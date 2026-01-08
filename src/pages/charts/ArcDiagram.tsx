import type { Component } from "solid-js";
import { For } from "solid-js";
import { Group } from "@ensolid/visx";
import { scalePoint } from "d3-scale";

// Node data on a line
const nodes = [
  { id: "The Godfather", group: 1 },
  { id: "Al Pacino", group: 2 },
  { id: "Marlon Brando", group: 2 },
  { id: "Robert Duvall", group: 2 },
  { id: "Francis Ford Coppola", group: 3 },
  { id: "Diane Keaton", group: 2 },
];

const links = [
  { source: "The Godfather", target: "Al Pacino" },
  { source: "The Godfather", target: "Marlon Brando" },
  { source: "The Godfather", target: "Robert Duvall" },
  { source: "The Godfather", target: "Francis Ford Coppola" },
  { source: "The Godfather", target: "Diane Keaton" },
  { source: "Al Pacino", target: "Marlon Brando" },
  { source: "Al Pacino", target: "Diane Keaton" },
];

export const ArcDiagram: Component = () => {
  const width = 600;
  const height = 400;
  const margin = { top: 150, right: 20, bottom: 40, left: 20 }; // Large top margin for arcs
  const innerWidth = width - margin.left - margin.right;
  
  const xScale = scalePoint()
    .domain(nodes.map(d => d.id))
    .range([0, innerWidth])
    .padding(0.5);

  const colors = ["#ef4444", "#3b82f6", "#10b981", "#f59e0b"];

  return (
    <div class="group relative">
      <div class="absolute -inset-1 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div class="relative bg-card border-2 border-muted rounded-2xl p-6 shadow-xl overflow-hidden transition-all duration-300 hover:border-red-500/30">
        <div class="flex items-center gap-3 mb-6">
          <div class="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-red-500/20 to-orange-500/20">
            <span class="text-2xl">🌈</span>
          </div>
          <div>
            <h2 class="text-2xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              弧线图
            </h2>
            <p class="text-xs text-muted-foreground">
              Arc Diagram - 线性关系展示
            </p>
          </div>
        </div>
        <div class="flex justify-center overflow-x-auto w-full">
          <svg
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            class="max-w-full h-auto"
          >
            <Group left={margin.left} top={margin.top}>
              {/* Links - Arcs */}
              <For each={links}>
                {(link) => {
                  const startX = xScale(link.source) as number;
                  const endX = xScale(link.target) as number;
                  return (
                    <path
                      d={`M${startX},0 A${(endX - startX) / 2},${(endX - startX) / 2} 0 0,1 ${endX},0`}
                      fill="none"
                      stroke="#94a3b8"
                      stroke-width={1.5}
                      stroke-opacity={0.6}
                      class="transition-all duration-300 hover:stroke-red-500 hover:stroke-opacity-100 hover:stroke-[2px]"
                    />
                  );
                }}
              </For>

              {/* Nodes */}
              <For each={nodes}>
                {(node) => (
                  <g transform={`translate(${xScale(node.id)}, 0)`}>
                    <circle
                      r={6}
                      fill={colors[node.group]}
                      class="stroke-background stroke-2"
                    />
                    <text
                      transform="rotate(45)"
                      x={10}
                      y={0}
                      dy="0.32em"
                      text-anchor="start"
                      font-size="12px"
                      class="fill-muted-foreground font-medium"
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
