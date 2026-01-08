import type { Component } from "solid-js";
import { For } from "solid-js";
import { Group, Text } from "@ensolid/visx";
import { hierarchy, tree } from "d3-hierarchy";

const treeData = {
  name: "Root",
  children: [
    {
      name: "Strategy",
      children: [
        { name: "Market" },
        { name: "Product" },
        { name: "Growth" }
      ]
    },
    {
      name: "Engineering",
      children: [
        { name: "Frontend" },
        { name: "Backend" },
        { name: "DevOps" }
      ]
    },
    {
      name: "Design",
      children: [
        { name: "UI" },
        { name: "UX" },
        { name: "User Research" }
      ]
    }
  ]
};

export const TreeChart: Component = () => {
  const width = 600;
  const height = 400;
  const margin = { top: 20, right: 100, bottom: 20, left: 60 };

  const data = hierarchy<any>(treeData);
  const treeLayout = tree().size([height - margin.top - margin.bottom, width - margin.left - margin.right]);
  const root = treeLayout(data);
  const links = root.links();
  const descendants = root.descendants();

  return (
    <div class="group relative">
      <div class="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-blue-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
      </div>
      <div class="relative bg-card border-2 border-muted rounded-2xl p-6 shadow-xl overflow-hidden transition-all duration-300 hover:border-indigo-500/30">
        <div class="flex items-center gap-3 mb-6">
          <div class="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-blue-500/20">
            <span class="text-2xl">🌲</span>
          </div>
          <div>
            <h2 class="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
              树图
            </h2>
            <p class="text-xs text-muted-foreground">
              Tree Chart - 层级结构展示
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
              {/* 绘制线条 */}
              <For each={links}>
                {(link) => (
                  <path
                    d={`M${link.source.y},${link.source.x} C${(link.source.y + link.target.y) / 2},${link.source.x} ${(link.source.y + link.target.y) / 2},${link.target.x} ${link.target.y},${link.target.x}`}
                    fill="none"
                    stroke="#e2e8f0"
                    stroke-width={2}
                  />
                )}
              </For>

              {/* 绘制节点 */}
              <For each={descendants}>
                {(node) => (
                  <Group top={node.x} left={node.y}>
                    <circle
                      r={6}
                      fill={node.children ? "#6366f1" : "#94a3b8"}
                      stroke="white"
                      stroke-width={2}
                      class="transition-all duration-300 hover:r-8 cursor-pointer"
                    />
                    <Text
                      x={node.children ? -10 : 10}
                      y={4}
                      textAnchor={node.children ? "end" : "start"}
                      font-size="12px"
                      font-weight="bold"
                      fill="#475569"
                    >
                      {(node.data as any).name}
                    </Text>
                  </Group>
                )}
              </For>
            </Group>
          </svg>
        </div>
      </div>
    </div>
  );
};
