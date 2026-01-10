# @ensolid/fiber

A SolidJS port of [@react-three/fiber](https://github.com/pmndrs/react-three-fiber).

Ensolid Fiber is a Three.js renderer for SolidJS. It allows you to build 3D scenes declaratively using SolidJS components, with full access to the Three.js ecosystem.

## Installation

```bash
pnpm add @ensolid/fiber three
```

## Features

- ✅ **Declarative**: Build 3D scenes using SolidJS components.
- ✅ **Reactive**: Automatically updates when your SolidJS state changes.
- ✅ **Full Access**: Provides access to all Three.js objects and features.
- ✅ **Performance**: Optimized for SolidJS fine-grained reactivity.

## Usage Example

```tsx
import { Canvas } from "@ensolid/fiber";

function App() {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="orange" />
      </mesh>
    </Canvas>
  );
}
```

## License

MIT
