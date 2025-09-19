# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Figma plugin called "MB Tools" that provides utilities for design system management. The plugin contains two main modules:

1. **Style to Variable Converter** (`style`) - Converts legacy color styles to design tokens/variables
2. **Icon Rename Tool** (`icons`) - Renames components to PascalCase with Lucide icon validation

## Architecture

The plugin follows a modular architecture:

- **Entry Point**: `src/main.ts` - Initializes all modules and handles UI message routing
- **Core Types**: `src/core/types.ts` - Defines the module system interfaces (`Module`, `UIMsg`, `Handler`)
- **Module System**: `src/modules/index.ts` - Exports all available modules and creates a module map
- **Individual Modules**: Each module in `src/modules/*/` implements the `Module` interface with:
  - `id`: Unique identifier matching `ModuleId` type
  - `name`: Display name
  - `init()`: Optional initialization (e.g., event listeners)
  - `handlers`: Object mapping message types to handler functions

## Development Commands

```bash
# Build the plugin for production
npm run build

# Build and watch for changes during development
npm run watch

# Clean build artifacts
npm run clean
```

## Build Process

The build system (`build.js`) uses esbuild to:

- Bundle `src/main.ts` into `dist/code.js` (Figma plugin code)
- Copy and process `src/ui/index.html` to `dist/ui.html` (plugin UI)
- Inline the MB logo SVG as base64 data URI in the UI
- Target ES2017 for Figma plugin compatibility
- Minify output for production

## Plugin Structure

- **Manifest**: `manifest.json` defines plugin metadata for Figma
- **TypeScript Config**: Targets ES2019 with strict mode enabled
- **UI**: Single HTML file with embedded CSS and JavaScript
- **Assets**: Logo files processed during build (prefers `../mb-logo.svg`, falls back to `assets/mb-logo.svg`)

## Adding New Modules

1. Create a new directory under `src/modules/your-module/`
2. Implement a `main.ts` that exports a `Module` object
3. Add the module ID to the `ModuleId` union type in `src/core/types.ts`
4. Import and add the module to the `modules` array in `src/modules/index.ts`
5. Add corresponding UI elements and handlers in `src/ui/index.html`

## Module Communication

UI ↔ Plugin communication uses `postMessage` with typed messages:
- UI sends: `{ module: ModuleId, type: string, payload?: any }`
- Plugin responds via `figma.ui.postMessage()`
- Message routing handled automatically in `main.ts`

## External Dependencies

The icon rename module depends on a Lucide names JSON file at `../../../../mbIconRename/lucide-names.json` for validation.