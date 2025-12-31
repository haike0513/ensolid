import type { Component } from "solid-js";
import { For } from "solid-js";
import {
  AxisBottom,
  AxisLeft,
  GridColumns,
  GridRows,
  Group,
  LinePath,
  curveStep,
  scaleLinear,
  max,
  extent
} from "@ensolid/visx";

const stepData = Array.from({ length: 20 }, (_, i) => ({
  x: i,
  y: Math.floor(Math.random() * 50) + 20,
}));

export const StepLineChart: Component = () => {
    const width = 600;
    const height = 400;
    const margin = { top: 40, right: 30, bottom: 50, left: 50 };
    const xMax = width - margin.left - margin.right;
    const yMax = height - margin.top - margin.bottom;

  const xScale = scaleLinear<number>()
    .range([0, xMax])
    .domain(extent(stepData, (d) => d.x) as [number, number]);

  const yScale = scaleLinear<number>()
    .range([yMax, 0])
    .domain([0, max(stepData, (d) => d.y) ?? 100]);

  return (
    <div class="group relative">
      <div class="absolute -inset-1 bg-gradient-to-r from-fuchsia-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div class="relative bg-card border-2 border-muted rounded-2xl p-6 shadow-xl overflow-hidden transition-all duration-300 hover:border-fuchsia-500/30">
        <div class="flex items-center gap-3 mb-6">
          <div class="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-fuchsia-500/20 to-purple-500/20">
            <span class="text-2xl">⚡</span>
          </div>
          <div>
            <h2 class="text-2xl font-bold bg-gradient-to-r from-fuchsia-600 to-purple-600 bg-clip-text text-transparent">
              阶梯折线图
            </h2>
            <p class="text-xs text-muted-foreground">
              Step Line Chart - 离散变化趋势
            </p>
          </div>
        </div>
        <div class="flex justify-center overflow-x-auto w-full">
          <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} class="max-w-full h-auto">
            <Group top={margin.top} left={margin.left}>
                <GridRows scale={yScale} width={xMax} stroke="#e2e8f0" />
                <GridColumns scale={xScale} height={yMax} stroke="#e2e8f0" />
                <AxisBottom scale={xScale} top={yMax} />
                <AxisLeft scale={yScale} />
              <LinePath
                data={stepData}
                x={(d) => xScale(d.x) ?? 0}
                y={(d) => yScale(d.y) ?? 0}
                stroke="#c026d3"
                stroke-width={3}
                curve={curveStep}
              />
              <For each={stepData}>
                {(d) => (
                    <circle
                    cx={xScale(d.x)}
                    cy={yScale(d.y)}
                    r={4}
                    fill="#ffffff"
                    stroke="#c026d3"
                    stroke-width={2}
                    class="transition-all duration-200 hover:r-6"
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
