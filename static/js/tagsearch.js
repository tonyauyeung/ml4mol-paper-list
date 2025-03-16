// File: tagsearch.js
import { parseBibFile } from './bibtex-parse.js';

document.addEventListener('DOMContentLoaded', async () => {
  const tagsContainer = document.getElementById('tags-container');
  const papersContainer = document.getElementById('papers-container');

  // 1) Fetch the .bib file (same path as your main "papers" page uses)
  const response = await fetch('/_bibliography/papers.bib');
  const bibText  = await response.text();

  // 2) Parse the BibTeX content into an array of entries
  const entries = parseBibFile(bibText);
  console.log(entries);

  // 3) A helper to build the BibTeX string for each entry (similar to bibsearch.js)
  function buildBibTex(entry) {
    const { citationKey, entryType, entryTags } = entry;
    const tagsString = Object.entries(entryTags)
      // Example filter: skip any special fields, e.g. "bibtex_show"
      .filter(([key]) => key !== 'bibtex_show')
      .map(([key, val]) => `  ${key} = {${val}},`)
      .join('\n');

    return `@${entryType}{${citationKey},\n${tagsString}\n}`;
  }

  // 4) Collect all unique tags from the entries
  const allTags = new Set();
  entries.forEach(entry => {
    const rawTags = entry.entryTags.tags || '';
    // 'tags' field might be comma-separated, e.g. "AI, machine learning"
    // We'll split on commas and store them in a Set.
    rawTags.split(',').forEach(tag => {
      const cleanTag = tag.trim().toLowerCase();
      if (cleanTag) {
        allTags.add(cleanTag);
      }
    });
  });

  // 5) For each unique tag, create a button that filters papers by that tag
  allTags.forEach(tag => {
    const btn = document.createElement('button');
    btn.textContent = tag;
    btn.addEventListener('click', () => {
      filterByTag(tag);
    });
    tagsContainer.appendChild(btn);
  });

  // 6) Render all the entries initially
  entries.forEach(entry => {
    // Container for this paper
    const paperDiv = document.createElement('div');
    paperDiv.classList.add('paper-item');

    // Title
    paperDiv.innerHTML = `<h3>${entry.entryTags.title || 'Untitled'}</h3>`;

    // BibTeX toggle button
    const bibtexButton = document.createElement('button');
    bibtexButton.innerText = 'Bibtex';
    bibtexButton.classList.add('bibtex-btn');

    // Container for the BibTeX code (hidden by default)
    const bibtexContainer = document.createElement('div');
    bibtexContainer.classList.add('bibtex-container');
    bibtexContainer.style.display = 'none';

    // Insert the actual BibTeX code
    bibtexContainer.innerHTML = `
      <pre><code class="language-latex">${buildBibTex(entry)}</code></pre>
    `;

    // Store the paper's tags (in lowercase) in a data attribute so we can filter easily
    const rawTags = entry.entryTags.tags || '';
    paperDiv.dataset.tags = rawTags.toLowerCase();

    // Append all pieces
    paperDiv.appendChild(bibtexButton);
    paperDiv.appendChild(bibtexContainer);
    papersContainer.appendChild(paperDiv);

    // On button click, toggle show/hide the BibTeX
    bibtexButton.addEventListener('click', () => {
      bibtexContainer.style.display =
        (bibtexContainer.style.display === 'none') ? 'block' : 'none';
    });

    // If you have highlight.js loaded globally, re-highlight this new code
    if (typeof hljs !== 'undefined') {
      hljs.highlightAll();
    }
  });

  // 7) The function that filters the papers by a particular tag
  function filterByTag(tag) {
    const paperItems = papersContainer.querySelectorAll('.paper-item');
    paperItems.forEach(item => {
      const itemTags = item.dataset.tags || ''; // e.g. "ai, machine learning"
      // We'll consider it a match if the exact clicked tag is present
      // in the comma-split tags for this item:
      const hasTag = itemTags.split(',').some(t => t.trim() === tag);
      item.style.display = hasTag ? '' : 'none';
    });
  }
});
