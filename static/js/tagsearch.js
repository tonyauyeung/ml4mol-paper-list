// File: tagsearch.js
import { parseBibFile } from './bibtex-parse.js';

document.addEventListener('DOMContentLoaded', async () => {
  const tagsContainer = document.getElementById('tags-container');
  const papersContainer = document.getElementById('papers-container');

  console.log('hi, this is the tag page');

  // Fetch the .bib file
  const response = await fetch('/_bibliography/papers.bib');
  const bibText  = await response.text();

  // Parse the BibTeX content into an array of entries
  const entries = parseBibFile(bibText);
  console.log(entries);

  function buildBibTex(entry) {
    const { citationKey, entryType, entryTags } = entry;
    const tagsString = Object.entries(entryTags)
      .filter(([key]) => key !== 'bibtex_show')
      .map(([key, val]) => `  ${key} = {${val}},`)
      .join('\n');

    return `@${entryType}{${citationKey},\n${tagsString}\n}`;
  }

  // Collect all unique tags from entries
  const allTags = new Set();
  entries.forEach(entry => {
    const rawTags = entry.entryTags.tags || '';
    rawTags.split(',').forEach(tag => {
      const cleanTag = tag.trim().toLowerCase();
      if (cleanTag) {
        allTags.add(cleanTag);
      }
    });
  });

  const selectedTags = new Set();

  // Create tag buttons and enable selection
  allTags.forEach(tag => {
    const btn = document.createElement('button');
    btn.textContent = tag;
    btn.classList.add('tag-btn');
    btn.addEventListener('click', () => {
      if (selectedTags.has(tag)) {
        selectedTags.delete(tag);
        btn.classList.remove('selected');
      } else {
        selectedTags.add(tag);
        btn.classList.add('selected');
      }
      filterByTags();
    });
    tagsContainer.appendChild(btn);
  });

  function renderEntries() {
    papersContainer.innerHTML = '';
    entries.forEach(entry => {
      const paperDiv = document.createElement('div');
      paperDiv.classList.add('paper-item');

      // Title
      const title = entry.entryTags.title || 'Untitled';
      paperDiv.innerHTML = `<h3>${title}</h3>`;

      // Buttons container
      const buttonContainer = document.createElement('div');
      buttonContainer.classList.add('button-container');
      buttonContainer.style.marginTop = '10px';
      buttonContainer.style.display = 'flex';
      buttonContainer.style.gap = '10px';

      // BibTeX button
      const bibtexButton = document.createElement('button');
      bibtexButton.innerText = 'BibTex';
      bibtexButton.classList.add('bibtex-btn');

      // URL button (if available)
      if (entry.entryTags.url) {
        const urlButton = document.createElement('a');
        urlButton.innerText = 'PAPER';
        urlButton.classList.add('url-btn');
        urlButton.href = entry.entryTags.url;
        urlButton.target = '_blank';
        buttonContainer.appendChild(urlButton);
      }

      // TDLR button (if available)
      if (entry.entryTags.tdlr) {
        const tdlrButton = document.createElement('button');
        tdlrButton.innerText = 'TDLR';
        tdlrButton.classList.add('tdlr-btn');

        const tdlrContainer = document.createElement('div');
        tdlrContainer.classList.add('tdlr-container');
        tdlrContainer.style.display = 'none';
        tdlrContainer.innerText = entry.entryTags.tdlr;

        tdlrButton.addEventListener('click', () => {
          tdlrContainer.style.display =
            (tdlrContainer.style.display === 'none') ? 'block' : 'none';
        });

        paperDiv.appendChild(tdlrButton);
        paperDiv.appendChild(tdlrContainer);
      }

      // BibTeX container
      const bibtexContainer = document.createElement('div');
      bibtexContainer.classList.add('bibtex-container');
      bibtexContainer.style.display = 'none';
      bibtexContainer.innerHTML = `
        <pre><code class="language-latex">${buildBibTex(entry)}</code></pre>
      `;

      // Store paper tags for filtering
      const rawTags = entry.entryTags.tags || '';
      paperDiv.dataset.tags = rawTags.toLowerCase();

      // Append buttons
      buttonContainer.appendChild(bibtexButton);
      paperDiv.appendChild(buttonContainer);
      paperDiv.appendChild(bibtexContainer);
      papersContainer.appendChild(paperDiv);

      // Toggle BibTeX display
      bibtexButton.addEventListener('click', () => {
        bibtexContainer.style.display =
          (bibtexContainer.style.display === 'none') ? 'block' : 'none';
      });

      if (typeof hljs !== 'undefined') {
        hljs.highlightAll();
      }
    });
  }

  function filterByTags() {
    const paperItems = papersContainer.querySelectorAll('.paper-item');

    if (selectedTags.size === 0) {
      paperItems.forEach(item => item.style.display = '');
      return;
    }

    paperItems.forEach(item => {
      const itemTags = item.dataset.tags || '';
      const hasTag = [...selectedTags].some(tag => itemTags.includes(tag));
      item.style.display = hasTag ? '' : 'none';
    });
  }

  renderEntries();
});
