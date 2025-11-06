/**
 * IndexedDB adapter for storing and retrieving logs
 * Provides a simple interface for async read/write operations
 */
export class IndexedDBAdapter {
    private dbName: string;
    private storeName: string;
    private version: number;
    private db: IDBDatabase | null = null;

    constructor(
        dbName = "__illogger_db__",
        storeName = "logs",
        version = 1,
    ) {
        this.dbName = dbName;
        this.storeName = storeName;
        this.version = version;
    }

    /**
     * Initialize the IndexedDB database
     * Returns a promise that resolves when the database is ready
     */
    private async init(): Promise<IDBDatabase> {
        if (this.db) {
            return this.db;
        }

        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onerror = () => {
                reject(new Error(`Failed to open IndexedDB: ${request.error}`));
            };

            request.onsuccess = () => {
                this.db = request.result;
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;
                if (!db.objectStoreNames.contains(this.storeName)) {
                    // Create object store with auto-incrementing key
                    const objectStore = db.createObjectStore(this.storeName, {
                        keyPath: "id",
                        autoIncrement: true,
                    });
                    // Create index for efficient querying by timestamp
                    objectStore.createIndex("timestamp", "timestamp", { unique: false });
                    // Create index for querying by logger name
                    objectStore.createIndex("name", "name", { unique: false });
                }
            };
        });
    }

    /**
     * Read all logs from IndexedDB
     */
    async read(): Promise<any[]> {
        try {
            const db = await this.init();
            return new Promise((resolve, reject) => {
                const transaction = db.transaction([this.storeName], "readonly");
                const store = transaction.objectStore(this.storeName);
                const request = store.getAll();

                request.onerror = () => {
                    reject(new Error(`Failed to read from IndexedDB: ${request.error}`));
                };

                request.onsuccess = () => {
                    resolve(request.result || []);
                };
            });
        } catch (error) {
            console.error("IndexedDB read error:", error);
            return [];
        }
    }

    /**
     * Write logs to IndexedDB
     * Replaces all existing logs with the new array
     */
    async write(logs: any[]): Promise<void> {
        try {
            const db = await this.init();
            return new Promise((resolve, reject) => {
                const transaction = db.transaction([this.storeName], "readwrite");
                const store = transaction.objectStore(this.storeName);

                // Clear existing data
                const clearRequest = store.clear();

                clearRequest.onerror = () => {
                    reject(
                        new Error(
                            `Failed to clear IndexedDB: ${clearRequest.error}`,
                        ),
                    );
                };

                clearRequest.onsuccess = () => {
                    // Add all new logs
                    if (logs.length === 0) {
                        resolve();
                        return;
                    }

                    let completed = 0;
                    let hasError = false;

                    logs.forEach((log) => {
                        // Let IndexedDB auto-increment the id
                        const addRequest = store.add(log);

                        addRequest.onerror = () => {
                            if (!hasError) {
                                hasError = true;
                                reject(
                                    new Error(
                                        `Failed to write to IndexedDB: ${addRequest.error}`,
                                    ),
                                );
                            }
                        };

                        addRequest.onsuccess = () => {
                            completed++;
                            if (completed === logs.length && !hasError) {
                                resolve();
                            }
                        };
                    });
                };
            });
        } catch (error) {
            console.error("IndexedDB write error:", error);
            throw error;
        }
    }

    /**
     * Append a single log entry to IndexedDB
     */
    async append(entry: any): Promise<void> {
        try {
            const db = await this.init();
            return new Promise((resolve, reject) => {
                const transaction = db.transaction([this.storeName], "readwrite");
                const store = transaction.objectStore(this.storeName);
                const request = store.add(entry);

                request.onerror = () => {
                    reject(new Error(`Failed to append to IndexedDB: ${request.error}`));
                };

                request.onsuccess = () => {
                    resolve();
                };
            });
        } catch (error) {
            console.error("IndexedDB append error:", error);
            throw error;
        }
    }

    /**
     * Clear all logs from IndexedDB
     */
    async clear(): Promise<void> {
        try {
            const db = await this.init();
            return new Promise((resolve, reject) => {
                const transaction = db.transaction([this.storeName], "readwrite");
                const store = transaction.objectStore(this.storeName);
                const request = store.clear();

                request.onerror = () => {
                    reject(new Error(`Failed to clear IndexedDB: ${request.error}`));
                };

                request.onsuccess = () => {
                    resolve();
                };
            });
        } catch (error) {
            console.error("IndexedDB clear error:", error);
            throw error;
        }
    }

    /**
     * Get count of logs in IndexedDB
     */
    async count(): Promise<number> {
        try {
            const db = await this.init();
            return new Promise((resolve, reject) => {
                const transaction = db.transaction([this.storeName], "readonly");
                const store = transaction.objectStore(this.storeName);
                const request = store.count();

                request.onerror = () => {
                    reject(new Error(`Failed to count IndexedDB: ${request.error}`));
                };

                request.onsuccess = () => {
                    resolve(request.result);
                };
            });
        } catch (error) {
            console.error("IndexedDB count error:", error);
            return 0;
        }
    }

    /**
     * Close the database connection
     */
    close(): void {
        if (this.db) {
            this.db.close();
            this.db = null;
        }
    }
}
