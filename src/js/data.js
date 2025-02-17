const testData = [
    { 
        mediaId: 10001,
        title: "Blue Monday",
        artist: "New Order",
        genre: "New Wave",
        length: "7:29",
        bpm: 130,
        label: "Factory"
    },
    {
        mediaId: 10002,
        title: "Just Like Heaven",
        artist: "The Cure",
        genre: "New Wave",
        length: "3:32",
        bpm: 126,
        label: "Fiction"
    },
    {
        mediaId: 10003,
        title: "Love Will Tear Us Apart",
        artist: "Joy Division",
        genre: "Post-Punk",
        length: "3:26",
        bpm: 148,
        label: "Factory"
    },
    {
        mediaId: 10004,
        title: "This Charming Man",
        artist: "The Smiths",
        genre: "Indie Rock",
        length: "2:41",
        bpm: 137,
        label: "Rough Trade"
    },
    {
        mediaId: 10005,
        title: "People Are People",
        artist: "Depeche Mode",
        genre: "Synthpop",
        length: "4:01",
        bpm: 127,
        label: "Sire"
    },
    {
        mediaId: 10006,
        title: "Sweet Dreams",
        artist: "Eurythmics",
        genre: "Synthpop",
        length: "3:36",
        bpm: 126,
        label: "RCA"
    }
];

function generateTableRow(data) {
    return `
        <tr data-media-id="${data.mediaId}" draggable="true">
            <td class="cart-cell">
                <button class="cart-button">
                    <i data-lucide="pause" size="14"></i>Cart
                </button>
            </td>
            <td>${data.title}</td>
            <td>${data.artist}</td>
            <td>${data.genre}</td>
            <td>${data.length}</td>
            <td>${data.bpm}</td>
            <td>${data.label}</td>
        </tr>
    `;
}

function initializeRowHandlers(row) {
    const mediaId = row.dataset.mediaId;
    
    // Context menu handler with defensive check
    row.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (window.menuManager && typeof window.menuManager.show === 'function') {
            window.menuManager.show(e.pageX, e.pageY, mediaId);
        } else {
            console.warn('MenuManager not available or show method not found');
        }
    });

    // Cart button handler with defensive check
    const cartButton = row.querySelector('.cart-button');
    if (cartButton) {
        cartButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (window.menuManager && typeof window.menuManager.show === 'function') {
                window.menuManager.show(0, 0, mediaId, cartButton);
            } else {
                console.warn('MenuManager not available or show method not found');
            }
        });
    }

    // Drag handlers
    row.addEventListener('dragstart', (e) => {
        const rowData = Array.from(row.cells)
            .slice(1)
            .map(cell => cell.textContent);
        
        e.dataTransfer.setData('text/uri-list', 
            `myriad://Players/CueMediaItem?mediaId=${mediaId}`);
        e.dataTransfer.setData('text/plain', rowData.join('\t'));
        
        Array.from(row.cells).slice(1).forEach(cell => 
            cell.classList.add('dragging'));
    });

    row.addEventListener('dragend', () => {
        Array.from(row.cells).slice(1).forEach(cell => 
            cell.classList.remove('dragging'));
    });
}

function updateTableData(data) {
    const tbody = document.querySelector('.results-table tbody');
    if (tbody) {
        tbody.innerHTML = data.map(item => generateTableRow(item)).join('');
        
        // Reinitialize Lucide icons for the new content
        if (typeof lucide !== 'undefined' && typeof lucide.createIcons === 'function') {
            lucide.createIcons({
                parent: tbody
            });
        } else {
            console.warn('Lucide icons not available');
        }

        // Initialize handlers for each new row
        tbody.querySelectorAll('tr').forEach(row => {
            initializeRowHandlers(row);
        });

        // Restore cart states if they exist
        if (window.cartStateManager && typeof window.cartStateManager.updateAllButtons === 'function') {
            window.cartStateManager.updateAllButtons();
        }
    }
}

// Initialize table with test data when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        updateTableData(testData);
    });
} else {
    // DOM already loaded, update immediately
    updateTableData(testData);
}

// Table sorting function
function updateTableData(data) {
    const tbody = document.querySelector('.results-table tbody');
    if (tbody) {
        tbody.innerHTML = data.map(item => generateTableRow(item)).join('');
        
        // Reinitialize Lucide icons for the new content
        if (typeof lucide !== 'undefined' && typeof lucide.createIcons === 'function') {
            lucide.createIcons({
                parent: tbody
            });
        } else {
            console.warn('Lucide icons not available');
        }

        // Initialize handlers for each new row
        tbody.querySelectorAll('tr').forEach(row => {
            initializeRowHandlers(row);
        });

        // Restore cart states if they exist
        if (window.cartStateManager && typeof window.cartStateManager.updateAllButtons === 'function') {
            window.cartStateManager.updateAllButtons();
        }

        // Reinitialize sorting
        if (window.tableSortManager) {
            window.tableSortManager = new TableSortManager();
        }
    }
}