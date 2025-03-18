// File: bibsearch.js
import { parseBibFile } from './bibtex-parse.js';

document.addEventListener('DOMContentLoaded', async () => {
  const container   = document.getElementById('papers-container');
  const searchInput = document.getElementById('bibsearch');

  // 1) Fetch the .bib file
  const response = await fetch('/_bibliography/papers.bib');
  const bibText  = await response.text();

  // 2) Parse the .bib text
  let entries = parseBibFile(bibText);

  // 3) Sort entries by year (descending).
  entries = entries.sort((a, b) => {
    const yearA = parseInt(a.entryTags.year, 10) || 0;
    const yearB = parseInt(b.entryTags.year, 10) || 0;
    return yearB - yearA;
  });

  // 4) Group the entries by year
  const groupedByYear = {};
  entries.forEach(entry => {
    const y = entry.entryTags.year || 'Unknown';
    if (!groupedByYear[y]) {
      groupedByYear[y] = [];
    }
    groupedByYear[y].push(entry);
  });

  const allYears = Object.keys(groupedByYear)
    .sort((a, b) => parseInt(b) - parseInt(a));

  function buildBibTex(entry) {
    const { citationKey, entryType, entryTags } = entry;
    const tagsString = Object.entries(entryTags)
      .filter(([key]) => key !== 'bibtex_show')
      .map(([key, val]) => `  ${key} = {${val}},`)
      .join('\n');

    return `@${entryType}{${citationKey},\n${tagsString}\n}`;
  }

  allYears.forEach(year => {
    const yearSection = document.createElement('div');
    yearSection.classList.add('year-section');

    const yearHeading = document.createElement('h2');
    yearHeading.classList.add('year-heading');
    yearHeading.textContent = year;

    yearSection.appendChild(yearHeading);

    groupedByYear[year].forEach(entry => {
      const paperDiv = document.createElement('div');
      paperDiv.classList.add('paper-item');

      const title = entry.entryTags.title || 'Untitled';
      paperDiv.innerHTML = `<h3>${title}</h3>`;

      const buttonContainer = document.createElement('div');
      buttonContainer.classList.add('button-container');
      buttonContainer.style.marginTop = '10px';
      buttonContainer.style.display = 'flex';
      buttonContainer.style.gap = '10px';

      const bibtexButton = document.createElement('button');
      bibtexButton.innerText = 'BibTex';
      bibtexButton.classList.add('bibtex-btn');

      if (entry.entryTags.url) {
        const urlButton = document.createElement('a');
        urlButton.innerText = 'PAPER';
        urlButton.classList.add('url-btn');
        urlButton.href = entry.entryTags.url;
        urlButton.target = '_blank';
        buttonContainer.appendChild(urlButton);
      }

      if (entry.entryTags.tdlr) {
        const tdlrButton = document.createElement('button');
        tdlrButton.innerText = 'TDLR';
        tdlrButton.classList.add('tdlr-btn');

        const tdlrContainer = document.createElement('div');
        tdlrContainer.classList.add('tdlr-container');
        tdlrContainer.style.display = 'none';
        tdlrContainer.innerText = entry.entryTags.tdlr;

        paperDiv.appendChild(tdlrButton);
        paperDiv.appendChild(tdlrContainer);

        tdlrButton.addEventListener('click', () => {
          tdlrContainer.style.display =
            (tdlrContainer.style.display === 'none') ? 'block' : 'none';
        });
      }

      const bibtexContainer = document.createElement('div');
      bibtexContainer.classList.add('bibtex-container');
      bibtexContainer.style.display = 'none';
      bibtexContainer.innerHTML = `
        <pre><code class="language-latex">${buildBibTex(entry)}</code></pre>
      `;

      paperDiv.dataset.search =
        (title + ' ' + year + ' ' + (entry.entryTags.tags || '')).toLowerCase();

      buttonContainer.appendChild(bibtexButton);
      paperDiv.appendChild(buttonContainer);
      paperDiv.appendChild(bibtexContainer);
      yearSection.appendChild(paperDiv);

      bibtexButton.addEventListener('click', () => {
        bibtexContainer.style.display =
          bibtexContainer.style.display === 'none' ? 'block' : 'none';
      });

      if (typeof hljs !== 'undefined') {
        hljs.highlightAll();
      }
    });

    container.appendChild(yearSection);
  });

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

      const heading = section.querySelector('.year-heading');
      heading.style.display = anyVisible ? '' : 'none';
    });
  });
});