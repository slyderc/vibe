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
    
    // Context menu handler
    row.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        e.stopPropagation();
        window.menuManager.show(e.pageX, e.pageY, mediaId);
    });

    // Cart button handler
    const cartButton = row.querySelector('.cart-button');
    if (cartButton) {
        cartButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            window.menuManager.show(0, 0, mediaId, cartButton);
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
        lucide.createIcons({
            parent: tbody
        });

        // Initialize handlers for each new row
        tbody.querySelectorAll('tr').forEach(row => {
            initializeRowHandlers(row);
        });

        // Restore cart states if they exist
        if (window.cartStateManager) {
            window.cartStateManager.updateAllButtons();
        }
    }
}

// Initialize table with test data
document.addEventListener('DOMContentLoaded', () => {
    updateTableData(testData);
});
