<?php
// lib/init_database.php
namespace Vibe;

require_once __DIR__ . '/Database.php';

class DatabaseInitializer {
    private static $instance = null;
    private $db = null;
    
    private function __construct() {
        try {
            $this->db = new Database();
            $this->validateMyriadTables();
        } catch (\Exception $e) {
            $this->handleError($e->getMessage());
        }
    }
    
    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    public function getConnection() {
        return $this->db;
    }
    
    private function validateMyriadTables() {
        $requiredTables = [
            'AttributeTypes' => 'SELECT TOP 1 * FROM AttributeTypes',
            'StationAttributes' => 'SELECT TOP 1 * FROM StationAttributes WHERE StationId = 0',
            'Media' => 'SELECT TOP 1 * FROM Media',
            'MediaAttributes' => 'SELECT TOP 1 * FROM MediaAttributes'
        ];
        
        foreach ($requiredTables as $table => $query) {
            try {
                $stmt = $this->db->prepare($query);
                $stmt->execute();
                // Just fetching to verify the query works
                $stmt->fetch();
            } catch (\Exception $e) {
                throw new \Exception("Failed to validate Myriad table '$table': " . $e->getMessage());
            }
        }
    }
    
    private function handleError($message) {
        // Log the error
        error_log("VIBE Database Initialization Error: " . $message);
        
        // Display user-friendly error page
        header('Content-Type: text/html; charset=utf-8');
        echo '<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>VIBE - Database Connection Error</title>
            <style>
                body {
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                    background: #1a1a1a;
                    color: #ffffff;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    margin: 0;
                    padding: 20px;
                }
                .error-container {
                    background: #2a2a2a;
                    padding: 2rem;
                    border-radius: 8px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    max-width: 600px;
                    text-align: center;
                }
                h1 { color: #ff4444; margin-bottom: 1rem; }
                p { line-height: 1.6; }
                .details { 
                    color: #888;
                    font-size: 0.9rem;
                    margin-top: 1rem;
                    padding-top: 1rem;
                    border-top: 1px solid #444;
                }
            </style>
        </head>
        <body>
            <div class="error-container">
                <h1>Database Connection Error</h1>
                <p>VIBE is unable to connect to the Myriad database. Please ensure the database server is running and try again.</p>
                <div class="details">Error: ' . htmlspecialchars($message) . '</div>
            </div>
        </body>
        </html>';
        exit(1);
    }
}