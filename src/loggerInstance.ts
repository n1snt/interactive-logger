import { StorageAdapter } from "./storageAdapter";

export class LoggerInstance {
  constructor(
    private name: string,
    private storage: StorageAdapter,
    private withTimestamps = true,
    private consoleLogging = false,
    private enabled = true,
  ) { }

  writeLog(...args: any[]) {
    // If logger is disabled, don't write to storage
    if (!this.enabled) {
      // Still allow console logging if enabled (for debugging)
      if (this.consoleLogging) console.log(`[${this.name}]`, ...args);
      return;
    }

    const message = args
      .map((a) =>
        typeof a === "string"
          ? a
          : a instanceof Error
            ? `${a.message}\n${a.stack}`
            : JSON.stringify(a),
      )
      .join(" ");

    const entry = {
      name: this.name,
      message,
      timestamp: this.withTimestamps ? new Date().toISOString() : undefined,
    };

    // Fire and forget - don't block on storage write
    this.storage.append(entry).catch((error) => {
      console.error("Failed to write log to storage:", error);
    });
    if (this.consoleLogging) console.log(`[${this.name}]`, ...args);
  }

  setConsoleLogging(enabled: boolean) {
    this.consoleLogging = enabled;
  }

  setTimestamps(enabled: boolean) {
    this.withTimestamps = enabled;
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }
}
