# @ensolid/radix

A SolidJS port of [Radix UI Primitives](https://www.radix-ui.com/primitives).

Ensolid Radix is a library of unstyled, accessible UI primitives for SolidJS. It provides low-level components that handle the complex logic, accessibility, and state management of common UI patterns, allowing you to focus on your design and styles.

## Installation

```bash
pnpm add @ensolid/radix
```

## Features

- ✅ **Accessibility**: Built-in support for ARIA attributes and keyboard interaction.
- ✅ **Unstyled**: Completely unstyled, giving you full control over the appearance.
- ✅ **Reactive**: Built with SolidJS's fine-grained reactivity.
- ✅ **SSR Support**: Fully compatible with server-side rendering.
- ✅ **Tree Shakeable**: Import only what you need to keep your bundle size small.

## Components

The following components are currently available:

- **Separator**
- **Label**
- **AspectRatio**
- **VisuallyHidden**
- **Checkbox**
- **Switch**
- **RadioGroup**
- **Select**
- **Slider**
- **Toggle**
- **ToggleGroup**
- **Tabs**
- **Accordion**
- **Collapsible**
- **ScrollArea**
- **Dialog**
- **AlertDialog**
- **Popover**
- **DropdownMenu**
- **Tooltip**
- **HoverCard**
- **ContextMenu**
- **Menubar**
- **Progress**
- **Avatar**

## Usage Example

```tsx
import { Dialog } from "@ensolid/radix";

function App() {
  return (
    <Dialog>
      <Dialog.Trigger>Open Dialog</Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Title>Title</Dialog.Title>
        <Dialog.Description>Description</Dialog.Description>
         <Dialog.Close>Close</Dialog.Close>
      </Dialog.Content>
    </Dialog>
  );
}
```

### The `asChild` Property

Radix UI components use the `asChild` property to allow you to pass functionality to your own components.

```tsx
<Dialog.Trigger asChild>
  <button class="your-custom-class">Open</button>
</Dialog.Trigger>
```

**Note**: Only Radix component `Trigger` subcomponents support `asChild`.

## License

MIT
