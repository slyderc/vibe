
### VIBE: Minimum Requirements Document

**Overview:**
Versatile Index for Broadcasting Everything (VIBE) is a proposed tool designed to provide search functionality that isn't currently present in Myriad's native search. It enables DJs and Music Programmers to perform advanced search queries on Song media items based on extended metadata and user-defined Categories and Attributes. Search results can quickly be located and selected for cart loads directly in Myriad. The tool integrates seamlessly with Myriad via its "HTML Display View" layout widget, first made available in Myriad Playout v6.6.1.

This document outlines the minimum technical, functional, and user requirements necessary for the successful development and deployment of VIBE.

#### **Functional Requirements:**
- **Advanced Search:** Dynamic, multi-parameter search across metadata fields (artist, title, genre, mood, tempo, label, etc.)
- **Search Results:** Displayed in a sortable, adjustable table with an intuitive user interface.
- **Playout Integration:** One-click, right-click, and drag-and-drop options to send selected tracks to Myriad cart players.
- **Search History:** Ability to bookmark and retrieve frequently used searches.

#### **Technical Requirements:**
- **Integration:**
  - Myriad Swagger API and direct SQL Server database calls.
  - Support for Myriad’s HTML Display View widget (v6.6.1+).
- **Web Interface:**
  - Simple HTML 5 with Javascript for responsive design, compatible with Chrome, Firefox, and Safari.
  - Seamless Myriad integration with consistent color schemes, fonts, and icons.
- **Backend Infrastructure:**
  - Docker container running all necessary software (php:8.2-fpm-alpine).
  - nginx, PHP 8, and FPM server setup for serving the interface
  - SQLite3 for caching and state management as necessary
  - PHP support for SQL Server connectivity to Myriad's database as required.

#### **Performance and Scalability:**
- Caching of search templates and metadata to minimize database load.
- Efficient resource utilization without impacting Myriad performance.


```
src/
├── css/
│   ├── vibe.css        # Main CSS styles
│   └── themes/         # For Myriad theme matching
├── js/
│   ├── search.js       # Search functionality
│   ├── cache.js        # Client-side caching
│   └── playout.js      # Myriad playout integration
├── lib/
│   ├── Cache.php       # SQLite caching class
│   ├── MyriadAPI.php   # Myriad API wrapper
│   ├── Database.php    # SQL Server connection handling
│   └── AudioInfo.php   # getID3 wrapper for metadata
├── api/
│   ├── search.php      # Search endpoint
│   ├── cache.php       # Cache management
│   └── playout.php     # Playout controls
├── config/
│   ├── database.php    # DB configuration
│   └── myriad.php      # Myriad API settings
└── index.php           # Main entry point

```

