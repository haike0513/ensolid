import type { Component } from "solid-js";
import { For } from "solid-js";
import { Group, Text, scaleLinear } from "@ensolid/visx";

const sankeyNodes = [
  { name: "访问", x: 0, color: "#6366f1" },
  { name: "注册", x: 1, color: "#8b5cf6" },
  { name: "活跃", x: 1, color: "#a855f7" },
  { name: "付费", x: 2, color: "#d946ef" },
  { name: "流失", x: 2, color: "#94a3b8" },
];

const sankeyLinks = [
  { source: 0, target: 1, value: 60 },
  { source: 0, target: 2, value: 40 },
  { source: 1, target: 3, value: 30 },
  { source: 1, target: 4, value: 30 },
  { source: 2, target: 3, value: 25 },
  { source: 2, target: 4, value: 15 },
];

export const SankeyChart: Component = () => {
  const width = 600;
  const height = 400;
  const margin = { top: 40, right: 40, bottom: 40, left: 40 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  
  const nodeWidth = 24;
  const nodePadding = 20;
  const columns = 3;
  const columnWidth = innerWidth / columns;

  // 计算节点位置
  const nodesByColumn: number[][] = [[], [], []];
  sankeyNodes.forEach((n, i) => nodesByColumn[n.x].push(i));
  
  const nodePositions = sankeyNodes.map((n, i) => {
    const colNodes = nodesByColumn[n.x];
    const idx = colNodes.indexOf(i);
    const totalHeight = colNodes.length * 60 + (colNodes.length - 1) * nodePadding;
    const startY = (innerHeight - totalHeight) / 2;
    return {
      x: n.x * columnWidth,
      y: startY + idx * (60 + nodePadding),
      height: 60,
    };
  });

  return (
    <div class="group relative">
      <div class="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div class="relative bg-card border-2 border-muted rounded-2xl p-6 shadow-xl overflow-hidden transition-all duration-300 hover:border-indigo-500/30">
        <div class="flex items-center gap-3 mb-6">
          <div class="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20">
            <span class="text-2xl">🔀</span>
          </div>
          <div>
            <h2 class="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">桑基图</h2>
            <p class="text-xs text-muted-foreground">Sankey - 流量分布分析</p>
          </div>
        </div>
        <div class="flex justify-center overflow-x-auto w-full">
          <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} class="max-w-full h-auto">
            <rect width={width} height={height} fill="#f8fafc" rx={14} />
            <Group top={margin.top} left={margin.left}>
              <For each={sankeyLinks}>
                {(link) => {
                  const s = nodePositions[link.source];
                  const t = nodePositions[link.target];
                  const sx = s.x + nodeWidth;
                  const sy = s.y + s.height / 2;
                  const tx = t.x;
                  const ty = t.y + t.height / 2;
                  const path = `M${sx},${sy} C${sx + 80},${sy} ${tx - 80},${ty} ${tx},${ty}`;
                  return <path d={path} fill="none" stroke={sankeyNodes[link.source].color} stroke-width={link.value / 3} stroke-opacity={0.4} class="transition-all duration-300 hover:stroke-opacity-0.8" />;
                }}
              </For>
              <For each={sankeyNodes}>
                {(node, i) => {
                  const pos = nodePositions[i()];
                  return (
                    <g>
                      <rect x={pos.x} y={pos.y} width={nodeWidth} height={pos.height} fill={node.color} rx={4} class="transition-all duration-300 hover:opacity-80 cursor-pointer" />
                      <Text x={pos.x + nodeWidth + 8} y={pos.y + pos.height / 2} verticalAnchor="middle" fill="#475569" font-size="12px" font-weight="bold">{node.name}</Text>
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
