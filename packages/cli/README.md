# @ensolid/cli

A CLI for adding beautiful, accessible SolidJS components to your projects. Inspired by [shadcn/ui](https://ui.shadcn.com/).

## Features

- 🚀 **Easy Setup** - Initialize your project with a single command
- 📦 **Component Installation** - Add individual components on demand
- 🔄 **Dependency Resolution** - Automatically handles component dependencies
- 📝 **TypeScript Support** - Full TypeScript support with type definitions
- 🎨 **Customizable** - Components are copied to your project for full customization
- 🔍 **Diff Tracking** - Check for updates against the registry

## Quick Start

### Initialize Your Project

```bash
npx @ensolid/cli init
```

This will:
- Detect your project configuration
- Create an `ensolid.json` config file
- Set up CSS variables for theming
- Install required dependencies (`clsx`, `tailwind-merge`)
- Create the `cn` utility function

### Add Components

Add individual components:

```bash
npx @ensolid/cli add button
```

Add multiple components at once:

```bash
npx @ensolid/cli add button card dialog
```

Add all available components:

```bash
npx @ensolid/cli add --all
```

### List Available Components

```bash
npx @ensolid/cli list
```

Show only installed components:

```bash
npx @ensolid/cli list --installed
```

### Check for Updates

```bash
npx @ensolid/cli diff
```

Check a specific component:

```bash
npx @ensolid/cli diff button
```

## Commands

### `init`

Initialize a new project or update configuration.

```bash
npx @ensolid/cli init [options]
```

Options:
- `-y, --yes` - Skip confirmation prompts
- `-d, --defaults` - Use default configuration
- `-f, --force` - Force overwrite existing configuration
- `-c, --cwd <cwd>` - Working directory (defaults to current)

### `add`

Add components to your project.

```bash
npx @ensolid/cli add [components...] [options]
```

Options:
- `-y, --yes` - Skip confirmation prompts
- `-o, --overwrite` - Overwrite existing files
- `-a, --all` - Add all available components
- `-p, --path <path>` - Custom path to add components
- `-c, --cwd <cwd>` - Working directory (defaults to current)

### `list`

List available components.

```bash
npx @ensolid/cli list [options]
```

Options:
- `-i, --installed` - Show only installed components
- `-a, --available` - Show only available (not installed) components
- `-c, --cwd <cwd>` - Working directory (defaults to current)

### `diff`

Check for updates against the registry.

```bash
npx @ensolid/cli diff [component] [options]
```

Options:
- `-c, --cwd <cwd>` - Working directory (defaults to current)

## Configuration

The CLI stores configuration in `ensolid.json`:

```json
{
  "$schema": "https://ensolid.dev/schema.json",
  "style": "default",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "src/index.css",
    "baseColor": "slate",
    "cssVariables": true
  },
  "registry": "https://raw.githubusercontent.com/haike0513/ensolid/main/public/registry",
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
```

### Configuration Options

| Option | Description |
|--------|-------------|
| `style` | The style preset to use |
| `rsc` | Enable React Server Components (unused in SolidJS) |
| `tsx` | Whether to use TypeScript |
| `tailwind.config` | Path to Tailwind config file |
| `tailwind.css` | Path to global CSS file |
| `tailwind.baseColor` | Base color theme |
| `tailwind.cssVariables` | Use CSS variables for theming |
| `registry` | URL to the component registry |
| `aliases.components` | Import alias for components |
| `aliases.utils` | Import alias for utils |
| `aliases.ui` | Import alias for UI components |
| `aliases.lib` | Import alias for lib |
| `aliases.hooks` | Import alias for hooks |

## Custom Registry

You can host your own component registry. The registry should have the following structure:

```
registry/
├── index.json          # List of all components
├── components/
│   ├── button.json     # Component metadata
│   ├── card.json
│   └── ...
├── button.tsx          # Component source files
├── card.tsx
└── ...
```

### Registry Index (`index.json`)

```json
[
  {
    "name": "button",
    "type": "components:ui",
    "files": ["button.tsx"],
    "dependencies": [],
    "registryDependencies": []
  }
]
```

### Component Metadata (`components/button.json`)

```json
{
  "name": "button",
  "type": "components:ui",
  "dependencies": ["@kobalte/core"],
  "registryDependencies": [],
  "files": ["button.tsx"]
}
```

## Development

```bash
# Install dependencies
pnpm install

# Build
pnpm build

# Development with watch mode
pnpm dev

# Test locally
node dist/index.js init
```

## License

MIT
