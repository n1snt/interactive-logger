---
sidebar_position: 1
---

# InteractiveLogger

The main entry point for Interactive Logger. Creates and configures a logger instance.

## Syntax

```typescript
InteractiveLogger(options?: InteractiveLoggerOptions): InteractiveLoggerInstance
```

## Parameters

### `options` (optional)

An object with the following properties:

#### `maxLogs?: number`

Maximum number of log entries to store. When exceeded, oldest entries are automatically removed.

- **Default**: `5000`
- **Minimum**: `1`

#### `singleFile?: boolean`

Download logs as a single file or ZIP.

- **Default**: `false`
  - `false`: Download logs as a ZIP file with separate files for each logger instance
  - `true`: Download all logs as a single `.log` file

#### `timestamps?: boolean`

Whether to include ISO timestamps in log entries.

- **Default**: `true`

#### `enabled?: boolean`

Global enable/disable flag for all logging operations. When disabled, `writeLog()` calls are ignored (but console logging may still work if enabled).

- **Default**: `true`

#### `sessionSeparator?: boolean`

Whether to automatically add session separators when a new browser tab/window is opened. Session separators help distinguish between different browser sessions in your log files.

- **Default**: `true`

#### `sessionSeparatorMessage?: string`

Custom message to display in session separators. If not provided, defaults to `"New Session"`. The separator will include a timestamp if timestamps are enabled.

- **Default**: `"New Session"`

#### `buttonOptions?: ButtonOptions`

Customize the download button's text and styling. See [ButtonOptions](#buttonoptions) for details.

## Returns

An `InteractiveLoggerInstance` object with methods for creating logger instances, configuring settings, and managing logs.

## Examples

### Basic Usage

```javascript
import { InteractiveLogger } from 'interactive-logger';

const logger = InteractiveLogger();
```

### With Options

```javascript
const logger = InteractiveLogger({
  maxLogs: 10000,
  singleFile: false,
  timestamps: true,
  enabled: true,
  sessionSeparator: true,
  sessionSeparatorMessage: "🔄 New Session Started"
});
```

### Custom Button

```javascript
const logger = InteractiveLogger({
  buttonOptions: {
    text: "Download Logs",
    style: {
      background: "#007bff",
      color: "#fff",
      borderRadius: "8px"
    }
  }
});
```

## ButtonOptions

### `text?: string`

Button text to display.

- **Default**: `"Interactive Logger"`

### `style?: ButtonStyleOptions`

CSS style properties for the button. Any valid CSS property can be specified.

#### Common Properties

- `background?: string` - Background color
- `color?: string` - Text color
- `padding?: string` - Padding (e.g., "8px 14px")
- `borderRadius?: string` - Border radius (e.g., "8px")
- `fontSize?: string` - Font size (e.g., "14px")
- `border?: string` - Border (e.g., "none" or "1px solid #ccc")
- `cursor?: string` - Cursor style (default: "grab")
- `zIndex?: string` - Z-index (default: "99999")
- `opacity?: string` - Opacity (default: "0.8")
- `width?: string` - Button width (e.g., "80px")
- `height?: string` - Button height (e.g., "40px")

Custom styles are merged with default styles, so you only need to specify the properties you want to change.

## See Also

- [createInstance](./create-instance) - Create logger instances
- [getLogger](./get-logger) - Retrieve logger instances
- [Examples](../examples) - More usage examples
