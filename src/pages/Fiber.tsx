import type { Component } from 'solid-js';
import { Canvas } from '@ensolid/fiber';
import { FiberScene } from './fiber/Scene.fiber';

export const FiberPage: Component = () => {
  return (
    <div style={{ height: "100vh", width: "100%", background: "#111" }}>
      <Canvas>
        <FiberScene />
      </Canvas>
    </div>
  );
};
