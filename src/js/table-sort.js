// table-sort.js
class TableSortManager {
    constructor() {
        this.currentSort = {
            column: null,
            direction: 'asc'
        };
        this.init();
    }

    init() {
        // Add click handlers to all table headers
        const headers = document.querySelectorAll('.results-table th');
        headers.forEach((header, index) => {
            if (index === 0) return; // Skip the "Load Cart" column
            
            header.style.cursor = 'pointer';
            header.addEventListener('click', () => this.handleHeaderClick(header, index));
        });
    }

    handleHeaderClick(header, columnIndex) {
        // Toggle direction if clicking the same column
        if (this.currentSort.column === columnIndex) {
            this.currentSort.direction = this.currentSort.direction === 'asc' ? 'desc' : 'asc';
        } else {
            // New column, start with ascending
            this.currentSort.column = columnIndex;
            this.currentSort.direction = 'asc';
        }

        this.updateHeaderIndicators();
        this.sortTable();
    }

    updateHeaderIndicators() {
        // Remove all sort indicators
        document.querySelectorAll('.results-table th').forEach(th => {
            th.dataset.sort = '';
            th.classList.remove('sort-asc', 'sort-desc');
        });

        // Add indicator to current sort column
        if (this.currentSort.column !== null) {
            const currentHeader = document.querySelectorAll('.results-table th')[this.currentSort.column];
            currentHeader.dataset.sort = this.currentSort.direction;
            currentHeader.classList.add(`sort-${this.currentSort.direction}`);
        }
    }

    getSortValue(row, columnIndex) {
        const cell = row.cells[columnIndex];
        const value = cell.textContent.trim();

        // Special handling for specific columns
        switch(columnIndex) {
            case 4: // Length column (mm:ss format)
                const [minutes, seconds] = value.split(':').map(Number);
                return minutes * 60 + seconds;
            case 5: // BPM column
                return parseFloat(value) || 0;
            default:
                return value;
        }
    }

    sortTable() {
        const tbody = document.querySelector('.results-table tbody');
        const rows = Array.from(tbody.querySelectorAll('tr'));

        // Sort based on current column and direction
        rows.sort((a, b) => {
            const aValue = this.getSortValue(a, this.currentSort.column);
            const bValue = this.getSortValue(b, this.currentSort.column);

            if (typeof aValue === 'number' && typeof bValue === 'number') {
                return this.currentSort.direction === 'asc' ? 
                    aValue - bValue : 
                    bValue - aValue;
            }

            return this.currentSort.direction === 'asc' ?
                String(aValue).localeCompare(String(bValue)) :
                String(bValue).localeCompare(String(aValue));
        });

        // Reorder the table
        tbody.innerHTML = '';
        rows.forEach(row => tbody.appendChild(row));

        // Reinitialize row handlers and cart states
        if (window.cartStateManager) {
            window.cartStateManager.updateAllButtons();
        }
    }
}

// Initialize table sort manager when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.tableSortManager = new TableSortManager();
    });
} else {
    window.tableSortManager = new TableSortManager();
}