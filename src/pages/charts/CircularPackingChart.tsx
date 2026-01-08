import type { Component } from "solid-js";
import { For, createMemo } from "solid-js";
import { Group } from "@ensolid/visx";
import { pack, hierarchy } from "d3-hierarchy";

interface Data {
  name: string;
  value?: number;
  children?: Data[];
}

const data: Data = {
  name: "root",
  children: [
    { name: "A", value: 10 },
    { name: "B", value: 20 },
    {
      name: "C",
      children: [
        { name: "C1", value: 5 },
        { name: "C2", value: 8 },
        { name: "C3", value: 12 },
      ],
    },
    { name: "D", value: 30 },
    {
      name: "E",
      children: [
        { name: "E1", value: 15 },
        { name: "E2", value: 10 },
      ],
    },
  ],
};

export const CircularPackingChart: Component = () => {
  const width = 600;
  const height = 400;
  const margin = { top: 20, right: 20, bottom: 20, left: 20 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const root = createMemo(() => {
    const rootHierarchy = hierarchy(data)
      .sum((d: any) => d.value ?? 0)
      .sort((a: any, b: any) => (b.value ?? 0) - (a.value ?? 0));

    return pack<Data>().size([innerWidth, innerHeight]).padding(3)(rootHierarchy);
  });

  return (
    <div class="group relative">
      <div class="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div class="relative bg-card border-2 border-muted rounded-2xl p-6 shadow-xl overflow-hidden transition-all duration-300 hover:border-purple-500/30">
        <div class="flex items-center gap-3 mb-6">
          <div class="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20">
            <span class="text-2xl">🫧</span>
          </div>
          <div>
            <h2 class="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              圆形打包图
            </h2>
            <p class="text-xs text-muted-foreground">
              Circle Packing - 层级数据包含关系
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
            <Group top={margin.top} left={margin.left}>
              <For each={root().descendants()}>
                {(node) => (
                  <g transform={`translate(${node.x},${node.y})`}>
                    <circle
                      r={node.r}
                      fill={node.children ? "#f1f5f9" : "#a855f7"}
                      fill-opacity={node.children ? 1 : 0.6}
                      stroke={node.children ? "#cbd5e1" : "none"}
                      stroke-width={1}
                      class="transition-all duration-300 hover:fill-opacity-80"
                    >
                      <title>{`${node.data.name}: ${node.value}`}</title>
                    </circle>
                    {!node.children && node.r > 10 && (
                      <text
                        dy=".3em"
                        text-anchor="middle"
                        font-size="10px"
                        fill="white"
                        pointer-events="none"
                      >
                        {node.data.name}
                      </text>
                    )}
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
