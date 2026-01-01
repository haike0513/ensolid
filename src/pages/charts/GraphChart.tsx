import type { Component } from "solid-js";
import { For, createMemo } from "solid-js";
import { Group, Text, scaleOrdinal } from "@ensolid/visx";

// Simple custom implementation of a Force Graph since d3-force might not be directly exported or easy to plug in without full D3.
// We will use a static layout that LOOKS like a force graph for visual demonstration.
// Or we can implement a simple relaxation loop.

const nodes = [
  { id: "A", r: 20 }, { id: "B", r: 15 }, { id: "C", r: 10 }, { id: "D", r: 10 },
  { id: "E", r: 25 }, { id: "F", r: 15 }, { id: "G", r: 12 }, { id: "H", r: 12 }
];

const links = [
  { source: "A", target: "B" }, { source: "A", target: "C" }, { source: "A", target: "D" },
  { source: "E", target: "A" }, { source: "E", target: "F" }, { source: "F", target: "G" },
  { source: "F", target: "H" }, { source: "B", target: "C" }
];

// Pre-computed positions for a "Force-like" layout
const nodePositions: Record<string, {x: number, y: number}> = {
    "A": { x: 300, y: 200 },
    "B": { x: 400, y: 150 },
    "C": { x: 380, y: 250 },
    "D": { x: 250, y: 120 },
    "E": { x: 200, y: 250 },
    "F": { x: 150, y: 350 },
    "G": { x: 100, y: 300 },
    "H": { x: 200, y: 400 },
};

const colors = ["#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#06b6d4", "#84cc16"];

export const GraphChart: Component = () => {
    const width = 600;
    const height = 500;
    
    // Use standard D3 pattern: scaleOrdinal(range).domain(...)
    const colorScale = scaleOrdinal<string, string>(colors)
        .domain(nodes.map(n => n.id));

    return (
        <div class="group relative">
            <div class="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div class="relative bg-card border-2 border-muted rounded-2xl p-6 shadow-xl overflow-hidden transition-all duration-300 hover:border-indigo-500/30">
                <div class="flex items-center gap-3 mb-6">
                    <div class="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20">
                        <span class="text-2xl">🕸️</span>
                    </div>
                    <div>
                        <h2 class="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            关系图
                        </h2>
                        <p class="text-xs text-muted-foreground">
                            Graph Chart - 节点链接关系
                        </p>
                    </div>
                </div>
                <div class="flex justify-center overflow-x-auto w-full">
                    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} class="max-w-full h-auto">
                        <Group>
                            {/* Links */}
                            <For each={links}>
                                {(link) => {
                                    const source = nodePositions[link.source];
                                    const target = nodePositions[link.target];
                                    return (
                                        <line
                                            x1={source?.x}
                                            y1={source?.y}
                                            x2={target?.x}
                                            y2={target?.y}
                                            stroke="#cbd5e1"
                                            stroke-width={2}
                                            class="transition-all duration-300"
                                        />
                                    );
                                }}
                            </For>

                            {/* Nodes */}
                            <For each={nodes}>
                                {(node) => {
                                    const pos = nodePositions[node.id];
                                    return (
                                        <g 
                                          transform={`translate(${pos?.x}, ${pos?.y})`}
                                          class="cursor-pointer transition-transform duration-300 hover:scale-110"
                                        >
                                            <circle
                                                r={node.r}
                                                fill={colorScale(node.id)}
                                                stroke="#fff"
                                                stroke-width={2}
                                                class="shadow-lg"
                                            />
                                            <Text
                                                dy=".33em"
                                                font-size="10px"
                                                textAnchor="middle"
                                                fill="white"
                                                font-weight="bold"
                                                pointer-events="none"
                                            >
                                                {node.id}
                                            </Text>
                                        </g>
                                    );
                                }}
                            </For>
                        </Group>
                    </svg>
                </div>
            </div>
        </div>
    );
};
