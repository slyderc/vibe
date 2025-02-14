<!DOCTYPE html>
<html lang="en" class="vibe-compact">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>VIBE - Music Search</title>
    <script src="https://unpkg.com/lucide@latest"></script>
    <link rel="stylesheet" href="./css/vibe.css">
    <link rel="stylesheet" href="./css/themes/dark.css">
</head>
<body>
    <div class="icon-bar compact">
        <button class="icon-button" title="Basic Search">
            <i data-lucide="search"></i>
        </button>
        <button class="icon-button" title="Advanced Search">
            <i data-lucide="filter"></i>
        </button>
        <div class="icon-separator"></div>
        <button class="icon-button" title="Recent Searches">
            <i data-lucide="history"></i>
        </button>
        <button class="icon-button" title="Saved Searches">
            <i data-lucide="bookmark"></i>
        </button>
        <div class="icon-separator"></div>
        <button class="icon-button" title="Help">
            <i data-lucide="help-circle"></i>
        </button>
    </div>

    <div class="search-container compact">
        <div class="search-bar">
            <input type="search" placeholder="Search..." class="compact">
            <button class="save-search-btn compact">Search</button>
        </div>
        <div class="filters-grid compact">
            <div class="filter-select">
                <select class="compact">
                    <option value="">Genre</option>
                    <option>New Wave</option>
                    <option>Post-Punk</option>
                    <option>Synthpop</option>
                </select>
            </div>
            <div class="filter-select">
                <select class="compact">
                    <option value="">Mood</option>
                    <option>Energetic</option>
                    <option>Melancholic</option>
                    <option>Upbeat</option>
                </select>
            </div>
            <div class="filter-select">
                <select class="compact">
                    <option value="">Tempo</option>
                    <option>Slow</option>
                    <option>Medium</option>
                    <option>Fast</option>
                </select>
            </div>
            <div class="filter-select">
                <select class="compact">
                    <option value="">Label</option>
                    <option>4AD</option>
                    <option>Factory</option>
                    <option>Mute</option>
                </select>
            </div>
        </div>
    </div>

    <table class="results-table">
        <thead>
            <tr>
                <th>Load Cart</th>
                <th>Title</th>
                <th>Artist</th>
                <th>Genre</th>
                <th>Length</th>
                <th>BPM</th>
                <th>Label</th>
            </tr>
        </thead>
        <tbody>
            <tr data-media-id="10001">
                <td class="cart-cell">
                    <button class="cart-button">
                        <i data-lucide="pause" size="14"></i>Cart
                    </button>
                </td>
                <td>Blue Monday</td>
                <td>New Order</td>
                <td>New Wave</td>
                <td>7:29</td>
                <td>130</td>
                <td>Factory</td>
            </tr>
            <tr data-media-id="10002">
                <td class="cart-cell">
                    <button class="cart-button">
                        <i data-lucide="pause" size="14"></i>Cart
                    </button>
                </td>
                <td>Just Like Heaven</td>
                <td>The Cure</td>
                <td>New Wave</td>
                <td>3:32</td>
                <td>126</td>
                <td>Fiction</td>
            </tr>
            <tr data-media-id="10003">
                <td class="cart-cell">
                    <button class="cart-button">
                        <i data-lucide="pause" size="14"></i>Cart
                    </button>
                </td>
                <td>Love Will Tear Us Apart</td>
                <td>Joy Division</td>
                <td>Post-Punk</td>
                <td>3:26</td>
                <td>148</td>
                <td>Factory</td>
            </tr>
        </tbody>
    </table>

    <!-- Scripts -->
    <script src="js/search.js"></script>
    <script src="js/playout.js"></script>
    <script src="js/cache.js"></script>
    <script>
        // Initialize Lucide icons
        lucide.createIcons();
    </script>
</body>
</html>