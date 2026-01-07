import type { Component } from "solid-js";
import { For, createMemo } from "solid-js";
import { Group, tree, hierarchy, scaleLinear, linkRadial } from "@ensolid/visx";

interface Data {
  name: string;
  children?: Data[];
}

const data: Data = {
  name: "Root",
  children: [
    {
      name: "Node A",
      children: [{ name: "A1" }, { name: "A2" }, { name: "A3" }],
    },
    {
      name: "Node B",
      children: [
        { name: "B1" },
        {
          name: "B2",
          children: [{ name: "B2-1" }, { name: "B2-2" }],
        },
      ],
    },
    {
      name: "Node C",
      children: [{ name: "C1" }, { name: "C2" }],
    },
  ],
};

export const RadialTreeChart: Component = () => {
  const width = 600;
  const height = 400;
  const margin = { top: 20, right: 20, bottom: 20, left: 20 };

  const radius = Math.min(width, height) / 2 - 40;

  const root = createMemo(() => {
    const rootHierarchy = hierarchy(data);
    return tree<Data>().size([2 * Math.PI, radius])(rootHierarchy);
  });

  const linkPath = linkRadial()
    .angle((d: any) => d.x)
    .radius((d: any) => d.y);

  return (
    <div class="group relative">
      <div class="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div class="relative bg-card border-2 border-muted rounded-2xl p-6 shadow-xl overflow-hidden transition-all duration-300 hover:border-emerald-500/30">
        <div class="flex items-center gap-3 mb-6">
          <div class="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20">
            <span class="text-2xl">🕸️</span>
          </div>
          <div>
            <h2 class="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              径向树图
            </h2>
            <p class="text-xs text-muted-foreground">
              Radial Tree - 辐射状层级结构
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
              <For each={root().links()}>
                {(link) => (
                  <path
                    d={linkPath(link as any) || ""}
                    fill="none"
                    stroke="#cbd5e1"
                    stroke-width={1}
                  />
                )}
              </For>
              <For each={root().descendants()}>
                {(node) => (
                  <g
                    transform={`rotate(${(node.x * 180) / Math.PI - 90}) translate(${node.y},0)`}
                  >
                    <circle
                      r={4}
                      fill={node.children ? "#ffffff" : "#10b981"}
                      stroke="#10b981"
                      stroke-width={2}
                      class="transition-all duration-300 hover:r-6"
                    />
                    <text
                      dy="0.31em"
                      x={node.x < Math.PI === !node.children ? 6 : -6}
                      text-anchor={
                        node.x < Math.PI === !node.children ? "start" : "end"
                      }
                      transform={`rotate(${node.x >= Math.PI ? 180 : 0})`}
                      font-size="10px"
                      fill="#64748b"
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
