<?php
namespace Vibe;

class Cache {
    private \SQLite3 $db;
    private int $defaultTTL = 3600; // 1 hour default

    public function __construct(string $dbPath = '/tmp/vibe_cache.db') {
        $this->db = new \SQLite3($dbPath);
        $this->initializeTable();
    }

    private function initializeTable(): void {
        $this->db->exec('
            CREATE TABLE IF NOT EXISTS cache (
                key TEXT PRIMARY KEY,
                value TEXT,
                expires_at INTEGER
            )
        ');
        // Index for faster expiration cleanup
        $this->db->exec('
            CREATE INDEX IF NOT EXISTS idx_expires_at 
            ON cache(expires_at)
        ');
    }

    public function set(string $key, mixed $value, int $ttl = null): bool {
        $ttl = $ttl ?? $this->defaultTTL;
        $expiresAt = time() + $ttl;
        
        $stmt = $this->db->prepare('
            INSERT OR REPLACE INTO cache (key, value, expires_at)
            VALUES (:key, :value, :expires_at)
        ');
        
        $stmt->bindValue(':key', $key, SQLITE3_TEXT);
        $stmt->bindValue(':value', serialize($value), SQLITE3_TEXT);
        $stmt->bindValue(':expires_at', $expiresAt, SQLITE3_INTEGER);
        
        return $stmt->execute() !== false;
    }

    public function get(string $key): mixed {
        $this->cleanup();
        
        $stmt = $this->db->prepare('
            SELECT value FROM cache 
            WHERE key = :key AND expires_at > :now
        ');
        
        $stmt->bindValue(':key', $key, SQLITE3_TEXT);
        $stmt->bindValue(':now', time(), SQLITE3_INTEGER);
        
        $result = $stmt->execute();
        if ($row = $result->fetchArray(SQLITE3_ASSOC)) {
            return unserialize($row['value']);
        }
        
        return null;
    }

    private function cleanup(): void {
        $this->db->exec('
            DELETE FROM cache 
            WHERE expires_at <= ' . time()
        );
    }

    public function __destruct() {
        $this->db->close();
    }
}

