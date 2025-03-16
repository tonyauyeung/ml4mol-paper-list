// File: assets/js/bibsearch.js
import { parseBibFile } from './bibtex-parse.js'; // from step 3

document.addEventListener('DOMContentLoaded', async () => {
  console.log('helllo');
  const container = document.getElementById('papers-container');
  const searchInput = document.getElementById('bibsearch');

  // 1) Fetch the .bib file (update the path if needed)
  const response = await fetch('/_bibliography/papers.bib');
  const bibText = await response.text();

  // 2) Parse the .bib text
  const entries = parseBibFile(bibText);

  // 3) Render them all
  entries.forEach(entry => {
    const paperDiv = document.createElement('div');
    paperDiv.classList.add('paper-item');

    // Build some basic HTML
    paperDiv.innerHTML = `
      <h3>${entry.title || 'Untitled'}</h3>
      <p><strong>Authors:</strong> ${entry.author || 'N/A'}</p>
      <p><strong>Year:</strong> ${entry.year || 'N/A'}</p>
      <p><strong>Type:</strong> ${entry.type}</p>
    `;

    container.appendChild(paperDiv);
  });

  // 4) Filter on user input
  searchInput.addEventListener('input', e => {
    const query = e.target.value.toLowerCase();
    const paperItems = container.querySelectorAll('.paper-item');

    paperItems.forEach(item => {
      // Naive approach: check if the entire text includes the query
      if (item.innerText.toLowerCase().includes(query)) {
        item.style.display = '';
      } else {
        item.style.display = 'none';
      }
    });
  });
});
