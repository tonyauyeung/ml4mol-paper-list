---
permalink: /papers/
title: All Papers
description: 
nav: true
nav_order: 1
---

{{< rawhtml >}}
<div>
  <!-- 1) Load highlight.js CSS (pick any style you like) -->
  <!-- <link 
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/default.min.css"> -->
  
  <!-- 2) Load the highlight.js core library -->
  <!-- <script
    src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/highlight.min.js">
  </script> -->

  <!-- 3) Load the BibTeX plugin for highlight.js -->
  <!-- <script
    src="https://cdn.jsdelivr.net/gh/highlightjs/highlightjs-bibtex/dist/bibtex.min.js">
  </script> -->
  <link rel="stylesheet" href="../css/papers.css">
  <!-- 4) The search box the user can type into -->
  <div id="searchbox" class="search-container" style="margin-top: 3rem; display: flex; align-items: center; gap: 8px;" >
    <input
      type="text"
      id="bibsearch"
      spellcheck="false"
      autocomplete="off"
      class="search bibsearch-form-input"
      placeholder="Type to filter"
      maxlength="64" 
      style="width:500px"
    />
    <span style="display: flex; align-items: center; height: 40px;">
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentcolor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
    </span>
  </div>

  <!-- 5) Container where your JS will inject the paper entries -->
  <div id="papers-container"></div>

  <!-- 6) Load your parsing library and search script (as modules) -->
  <script src="../js/bibtex-parse.js" type="module"></script>
  <script src="../js/bibsearch.js" type="module"></script>
</div>
{{< /rawhtml >}}
