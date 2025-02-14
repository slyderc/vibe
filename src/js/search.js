document.addEventListener('DOMContentLoaded', function() {
    // Search functionality
    const searchInput = document.querySelector('input[type="search"]');
    const searchButton = document.querySelector('.save-search-btn');
    const filterSelects = document.querySelectorAll('.filter-select select');

    // Search history
    const searchHistory = {
        items: JSON.parse(localStorage.getItem('searchHistory') || '[]'),
        
        add(query, filters) {
            this.items.unshift({
                query,
                filters,
                timestamp: new Date().toISOString()
            });
            
            // Keep last 10 searches
            if (this.items.length > 10) {
                this.items.pop();
            }
            
            localStorage.setItem('searchHistory', JSON.stringify(this.items));
        },

        clear() {
            this.items = [];
            localStorage.removeItem('searchHistory');
        }
    };

    // Handle search
    function performSearch() {
        const query = searchInput.value.trim();
        if (!query) return;

        // Collect filter values
        const filters = {};
        filterSelects.forEach(select => {
            const filterName = select.options[0].text;
            const filterValue = select.value;
            if (filterValue) {
                filters[filterName] = filterValue;
            }
        });

        // Add to search history
        searchHistory.add(query, filters);

        // TODO: Implement actual search functionality with Myriad API
        console.log('Searching for:', query, 'with filters:', filters);
    }

    // Event listeners
    searchButton.addEventListener('click', performSearch);
    
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    // Filter change handlers
    filterSelects.forEach(select => {
        select.addEventListener('change', () => {
            if (searchInput.value.trim()) {
                performSearch();
            }
        });
    });
});