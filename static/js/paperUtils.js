// File: paperUtils.js

/**
 * Build a BibTeX string, excluding certain fields.
 */
export function buildBibTex(entry) {
    const { citationKey, entryType, entryTags } = entry;
    const filteredTags = Object.entries(entryTags)
      // Exclude fields you do NOT want in BibTeX:
      .filter(([key]) => key !== 'bibtex_show' && key !== 'tags' && key !== 'tdlr')
      .map(([key, val]) => `  ${key} = {${val}},`)
      .join('\n');
  
    return `@${entryType}{${citationKey},\n${filteredTags}\n}`;
  }
  
  /**
   * Create and return a DIV that displays:
   *   - Paper title (as <h3>)
   *   - Buttons for PAPER URL, BibTeX, TDLR (if available)
   *   - Hidden containers for BibTeX and TDLR
   *
   * @param {Object} entry - One parsed BibTeX entry (from bibtex-parse).
   * @returns {HTMLDivElement} paperDiv
   */
  export function createPaperDiv(entry) {
    // Main container:
    const paperDiv = document.createElement('div');
    paperDiv.classList.add('paper-item');
  
    // Title:
    const title = entry.entryTags.title || 'Untitled';
    paperDiv.innerHTML = `<h3>${title}</h3>`;
  
    // Button container:
    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('button-container');
    // Inline style to match your existing approach
    buttonContainer.style.marginTop = '10px';
    buttonContainer.style.display = 'flex';
    buttonContainer.style.gap = '10px';
  
    // BibTeX button + container:
    const bibtexButton = document.createElement('button');
    bibtexButton.innerText = 'BibTex';
    bibtexButton.classList.add('bibtex-btn');
  
    const bibtexContainer = document.createElement('div');
    bibtexContainer.classList.add('bibtex-container');
    bibtexContainer.style.display = 'none';
    bibtexContainer.innerHTML = `
      <pre><code class="language-latex">${buildBibTex(entry)}</code></pre>
    `;
  
    bibtexButton.addEventListener('click', () => {
      bibtexContainer.style.display =
        bibtexContainer.style.display === 'none' ? 'block' : 'none';
    });
  
    buttonContainer.appendChild(bibtexButton);
    paperDiv.appendChild(buttonContainer);
    paperDiv.appendChild(bibtexContainer);
  
    // PAPER URL button (if available):
    if (entry.entryTags.url) {
      const urlButton = document.createElement('a');
      urlButton.innerText = 'PAPER';
      urlButton.classList.add('url-btn');
      urlButton.href = entry.entryTags.url;
      urlButton.target = '_blank';
  
      // Put PAPER button before BibTeX button (or in whichever order you prefer)
      buttonContainer.insertBefore(urlButton, bibtexButton);
    }
  
    // TDLR button (if available):
    if (entry.entryTags.tdlr) {
      const tdlrButton = document.createElement('button');
      tdlrButton.innerText = 'TDLR';
      tdlrButton.classList.add('tdlr-btn');
  
      const tdlrContainer = document.createElement('div');
      tdlrContainer.classList.add('tdlr-container');
      tdlrContainer.style.display = 'none';
      // Multi-line + no mid-word breaks:
      tdlrContainer.innerHTML = `
        <pre style="
            white-space: pre-wrap;
            word-break: normal;
            overflow-wrap: normal;
            word-wrap: normal;
            overflow-x: auto;"
        >
          <code class="language-latex">${entry.entryTags.tdlr}</code>
        </pre>
      `;
  
      tdlrButton.addEventListener('click', () => {
        tdlrContainer.style.display =
          tdlrContainer.style.display === 'none' ? 'block' : 'none';
      });
  
      buttonContainer.appendChild(tdlrButton);
      paperDiv.appendChild(tdlrContainer);
    }
  
    // Optionally highlight code if hljs is present:
    if (typeof hljs !== 'undefined') {
      hljs.highlightAll();
    }
  
    return paperDiv;
  }
  