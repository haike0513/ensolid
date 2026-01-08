import type { Component } from "solid-js";
import { For } from "solid-js";
import { AxisBottom, AxisLeft, GridColumns, GridRows, Group } from "@ensolid/visx";
import { scaleLinear, scaleOrdinal, scaleSqrt } from "d3-scale";
import { max, min } from "d3-array";

const bubbleData = Array.from({ length: 30 }, (_, i) => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    value: Math.random() * 1000 + 100,
    category: ["A", "B", "C"][Math.floor(Math.random() * 3)],
  }));

export const BubbleChart: Component = () => {
    const width = 600;
    const height = 400;
    const margin = { top: 40, right: 30, bottom: 50, left: 50 };
    const xMax = width - margin.left - margin.right;
    const yMax = height - margin.top - margin.bottom;

  const xScale = scaleLinear<number>()
    .range([0, xMax])
    .domain([0, max(bubbleData, (d: {x: number}) => d.x) ?? 100]);

  const yScale = scaleLinear<number>()
    .range([yMax, 0])
    .domain([0, max(bubbleData, (d: {y: number}) => d.y) ?? 100]);

  const sizeScale = scaleSqrt<number>()
    .range([5, 40])
    .domain([min(bubbleData, (d: {value: number}) => d.value) ?? 100, max(bubbleData, (d: {value: number}) => d.value) ?? 1100]);

  const colorScale = scaleOrdinal<string, string>()
    .domain(["A", "B", "C"])
    .range(["#3b82f6", "#10b981", "#f59e0b"]);

  return (
    <div class="group relative">
    <div class="absolute -inset-1 bg-gradient-to-r from-pink-500/20 to-rose-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
    </div>
    <div class="relative bg-card border-2 border-muted rounded-2xl p-6 shadow-xl overflow-hidden transition-all duration-300 hover:border-pink-500/30">
      <div class="flex items-center gap-3 mb-6">
        <div class="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500/20 to-rose-500/20">
          <span class="text-2xl">🫧</span>
        </div>
        <div>
          <h2 class="text-2xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
            气泡图
          </h2>
          <p class="text-xs text-muted-foreground">
            Bubble Chart - 三维数据展示
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
            <GridRows
              scale={yScale}
              width={xMax}
              stroke="#e2e8f0"
            />
            <GridColumns
              scale={xScale}
              height={yMax}
              stroke="#e2e8f0"
            />
            <AxisBottom scale={xScale} top={yMax} />
            <AxisLeft scale={yScale} />
            <For each={bubbleData}>
              {(d) => (
                <circle
                  cx={xScale(d.x)}
                  cy={yScale(d.y)}
                  r={sizeScale(d.value)}
                  fill={colorScale(d.category)}
                  fill-opacity={0.6}
                  stroke={colorScale(d.category)}
                  stroke-width={2}
                  class="transition-all duration-200 hover:opacity-100 hover:r-45"
                />
              )}
            </For>
          </Group>
        </svg>
      </div>
    </div>
  </div>
  );
};
