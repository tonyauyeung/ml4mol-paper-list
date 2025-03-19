// File: tagsearch.js
import { parseBibFile } from './bibtex-parse.js';
import { createPaperDiv } from './paperUtils.js';

document.addEventListener('DOMContentLoaded', async () => {
  const tagsContainer    = document.getElementById('tags-container');
  const papersContainer  = document.getElementById('papers-container');

  // Function to capitalize the first letter of each tag
  function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // 1) Fetch the .bib file
  const response = await fetch('/_bibliography/papers.bib');
  const bibText  = await response.text();

  // 2) Parse the BibTeX content
  const entries = parseBibFile(bibText);

  // 3) Collect all unique tags
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

  // 4) Create a button for each tag
  const selectedTags = new Set();

  allTags.forEach(tag => {
    const btn = document.createElement('button');
    btn.textContent = capitalizeFirstLetter(tag); // Capitalize first letter
    btn.classList.add('tag-btn');
    
    // Ensure text color is black before selection
    btn.style.color = 'black';

    btn.addEventListener('click', () => {
      // Toggle selection
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

  // 5) Render all papers
  function renderEntries() {
    papersContainer.innerHTML = '';

    entries.forEach(entry => {
      // Build DOM using shared code
      const paperDiv = createPaperDiv(entry);

      // For filtering, store the raw tags in a dataset property
      const rawTags = entry.entryTags.tags || '';
      paperDiv.dataset.tags = rawTags.toLowerCase();

      // By default, we’ll hide them all (we’ll call filterByTags)
      papersContainer.appendChild(paperDiv);
    });
  }

  // 6) AND logic filter: show items that have *all* selected tags
  //    Hide everything if no tags selected
  function filterByTags() {
    const paperItems = papersContainer.querySelectorAll('.paper-item');

    if (selectedTags.size === 0) {
      // Hide all
      paperItems.forEach(item => {
        item.style.display = 'none';
      });
      return;
    }

    // Otherwise, show items that contain *all* selected tags
    paperItems.forEach(item => {
      const itemTags = item.dataset.tags || '';
      const hasAll = [...selectedTags].every(tag => itemTags.includes(tag));
      item.style.display = hasAll ? '' : 'none';
    });
  }

  // 7) Render everything, then hide all by default
  renderEntries();
  filterByTags(); // => ensures all are hidden until user picks a tag
});
