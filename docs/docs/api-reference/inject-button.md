---
sidebar_position: 5
---

# injectButton

Injects a floating, draggable download button into the page. The button position is saved in localStorage and restored on subsequent page loads.

## Syntax

```typescript
injectButton(buttonOptions?: ButtonOptions): void
```

## Parameters

### `buttonOptions` (optional)

Customize button text and styling. If not provided, uses options from constructor or defaults.

See [ButtonOptions](#buttonoptions) for available options.

## Features

- **Draggable**: Button can be repositioned anywhere on the page
- **Persistent Position**: Position is saved in localStorage and restored on page reload
- **Viewport Constraints**: Automatically constrained to viewport bounds
- **Responsive**: Adjusts position on window resize
- **Customizable**: Text and styling can be customized

## Examples

### Basic Usage

```javascript
const logger = InteractiveLogger();
logger.injectButton();
```

### With Custom Options

```javascript
const logger = InteractiveLogger();

logger.injectButton({
  text: "Download Logs",
  style: {
    background: "#007bff",
    color: "#fff",
    borderRadius: "12px"
  }
});
```

### Minimal Customization

```javascript
logger.injectButton({
  text: "📥 Export"
});
```

### Custom Styling Only

```javascript
logger.injectButton({
  style: {
    background: "#ff6b6b",
    color: "#fff",
    borderRadius: "50%",
    width: "60px",
    height: "60px"
  }
});
```

### Gradient Button

```javascript
logger.injectButton({
  text: "Export Logs",
  style: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#fff",
    borderRadius: "20px",
    padding: "10px 20px",
    fontSize: "16px",
    fontWeight: "bold"
  }
});
```

## ButtonOptions

### `text?: string`

Button text to display.

- **Default**: `"Interactive Logger"` (or value from constructor)

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
- `boxShadow?: string` - Box shadow (e.g., "0 2px 4px rgba(0,0,0,0.2)")

Custom styles are merged with default styles, so you only need to specify the properties you want to change.

## Notes

- The button maintains its draggable functionality regardless of customization
- Position is stored in localStorage with the key `__illogger_button_position`
- Only one button can be injected at a time
- To remove the button, use [withdrawButton](./withdraw-button)
- The button works on both desktop and mobile devices

## See Also

- [withdrawButton](./withdraw-button) - Remove the download button
- [InteractiveLogger](./interactive-logger#buttonoptions) - Configure button in constructor
- [Examples](../examples#download-button) - More examples
