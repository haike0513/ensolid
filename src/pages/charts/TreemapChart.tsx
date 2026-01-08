import type { Component } from "solid-js";
import { For } from "solid-js";
import { Group, Text } from "@ensolid/visx";
import { hierarchy, treemap, treemapSquarify } from "d3-hierarchy";

const treemapData = {
  name: "root",
  children: [
    { name: "技术", value: 45, color: "#6366f1" },
    { name: "设计", value: 30, color: "#8b5cf6" },
    { name: "市场", value: 25, color: "#a855f7" },
    { name: "运营", value: 20, color: "#d946ef" },
    { name: "财务", value: 15, color: "#ec4899" },
    { name: "人事", value: 12, color: "#f43f5e" },
    { name: "行政", value: 8, color: "#fb7185" },
    { name: "法务", value: 5, color: "#fda4af" },
  ],
};

interface TreemapChild {
  name: string;
  value: number;
  color: string;
}

export const TreemapChart: Component = () => {
  const width = 600;
  const height = 400;
  const margin = { top: 40, right: 20, bottom: 20, left: 20 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // 创建层级结构
  const root = hierarchy(treemapData)
    .sum((d: any) => d.value)
    .sort((a: any, b: any) => (b.value ?? 0) - (a.value ?? 0));

  // 创建 treemap 布局
  const treemapLayout = treemap<typeof treemapData>()
    .size([innerWidth, innerHeight])
    .padding(3)
    .tile(treemapSquarify);

  const treemapRoot = treemapLayout(root);
  const leaves = treemapRoot.leaves();

  return (
    <div class="group relative">
      <div class="absolute -inset-1 bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
      </div>
      <div class="relative bg-card border-2 border-muted rounded-2xl p-6 shadow-xl overflow-hidden transition-all duration-300 hover:border-violet-500/30">
        <div class="flex items-center gap-3 mb-6">
          <div class="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20">
            <span class="text-2xl">🗂️</span>
          </div>
          <div>
            <h2 class="text-2xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
              矩形树图
            </h2>
            <p class="text-xs text-muted-foreground">
              Treemap - 层级占比分析
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
              <For each={leaves}>
                {(leaf) => {
                  const nodeData = leaf.data as any;
                  const rectWidth = leaf.x1 - leaf.x0;
                  const rectHeight = leaf.y1 - leaf.y0;
                  const centerX = (leaf.x0 + leaf.x1) / 2;
                  const centerY = (leaf.y0 + leaf.y1) / 2;

                  return (
                    <g>
                      <rect
                        x={leaf.x0}
                        y={leaf.y0}
                        width={rectWidth}
                        height={rectHeight}
                        fill={nodeData.color}
                        rx={4}
                        class="transition-all duration-300 hover:opacity-80 cursor-pointer"
                        stroke="#ffffff"
                        stroke-width={2}
                      />
                      {rectWidth > 50 && rectHeight > 30 && (
                        <>
                          <Text
                            x={centerX}
                            y={centerY - 8}
                            textAnchor="middle"
                            verticalAnchor="middle"
                            fill="#ffffff"
                            font-size="14px"
                            font-weight="bold"
                          >{nodeData.name}</Text>
                          <Text
                            x={centerX}
                            y={centerY + 10}
                            textAnchor="middle"
                            verticalAnchor="middle"
                            fill="rgba(255,255,255,0.8)"
                            font-size="12px"
                          >{`${nodeData.value}人`}</Text>
                        </>
                      )}
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
