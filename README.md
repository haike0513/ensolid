# Ensolid

> A project for enriching the SolidJS ecosystem with UI and utility libraries.

**[中文](README.zh-CN.md) | [English](#)**

## 📖 Project Overview

Ensolid is dedicated to porting excellent libraries and UI components from the React ecosystem to SolidJS, enriching the SolidJS ecosystem and providing developers with more available tools and components. This project uses a Monorepo architecture, containing multiple independent component library packages, each of which can be used and published independently.

## 🎯 Project Goals

The main goals of this project are:
- Port mature libraries and UI components from the React ecosystem to SolidJS
- Provide more tool and component choices for SolidJS developers
- Accelerate the porting process with AI assistance
- Establish component library standards for the SolidJS ecosystem
- Provide complete TypeScript type support and SSR compatibility

## ⚠️ Important Notice

**This project uses AI to complete porting work, and the following situations may exist:**
- Code may not be perfect and may have potential issues
- Features may not be fully tested
- APIs may differ from the original library
- Performance optimizations may be insufficient

**Please use with caution and recommend thorough testing before using in production environments.**

## 🛠️ Tech Stack

- [SolidJS](https://www.solidjs.com/) - Reactive UI framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Vite](https://vite.dev/) - Build tool
- [pnpm](https://pnpm.io/) - Package manager

## 📦 Installation

This project uses [pnpm](https://pnpm.io/) as the package manager.

First, make sure pnpm is installed:

```bash
npm install -g pnpm
```

Then install project dependencies:

```bash
pnpm install
```

## 🚀 Development

### Development Mode

Start the development server:

```bash
pnpm dev
```

The development server will start at [http://localhost:5173](http://localhost:5173).

### Build

Build for production:

```bash
pnpm build
```

The build output will be in the `dist` directory, optimized and minified for production.

### Preview

Preview the production build:

```bash
pnpm preview
```

## 📁 Project Structure

```
ensolid/
├── packages/                    # Monorepo packages directory
│   ├── cli/                    # shadcn-like CLI tool
│   ├── radix/                  # Radix UI Primitives port
│   ├── baseui/                 # BaseUI component library
│   ├── solidflow/              # SolidFlow (React Flow port)
│   ├── aisolid/                # AI SDK for SolidJS
│   ├── fiber/                  # Three.js for SolidJS (R3F port)
│   ├── streamdown/             # AI-powered streaming Markdown
│   ├── visx/                   # Airbnb Visx port
│   ├── remend/                 # Markdown utility
│   └── utils/                  # Common utilities
├── components/
│   └── ui/                     # shadcn/ui style components (managed by CLI)
├── src/                        # Example application & playground
├── docs/                       # Project documentation
└── package.json                # Root configuration
```

## 📦 Component Libraries & Packages

### 1. @ensolid/cli 🚀

A command-line tool to initialize projects and add components, similar to shadcn/ui CLI.

**Quick Start:**
```bash
npx @ensolid/cli@latest init
npx @ensolid/cli@latest add button
```

### 2. @ensolid/radix

A SolidJS port of [Radix UI Primitives](https://www.radix-ui.com/primitives), providing unstyled, accessible base components.

**Features:**
- ✅ Complete accessibility support (ARIA attributes)
- ✅ Unstyled design, fully customizable
- ✅ Support for controlled and uncontrolled modes
- ✅ Complete TypeScript type definitions
- ✅ SSR compatible

#### Ported Components (25)

- **Base**: Separator, Label, AspectRatio, VisuallyHidden
- **Form**: Checkbox, Switch, RadioGroup, Select, Slider, Toggle, ToggleGroup
- **Layout**: Tabs, Accordion, Collapsible, ScrollArea
- **Overlay**: Dialog, AlertDialog, Popover, DropdownMenu, Tooltip, HoverCard, ContextMenu, Menubar
- **Other**: Progress, Avatar

### 3. @ensolid/baseui

A SolidJS port of [BaseUI](https://baseui.org/), providing enterprise-grade UI component library.

**Features:**
- ✅ Rich component collection (59+ components)
- ✅ Material Design style
- ✅ Complete theme system support
- ✅ Enterprise components (tables, pagination, steppers, etc.)

### 4. @ensolid/solidflow

A SolidJS port of [React Flow](https://reactflow.dev/), providing flowchart and node editor functionality.

### 5. @ensolid/aisolid

AI SDK for SolidJS, ported from [Vercel AI SDK](https://github.com/vercel/ai). Supports `useChat`, `useCompletion`, and `useAssistant`.

### 6. @ensolid/fiber

A SolidJS port of [@react-three/fiber](https://github.com/pmndrs/react-three-fiber) for Three.js rendering.

### 7. Other Packages
- **@ensolid/streamdown**: AI-powered streaming Markdown renderer.
- **@ensolid/visx**: SolidJS port of Airbnb's [visx](https://github.com/airbnb/visx) visualization library.
- **@ensolid/utils**: Common utility functions used across the ecosystem.

---

## 🚀 Getting Started

### Using the CLI (Recommended)

To use Ensolid components in your own project:

1. **Initialize Ensolid:**
   ```bash
   npx @ensolid/cli@latest init
   ```

2. **Add Components:**
   ```bash
   npx @ensolid/cli@latest add button
   ```

### Quick Dev Setup (For Contributors)

1. **Clone & Install:**
   ```bash
   git clone https://github.com/haike0513/ensolid.git
   pnpm install
   ```

2. **Run Playground:**
   ```bash
   pnpm dev
   ```

## 📦 Usage Examples

### Using the CLI to add components

The CLI allows you to add components to your `src/components/ui` directory:

```bash
npx @ensolid/cli add dialog
```

Then use it in your code:

```tsx
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

function App() {
  return (
    <Dialog>
      <DialogTrigger>Open</DialogTrigger>
      <DialogContent>Hello Ensolid!</DialogContent>
    </Dialog>
  );
}
```

### Direct Package Usage

```tsx
import { Checkbox } from "@ensolid/radix";

function App() {
  return <Checkbox />;
}
```

### ⚠️ Important Notes on the `asChild` Property

1. **Only Radix base component Triggers support `asChild`**
   - `asChild` is used to pass component functionality to child elements.
   - Only Radix base component Trigger subcomponents (such as `Dialog.Trigger`, `Popover.Trigger`, etc.) support this property.
   - Regular UI components (such as `Button`, `Card`, etc.) **do not support** the `asChild` property.

2. **Correct usage**:
   ```tsx
   // ✅ Correct
   <Dialog.Trigger asChild>
     <Button>Open Dialog</Button>
   </Dialog.Trigger>
   ```

---

## 🔄 Porting Workflow

This project uses a standardized porting process. For details, see [agents.md](./agents.md).

## 🤝 Contributing

Issues and Pull Requests are welcome!

## 📄 License

MIT
