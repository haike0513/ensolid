import type { Component } from "solid-js";
import { For } from "solid-js";
import { AxisBottom, AxisLeft, Group, scaleBand, scaleLinear } from "@ensolid/visx";

const heatmapData = Array.from({ length: 7 }, (_, day) =>
    Array.from({ length: 12 }, (_, hour) => ({
      day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][day],
      hour: hour + 8, // 8am - 8pm
      value: Math.random() * 100,
    }))
  ).flat();

export const Heatmap: Component = () => {
    const width = 600;
    const height = 400;
    const margin = { top: 40, right: 30, bottom: 50, left: 50 };
    const xMax = width - margin.left - margin.right;
    const yMax = height - margin.top - margin.bottom;

  const xScale = scaleBand<number>()
    .range([0, xMax])
    .domain(Array.from({ length: 12 }, (_, i) => i + 8))
    .padding(0.05);

  const yScale = scaleBand<string>()
    .range([yMax, 0])
    .domain(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"])
    .padding(0.05);

  const colorScale = scaleLinear<string>()
    .domain([0, 100])
    .range(["#e0e7ff", "#3730a3"]);

  return (
    <div class="group relative">
    <div class="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-violet-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
    </div>
    <div class="relative bg-card border-2 border-muted rounded-2xl p-6 shadow-xl overflow-hidden transition-all duration-300 hover:border-indigo-500/30">
      <div class="flex items-center gap-3 mb-6">
        <div class="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20">
          <span class="text-2xl">🌡️</span>
        </div>
        <div>
          <h2 class="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            热力图
          </h2>
          <p class="text-xs text-muted-foreground">
            Heatmap - 数据密度展示
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
            <AxisBottom
              scale={xScale}
              top={yMax}
              tickFormat={(d: any) => `${d}:00`}
            />
            <AxisLeft scale={yScale} />
            <For each={heatmapData}>
              {(d) => (
                <rect
                  x={xScale(d.hour)}
                  y={yScale(d.day)}
                  width={xScale.bandwidth()}
                  height={yScale.bandwidth()}
                  fill={colorScale(d.value)}
                  rx={4}
                  class="transition-all duration-200 hover:opacity-80"
                >
                  <title>
                    {`${d.day} ${d.hour}:00 - Value: ${d.value.toFixed(0)}`}
                  </title>
                </rect>
              )}
            </For>
          </Group>
        </svg>
      </div>
    </div>
  </div>
  );
};
