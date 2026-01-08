import type { Component } from "solid-js";
import { For } from "solid-js";
import { AxisBottom, AxisLeft, GridColumns, GridRows, Group, LinePath } from "@ensolid/visx";
import { scaleLinear } from "d3-scale";
import { extent, max } from "d3-array";
import { curveMonotoneX } from "d3-shape";

const lineData = Array.from({ length: 20 }, (_, i) => ({
    x: i,
    y: Math.sin(i / 3) * 10 + 15 + Math.random() * 5,
  }));

export const LineChart: Component = () => {
    const width = 600;
    const height = 400;
    const margin = { top: 40, right: 30, bottom: 50, left: 50 };
    const xMax = width - margin.left - margin.right;
    const yMax = height - margin.top - margin.bottom;

  const xScale = scaleLinear<number>()
    .range([0, xMax])
    .domain(extent(lineData, (d) => d.x) as [number, number]);

  const yScale = scaleLinear<number>()
    .range([yMax, 0])
    .domain([0, max(lineData, (d) => d.y) ?? 0]);

  return (
    <div class="group relative">
    <div class="absolute -inset-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
    </div>
    <div class="relative bg-card border-2 border-muted rounded-2xl p-6 shadow-xl overflow-hidden transition-all duration-300 hover:border-green-500/30">
      <div class="flex items-center gap-3 mb-6">
        <div class="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20">
          <span class="text-2xl">📈</span>
        </div>
        <div>
          <h2 class="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            折线图
          </h2>
          <p class="text-xs text-muted-foreground">
            Line Chart - 趋势变化分析
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
            <AxisBottom
              scale={xScale}
              top={yMax}
              tickFormat={(d: any) => `T${d}`}
            />
            <AxisLeft scale={yScale} />
            <LinePath
              data={lineData}
              x={(d: { x: number; y: number }) => xScale(d.x) ?? 0}
              y={(d: { x: number; y: number }) => yScale(d.y) ?? 0}
              stroke="#10b981"
              stroke-width={3}
              curve={curveMonotoneX}
            />
            <For each={lineData}>
              {(d) => (
                <circle
                  cx={xScale(d.x)}
                  cy={yScale(d.y)}
                  r={4}
                  fill="#ffffff"
                  stroke="#10b981"
                  stroke-width={2}
                  class="transition-all duration-200 hover:r-6 hover:fill-emerald-100"
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
