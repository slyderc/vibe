// menu-manager.js
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

        let success = false;
        let cartNumber = null;

        if (action === 'cart-auto') {
            success = window.myriadController.cueInFirstAvailable(this.currentMediaId);
            cartNumber = 'Auto';
        } else if (action.startsWith('cart-')) {
            cartNumber = action.split('-')[1];
            success = window.myriadController.cueInCart(this.currentMediaId, cartNumber);
        } else if (action === 'cue-edit') {
            success = window.myriadController.sendToCueEdit(this.currentMediaId);
        }

        if (success && cartNumber) {
            if (window.cartStateManager) {
                window.cartStateManager.updateState(this.currentMediaId, cartNumber);
                
                const button = document.querySelector(`tr[data-media-id="${this.currentMediaId}"] .cart-button`);
                if (button) {
                    window.cartStateManager.updateButton(button, cartNumber);
                }
            }
        }

        this.hide();
    }

    show(x, y, mediaId, button = null) {
        this.currentMediaId = mediaId;
        this.isVisible = true;
        this.element.style.display = 'block';

        let rect;
        if (button) {
            const rect = button.getBoundingClientRect();
            x = rect.left;
            y = rect.bottom + window.scrollY;
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

            if (x + menuRect.width > viewportWidth) {
                x = viewportWidth - menuRect.width - 5;
            }

            if (y + menuRect.height > viewportHeight) {
                if (button && rect) {
                    y = rect.top - menuRect.height;
                } else {
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

// Initialize and export to window
window.menuManager = new MenuManager();