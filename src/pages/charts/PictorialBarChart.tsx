import type { Component } from "solid-js";
import { For } from "solid-js";
import { Group, Text, scaleBand, scaleLinear } from "@ensolid/visx";

const pictorialData = [
  { name: "Apples", value: 100, icon: "🍎" },
  { name: "Bananas", value: 120, icon: "🍌" },
  { name: "Cherries", value: 80, icon: "🍒" },
  { name: "Grapes", value: 150, icon: "🍇" },
  { name: "Oranges", value: 90, icon: "🍊" },
];

export const PictorialBarChart: Component = () => {
  const width = 600;
  const height = 400;
  const margin = { top: 40, right: 30, bottom: 60, left: 60 };
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  const xScale = scaleBand<string>()
    .range([0, xMax])
    .domain(pictorialData.map((d) => d.name))
    .padding(0.4);

  const yScale = scaleLinear<number>()
    .range([yMax, 0])
    .domain([0, Math.max(...pictorialData.map((d) => d.value)) * 1.1]);

  return (
    <div class="group relative">
      <div class="absolute -inset-1 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
      </div>
      <div class="relative bg-card border-2 border-muted rounded-2xl p-6 shadow-xl overflow-hidden transition-all duration-300 hover:border-orange-500/30">
        <div class="flex items-center gap-3 mb-6">
          <div class="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500/20 to-yellow-500/20">
            <span class="text-2xl">🎨</span>
          </div>
          <div>
            <h2 class="text-2xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
              象形柱图
            </h2>
            <p class="text-xs text-muted-foreground">
              Pictorial Bar - 创意形象化展示
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
              <For each={pictorialData}>
                {(d) => {
                  const barWidth = xScale.bandwidth();
                  const barHeight = yMax - yScale(d.value);
                  const x = xScale(d.name) || 0;
                  const iconSize = barWidth;
                  const iconsCount = Math.ceil(d.value / 20);
                  
                  return (
                    <Group left={x}>
                      {/* 背景占位 */}
                      <rect
                        x={0}
                        y={0}
                        width={barWidth}
                        height={yMax}
                        fill="#f1f5f9"
                        opacity={0.3}
                        rx={barWidth / 2}
                      />
                      
                      {/* 象形元素堆叠 */}
                      <For each={Array.from({ length: iconsCount })}>
                        {(_, i) => (
                            <Text
                                x={barWidth / 2}
                                y={yMax - i() * (yMax/10) - 10}
                                textAnchor="middle"
                                verticalAnchor="middle"
                                font-size={`${barWidth * 0.8}px`}
                                class="animate-bounce"
                                style={{ "animation-delay": `${i() * 100}ms`, "animation-duration": "2s" }}
                            >
                                {d.icon}
                            </Text>
                        )}
                      </For>

                      {/* 数值标签 */}
                      <Text
                        x={barWidth / 2}
                        y={yScale(d.value) - 10}
                        textAnchor="middle"
                        font-size="12px"
                        font-weight="bold"
                        fill="#64748b"
                      >
                        {d.value}
                      </Text>

                      {/* X轴标签 */}
                      <Text
                        x={barWidth / 2}
                        y={yMax + 20}
                        textAnchor="middle"
                        font-size="12px"
                        fill="#64748b"
                      >
                        {d.name}
                      </Text>
                    </Group>
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
