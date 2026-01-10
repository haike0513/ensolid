# @ensolid/utils

Common utility functions for the Ensolid ecosystem.

## Installation

```bash
pnpm add @ensolid/utils
```

## Features

- ✅ **cn**: A utility for conditionally merging Tailwind CSS classes (wraps `clsx` and `tailwind-merge`).
- ✅ **Type Guards**: Common type checking utilities.

## Usage

```tsx
import { cn } from "@ensolid/utils";

function MyComponent(props) {
  return (
    <div class={cn("bg-red-500", props.class)}>
      Hello
    </div>
  );
}
```

## License

MIT
