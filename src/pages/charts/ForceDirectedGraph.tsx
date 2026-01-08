import type { Component } from "solid-js";
import { For, createEffect, onMount, onCleanup, createSignal } from "solid-js";
import { Group } from "@ensolid/visx";
import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceCenter,
  forceCollide,
} from "d3-force";
import { scaleOrdinal } from "d3-scale";

// Simple graph data
const initialNodes = [
  { id: "Java", group: 1 },
  { id: "JavaScript", group: 1 },
  { id: "TypeScript", group: 1 },
  { id: "SolidJS", group: 2 },
  { id: "React", group: 2 },
  { id: "Vue", group: 2 },
  { id: "Svelte", group: 2 },
  { id: "HTML", group: 3 },
  { id: "CSS", group: 3 },
  { id: "Node.js", group: 4 },
  { id: "Deno", group: 4 },
  { id: "Go", group: 5 },
  { id: "Rust", group: 5 },
  { id: "Python", group: 6 },
];

const initialLinks = [
  { source: "JavaScript", target: "Java" }, // Just a joke link or history
  { source: "TypeScript", target: "JavaScript" },
  { source: "SolidJS", target: "JavaScript" },
  { source: "React", target: "JavaScript" },
  { source: "Vue", target: "JavaScript" },
  { source: "Svelte", target: "JavaScript" },
  { source: "SolidJS", target: "React" }, // Influence
  { source: "HTML", target: "CSS" },
  { source: "JavaScript", target: "HTML" },
  { source: "JavaScript", target: "CSS" },
  { source: "Node.js", target: "JavaScript" },
  { source: "Deno", target: "JavaScript" },
  { source: "Deno", target: "Node.js" },
  { source: "Rust", target: "Go" }, // Systems
  { source: "Python", target: "Go" }, // Scripting vs Compile
];

const colors = [
  "#ef4444",
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
];

export const ForceDirectedGraph: Component = () => {
  const width = 600;
  const height = 500;

  // Use signals for reactive updates from d3-force
  const [nodes, setNodes] = createSignal([...initialNodes.map(n => ({...n, x: width/2, y: height/2}))]);
  const [links, setLinks] = createSignal([...initialLinks.map(l => ({...l}))]);

  const colorScale = scaleOrdinal<number, string>(colors);

  // We use onMount to modify the d3 simulation which itself modifies the objects in place.
  // We need to update the signals to trigger reactivity, but we must be careful not to create a loop
  // where updating signals restarts the simulation logic.
  onMount(() => {
    // Untrack initial reads so we don't depend on them
    const currentNodes = nodes(); // We want to mutate these objects directly for d3
    const currentLinks = links();

    const simulation = forceSimulation(currentNodes)
      .force(
        "link",
        forceLink(currentLinks)
          .id((d: any) => d.id)
          .distance(80)
      )
      .force("charge", forceManyBody().strength(-200))
      .force("center", forceCenter(width / 2, height / 2))
      .force("collide", forceCollide(30));

    simulation.on("tick", () => {
       // D3 updates x/y properties on the node objects in place.
       // We just need to notify Solid that the array contents have changed.
       // Creating a new array reference via [...] is enough for For to re-evaluate,
       // but since item reference is same, it might be efficient.
       setNodes([...currentNodes]);
       setLinks([...currentLinks]);
    });

    onCleanup(() => {
      simulation.stop();
    });
  });

  // Drag handling could be added here, but complex in Solid+D3 combo without a wrapper.
  // We keep it auto-layout for now.

  return (
    <div class="group relative">
      <div class="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div class="relative bg-card border-2 border-muted rounded-2xl p-6 shadow-xl overflow-hidden transition-all duration-300 hover:border-blue-500/30">
        <div class="flex items-center gap-3 mb-6">
          <div class="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20">
            <span class="text-2xl">⚡</span>
          </div>
          <div>
            <h2 class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              力导向图
            </h2>
            <p class="text-xs text-muted-foreground">
              Force Directed Graph - 动态网络结构
            </p>
          </div>
        </div>
        <div class="flex justify-center overflow-x-auto w-full">
          <svg
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            class="max-w-full h-auto cursor-grab active:cursor-grabbing"
          >
            <Group>
              {/* Links */}
              <For each={links()}>
                {(link: any) => (
                  <line
                    x1={link.source.x}
                    y1={link.source.y}
                    x2={link.target.x}
                    y2={link.target.y}
                    stroke="#94a3b8"
                    stroke-width={1.5}
                    stroke-opacity={0.6}
                  />
                )}
              </For>

              {/* Nodes */}
              <For each={nodes()}>
                {(node: any) => (
                  <g transform={`translate(${node.x},${node.y})`}>
                    <circle
                      r={20} // Just background for glow
                      fill={colorScale(node.group)}
                      class="opacity-20 animate-pulse"
                    />
                    <circle
                      r={8}
                      fill={colorScale(node.group)}
                      stroke="#fff"
                      stroke-width={2}
                      class="transition-all duration-300 hover:scale-125"
                    />
                    <text
                      dy={20}
                      text-anchor="middle"
                      font-size="10px"
                      class="fill-foreground font-medium select-none pointer-events-none"
                    >
                      {node.id}
                    </text>
                  </g>
                )}
              </For>
            </Group>
          </svg>
        </div>
      </div>
    </div>
  );
};
