import type { Component } from "solid-js";
import { For } from "solid-js";
import { AxisBottom, AxisLeft, GridRows, Group, scaleBand, scaleLinear, Bar, max } from "@ensolid/visx";

const negativeData = [
  { label: "A类", positive: 45, negative: -30 },
  { label: "B类", positive: 60, negative: -25 },
  { label: "C类", positive: 35, negative: -45 },
  { label: "D类", positive: 55, negative: -20 },
  { label: "E类", positive: 70, negative: -35 },
];

export const NegativeBarChart: Component = () => {
  const width = 600;
  const height = 400;
  const margin = { top: 40, right: 30, bottom: 50, left: 60 };
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  const xScale = scaleBand<string>()
    .range([0, xMax])
    .domain(negativeData.map((d) => d.label))
    .padding(0.3);

  const allValues = negativeData.flatMap((d) => [d.positive, d.negative]);
  const yScale = scaleLinear<number>()
    .range([yMax, 0])
    .domain([Math.min(...allValues) - 10, Math.max(...allValues) + 10]);

  const zeroY = yScale(0);

  return (
    <div class="group relative">
      <div class="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-red-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div class="relative bg-card border-2 border-muted rounded-2xl p-6 shadow-xl overflow-hidden transition-all duration-300 hover:border-emerald-500/30">
        <div class="flex items-center gap-3 mb-6">
          <div class="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-red-500/20">
            <span class="text-2xl">⚖️</span>
          </div>
          <div>
            <h2 class="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-red-600 bg-clip-text text-transparent">正负条形图</h2>
            <p class="text-xs text-muted-foreground">Diverging Bar - 正负对比分析</p>
          </div>
        </div>
        <div class="flex justify-center overflow-x-auto w-full">
          <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} class="max-w-full h-auto">
            <rect width={width} height={height} fill="#f8fafc" rx={14} />
            <Group top={margin.top} left={margin.left}>
              <GridRows scale={yScale} width={xMax} stroke="#e2e8f0" />
              <line x1={0} y1={zeroY} x2={xMax} y2={zeroY} stroke="#94a3b8" stroke-width={2} />
              <AxisBottom scale={xScale} top={yMax} />
              <AxisLeft scale={yScale} />
              <For each={negativeData}>
                {(d) => {
                  const x = xScale(d.label) ?? 0;
                  const barWidth = xScale.bandwidth() / 2 - 2;
                  return (
                    <g>
                      <Bar x={x} y={yScale(d.positive)} width={barWidth} height={zeroY - yScale(d.positive)} fill="#22c55e" rx={4} class="transition-all duration-300 hover:opacity-80 cursor-pointer" />
                      <Bar x={x + barWidth + 4} y={zeroY} width={barWidth} height={yScale(d.negative) - zeroY} fill="#ef4444" rx={4} class="transition-all duration-300 hover:opacity-80 cursor-pointer" />
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
