# Mermaid to Image Conversion Scripts

This folder contains scripts to convert Mermaid diagrams to PNG images for use in the documentation.

## Available Scripts

### 1. `convert-mermaid.js` (Full Automation)
- **Requires**: Puppeteer (Chrome/Chromium)
- **Output**: Direct PNG files
- **Pros**: Fully automated, high quality
- **Cons**: Larger dependency, requires Chrome

### 2. `convert-mermaid-simple.js` (Manual Conversion)
- **Requires**: Only Node.js built-ins
- **Output**: HTML files you open in browser
- **Pros**: Lightweight, no external dependencies
- **Cons**: Manual step to save as PNG

## Quick Start

### Option 1: Full Automation (Recommended)

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the conversion**:
   ```bash
   npm run convert-diagrams
   ```

3. **Check results**:
   - PNG files will be created in `public/diagrams/`
   - Restart your dev server
   - Diagrams should now display properly

### Option 2: Simple Manual Conversion

1. **Run the simple conversion**:
   ```bash
   npm run convert-diagrams-simple
   ```

2. **Convert HTML to PNG**:
   - Open each `.html` file in your browser
   - Right-click on the diagram
   - Select "Save image as..."
   - Save as PNG in `public/diagrams/`

## What Gets Created

The scripts will create these diagrams:

1. **`system-architecture.png`** - System overview with all layers
2. **`data-flow.png`** - Data flow sequence diagram
3. **`tool-execution.png`** - Tool execution flow

## Customizing Diagrams

To modify the diagrams, edit the `diagrams` object in either script:

```javascript
const diagrams = {
  'your-diagram-name': {
    title: 'Your Diagram Title',
    code: `graph TB
      A[Start] --> B[Process]
      B --> C[End]`
  }
};
```

## Troubleshooting

### Puppeteer Issues
If the full automation fails:
- Ensure Chrome/Chromium is installed
- Try running with `--no-sandbox` flag
- Use the simple script instead

### Image Quality
- PNG files are created with transparent backgrounds
- Resolution is set to 1000x800 for consistency
- Adjust viewport in script if needed

## File Structure

```
scripts/
├── convert-mermaid.js          # Full automation script
├── convert-mermaid-simple.js   # Simple HTML generator
└── README.md                   # This file

public/diagrams/
├── system-architecture.png     # Generated image
├── data-flow.png              # Generated image
├── tool-execution.png         # Generated image
└── README.md                  # Image documentation
```

## Next Steps

After running the scripts:

1. **Verify images**: Check that PNG files exist in `public/diagrams/`
2. **Restart server**: Stop and restart your Next.js dev server
3. **Test pages**: Visit `/test-diagrams` and `/architecture-diagrams`
4. **Customize**: Edit the Mermaid code in scripts and regenerate

## Benefits

- ✅ **No hydration errors** - Pure static images
- ✅ **Fast loading** - No dynamic rendering
- ✅ **Easy editing** - Modify Mermaid code in scripts
- ✅ **Consistent quality** - Same rendering every time
- ✅ **Version control** - Track diagram changes in scripts
