import type { Component } from "solid-js";
import { For } from "solid-js";
import { Group, Text } from "@ensolid/visx";

interface TreemapItem {
  name: string;
  value: number;
  color: string;
}

const treemapData: TreemapItem[] = [
  { name: "技术", value: 45, color: "#6366f1" },
  { name: "设计", value: 30, color: "#8b5cf6" },
  { name: "市场", value: 25, color: "#a855f7" },
  { name: "运营", value: 20, color: "#d946ef" },
  { name: "财务", value: 15, color: "#ec4899" },
  { name: "人事", value: 12, color: "#f43f5e" },
  { name: "行政", value: 8, color: "#fb7185" },
  { name: "法务", value: 5, color: "#fda4af" },
];

// 简单的 squarified treemap 布局算法
function calculateTreemapLayout(
  data: TreemapItem[],
  width: number,
  height: number
): Array<TreemapItem & { x: number; y: number; w: number; h: number }> {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const sorted = [...data].sort((a, b) => b.value - a.value);
  
  const result: Array<TreemapItem & { x: number; y: number; w: number; h: number }> = [];
  let currentX = 0;
  let currentY = 0;
  let remainingWidth = width;
  let remainingHeight = height;
  let isHorizontal = width >= height;
  
  let i = 0;
  while (i < sorted.length) {
    // 计算当前方向能容纳的元素
    const remaining = sorted.slice(i);
    const remainingTotal = remaining.reduce((sum, d) => sum + d.value, 0);
    
    // 简化：每次放置一个元素
    const item = sorted[i];
    const ratio = item.value / remainingTotal;
    
    if (isHorizontal) {
      const itemWidth = remainingWidth * ratio;
      result.push({
        ...item,
        x: currentX,
        y: currentY,
        w: itemWidth,
        h: remainingHeight,
      });
      currentX += itemWidth;
      remainingWidth -= itemWidth;
    } else {
      const itemHeight = remainingHeight * ratio;
      result.push({
        ...item,
        x: currentX,
        y: currentY,
        w: remainingWidth,
        h: itemHeight,
      });
      currentY += itemHeight;
      remainingHeight -= itemHeight;
    }
    
    // 交替方向以获得更好的布局
    if (i % 2 === 1) {
      isHorizontal = !isHorizontal;
    }
    i++;
  }
  
  return result;
}

export const TreemapChart: Component = () => {
  const width = 600;
  const height = 400;
  const margin = { top: 40, right: 20, bottom: 20, left: 20 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const layoutItems = calculateTreemapLayout(treemapData, innerWidth, innerHeight);

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
              <For each={layoutItems}>
                {(item) => {
                  const showLabel = item.w > 50 && item.h > 30;
                  return (
                    <g>
                      <rect
                        x={item.x}
                        y={item.y}
                        width={Math.max(0, item.w - 2)}
                        height={Math.max(0, item.h - 2)}
                        fill={item.color}
                        rx={4}
                        class="transition-all duration-300 hover:opacity-80 cursor-pointer"
                        stroke="#ffffff"
                        stroke-width={2}
                      />
                      {showLabel && (
                        <>
                          <Text
                            x={item.x + item.w / 2}
                            y={item.y + item.h / 2 - 8}
                            textAnchor="middle"
                            verticalAnchor="middle"
                            fill="#ffffff"
                            font-size="14px"
                            font-weight="bold"
                          >
                            {item.name}
                          </Text>
                          <Text
                            x={item.x + item.w / 2}
                            y={item.y + item.h / 2 + 10}
                            textAnchor="middle"
                            verticalAnchor="middle"
                            fill="rgba(255,255,255,0.8)"
                            font-size="12px"
                          >
                            {`${item.value}人`}
                          </Text>
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
