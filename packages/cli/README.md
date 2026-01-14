# @ensolid/cli 🚀

A command-line interface for managing Ensolid components in your SolidJS projects. Inspired by the shadcn/ui CLI.

## Installation

You can run the CLI directly using `npx`:

```bash
npx @ensolid/cli@latest init
```

Or install it as a dev dependency:

```bash
pnpm add -D @ensolid/cli
```

## Commands

### `init`

Initialize your project and create an `ensolid.json` configuration file. This will also help you set up path aliases and target directories.

```bash
npx ensolid init
```

### `add`

Add components to your project. This will download the component files from the Ensolid registry and place them in your configured UI directory.

```bash
# Add specific components
npx ensolid add button dialog

# Run without arguments to see a list of available components
npx ensolid add
```

## Configuration

The CLI uses an `ensolid.json` file in your project root to manage settings:

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
  "registry": "https://github.com/haike0513/ensolid/tree/main/src/components/ui",
  "aliases": {
    "components": "src/components",
    "utils": "src/lib/utils.ts",
    "ui": "src/components/ui"
  }
}
```

### Custom Registries

You can point the CLI to any compatible registry by changing the `registry` field in `ensolid.json`. This allows you to use `ensolid` CLI with your own custom component collection.

## Features

- ✅ **Project Setup**: Seamlessly integrates with your existing SolidJS & Tailwind CSS project.
- ✅ **On-demand Components**: Only add the components you need to keep your codebase clean.
- ✅ **Path Aliases**: Intelligent handling of path aliases for imports.
- ✅ **Registry Integration**: Fetches the latest component versions directly from the official repository.

## License

MIT
