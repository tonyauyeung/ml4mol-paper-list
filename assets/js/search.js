document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');

    // Function to filter the papers
    function searchPapers(query) {
        // Clear previous results
        searchResults.innerHTML = '';

        // Filter the papers based on the query
        const filteredPapers = papers.filter(paper => {
            return paper.title.toLowerCase().includes(query.toLowerCase());
        });

        // Show the filtered papers in the results
        filteredPapers.forEach(paper => {
            const li = document.createElement('li');
            li.innerHTML = `<a href="${paper.url}">${paper.title}</a>`;
            searchResults.appendChild(li);
        });
    }

    // Listen for input changes
    searchInput.addEventListener('input', function() {
        const query = searchInput.value;
        searchPapers(query);
    });
});
