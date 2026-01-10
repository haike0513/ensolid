# @ensolid/remend

Self-healing markdown parser. Intelligently parses and styles incomplete Markdown blocks to prevent broken UI during streaming.

## Installation

```bash
pnpm add @ensolid/remend
```

## Features

- ✅ **Self-healing**: Automatically closes unclosed tags and blocks.
- ✅ **Streaming-focused**: Designed specifically for LLM streaming outputs.
- ✅ **Lightweight**: Minimal dependencies.

## Usage

This package is primarily used internally by `@ensolid/streamdown`, but can be used standalone.

```tsx
import { remend } from "@ensolid/remend";

const incompleteMarkdown = "```javascript\nconsole.log('hello";
const healed = remend(incompleteMarkdown);
// Output will close the code block
```

## License

Apache-2.0
