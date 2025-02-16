// Client-side caching functionality
const cacheManager = {
    set(key, value, ttl = 3600) {
        const item = {
            value,
            expiry: new Date().getTime() + (ttl * 1000)
        };
        localStorage.setItem(key, JSON.stringify(item));
    },

    get(key) {
        const item = localStorage.getItem(key);
        if (!item) return null;

        const parsedItem = JSON.parse(item);
        if (new Date().getTime() > parsedItem.expiry) {
            localStorage.removeItem(key);
            return null;
        }
        return parsedItem.value;
    },

    remove(key) {
        localStorage.removeItem(key);
    },

    clear() {
        localStorage.clear();
    }
};

// Make cache manager globally available
window.cacheManager = cacheManager;