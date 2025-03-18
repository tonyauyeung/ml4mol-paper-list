---
permalink: /tag-search/
title: Paper by Tags
description: You can select papers according to their tags.
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
      border-radius: 5px;
      cursor: pointer;
      transition: 0.2s;
    }
    .tag-btn:hover {
      background: #e0e0e0;
    }
    .tag-btn.selected {
      background: #007bff;
      color: white;
      border-color: #0056b3;
    }
  </style>
</div>
{{< /rawhtml >}}
