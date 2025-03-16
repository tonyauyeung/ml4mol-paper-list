---
permalink: /tags/
title: Paper by Tags
description: You can select papers according to their tags.
nav: true
nav_order: 2
---

{{< rawhtml >}}
<div id="tags-page">
  <p>Click on a tag button below to show only the papers that have that tag.</p>
  
  <!-- Container for the tag buttons -->
  <div id="tags-container"></div>

  <!-- Container where your JS will place the listed papers -->
  <div id="papers-container"></div>

  <!-- (1) Load the same bibtex-parse library -->
  <script src="/js/bibtex-parse.js" type="module"></script>

  <!-- (2) Load our new script for tag filtering (tagsearch.js) -->
  <script src="/js/tagsearch.js" type="module"></script>
</div>
{{< /rawhtml >}}