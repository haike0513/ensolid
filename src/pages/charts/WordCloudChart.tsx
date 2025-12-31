import type { Component } from "solid-js";
import { For } from "solid-js";
import { Group, Text } from "@ensolid/visx";

const words = [
  { text: "数据可视化", value: 100 },
  { text: "前端开发", value: 85 },
  { text: "SolidJS", value: 75 },
  { text: "TypeScript", value: 70 },
  { text: "图表", value: 65 },
  { text: "交互设计", value: 60 },
  { text: "用户体验", value: 55 },
  { text: "响应式", value: 50 },
  { text: "动画", value: 45 },
  { text: "SVG", value: 40 },
  { text: "Canvas", value: 38 },
  { text: "D3", value: 35 },
  { text: "性能优化", value: 32 },
  { text: "组件化", value: 30 },
  { text: "模块化", value: 28 },
];

export const WordCloudChart: Component = () => {
  const width = 600;
  const height = 400;
  const colors = ["#6366f1", "#8b5cf6", "#a855f7", "#d946ef", "#ec4899"];
  
  // 简化的词云布局
  const layoutWords = words.map((w, i) => {
    const angle = (i / words.length) * Math.PI * 2;
    const radius = 50 + (100 - w.value) * 1.2;
    return {
      ...w,
      x: width / 2 + Math.cos(angle) * radius + (Math.random() - 0.5) * 40,
      y: height / 2 + Math.sin(angle) * radius + (Math.random() - 0.5) * 30,
      fontSize: 12 + (w.value / 100) * 24,
      color: colors[i % colors.length],
      rotate: (Math.random() - 0.5) * 30,
    };
  });

  return (
    <div class="group relative">
      <div class="absolute -inset-1 bg-gradient-to-r from-pink-500/20 to-rose-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div class="relative bg-card border-2 border-muted rounded-2xl p-6 shadow-xl overflow-hidden transition-all duration-300 hover:border-pink-500/30">
        <div class="flex items-center gap-3 mb-6">
          <div class="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500/20 to-rose-500/20">
            <span class="text-2xl">☁️</span>
          </div>
          <div>
            <h2 class="text-2xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">词云图</h2>
            <p class="text-xs text-muted-foreground">Word Cloud - 关键词分析</p>
          </div>
        </div>
        <div class="flex justify-center overflow-x-auto w-full">
          <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} class="max-w-full h-auto">
            <rect width={width} height={height} fill="#f8fafc" rx={14} />
            <For each={layoutWords}>
              {(word) => (
                <Text
                  x={word.x}
                  y={word.y}
                  textAnchor="middle"
                  verticalAnchor="middle"
                  fill={word.color}
                  font-size={`${word.fontSize}px`}
                  font-weight="bold"
                  transform={`rotate(${word.rotate}, ${word.x}, ${word.y})`}
                  class="transition-all duration-300 hover:opacity-70 cursor-pointer"
                >
                  {word.text}
                </Text>
              )}
            </For>
          </svg>
        </div>
      </div>
    </div>
  );
};
