document.addEventListener('DOMContentLoaded', function() {
    // Search functionality
    const searchInput = document.querySelector('input[type="search"]');
    const searchButton = document.querySelector('.save-search-btn');
    const filterSelects = document.querySelectorAll('.filter-input');

    // Search history
    const searchHistory = {
        items: JSON.parse(localStorage.getItem('searchHistory') || '[]'),
        
        add(query, filters) {
            const searchEntry = {
                query,
                filters,
                timestamp: new Date().toISOString()
            };

            // Remove duplicate searches
            this.items = this.items.filter(item => 
                !(item.query === query && 
                  JSON.stringify(item.filters) === JSON.stringify(filters))
            );
            
            this.items.unshift(searchEntry);
            
            // Keep last 10 searches
            if (this.items.length > 10) {
                this.items.pop();
            }
            
            localStorage.setItem('searchHistory', JSON.stringify(this.items));
            this.updateHistoryUI();
        },

        clear() {
            this.items = [];
            localStorage.removeItem('searchHistory');
            this.updateHistoryUI();
        },

        updateHistoryUI() {
            const historyButton = document.querySelector('button[title="Recent Searches"]');
            if (!historyButton) return;

            // Create or update history dropdown
            let historyMenu = document.getElementById('search-history-menu');
            if (!historyMenu) {
                historyMenu = document.createElement('div');
                historyMenu.id = 'search-history-menu';
                historyMenu.className = 'unified-menu';
                document.body.appendChild(historyMenu);
            }

            historyMenu.innerHTML = this.items.map(item => `
                <div class="menu-item" data-search='${JSON.stringify(item)}'>
                    <div class="history-query">${item.query}</div>
                    ${Object.entries(item.filters)
                        .filter(([_, value]) => value)
                        .map(([key, value]) => `
                            <span class="filter-tag">${key}: ${value}</span>
                        `).join('')}
                </div>
            `).join('');

            // Add click handlers for history items
            historyMenu.querySelectorAll('.menu-item').forEach(item => {
                item.addEventListener('click', () => {
                    const searchData = JSON.parse(item.dataset.search);
                    loadSearch(searchData);
                });
            });
        }
    };

    // Function to load a search from history
    function loadSearch(searchData) {
        // Update search input
        if (searchInput) {
            searchInput.value = searchData.query;
        }

        // Update filter selections
        Object.entries(searchData.filters).forEach(([filterName, value]) => {
            const select = document.querySelector(`select[data-filter="${filterName}"]`);
            if (select) {
                select.value = value;
                // Update custom filter button text if it exists
                const wrapper = select.closest('.filter-wrapper');
                if (wrapper) {
                    const button = wrapper.querySelector('.filter-button span');
                    const selectedOption = Array.from(select.options)
                        .find(option => option.value === value);
                    if (button && selectedOption) {
                        button.textContent = selectedOption.text;
                    }
                }
            }
        });

        // Trigger search
        performSearch();
    }

    // Handle search
    function performSearch() {
        const query = searchInput.value.trim();
        if (!query) return;

        // Collect filter values
        const filters = {};
        filterSelects.forEach(select => {
            const filterName = select.getAttribute('data-filter');
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
    if (searchButton) {
        searchButton.addEventListener('click', performSearch);
    }
    
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }

    // History button handler
    const historyButton = document.querySelector('button[title="Recent Searches"]');
    if (historyButton) {
        historyButton.addEventListener('click', (e) => {
            e.stopPropagation();
            const historyMenu = document.getElementById('search-history-menu');
            if (historyMenu) {
                const rect = historyButton.getBoundingClientRect();
                historyMenu.style.display = 
                    historyMenu.style.display === 'none' ? 'block' : 'none';
                historyMenu.style.top = (rect.bottom + window.scrollY) + 'px';
                historyMenu.style.right = 
                    (window.innerWidth - rect.right) + 'px';
            }
        });
    }

    // Filter change handlers
    filterSelects.forEach(select => {
        select.addEventListener('change', () => {
            if (searchInput.value.trim()) {
                performSearch();
            }
        });
    });

    // Close history menu on click outside
    document.addEventListener('click', (e) => {
        const historyMenu = document.getElementById('search-history-menu');
        if (historyMenu && !e.target.closest('button[title="Recent Searches"]')) {
            historyMenu.style.display = 'none';
        }
    });

    // Initialize history UI
    searchHistory.updateHistoryUI();
});