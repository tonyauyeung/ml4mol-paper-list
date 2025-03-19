---
permalink: /tag-search/
title: Paper by Tags
description:
nav: true
nav_order: 2
---

{{< rawhtml >}}
<div>
  <p>Click on a tag button below to show only the papers that have that tag. Multiple tags can be selected.</p>

  <!-- Container for the tag buttons -->
  <div id="tags-container" style="display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 20px;"></div>

  <!-- Container where your JS will place the listed papers -->
  <div id="papers-container"></div>

  <!-- Load the bibtex-parse library -->
  <script src="/js/bibtex-parse.js" type="module"></script>

  <!-- Load the tag filtering script -->
  <script src="/js/tagsearch.js" type="module"></script>

  <style>
    .tag-btn {
      background: #f0f0f0;
      border: 1px solid #ccc;
      padding: 8px 12px;
      border-radius: 4px;
      cursor: pointer;
      transition: 0.2s;
      color: black;
    }
    .tag-btn:hover {
      background: #b0b7c0;
    }
    .tag-btn.selected {
      background: #595e60;
      color: white;
      border-color: #595e60;
    }
  </style>
</div>
{{< /rawhtml >}}
