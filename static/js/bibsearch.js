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
      // Filter out bibtex_show:
      .filter(([key]) => key !== 'bibtex_show')
      .map(([key, val]) => `  ${key} = {${val}},`)
      .join('\n');

    return `@${entryType}{${citationKey},\n${tagsString}\n}`;
  }

  // 3) Render them all
  entries.forEach(entry => {
    const paperDiv = document.createElement('div');
    paperDiv.classList.add('paper-item');

    // Title
    paperDiv.innerHTML = `<h3>${entry.entryTags.title || 'Untitled'}</h3>`;

    // "Bibtex" toggle button
    const bibtexButton = document.createElement('button');
    bibtexButton.innerText = 'Bibtex';
    bibtexButton.classList.add('bibtex-btn');

    // Container for the BibTeX (hidden by default)
    const bibtexContainer = document.createElement('div');
    bibtexContainer.classList.add('bibtex-container');
    bibtexContainer.style.display = 'none';

    // Use class="language-bibtex" so that highlight.js recognizes it
// Instead of class="language-bibtex"
bibtexContainer.innerHTML = `
  <pre><code class="language-latex">${buildBibTex(entry)}</code></pre>
`;


    // Append everything
    paperDiv.appendChild(bibtexButton);
    paperDiv.appendChild(bibtexContainer);
    container.appendChild(paperDiv);

    // Toggle show/hide on click
    bibtexButton.addEventListener('click', () => {
      bibtexContainer.style.display =
        bibtexContainer.style.display === 'none' ? 'block' : 'none';
    });

    // Highlight any new code blocks in this newly inserted container
    // (You can also do this once at the end if you prefer).
    if (typeof hljs !== 'undefined') {
      hljs.highlightAll();
    }
  });

  // 4) Simple filtering on user input
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    const paperItems = container.querySelectorAll('.paper-item');

    paperItems.forEach((item) => {
      if (item.innerText.toLowerCase().includes(query)) {
        item.style.display = '';
      } else {
        item.style.display = 'none';
      }
    });
  });
});
