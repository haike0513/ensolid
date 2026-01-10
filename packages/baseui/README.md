# @ensolid/baseui

A SolidJS port of [BaseUI](https://baseui.org/), providing enterprise-grade UI components.

## Installation

```bash
pnpm add @ensolid/baseui
```

## Features

- ✅ **Enterprise-ready**: Comprehensive set of components for complex applications.
- ✅ **Themeable**: Powerful theme system support.
- ✅ **TypeScript**: Full type safety for all components and props.
- ✅ **Performance**: Optimized for SolidJS fine-grained reactivity.

## Component Categories

- **Base Components**: Box, Paper, Container, Stack, Grid, Typography, Divider
- **Form Components**: Button, Input, Textarea, Checkbox, Radio, Switch, Select, Slider, NumberInput
- **Layout Components**: Tabs, Accordion, Collapsible, Drawer, Modal, Dialog
- **Data Display**: Table, TablePagination, List, Card, Avatar, Badge, Chip, Skeleton
- **Feedback Components**: Alert, AlertDialog, Snackbar, Progress, Rating
- **Navigation Components**: Breadcrumbs, Menu, Pagination, Stepper
- **Other Components**: Tooltip, Popover, Popper, Portal, FocusTrap, ClickAwayListener

## Usage Example

```tsx
import { Button, Stack } from "@ensolid/baseui";

function App() {
  return (
    <Stack spacing={2} direction="row">
      <Button variant="contained">Primary</Button>
      <Button variant="outlined">Secondary</Button>
    </Stack>
  );
}
```

## License

MIT
