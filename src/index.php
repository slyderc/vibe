<?php include 'nocache.php'; ?>
<html lang="en" class="vibe-compact">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- Cache control meta tags -->
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
    <meta http-equiv="Pragma" content="no-cache">
    <meta http-equiv="Expires" content="0">
    
    <title>VIBE - Versatile Index for Broadcasting Everything</title>
    <script src="https://unpkg.com/lucide@latest"></script>
    <!-- Add version parameters to force reload -->
    <link rel="stylesheet" href="./css/vibe.css?v=<?php echo time(); ?>">
    <link rel="stylesheet" href="./css/themes/dark.css?v=<?php echo time(); ?>">
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
        <div class="history-menu-container" style="position: relative;">
            <button title="Recent Searches" class="icon-button" title="Recent Searches">
                <i data-lucide="history"></i>
            </button>
        </div>
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
            <div class="search-input-wrapper" style="position: relative; flex: 1;">
                <input type="search" placeholder="Search..." class="compact">
                <button class="clear-search-button" style="display: none; position: absolute; right: 8px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; padding: 4px;">
                    <i data-lucide="x" size="14"></i>
                </button>
            </div>
            <button class="save-search-btn compact">Search</button>
        </div>
        <div class="filters-grid compact">
            <div class="filter-select">
                <select class="compact filter-input" data-filter="genre">
                    <option value="">Genre</option>
                    <option value="new-wave">New Wave</option>
                    <option value="post-punk">Post-Punk</option>
                    <option value="synthpop">Synthpop</option>
                </select>
            </div>
            <div class="filter-select">
                <select class="compact filter-input" data-filter="mood">
                    <option value="">Mood</option>
                    <option value="energetic">Energetic</option>
                    <option value="melancholic">Melancholic</option>
                    <option value="upbeat">Upbeat</option>
                </select>
            </div>
            <div class="filter-select">
                <select class="compact filter-input" data-filter="tempo">
                    <option value="">Tempo</option>
                    <option value="slow">Slow</option>
                    <option value="medium">Medium</option>
                    <option value="fast">Fast</option>
                </select>
            </div>
            <div class="filter-select">
                <select class="compact filter-input" data-filter="label">
                    <option value="">Label</option>
                    <option value="4ad">4AD</option>
                    <option value="factory">Factory</option>
                    <option value="mute">Mute</option>
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
            <!-- Dynamic content will be inserted here -->
        </tbody>
    </table>

    <!-- Scripts with version parameters -->
    <script src="js/search.js?v=<?php echo time(); ?>"></script>
    <script src="js/filter-menu.js?v=<?php echo time(); ?>"></script>
    <script src="js/data.js?v=<?php echo time(); ?>"></script>
    <script src="js/playout.js?v=<?php echo time(); ?>"></script>
    <script src="js/cache.js?v=<?php echo time(); ?>"></script>
    <script>
        // Initialize Lucide icons
        lucide.createIcons();
    </script>
</body>
</html>