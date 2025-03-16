---
permalink: /papers/
title: All Papers
description: A collection of papers on various topics
nav: true
nav_order: 1
---
{{< rawhtml >}}
<div>
  <!-- Load our parsing library and our custom search script -->
<script src="/js/bibtex-parse.js" type="module"></script>
<script src="/js/bibsearch.js" type="module"></script>


  <!-- The search box the user will type into -->
  <input type="text" id="bibsearch"
         spellcheck="false"
         autocomplete="off"
         class="search bibsearch-form-input"
         placeholder="Type to filter" />
</div>
{{< papers >}}
{{< /rawhtml >}}
