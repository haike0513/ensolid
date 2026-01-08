import type { Component } from "solid-js";
import { For, createMemo } from "solid-js";
import { Group } from "@ensolid/visx";
import { cluster, hierarchy } from "d3-hierarchy";
import { lineRadial, curveBundle } from "d3-shape";

// Hierarchical data
const data = {
  name: "flare",
  children: [
    {
      name: "analytics",
      children: [
        { name: "cluster", imports: ["flare.util.MergeSort"] },
        { name: "graph", imports: ["flare.analytics.optimization", "flare.analytics.cluster"] },
        { name: "optimization", imports: ["flare.util.math"] },
      ],
    },
    {
      name: "animate",
      children: [
        { name: "Easing", imports: ["flare.animate.Transition"] },
        { name: "FunctionSequence", imports: ["flare.util.Maths"] },
        { name: "interpolate", imports: ["flare.util.Palette"] },
      ],
    },
    {
      name: "data",
      children: [
        { name: "Data", imports: ["flare.dest.Geometry"] },
        { name: "DataList", imports: ["flare.vis.data.Node"] },
      ],
    },
    {
      name: "display",
      children: [
        { name: "DirtySprite", imports: [] },
        { name: "LineSprite", imports: ["flare.vis.data.Edge"] },
      ],
    },
  ],
};

// ...

// Since reliable import parsing is complex without big data, let's make a mock structure 
// suited for immediate visual bundling.
const makeBundleData = (radius: number) => {
    // Generate a simple hierarchy
    const root = hierarchy(data).sort((a, b) => (a.height - b.height) || a.data.name.localeCompare(b.data.name));
    
    const clusterLayout = cluster()
        .size([360, radius - 100]); // angle in degrees, radius
        
    clusterLayout(root);
    
    // Now we need links. Let's create random links between leaves for effect
    const leaves = root.leaves();
    const links: any[] = [];
    
    leaves.forEach((d: any, i) => {
        // Connect to 2 random other nodes
        const target1 = leaves[(i + 3) % leaves.length];
        const target2 = leaves[(i + 7) % leaves.length];
        
        // Use d.path(target) to generate path from source d to target
        if (target1) links.push(d.path(target1));
        if (target2 && i % 2 === 0) links.push(d.path(target2));
    });
    
    return { root, links };
};


export const EdgeBundlingChart: Component = () => {
    const width = 600;
    const height = 600;
    const radius = width / 2;

    const { root, links } = makeBundleData(radius);

    const lineGenerator = lineRadial<any>()
        .curve(curveBundle.beta(0.85)) // High beta for tight bundling
        .radius((d) => d.y)
        .angle((d) => d.x / 180 * Math.PI);

    return (
        <div class="group relative">
            <div class="absolute -inset-1 bg-gradient-to-r from-violet-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div class="relative bg-card border-2 border-muted rounded-2xl p-6 shadow-xl overflow-hidden transition-all duration-300 hover:border-violet-500/30">
                <div class="flex items-center gap-3 mb-6">
                    <div class="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20">
                        <span class="text-2xl">🧶</span>
                    </div>
                    <div>
                        <h2 class="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                            边缘捆绑图
                        </h2>
                        <p class="text-xs text-muted-foreground">
                            Edge Bundling - 层级关系连接
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
                        <Group top={height / 2} left={width / 2}>
                            {/* Links */}
                            <For each={links}>
                                {(pathNodes) => (
                                    <path
                                        d={lineGenerator(pathNodes) || ""}
                                        fill="none"
                                        stroke="#8b5cf6"
                                        stroke-opacity={0.4}
                                        stroke-width={1}
                                        class="transition-all duration-300 hover:stroke-opacity-100 hover:stroke-width-2 cursor-pointer"
                                    />
                                )}
                            </For>

                            {/* Nodes (Leaves) */}
                            <For each={root.leaves()}>
                                {(node: any) => (
                                    <g
                                        transform={`rotate(${node.x - 90}) translate(${node.y},0)`}
                                    >
                                        <text
                                            dx={node.x < 180 ? 8 : -8}
                                            dy=".31em"
                                            text-anchor={node.x < 180 ? "start" : "end"}
                                            transform={node.x >= 180 ? "rotate(180)" : null}
                                            font-size="10px"
                                            class="fill-muted-foreground font-medium"
                                        >
                                            {node.data.name}
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
