import { parseBibFile } from './bibtex-parse.js';

document.addEventListener('DOMContentLoaded', async () => {
  console.log('hello');
  const container = document.getElementById('papers-container');
  const searchInput = document.getElementById('bibsearch');

  // 1) Fetch the .bib file
  const response = await fetch('/_bibliography/papers.bib');
  const bibText = await response.text();

  // 2) Parse the .bib text
  const entries = parseBibFile(bibText);
  console.log(entries);

  // Helper to build BibTeX string, excluding "bibtex_show"
  function buildBibTex(entry) {
    const { citationKey, entryType, entryTags } = entry;
    const tagsString = Object.entries(entryTags)
      // If you had any fields you wanted to exclude from the displayed BibTeX,
      // you could filter them out here:
      .filter(([key]) => key !== 'bibtex_show')
      .map(([key, val]) => `  ${key} = {${val}},`)
      .join('\n');

    return `@${entryType}{${citationKey},\n${tagsString}\n}`;
  }

  // 3) Render all entries
  entries.forEach(entry => {
    // Create a container for this paper
    const paperDiv = document.createElement('div');
    paperDiv.classList.add('paper-item');

    // Title
    paperDiv.innerHTML = `<h3>${entry.entryTags.title || 'Untitled'}</h3>`;

    // (A) "BibTeX" toggle button
    const bibtexButton = document.createElement('button');
    bibtexButton.innerText = 'Bibtex';
    bibtexButton.classList.add('bibtex-btn');

    // (B) Container for the BibTeX (hidden by default)
    const bibtexContainer = document.createElement('div');
    bibtexContainer.classList.add('bibtex-container');
    bibtexContainer.style.display = 'none';

    // Highlight.js expects something like <code class="language-latex">:
    bibtexContainer.innerHTML = `
      <pre><code class="language-latex">${buildBibTex(entry)}</code></pre>
    `;

    // (C) Extract the paper's tags and store them in a data attribute
    //     so we can easily filter on them later:
    const rawTags = entry.entryTags.tags || ''; 
    paperDiv.dataset.tags = rawTags.toLowerCase();

    // Append everything
    paperDiv.appendChild(bibtexButton);
    paperDiv.appendChild(bibtexContainer);
    container.appendChild(paperDiv);

    // (D) Show/hide the BibTeX block on button click
    bibtexButton.addEventListener('click', () => {
      bibtexContainer.style.display =
        bibtexContainer.style.display === 'none' ? 'block' : 'none';
    });

    // (E) If using highlight.js, highlight newly inserted code blocks
    if (typeof hljs !== 'undefined') {
      hljs.highlightAll();
    }
  });

  // 4) Simple filtering on user input (search by title OR tags)
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    const paperItems = container.querySelectorAll('.paper-item');

    paperItems.forEach((item) => {
      // Get title from the <h3> 
      const titleText = item.querySelector('h3')?.textContent.toLowerCase() || '';
      // Get tags from data-tags attribute
      const tagsText = item.dataset.tags || '';

      // Show item if title or tags match search query
      if (titleText.includes(query) || tagsText.includes(query)) {
        item.style.display = '';
      } else {
        item.style.display = 'none';
      }
    });
  });
});
