# @ensolid/cli

A shadcn-like CLI for Ensolid components.

## Installation

```bash
pnpm add -D @ensolid/cli
```

## Usage

### Initialize

Initialize your project and create an `ensolid.json` configuration file.

```bash
npx ensolid init
```

### Add Components

Add components to your project.

```bash
npx ensolid add button
```

Or run without arguments to see a list of available components:

```bash
npx ensolid add
```

## Configuration

The CLI uses an `ensolid.json` file to manage where components are installed.

```json
{
  "$schema": "https://ensolid.com/schema.json",
  "style": "default",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "src/index.css",
    "baseColor": "slate",
    "cssVariables": true
  },
  "aliases": {
    "components": "src/components",
    "utils": "src/lib/utils.ts",
    "ui": "src/components/ui"
  }
}
```
