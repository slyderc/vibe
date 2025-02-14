document.addEventListener('DOMContentLoaded', function() {
    class FilterMenuManager {
        constructor() {
            this.element = null;
            this.activeSelect = null;
            this.currentValue = null;
            this.isVisible = false;
            this.init();
        }

        init() {
            // Create unified menu element
            this.element = document.createElement('div');
            this.element.className = 'unified-menu';
            document.body.appendChild(this.element);

            // Convert all filter selects to custom dropdowns
            document.querySelectorAll('.filter-select select').forEach(select => {
                this.convertSelectToButton(select);
            });

            // Setup global event listeners
            this.setupGlobalEventListeners();
        }

        convertSelectToButton(select) {
            // Create button
            const button = document.createElement('button');
            button.className = 'cart-button filter-button compact';
            button.innerHTML = `
                <i data-lucide="filter" size="14"></i>
                <span>${select.options[0].text}</span>
            `;

            // Hide original select
            select.style.display = 'none';
            select.parentNode.insertBefore(button, select);

            // Initialize lucide icon
            lucide.createIcons({
                parent: button
            });

            // Add click handler
            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const wasOpen = this.isVisible && this.activeSelect === select;
                this.hide();
                
                if (!wasOpen) {
                    this.show(select, button);
                }
            });
        }

        createMenuItems(select) {
            return Array.from(select.options).map(option => `
                <div class="menu-item" data-value="${option.value}">
                    ${option.text}
                </div>
            `).join('');
        }

        show(select, button) {
            this.activeSelect = select;
            this.isVisible = true;
            this.element.innerHTML = this.createMenuItems(select);
            this.element.style.display = 'block';
            button.classList.add('active');

            // Position menu below button
            const rect = button.getBoundingClientRect();
            const menuRect = this.element.getBoundingClientRect();

            let x = rect.left;
            let y = rect.bottom + window.scrollY;

            // Adjust for viewport edges
            if (x + menuRect.width > window.innerWidth) {
                x = window.innerWidth - menuRect.width - 5;
            }

            if (y + menuRect.height > window.innerHeight) {
                y = rect.top - menuRect.height + window.scrollY;
            }

            this.element.style.left = Math.max(0, x) + 'px';
            this.element.style.top = Math.max(0, y) + 'px';

            // Add click handlers to menu items
            this.element.querySelectorAll('.menu-item').forEach(item => {
                item.addEventListener('click', () => {
                    const value = item.dataset.value;
                    select.value = value;
                    button.querySelector('span').textContent = item.textContent.trim();
                    this.hide();
                    select.dispatchEvent(new Event('change'));
                });
            });
        }

        hide() {
            if (this.activeSelect) {
                const button = this.activeSelect.previousElementSibling;
                if (button) {
                    button.classList.remove('active');
                }
            }
            this.element.style.display = 'none';
            this.isVisible = false;
            this.activeSelect = null;
        }

        setupGlobalEventListeners() {
            // Close on outside click
            document.addEventListener('click', (e) => {
                if (this.isVisible && !e.target.closest('.filter-button') && 
                    !e.target.closest('.unified-menu')) {
                    this.hide();
                }
            });

            // Close on ESC
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.isVisible) {
                    this.hide();
                }
            });
        }
    }

    // Initialize filter menu manager
    const filterMenuManager = new FilterMenuManager();
});