import { IndexedDBAdapter } from "./indexedDBAdapter";

export class StorageAdapter {
  private db: IndexedDBAdapter;
  private pendingWrites: any[] = [];
  private writeTimer: ReturnType<typeof setTimeout> | null = null;
  private maxEntries: number;

  constructor(
    private key = "__illogger__",
    maxEntries = 5000,
  ) {
    this.maxEntries = maxEntries;
    this.db = new IndexedDBAdapter(key, "logs", 1);
  }

  /**
   * Append a log entry to IndexedDB
   * Uses batching to improve performance for high-frequency logging
   */
  async append(entry: any): Promise<void> {
    this.pendingWrites.push(entry);

    // Batch writes to avoid too many IndexedDB transactions
    if (this.writeTimer) {
      clearTimeout(this.writeTimer);
    }

    this.writeTimer = setTimeout(async () => {
      await this.flushPendingWrites();
    }, 100); // Batch writes every 100ms
  }

  /**
   * Flush pending writes to IndexedDB
   */
  private async flushPendingWrites(): Promise<void> {
    if (this.pendingWrites.length === 0) return;

    const toWrite = [...this.pendingWrites];
    this.pendingWrites = [];

    try {
      // Add all pending entries
      await Promise.all(toWrite.map((entry) => this.db.append(entry)));

      // Trim if needed after adding
      const count = await this.db.count();
      if (count > this.maxEntries) {
        await this.trimOldEntries();
      }
    } catch (error) {
      console.error("Failed to flush pending writes:", error);
      // Re-add failed writes to pending queue
      this.pendingWrites.unshift(...toWrite);
    }
  }

  /**
   * Trim old entries to maintain maxEntries limit
   */
  private async trimOldEntries(): Promise<void> {
    try {
      const logs = await this.db.read();
      if (logs.length <= this.maxEntries) return;

      // Sort by id (which represents insertion order via auto-increment) and keep the most recent
      const sorted = logs.sort((a, b) => (a.id || 0) - (b.id || 0));
      const toKeep = sorted.slice(-this.maxEntries);
      // Remove id field before rewriting (IndexedDB will assign new auto-increment IDs)
      const logsWithoutId = toKeep.map(({ id, ...log }) => log);
      await this.db.write(logsWithoutId);
    } catch (error) {
      console.error("Failed to trim old entries:", error);
    }
  }

  /**
   * Get all logs from IndexedDB
   */
  async getAll(): Promise<any[]> {
    // Flush any pending writes first
    await this.flushPendingWrites();
    const logs = await this.db.read();
    // Remove the internal id field before returning
    return logs.map(({ id, ...log }) => log);
  }

  /**
   * Get count of logs in storage
   */
  async count(): Promise<number> {
    await this.flushPendingWrites();
    return await this.db.count();
  }

  /**
   * Clear all logs from IndexedDB
   */
  async clear(): Promise<void> {
    this.pendingWrites = [];
    if (this.writeTimer) {
      clearTimeout(this.writeTimer);
      this.writeTimer = null;
    }
    await this.db.clear();
  }

  /**
   * Close the database connection
   */
  close(): void {
    if (this.writeTimer) {
      clearTimeout(this.writeTimer);
      this.writeTimer = null;
    }
    // Flush pending writes before closing
    this.flushPendingWrites().finally(() => {
      this.db.close();
    });
  }
}
