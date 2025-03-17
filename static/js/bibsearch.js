// File: bibsearch.js
import { parseBibFile } from './bibtex-parse.js';

document.addEventListener('DOMContentLoaded', async () => {
  console.log('hello');
  const container   = document.getElementById('papers-container');
  const searchInput = document.getElementById('bibsearch');

  // 1) Fetch the .bib file
  const response = await fetch('/_bibliography/papers.bib');
  const bibText  = await response.text();

  // 2) Parse the .bib text
  let entries = parseBibFile(bibText);
  console.log(entries);

  // 3) Sort entries by year (descending).
  //    We parse the 'year' field into an integer; if missing, treat as 0.
  entries = entries.sort((a, b) => {
    const yearA = parseInt(a.entryTags.year, 10) || 0;
    const yearB = parseInt(b.entryTags.year, 10) || 0;
    return yearB - yearA; // descending
  });

  // 4) Group the entries by year
  //    We'll store them in a map: { [yearString]: [arrayOfEntries] }
  const groupedByYear = {};
  entries.forEach(entry => {
    const y = entry.entryTags.year || 'Unknown';
    if (!groupedByYear[y]) {
      groupedByYear[y] = [];
    }
    groupedByYear[y].push(entry);
  });

  // Sort the year groups themselves in descending order (strings to numbers)
  const allYears = Object.keys(groupedByYear)
    .sort((a, b) => parseInt(b) - parseInt(a));

  // Helper to build BibTeX string
  function buildBibTex(entry) {
    const { citationKey, entryType, entryTags } = entry;
    const tagsString = Object.entries(entryTags)
      .filter(([key]) => key !== 'bibtex_show') // exclude if you like
      .map(([key, val]) => `  ${key} = {${val}},`)
      .join('\n');

    return `@${entryType}{${citationKey},\n${tagsString}\n}`;
  }

  // 5) Render the papers by year
  //    For each year, create a heading & sub-container
  allYears.forEach(year => {
    // A wrapper div for this year
    const yearSection = document.createElement('div');
    yearSection.classList.add('year-section');

    // Possibly style or position this heading however you'd like:
    const yearHeading = document.createElement('h2');
    yearHeading.classList.add('year-heading');
    yearHeading.textContent = year;

    yearSection.appendChild(yearHeading);

    // Now list each paper under this year
    groupedByYear[year].forEach(entry => {
      const paperDiv = document.createElement('div');
      paperDiv.classList.add('paper-item');

      // Title
      const title = entry.entryTags.title || 'Untitled';
      // We'll keep the innerHTML approach so that text-based search sees it
      paperDiv.innerHTML = `<h3>${title}</h3>`;

      // (A) "BibTeX" toggle button
      const bibtexButton = document.createElement('button');
      bibtexButton.innerText = 'BibTex';
      bibtexButton.classList.add('bibtex-btn');
      if (entry.entryTags.url) {
        const urlButton = document.createElement('a');
        urlButton.innerText = 'PAPER';
        urlButton.classList.add('url-btn');
        // Make it a link that opens in a new tab
        urlButton.href = entry.entryTags.url;
        urlButton.target = '_blank';
        paperDiv.appendChild(urlButton);
      }
      if (entry.entryTags.tdlr) {
        const tdlrButton = document.createElement('button');
        tdlrButton.innerText = 'TDLR';
        tdlrButton.classList.add('tdlr-btn');

        // Create a hidden container for the TDLR text
        const tdlrContainer = document.createElement('div');
        tdlrContainer.classList.add('tdlr-container');
        tdlrContainer.style.display = 'none';
        tdlrContainer.innerText = entry.entryTags.tdlr;

        // Append them
        paperDiv.appendChild(tdlrButton);
        paperDiv.appendChild(tdlrContainer);

        // Toggle TDLR text on click
        tdlrButton.addEventListener('click', () => {
          tdlrContainer.style.display =
            (tdlrContainer.style.display === 'none') ? 'block' : 'none';
        });
      }

      // (B) Container for the BibTeX (hidden by default)
      const bibtexContainer = document.createElement('div');
      bibtexContainer.classList.add('bibtex-container');
      bibtexContainer.style.display = 'none';
      bibtexContainer.innerHTML = `
        <pre><code class="language-latex">${buildBibTex(entry)}</code></pre>
      `;

      // (C) Attach the data we use for searching
      //     We'll store "title + year + any other fields" for the text search
      const rawTags = entry.entryTags.tags || '';
      paperDiv.dataset.search =
        (title + ' ' + year + ' ' + rawTags).toLowerCase();

      // Append elements
      paperDiv.appendChild(bibtexButton);
      paperDiv.appendChild(bibtexContainer);
      yearSection.appendChild(paperDiv);

      // Toggle BibTeX on click
      bibtexButton.addEventListener('click', () => {
        bibtexContainer.style.display =
          bibtexContainer.style.display === 'none' ? 'block' : 'none';
      });

      // If highlight.js is present:
      if (typeof hljs !== 'undefined') {
        hljs.highlightAll();
      }
    });

    // Finally, append this year section to the main container
    container.appendChild(yearSection);
  });

  // 6) Text-based filtering (title, tags, year, etc.)
  //    We hide entire .paper-item if it doesn't match
  //    If all items in a year-section are hidden, we also hide the year heading
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    const yearSections = container.querySelectorAll('.year-section');

    yearSections.forEach((section) => {
      const paperItems = section.querySelectorAll('.paper-item');
      let anyVisible = false;

      paperItems.forEach((item) => {
        const data = item.dataset.search || '';
        if (data.includes(query)) {
          item.style.display = '';
          anyVisible = true;
        } else {
          item.style.display = 'none';
        }
      });

      // If none of the items in this year are visible, hide the heading
      const heading = section.querySelector('.year-heading');
      if (!anyVisible) {
        heading.style.display = 'none';
      } else {
        heading.style.display = '';
      }
    });
  });
});
