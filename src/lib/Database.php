<?php
// lib/Database.php
namespace Vibe;

class Database extends \PDO {
    public function __construct() {
        // Load configuration
        $config = require_once __DIR__ . '/../config/database.php';
        
        // Construct DSN for SQL Server
        $dsn = "sqlsrv:Server={$config['host']};Database={$config['database']}";
        
        // Connect with error handling
        try {
            parent::__construct($dsn, $config['username'], $config['password'], [
                \PDO::ATTR_ERRMODE => \PDO::ERRMODE_EXCEPTION,
                \PDO::ATTR_DEFAULT_FETCH_MODE => \PDO::FETCH_ASSOC,
                \PDO::ATTR_EMULATE_PREPARES => false
            ]);
        } catch (\PDOException $e) {
            // Log error (you might want to use a proper logging system)
            error_log("Database connection failed: " . $e->getMessage());
            throw new \Exception("Database connection failed. Please try again later.");
        }
    }
    
    /**
     * Override prepare to add better error handling
     */
    public function prepare($query, $options = []): \PDOStatement|false {
        try {
            $stmt = parent::prepare($query, $options);
            if ($stmt === false) {
                throw new \Exception("Failed to prepare statement");
            }
            return $stmt;
        } catch (\PDOException $e) {
            error_log("Query preparation failed: " . $e->getMessage());
            throw new \Exception("Query preparation failed");
        }
    }
}