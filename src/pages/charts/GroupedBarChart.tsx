import type { Component } from "solid-js";
import { For, createSignal } from "solid-js";
import { AxisBottom, AxisLeft, GridRows, Group, Bar } from "@ensolid/visx";
import { scaleBand, scaleLinear, scaleOrdinal } from "d3-scale";
import { max } from "d3-array";

const data = [
  { category: "USA", Gold: 39, Silver: 41, Bronze: 33 },
  { category: "China", Gold: 38, Silver: 32, Bronze: 18 },
  { category: "Japan", Gold: 27, Silver: 14, Bronze: 17 },
  { category: "UK", Gold: 22, Silver: 21, Bronze: 22 },
  { category: "ROC", Gold: 20, Silver: 28, Bronze: 23 },
];

const keys = ["Gold", "Silver", "Bronze"];

export const GroupedBarChart: Component = () => {
  const width = 600;
  const height = 400;
  const margin = { top: 40, right: 30, bottom: 50, left: 50 };
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  // Scale for groups (Categories)
  const x0Scale = scaleBand<string>()
    .domain(data.map((d) => d.category))
    .range([0, xMax])
    .padding(0.2);

  // Scale for bars within groups (Keys)
  const x1Scale = scaleBand<string>()
    .domain(keys)
    .range([0, x0Scale.bandwidth()])
    .padding(0.1);

  // Color scale
  const colorScale = scaleOrdinal<string, string>()
    .domain(keys)
    .range(["#fbbf24", "#94a3b8", "#b45309"]);

  // Y Scale
  const yScale = scaleLinear<number>()
    .domain([0, max(data, (d) => Math.max(d.Gold, d.Silver, d.Bronze)) ?? 0])
    .range([yMax, 0])
    .nice();

  return (
    <div class="group relative">
      <div class="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div class="relative bg-card border-2 border-muted rounded-2xl p-6 shadow-xl overflow-hidden transition-all duration-300 hover:border-blue-500/30">
        <div class="flex items-center gap-3 mb-6">
          <div class="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20">
            <span class="text-2xl">📊</span>
          </div>
          <div>
            <h2 class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              分组柱状图
            </h2>
            <p class="text-xs text-muted-foreground">
              Grouped Bar Chart - 并列对比
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
              <GridRows scale={yScale} width={xMax} stroke="#e2e8f0" />
              <AxisBottom scale={x0Scale} top={yMax} />
              <AxisLeft scale={yScale} />
              <For each={data}>
                {(d) => (
                  <Group left={x0Scale(d.category)}>
                    <For each={keys}>
                      {(key) => {
                        const value = d[key as keyof typeof d] as number;
                        const barWidth = x1Scale.bandwidth();
                        const barHeight = yMax - yScale(value);
                        const barX = x1Scale(key);
                        const barY = yScale(value);
                        return (
                          <Bar
                            x={barX}
                            y={barY}
                            width={barWidth}
                            height={barHeight}
                            fill={colorScale(key)}
                            rx={4}
                            class="transition-all duration-300 hover:opacity-80 cursor-pointer"
                          />
                        );
                      }}
                    </For>
                  </Group>
                )}
              </For>
            </Group>
          </svg>
        </div>
        <div class="flex justify-center gap-6 mt-4">
          <For each={keys}>
            {(key) => (
              <div class="flex items-center gap-2">
                <div
                  class="w-3 h-3 rounded-full"
                  style={{ "background-color": colorScale(key) }}
                ></div>
                <span class="text-xs text-muted-foreground">{key}</span>
              </div>
            )}
          </For>
        </div>
      </div>
    </div>
  );
};
