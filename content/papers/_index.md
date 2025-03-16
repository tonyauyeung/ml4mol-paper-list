---
permalink: /papers/
title: All Papers
description: A collection of papers on various topics
nav: true
nav_order: 1
---
<!-- {% include bib_search.liquid %} -->
<!-- <script src="{{ '/assets/js/bibsearch.js' | relative_url | bust_file_cache }}" type="module"></script>
<input type="text" id="bibsearch" spellcheck="false" autocomplete="off" class="search bibsearch-form-input" placeholder="Type to filter"> -->
{{< rawhtml >}}
<div>
  <script src="{{ '/assets/js/bibsearch.js' | relative_url | bust_file_cache }}" type="module"></script>
  <input type="text" id="bibsearch" spellcheck="false" autocomplete="off" class="search bibsearch-form-input" placeholder="Type to filter">
</div>
{{< papers >}}
{{< /rawhtml >}}