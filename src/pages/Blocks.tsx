/**
 * Blocks 页面
 */

import type { Component } from "solid-js";

import { FiberScene } from "../examples/fiber/Scene.fiber";
import { Canvas } from "@ensolid/fiber";

export const BlocksPage: Component = () => {
  return (
    <div class="container mx-auto px-4 py-12">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-4xl font-bold tracking-tight mb-4">Blocks</h1>
        <p class="text-lg text-muted-foreground mb-8">
          Blocks 页面正在建设中...
        </p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div class="p-6 flex flex-col items-center justify-center space-y-4">
              <h3 class="text-lg font-semibold">Fiber Scene</h3>
              <div class="h-[300px] w-full rounded-md border bg-black/5 overflow-hidden">
                <Canvas>
                   <FiberScene />
                </Canvas>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

