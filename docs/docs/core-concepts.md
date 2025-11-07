---
sidebar_position: 2
---

# Core Concepts

Understanding the core concepts of Interactive Logger will help you use it effectively in your applications.

## Logger Instances

Interactive Logger allows you to create multiple **logger instances**, each with a unique name. This enables you to organize logs by feature, module, or component.

```javascript
const logger = InteractiveLogger();

// Create separate loggers for different parts of your app
const appLogger = logger.createInstance('app');
const apiLogger = logger.createInstance('api');
const authLogger = logger.createInstance('auth');
const uiLogger = logger.createInstance('ui');
```

Each logger instance operates independently, allowing you to:
- Enable/disable logging per instance
- Configure timestamps per instance
- Control console output per instance

## Persistent Storage

All logs are stored in **IndexedDB**, a browser database that persists data across page reloads and browser sessions. This means:

- Logs survive page refreshes
- Logs persist even after closing the browser tab
- Logs are stored locally in the browser (no server required)
- Logs are automatically trimmed when the maximum limit is reached

The storage is organized by logger instance name, making it easy to query and download logs by category.

## Log Format

Each log entry contains:

- **name**: The logger instance name (e.g., "app", "api")
- **message**: The serialized log message (strings, objects, errors are handled)
- **timestamp**: ISO timestamp (if timestamps are enabled)
- **id**: Auto-incrementing ID for internal organization

Logs can contain:
- Simple strings
- Objects (automatically JSON stringified)
- Arrays (automatically JSON stringified)
- Errors (message and stack trace captured)
- Multiple arguments (joined with spaces)

## Download Formats

Interactive Logger supports two download formats:

### Single File Mode

When `singleFile: true`, all logs are downloaded as a single `.log` file with all logger instances combined chronologically.

### Multi-File Mode (Default)

When `singleFile: false`, logs are grouped by logger instance and downloaded as a ZIP file with separate files for each logger.

## Session Separators

Session separators automatically mark when a new browser session/tab is opened. This helps distinguish between different user sessions in your log files, making it easier to track user journeys and debug issues that span multiple sessions.

## Console Interception

Console interception allows you to capture all console output (console.log, console.error, console.warn, etc.) and automatically write them to log files. This is particularly useful for:

- Capturing logs from third-party libraries
- Debugging issues where you can't modify the code
- Creating comprehensive log files that include all console output

Intercepted console calls are stored with the logger name `__console__` and include log level prefixes.

## Performance Optimizations

Interactive Logger is designed for high-frequency logging:

- **Batched Writes**: Log entries are batched and written every 100ms to reduce IndexedDB transactions
- **Automatic Trimming**: When the log limit is reached, oldest entries are automatically removed
- **Proactive Trimming**: Before adding new entries, the system checks if trimming is needed
- **Fire-and-Forget**: Log writes are asynchronous and don't block the main thread

## Runtime Configuration

Interactive Logger supports runtime configuration, allowing you to:

- Enable/disable logging globally or per instance
- Toggle timestamps on/off
- Control console output
- Update maximum log limits
- Enable/disable console interception

This flexibility allows you to adjust logging behavior without restarting your application.
