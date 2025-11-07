---
sidebar_position: 4
---

# Architecture

This document outlines the architecture of Interactive Logger and explains how it works internally.

## Overview

Interactive Logger is built with a modular architecture that separates concerns into distinct components:

- **InteractiveLogger**: Main entry point and coordinator
- **StorageAdapter**: Abstraction layer for storage operations
- **IndexedDBAdapter**: IndexedDB implementation of storage
- **LoggerInstance**: Individual logger instances
- **UIButton**: Download button component

## Component Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  InteractiveLogger                       │
│  (Main coordinator, configuration, instance management)  │
└──────────────┬──────────────────────────────────────────┘
               │
       ┌───────┴────────┬──────────────┬──────────────┐
       │                │              │              │
┌──────▼──────┐  ┌──────▼──────┐  ┌───▼──────┐  ┌───▼──────┐
│StorageAdapter│  │LoggerInstance│  │ UIButton │  │Console   │
│              │  │              │  │          │  │Intercept │
└──────┬───────┘  └──────────────┘  └──────────┘  └──────────┘
       │
┌──────▼──────────┐
│IndexedDBAdapter │
│                 │
│  - Database     │
│  - Object Store │
│  - Indexes      │
└─────────────────┘
```

## Storage Architecture

### IndexedDB Structure

Interactive Logger uses IndexedDB for persistent storage with the following structure:

**Database Name**: `__illogger__`

**Object Store**: `logs`

**Key Path**: `id` (auto-incrementing)

**Indexes**:
- `timestamp`: For efficient querying by timestamp
- `name`: For efficient querying by logger name

### Log Entry Format

Each log entry stored in IndexedDB has the following structure:

```typescript
{
  id?: number;            // Auto-incrementing ID (internal)
  name: string;           // Logger instance name
  message: string;        // Serialized log message
  timestamp?: string;     // ISO timestamp (if timestamps enabled)
}
```

### Storage Operations

The storage adapter provides the following operations:

- **`writeLog(name: string, message: string, timestamp?: string)`**: Write a log entry
- **`getLogs(name?: string, limit?: number)`**: Retrieve logs (optionally filtered by name)
- **`clear()`**: Clear all logs
- **`getStats()`**: Get storage statistics
- **`trimLogs(maxLogs: number)`**: Remove oldest logs when limit is exceeded

## Logging Flow

### Write Flow

```
1. User calls loggerInstance.writeLog(...args)
   │
   ├─> Serialize arguments (strings, objects, errors)
   │
   ├─> Check if logging is enabled
   │
   ├─> Add timestamp (if enabled)
   │
   ├─> Queue log entry for batch write
   │
   └─> If console logging enabled, also log to console

2. Batch processor (every 100ms)
   │
   ├─> Collect all queued entries
   │
   ├─> Check if trimming is needed
   │
   ├─> Write batch to IndexedDB
   │
   └─> Clear queue
```

### Read Flow

```
1. User triggers download
   │
   ├─> Query all logs from IndexedDB
   │
   ├─> Group by logger name (if multi-file mode)
   │
   ├─> Format logs with timestamps
   │
   ├─> Add session separators (if enabled)
   │
   ├─> Create file(s) or ZIP
   │
   └─> Trigger download
```

## Performance Optimizations

### Batched Writes

Log entries are batched and written every 100ms to reduce IndexedDB transactions. This prevents performance issues when logging at high frequency.

```javascript
// Logs are queued
logger.writeLog('Message 1');
logger.writeLog('Message 2');
logger.writeLog('Message 3');

// After 100ms, all three are written in a single transaction
```

### Automatic Trimming

When the log limit is reached, the system automatically removes the oldest entries:

1. Before writing new logs, check current count
2. If count >= maxLogs, calculate how many to remove
3. Query oldest entries by timestamp
4. Delete oldest entries
5. Write new entries

This ensures the storage never exceeds the configured limit.

### Proactive Trimming

The system checks if trimming is needed before adding new entries, preventing storage from growing beyond limits.

## Session Management

### Session Detection

Sessions are detected using the `sessionStorage` API:

1. On initialization, check if a session marker exists
2. If not, create a new session marker
3. Add a session separator to logs
4. If session marker exists, continue with existing session

### Session Separators

Session separators are added to log files to mark when a new browser session/tab was opened:

```
============================================================
[2024-01-15T10:30:00.000Z] New Session
============================================================
```

This helps distinguish between different user sessions in log files.

## Console Interception

### How It Works

Console interception wraps the native console methods:

```javascript
// Store original methods
const originalLog = console.log;
const originalError = console.error;
// ... etc

// Wrap with interception
console.log = (...args) => {
  originalLog(...args);  // Still log to console
  logger.writeLog('[LOG]', ...args);  // Also log to storage
};
```

### Intercepted Methods

- `console.log`
- `console.error`
- `console.warn`
- `console.info`
- `console.debug`
- `console.trace`

All intercepted calls are stored with the logger name `__console__` and include log level prefixes.

## Download Mechanism

### Single File Mode

When `singleFile: true`:
1. Query all logs from IndexedDB
2. Sort by timestamp
3. Format with logger name prefix: `[logger-name] message`
4. Add session separators at appropriate positions
5. Create a single `.log` file
6. Trigger download using FileSaver.js

### Multi-File Mode (ZIP)

When `singleFile: false`:
1. Query all logs from IndexedDB
2. Group by logger name
3. For each logger:
   - Sort logs by timestamp
   - Format with timestamps (if enabled)
   - Add session separators
   - Create a `.log` file
4. Create a ZIP file using JSZip
5. Add all log files to ZIP
6. Trigger download

## UI Button Component

### Features

- **Draggable**: Can be repositioned anywhere on the page
- **Persistent Position**: Position saved in localStorage
- **Viewport Constraints**: Automatically constrained to viewport bounds
- **Responsive**: Adjusts position on window resize
- **Customizable**: Text and styling can be customized

### Implementation

The button is implemented as a floating DOM element with:
- Drag event handlers (mousedown, mousemove, mouseup)
- Touch event handlers for mobile (touchstart, touchmove, touchend)
- Position persistence using localStorage
- Viewport boundary checking

## Error Handling

### Storage Errors

Storage errors are caught and logged to the console but don't crash the application:

```javascript
try {
  await storageAdapter.writeLog(...);
} catch (error) {
  console.error('Failed to write log:', error);
  // Application continues to work
}
```

### Graceful Degradation

If IndexedDB is unavailable:
- Errors are logged to console
- Application continues to work
- Logging operations are silently ignored
- Download operations return empty files

## Thread Safety

All operations are asynchronous and non-blocking:
- Log writes are fire-and-forget
- Storage operations use async/await
- Batch processing runs on a timer
- No blocking operations on the main thread

## Browser Compatibility

Interactive Logger requires:
- **IndexedDB support** (all modern browsers)
- **ES2019+ JavaScript features**
- **File API** (for downloads)

Compatible with:
- Chrome/Edge 79+
- Firefox 78+
- Safari 14+
- Opera 66+

## Future Considerations

Potential improvements for future versions:
- Web Worker support for heavy operations
- Compression for large log files
- Remote storage backends (optional)
- Real-time log streaming
- Log filtering and search
- Export to different formats (JSON, CSV)
