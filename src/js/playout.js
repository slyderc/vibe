document.addEventListener('DOMContentLoaded', function() {
    // Myriad URI handler
    const myriadController = {
        cueInCart(mediaId, cartNumber) {
            const uri = `myriad://Players/CueMediaItem?mediaId=${mediaId}&forcePlayerIndex=${cartNumber}`;
            window.location.href = uri;
        },
        
        cueInFirstAvailable(mediaId) {
            const uri = `myriad://Players/CueMediaItem?mediaId=${mediaId}`;
            window.location.href = uri;
        },
        
        sendToCueEdit(mediaId) {
            const uri = `myriad://Media/OpenInPreviewPlayer?mediaId=${mediaId}`;
            window.location.href = uri;
        }
    };

    // Unified menu component
    class MenuManager {
        constructor() {
            this.element = null;
            this.activeButton = null;
            this.currentMediaId = null;
            this.isVisible = false;
            this.init();
        }

        createMenuHTML() {
            return `
                <div class="menu-item" data-action="cue-edit">
                    <i data-lucide="headphones"></i>
                    Cue Edit
                </div>
                <div class="menu-separator"></div>
                <div class="menu-item" data-action="cart-auto">
                    <i data-lucide="pause"></i>
                    Auto Cart
                    <i data-lucide="route"></i>
                </div>
                <div class="menu-separator"></div>
                ${Array.from({length: 8}, (_, i) => `
                    <div class="menu-item" data-action="cart-${i + 1}">
                        <i data-lucide="pause"></i>
                        Cart ${i + 1}
                    </div>
                `).join('')}
            `;
        }

        init() {
            // Create menu element
            this.element = document.createElement('div');
            this.element.className = 'unified-menu';
            this.element.innerHTML = this.createMenuHTML();
            document.body.appendChild(this.element);

            // Initialize icons
            lucide.createIcons({
                parent: this.element
            });

            // Setup event listeners
            this.setupEventListeners();
        }

        setupEventListeners() {
            // Menu item click handler
            this.element.addEventListener('click', (e) => {
                const menuItem = e.target.closest('.menu-item');
                if (!menuItem) return;

                e.stopPropagation();
                this.handleMenuAction(menuItem.dataset.action);
            });

            // Global click handler for closing menu
            document.addEventListener('click', (e) => {
                if (this.isVisible && !this.element.contains(e.target) && 
                    (!this.activeButton || !this.activeButton.contains(e.target))) {
                    this.hide();
                }
            });

            // Handle escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.isVisible) {
                    this.hide();
                }
            });
        }

        handleMenuAction(action) {
            if (!this.currentMediaId) return;

            if (action === 'cart-auto') {
                myriadController.cueInFirstAvailable(this.currentMediaId);
            } else if (action.startsWith('cart-')) {
                const cartNumber = action.split('-')[1];
                myriadController.cueInCart(this.currentMediaId, cartNumber);
            } else if (action === 'cue-edit') {
                myriadController.sendToCueEdit(this.currentMediaId);
            }

            this.hide();
        }

        show(x, y, mediaId, button = null) {
            this.currentMediaId = mediaId;
            this.isVisible = true;
            this.element.style.display = 'block';

            if (button) {
                const rect = button.getBoundingClientRect();
                x = rect.left;
                y = rect.bottom + window.pageYOffset;
                this.activeButton = button;
                button.classList.add('active');
            } else {
                this.activeButton = null;
            }

            // Position menu and ensure it's within viewport
            requestAnimationFrame(() => {
                const menuRect = this.element.getBoundingClientRect();
                const viewportWidth = window.innerWidth;
                const viewportHeight = window.innerHeight;

                // Adjust horizontal position
                if (x + menuRect.width > viewportWidth) {
                    x = viewportWidth - menuRect.width - 5;
                }

                // Adjust vertical position
                if (y + menuRect.height > viewportHeight) {
                    if (button) {
                        // If triggered by button, show above the button
                        y = rect.top - menuRect.height;
                    } else {
                        // If right-click, ensure it's within viewport
                        y = viewportHeight - menuRect.height - 5;
                    }
                }

                this.element.style.left = Math.max(0, x) + 'px';
                this.element.style.top = Math.max(0, y) + 'px';
            });
        }

        hide() {
            this.element.style.display = 'none';
            this.isVisible = false;
            this.currentMediaId = null;
            if (this.activeButton) {
                this.activeButton.classList.remove('active');
                this.activeButton = null;
            }
        }
    }

    // Initialize menu manager
    const menuManager = new MenuManager();

    // Setup table interactions
    document.querySelectorAll('.results-table tbody tr').forEach(row => {
        const mediaId = row.dataset.mediaId;
        
        // Context menu handler
        row.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            e.stopPropagation();
            menuManager.show(e.pageX, e.pageY, mediaId);
        });

        // Cart button handler
        const cartButton = row.querySelector('.cart-button');
        if (cartButton) {
            cartButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                menuManager.show(0, 0, mediaId, cartButton);
            });
        }

        // Drag handlers
        row.setAttribute('draggable', 'true');
        
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
    });
});