# @ensolid/visx

A SolidJS port of [Airbnb's visx](https://github.com/airbnb/visx) visualization library.

Ensolid Visx is a collection of reusable, low-level visualization primitives for SolidJS. It combines the power of D3 for calculations with the declarative nature of SolidJS for rendering.

## Installation

```bash
pnpm add @ensolid/visx
```

## Features

- ✅ **Modular**: Only import the primitives you need.
- ✅ **Performant**: Leverages SolidJS fine-grained reactivity for efficient updates.
- ✅ **Flexible**: Works with any styling solution.
- ✅ **Type-safe**: Built with TypeScript for excellent developer experience.

## Component Categories

- **Axis**: Bottom, Left, Top, Right
- **Shape**: Bar, LinePath, Area, Arc, Pie, Circle, Line
- **Grid**: Rows, Columns
- **Gradient**: Linear, Radial
- **Tooltip**: Integration with SolidJS signals.
- **And more...**

## Usage Example

```tsx
import { Bar } from "@ensolid/visx/Bar";
import { Group } from "@ensolid/visx/Group";

function MyChart() {
  return (
    <svg width={500} height={300}>
      <Group top={20} left={20}>
        <Bar
          width={40}
          height={100}
          fill="teal"
          x={10}
          y={50}
        />
      </Group>
    </svg>
  );
}
```

## License

MIT
