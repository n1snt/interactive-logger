import { LoggerInstance } from "./loggerInstance";
import { StorageAdapter } from "./storageAdapter";
import { downloadLogs, injectDownloadButton, withdrawDownloadButton } from "./uiButton";

class ILoggerCore {
  private instances: Record<string, LoggerInstance> = {};
  private storage: StorageAdapter;
  private consoleLogging = false;
  private singleFile = false;
  private timestampsEnabled = true;
  private enabled = true;

  constructor(options: { maxLogs?: number; singleFile?: boolean; timestamps?: boolean; enabled?: boolean } = {}) {
    this.storage = new StorageAdapter("__illogger__", options.maxLogs ?? 5000);
    this.singleFile = options.singleFile ?? false;
    this.timestampsEnabled = options.timestamps ?? true;
    this.enabled = options.enabled ?? true;
  }

  createInstance(name: string, options: { timeStamps?: boolean } = {}) {
    const instance = new LoggerInstance(
      name,
      this.storage,
      options.timeStamps ?? this.timestampsEnabled,
      this.consoleLogging,
      this.enabled,
    );
    this.instances[name] = instance;
    return instance;
  }

  getLogger(name: string) {
    return this.instances[name];
  }

  setConsoleLogging(enabled: boolean) {
    this.consoleLogging = enabled;
    Object.values(this.instances).forEach((i) => i.setConsoleLogging(enabled));
  }

  setTimestamps(enabled: boolean) {
    this.timestampsEnabled = enabled;
    Object.values(this.instances).forEach((i) => i.setTimestamps(enabled));
  }

  getTimestamps(): boolean {
    return this.timestampsEnabled;
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
    Object.values(this.instances).forEach((i) => i.setEnabled(enabled));
  }

  getEnabled(): boolean {
    return this.enabled;
  }

  injectButton() {
    injectDownloadButton(this.storage, this.singleFile, () => this.timestampsEnabled);
  }

  withdrawButton() {
    withdrawDownloadButton();
  }

  async clear() {
    await this.storage.clear();
  }

  async getStats() {
    const logs = await this.storage.getAll();
    const uniqueLoggers = new Set(logs.map((log) => log?.name).filter(Boolean));
    return {
      totalLogs: logs.length,
      activeLoggers: uniqueLoggers.size,
      maxLogs: this.storage.getMaxLogs(),
    };
  }

  async setMaxLogs(maxLogs: number) {
    await this.storage.setMaxLogs(maxLogs);
  }

  getMaxLogs(): number {
    return this.storage.getMaxLogs();
  }

  async downloadLogs() {
    await downloadLogs(this.storage, this.singleFile, () => this.timestampsEnabled);
  }

  enableConsoleInterface() {
    if (typeof window !== "undefined") {
      (window as any).downloadLogs = () => this.downloadLogs();
    }
  }

  disableConsoleInterface() {
    if (typeof window !== "undefined") {
      delete (window as any).downloadLogs;
    }
  }
}

let _illogger: ILoggerCore | null = null;

export function ILogger(options?: { maxLogs?: number; singleFile?: boolean; timestamps?: boolean; enabled?: boolean }) {
  if (!_illogger) _illogger = new ILoggerCore(options);
  return _illogger;
}

export function getLogger(name: string) {
  return _illogger?.getLogger(name);
}
