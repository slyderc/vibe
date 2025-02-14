document.addEventListener('DOMContentLoaded', function() {
    // Search functionality
    const searchInput = document.querySelector('input[type="search"]');
    const searchButton = document.querySelector('.save-search-btn');
    const filterSelects = document.querySelectorAll('.filter-select select');
    const historyButton = document.querySelector('button[title="Recent Searches"]');

    // Initialize history menu
    let historyMenu = document.createElement('div');
    historyMenu.id = 'search-history-menu';
    historyMenu.className = 'unified-menu';
    document.body.appendChild(historyMenu);

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
            if (!historyMenu) return;

            if (this.items.length === 0) {
                historyMenu.innerHTML = `
                    <div class="menu-item">
                        <span class="text-muted">No recent searches</span>
                    </div>`;
                return;
            }

            historyMenu.innerHTML = this.items.map(item => `
                <div class="menu-item" data-search='${JSON.stringify(item)}'>
                    <div class="history-query">
                        <i data-lucide="search" size="14"></i>
                        ${item.query}
                    </div>
                    <div class="history-filters">
                        ${Object.entries(item.filters)
                            .filter(([_, value]) => value)
                            .map(([key, value]) => `
                                <span class="filter-tag">${key}: ${value}</span>
                            `).join('')}
                    </div>
                    <div class="history-timestamp">
                        ${new Date(item.timestamp).toLocaleString()}
                    </div>
                </div>
            `).join('');

            // Initialize icons in the new menu items
            lucide.createIcons({
                parent: historyMenu
            });

            // Add click handlers for history items
            historyMenu.querySelectorAll('.menu-item').forEach(item => {
                if (!item.dataset.search) return;
                
                item.addEventListener('click', () => {
                    const searchData = JSON.parse(item.dataset.search);
                    loadSearch(searchData);
                    historyMenu.style.display = 'none';
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
            const select = document.querySelector(`select[data-filter="${filterName.toLowerCase()}"]`);
            if (select) {
                select.value = value;
                // Update custom filter button text if it exists
                const button = select.previousElementSibling;
                if (button && button.classList.contains('filter-button')) {
                    button.querySelector('span').textContent = 
                        select.options[select.selectedIndex].text;
                }
                // Trigger change event for the filter manager
                select.dispatchEvent(new Event('change'));
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
    if (historyButton) {
        historyButton.addEventListener('click', (e) => {
            e.stopPropagation();
            
            // Toggle history menu
            const isVisible = historyMenu.style.display === 'block';
            historyMenu.style.display = isVisible ? 'none' : 'block';
            
            if (!isVisible) {
                // Position the menu below the history button
                const rect = historyButton.getBoundingClientRect();
                historyMenu.style.top = `${rect.bottom + window.scrollY}px`;
                historyMenu.style.left = `${rect.left}px`;
                
                // Update the UI in case it changed
                searchHistory.updateHistoryUI();
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

    // Close history menu on outside click
    document.addEventListener('click', (e) => {
        if (!e.target.closest('button[title="Recent Searches"]') && 
            !e.target.closest('#search-history-menu')) {
            historyMenu.style.display = 'none';
        }
    });

    // Initialize history UI
    searchHistory.updateHistoryUI();
});