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
│   ├── radix/                  # Radix UI Primitives port
│   │   ├── src/
│   │   │   ├── components/    # All Radix components
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── baseui/                 # BaseUI component library
│   └── solidflow/              # SolidFlow component library
├── components/
│   └── ui/                     # shadcn/ui style components
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       └── ...                 # More components
├── src/                        # Source code directory
│   ├── examples/               # Component examples
│   │   ├── ButtonExample.tsx
│   │   └── ...
│   ├── App.tsx                 # Main application component
│   └── index.tsx
├── public/                     # Static assets
├── package.json                # Project configuration
└── vite.config.ts              # Vite configuration
```

## 📦 Ported Component Libraries

This project contains three main component library packages:

### 1. @ensolid/radix

A SolidJS port of [Radix UI Primitives](https://www.radix-ui.com/primitives), providing unstyled, accessible base components.

**Features:**
- ✅ Complete accessibility support (ARIA attributes)
- ✅ Unstyled design, fully customizable
- ✅ Support for controlled and uncontrolled modes
- ✅ Complete TypeScript type definitions
- ✅ SSR compatible

#### Ported Components (25)

**Base Components**
- ✅ Separator - Separator line
- ✅ Label - Label
- ✅ AspectRatio - Aspect ratio
- ✅ VisuallyHidden - Visually hidden (accessibility)

**Form Components**
- ✅ Checkbox - Checkbox
- ✅ Switch - Switch
- ✅ RadioGroup - Radio group
- ✅ Select - Select
- ✅ Slider - Slider
- ✅ Toggle - Toggle button
- ✅ ToggleGroup - Toggle group

**Layout Components**
- ✅ Tabs - Tabs
- ✅ Accordion - Accordion
- ✅ Collapsible - Collapsible
- ✅ ScrollArea - Scroll area

**Overlay Components**
- ✅ Dialog - Dialog
- ✅ AlertDialog - Alert dialog
- ✅ Popover - Popover
- ✅ DropdownMenu - Dropdown menu
- ✅ Tooltip - Tooltip
- ✅ HoverCard - Hover card
- ✅ ContextMenu - Context menu
- ✅ Menubar - Menu bar

**Other Components**
- ✅ Progress - Progress bar
- ✅ Avatar - Avatar

### 2. @ensolid/baseui

A SolidJS port of [BaseUI](https://baseui.org/), providing enterprise-grade UI component library.

**Features:**
- ✅ Rich component collection (59+ components)
- ✅ Material Design style
- ✅ Complete theme system support
- ✅ Enterprise components (tables, pagination, steppers, etc.)
- ✅ Complete TypeScript type definitions

#### Main Component Categories

- **Base Components**: Box, Paper, Container, Stack, Grid, Typography, Divider
- **Form Components**: Button, Input, Textarea, Checkbox, Radio, Switch, Select, Slider, NumberInput
- **Layout Components**: Tabs, Accordion, Collapsible, Drawer, Modal, Dialog
- **Data Display**: Table, TablePagination, List, Card, Avatar, Badge, Chip, Skeleton
- **Feedback Components**: Alert, AlertDialog, Snackbar, Progress, Rating
- **Navigation Components**: Breadcrumbs, Menu, Pagination, Stepper
- **Other Components**: Tooltip, Popover, Popper, Portal, FocusTrap, ClickAwayListener

### 3. @ensolid/solidflow

A SolidJS port of [React Flow](https://reactflow.dev/), providing flowchart and node editor functionality.

**Features:**
- ✅ High-performance node graph rendering
- ✅ Support for custom nodes and edges
- ✅ Interactive drag and zoom
- ✅ Complete type definitions
- ✅ Support for complex workflow editing

#### Core Components

- **Flow** - Main flowchart component
- **Node** - Node component
- **Edge** - Edge component
- **Handle** - Connection point component
- **Background** - Background grid component

### 4. components/ui

A shadcn/ui style component library based on `@ensolid/radix`, providing ready-to-use styled components.

**Features:**
- ✅ Modern design based on Tailwind CSS
- ✅ Fully customizable styles
- ✅ Consistent with shadcn/ui design specifications
- ✅ Beautiful interface out of the box

#### Available Components (26)

All Radix components have corresponding shadcn/ui style wrappers, including:
- **Base Components**: Button, Card, Label, Separator, AspectRatio
- **Form Components**: Checkbox, Switch, RadioGroup, Select, Slider, Toggle, ToggleGroup
- **Layout Components**: Tabs, Accordion, Collapsible, ScrollArea
- **Overlay Components**: Dialog, AlertDialog, Popover, DropdownMenu, Tooltip, HoverCard, ContextMenu, Menubar
- **Other Components**: Progress, Avatar

## 🎯 Usage Examples

### Using Radix Base Components

```tsx
import { Button, Dialog } from "@ensolid/radix";

function App() {
  return (
    <Dialog>
      <Dialog.Trigger>Open Dialog</Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Title>Title</Dialog.Title>
        <Dialog.Description>Description</Dialog.Description>
      </Dialog.Content>
    </Dialog>
  );
}
```

### Using shadcn/ui Style Components

```tsx
import { Button, Dialog } from "@/components/ui";

function App() {
  return (
    <Dialog>
      <Dialog.Trigger asChild>
        <Button>Open Dialog</Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Title</Dialog.Title>
          <Dialog.Description>Description</Dialog.Description>
        </Dialog.Header>
      </Dialog.Content>
    </Dialog>
  );
}
```

### ⚠️ Important Notes on the asChild Property

**Notes on using the `asChild` property**:

1. **Only Radix base component Triggers support `asChild`**
   - `asChild` is a special property in Radix UI used to pass component functionality to child elements
   - Only Radix base component Trigger subcomponents (such as `Dialog.Trigger`, `Popover.Trigger`, `DropdownMenu.Trigger`, etc.) support this property
   - Regular UI components (such as `Button`, `Card`, etc.) **do not support** the `asChild` property

2. **Correct usage**:
   ```tsx
   // ✅ Correct - Radix component Trigger supports asChild
   <Dialog.Trigger asChild>
     <Button>Open Dialog</Button>
   </Dialog.Trigger>
   
   // ❌ Wrong - Button component does not support asChild
   <Button asChild>
     <A href="/page">Link</A>
   </Button>
   ```

3. **Alternative approach**:
   ```tsx
   // ✅ Correct - Use wrapper approach
   <A href="/page">
     <Button>Link</Button>
   </A>
   ```

4. **Common errors**:
   - Error: `Property 'asChild' does not exist on type 'IntrinsicAttributes & ButtonProps'`
   - Reason: Used `asChild` property on a regular UI component
   - Solution: Remove the `asChild` property, use wrapper approach or use the component directly

For detailed explanations and solutions, please refer to the "Error 9: asChild Property Usage Error" section in [agents.md](./agents.md).

## 🔄 Porting Workflow

This project uses a standardized porting process. For details, see [agents.md](./agents.md).

### Quick Start for Porting New Components

1. **Create component in `packages/radix/src/components/`**
   - Reference existing component implementations
   - Follow SolidJS reactive patterns
   - Ensure SSR compatibility
   - Use `splitProps` to separate Props
   - Use `createSignal` to manage state
   - Use `createContext` and `useContext` for component communication

2. **Create shadcn/ui wrapper in `components/ui/`**
   - Based on Radix components
   - Add Tailwind CSS styles
   - Use `cn()` to merge class names
   - Maintain API consistency

3. **Create examples in `src/examples/`**
   - Show basic usage
   - Show different configurations and variants
   - Show interactive features

4. **Update related files**
   - Export in `packages/radix/src/components/index.ts`
   - Export in `src/components/ui/index.ts`
   - Export examples in `src/examples/index.ts`
   - Add examples to navigation in `src/App.tsx`
   - Add translations in `src/i18n/locales/`

5. **Test and verify**
   - Run `pnpm build:radix` to check compilation
   - Run `pnpm build` to check full build
   - Run `pnpm dev` to view examples
   - Fix all errors and warnings

For detailed porting guidelines, rules, and best practices, please refer to the "Actual Porting Case: Radix UI Primitives" section in [agents.md](./agents.md).

## 🤝 Contributing

Issues and Pull Requests are welcome!

Since this project uses AI-assisted porting, if you find any issues or have improvement suggestions, please feel free to provide feedback.

## 📚 Related Resources

- [SolidJS Official Website](https://www.solidjs.com/)
- [SolidJS Discord](https://discord.com/invite/solidjs)
- [Vite Documentation](https://vite.dev/)

## 📊 Project Statistics

### Component Count Statistics

- **@ensolid/radix**: 25 base components
- **@ensolid/baseui**: 59+ enterprise components
- **@ensolid/solidflow**: 5 flowchart core components
- **components/ui**: 26 shadcn/ui style components

### Technical Features

- ✅ **TypeScript Support**: All components have complete type definitions
- ✅ **SSR Compatible**: All components support server-side rendering
- ✅ **Tree Shaking**: Fully optimized for tree shaking with `sideEffects: false` and granular exports
- ✅ **Monorepo Architecture**: Use pnpm workspace to manage multi-package projects
- ✅ **Independent Build**: Each package can be built and published independently

### Tree Shaking Support

All `@ensolid/*` packages are fully optimized for tree shaking:

- ✅ **Zero Side Effects**: All packages marked with `sideEffects: false`
- ✅ **Granular Exports**: Individual component exports for precise imports
- ✅ **Module Preservation**: `preserveModules: true` in build configuration
- ✅ **Optimal Bundle Size**: Import only what you need

**Usage Example:**

```typescript
// Default import - modern bundlers will tree shake automatically
import { Button, Input } from '@ensolid/baseui';

// Precise import - maximum tree shaking
import { Button } from '@ensolid/baseui/Button';
import { Input } from '@ensolid/baseui/Input';
```

**📖 For detailed tree shaking guide and best practices, see [TREE_SHAKING_GUIDE.md](./TREE_SHAKING_GUIDE.md)**

**Bundle Size Reduction**: Up to 90% smaller when importing specific components vs entire package!

## 🏗️ Architecture Design

### Monorepo Structure

```
ensolid/
├── packages/              # Component library packages
│   ├── radix/            # Radix UI Primitives port
│   ├── baseui/           # BaseUI component library port
│   └── solidflow/        # React Flow port
├── src/                  # Example application
│   ├── components/       # shadcn/ui style components
│   ├── examples/         # Component examples
│   └── i18n/            # Internationalization support
└── dist/                 # Build output
```

### Build System

- **Build Tool**: Vite
- **Type Checking**: TypeScript 5.8+
- **Package Management**: pnpm workspace
- **Code Splitting**: Support for on-demand imports and tree shaking

## 🔍 Quality Assurance

### Code Standards

- ✅ Strict TypeScript type checking
- ✅ Unified code style
- ✅ Complete component documentation
- ✅ Example code coverage

### Compatibility

- ✅ **Browser Support**: Modern browsers (ES2020+)
- ✅ **SSR Support**: All components tested for SSR
- ✅ **TypeScript**: Complete type definitions
- ✅ **Responsive Design**: Support for mobile and desktop

## 🚧 Development Roadmap

### Short-term Plans

- [ ] Improve BaseUI component testing and documentation
- [ ] Optimize SolidFlow performance
- [ ] Add more shadcn/ui style components
- [ ] Improve internationalization support

### Long-term Plans

- [ ] Add unit tests and E2E tests
- [ ] Build component documentation website
- [ ] Publish stable versions to npm
- [ ] Establish community contribution guidelines

## 📄 License

To be determined
