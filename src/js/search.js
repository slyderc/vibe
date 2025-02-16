document.addEventListener('DOMContentLoaded', function() {
    // Cache DOM elements
    const searchInput = document.querySelector('input[type="search"]');
    const searchButton = document.querySelector('.save-search-btn');
    const filterSelects = document.querySelectorAll('.filter-select select');
    const historyButton = document.querySelector('button[title="Recent Searches"]');
    
    // Initialize history menu
    const historyMenu = document.createElement('div');
    historyMenu.id = 'search-history-menu';
    // historyMenu.className = 'unified-menu';

    // Append the menu to the container instead of document.body
    const historyContainer = document.querySelector('.history-menu-container');
    if (historyContainer) {
        historyContainer.appendChild(historyMenu);
    } else {
        document.body.appendChild(historyMenu);
    }

    
    // Search history manager
    const searchHistory = {
        items: JSON.parse(localStorage.getItem('searchHistory') || '[]'),
        
        add(query, filters) {
            const searchEntry = {
                query,
                filters,
                timestamp: new Date().toISOString()
            };
            
            // Remove duplicates
            this.items = this.items.filter(item => 
                !(item.query === query && 
                  JSON.stringify(item.filters) === JSON.stringify(filters))
            );
            
            this.items.unshift(searchEntry);
            this.items = this.items.slice(0, 10); // Keep only 10 items
            
            localStorage.setItem('searchHistory', JSON.stringify(this.items));
            this.updateHistoryUI();
        },

        clear() {
            this.items = [];
            localStorage.removeItem('searchHistory');
            this.updateHistoryUI();
        },

        updateHistoryUI() {
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

            // Initialize icons
            lucide.createIcons({
                parent: historyMenu
            });

            // Add click handlers
            historyMenu.querySelectorAll('.menu-item[data-search]').forEach(item => {
                item.addEventListener('click', () => {
                    const searchData = JSON.parse(item.dataset.search);
                    loadSearch(searchData);
                    toggleHistoryMenu(false);
                });
            });
        }
    };

    // Handle search functionality
    function performSearch() {
        const query = searchInput.value.trim();
        if (!query) return;
    
        // Reset cart states
        if (window.cartStateManager) {
            window.cartStateManager.reset();
        }
    
        // Collect filter values
        const filters = {};
        filterSelects.forEach(select => {
            const filterName = select.getAttribute('data-filter');
            const filterValue = select.value;
            if (filterValue) {
                filters[filterName] = filterValue;
            }
        });
    
        // Filter the test data based on search query and filters
        const filteredData = testData.filter(item => {
            const matchesQuery = Object.values(item)
                .some(value => 
                    value.toString().toLowerCase()
                        .includes(query.toLowerCase())
                );
            
            const matchesFilters = Object.entries(filters)
                .every(([key, value]) => 
                    item[key.toLowerCase()] === value
                );
            
            return matchesQuery && matchesFilters;
        });

        // Update the table with filtered results
        updateTableData(filteredData);
        searchHistory.add(query, filters);
    }

    // Load search from history
    function loadSearch(searchData) {
        searchInput.value = searchData.query;
        
        Object.entries(searchData.filters).forEach(([filterName, value]) => {
            const select = document.querySelector(`select[data-filter="${filterName.toLowerCase()}"]`);
            if (select) {
                select.value = value;
                // Update custom filter button if it exists
                const button = select.previousElementSibling;
                if (button && button.classList.contains('filter-button')) {
                    button.querySelector('span').textContent = 
                        select.options[select.selectedIndex].text;
                }
                select.dispatchEvent(new Event('change'));
            }
        });

        performSearch();
    }

    // Toggle history menu (let CSS handle positioning)
    function toggleHistoryMenu(show) {
        if (show) {
            historyMenu.style.display = 'block';
            searchHistory.updateHistoryUI();
        } else {
            historyMenu.style.display = 'none';
        }
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
            const isVisible = historyMenu.style.display === 'block';
            toggleHistoryMenu(!isVisible);
        });
    }

    // Close menu on outside click
    document.addEventListener('click', (e) => {
        if (!e.target.closest('button[title="Recent Searches"]') && 
            !e.target.closest('#search-history-menu')) {
            toggleHistoryMenu(false);
        }
    });

    // Close menu on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            toggleHistoryMenu(false);
        }
    });

    // Initialize
    searchHistory.updateHistoryUI();
});