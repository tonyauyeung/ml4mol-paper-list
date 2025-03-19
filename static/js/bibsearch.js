// File: bibsearch.js
import { parseBibFile } from './bibtex-parse.js';
import { createPaperDiv } from './paperUtils.js';

document.addEventListener('DOMContentLoaded', async () => {
  const container   = document.getElementById('papers-container');
  const searchInput = document.getElementById('bibsearch');

  // 1) Fetch the .bib file
  const response = await fetch('../_bibliography/papers.bib');
  const bibText  = await response.text();

  // 2) Parse the .bib text
  let entries = parseBibFile(bibText);

  // 3) Sort entries by year (descending)
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

  // Sort year headings descending
  const allYears = Object.keys(groupedByYear).sort((a, b) => parseInt(b) - parseInt(a));

  // 5) Build the UI, year by year
  allYears.forEach(year => {
    const yearSection = document.createElement('div');
    yearSection.classList.add('year-section');

    const yearHeading = document.createElement('h2');
    yearHeading.classList.add('year-heading');
    yearHeading.textContent = year;
    yearSection.appendChild(yearHeading);

    groupedByYear[year].forEach(entry => {
      // Create one paper div with shared code:
      const paperDiv = createPaperDiv(entry);

      // For searching, store additional data on the paperDiv
      const title = entry.entryTags.title || 'Untitled';
      paperDiv.dataset.search = [
        title, 
        year, 
        entry.entryTags.tags || ''
      ].join(' ').toLowerCase();

      // Add paper div to the year section
      yearSection.appendChild(paperDiv);
    });

    // Append the entire year section
    container.appendChild(yearSection);
  });

  // 6) Implement live search
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    const yearSections = container.querySelectorAll('.year-section');

    yearSections.forEach(section => {
      const paperItems = section.querySelectorAll('.paper-item');
      let anyVisible = false;

      paperItems.forEach(item => {
        const data = item.dataset.search || '';
        if (data.includes(query)) {
          item.style.display = '';
          anyVisible = true;
        } else {
          item.style.display = 'none';
        }
      });

      // Hide the heading if no items remain
      const heading = section.querySelector('.year-heading');
      heading.style.display = anyVisible ? '' : 'none';
    });
  });
});
