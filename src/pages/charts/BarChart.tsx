import type { Component } from "solid-js";
import { For } from "solid-js";
import { AxisBottom, AxisLeft, GridRows, Group, scaleBand, scaleLinear, Bar, max } from "@ensolid/visx";

const barData = [
  { label: "A", value: 10 },
  { label: "B", value: 20 },
  { label: "C", value: 15 },
  { label: "D", value: 30 },
  { label: "E", value: 25 },
  { label: "F", value: 18 },
  { label: "G", value: 22 },
];

export const BarChart: Component = () => {
    const width = 600;
    const height = 400;
    const margin = { top: 40, right: 30, bottom: 50, left: 50 };
    const xMax = width - margin.left - margin.right;
    const yMax = height - margin.top - margin.bottom;

  const xScale = scaleBand<string>()
    .range([0, xMax])
    .domain(barData.map((d) => d.label))
    .padding(0.4);

  const yScale = scaleLinear<number>()
    .range([yMax, 0])
    .domain([0, max(barData, (d) => d.value) ?? 0]);

  return (
    <div class="group relative">
        <div class="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        </div>
        <div class="relative bg-card border-2 border-muted rounded-2xl p-6 shadow-xl overflow-hidden transition-all duration-300 hover:border-blue-500/30">
            <div class="flex items-center gap-3 mb-6">
            <div class="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20">
                <span class="text-2xl">📊</span>
            </div>
            <div>
                <h2 class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                柱状图
                </h2>
                <p class="text-xs text-muted-foreground">
                Bar Chart - 数据对比分析
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
                <rect width={width} height={height} fill="#f8fafc" rx={14} />
                <Group top={margin.top} left={margin.left}>
                <GridRows scale={yScale} width={xMax} stroke="#e2e8f0" />
                <AxisBottom scale={xScale} top={yMax} />
                <AxisLeft scale={yScale} />
                <For each={barData}>
                    {(d) => {
                    const barHeight = yMax - (yScale(d.value) ?? 0);
                    return (
                        <Bar
                        class="transition-all duration-300 hover:opacity-80 cursor-pointer"
                        x={xScale(d.label)}
                        y={yMax - barHeight}
                        width={xScale.bandwidth()}
                        height={barHeight}
                        fill="#3b82f6"
                        rx={4}
                        />
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
