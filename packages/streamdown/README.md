# @ensolid/streamdown

A SolidJS drop-in replacement for `react-markdown`, designed for AI-powered streaming.

Ensolid Streamdown renders Markdown content as it streams in, ensuring a smooth and jitter-free experience. It is built on top of `@ensolid/remend` to handle incomplete Markdown blocks intelligently.

## Installation

```bash
pnpm add @ensolid/streamdown
```

## Features

- ✅ **Streaming Ready**: Handles incomplete markdown gracefully.
- ✅ **Optimized**: Reduces layout shifts during streaming.
- ✅ **Customizable**: extensive support for custom components.
- ✅ **Plugins**: Supports remark and rehype plugins.

## Usage

```tsx
import { Streamdown } from "@ensolid/streamdown";

function App() {
  const markdown = "Hello **world**! This is being streamed...";

  return (
    <Streamdown>
      {markdown}
    </Streamdown>
  );
}
```

## License

Apache-2.0
