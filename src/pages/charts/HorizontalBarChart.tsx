import type { Component } from "solid-js";
import { For } from "solid-js";
import { AxisBottom, AxisLeft, GridRows, Group, Bar, Text } from "@ensolid/visx";
import { scaleBand, scaleLinear } from "d3-scale";

const horizontalData = [
  { label: "JavaScript", value: 92 },
  { label: "Python", value: 85 },
  { label: "Java", value: 78 },
  { label: "TypeScript", value: 72 },
  { label: "C++", value: 65 },
  { label: "Go", value: 58 },
  { label: "Rust", value: 45 },
];

export const HorizontalBarChart: Component = () => {
  const width = 600;
  const height = 400;
  const margin = { top: 40, right: 60, bottom: 40, left: 100 };
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  const yScale = scaleBand<string>()
    .range([0, yMax])
    .domain(horizontalData.map((d) => d.label))
    .padding(0.3);

  const xScale = scaleLinear<number>()
    .range([0, xMax])
    .domain([0, 100]);

  const colors = ["#6366f1", "#8b5cf6", "#a855f7", "#d946ef", "#ec4899", "#f43f5e", "#fb7185"];

  return (
    <div class="group relative">
      <div class="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-pink-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div class="relative bg-card border-2 border-muted rounded-2xl p-6 shadow-xl overflow-hidden transition-all duration-300 hover:border-indigo-500/30">
        <div class="flex items-center gap-3 mb-6">
          <div class="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-pink-500/20">
            <span class="text-2xl">📊</span>
          </div>
          <div>
            <h2 class="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">横向柱状图</h2>
            <p class="text-xs text-muted-foreground">Horizontal Bar - 排名展示</p>
          </div>
        </div>
        <div class="flex justify-center overflow-x-auto w-full">
          <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} class="max-w-full h-auto">
            <rect width={width} height={height} fill="#f8fafc" rx={14} />
            <Group top={margin.top} left={margin.left}>
              <GridRows scale={yScale} width={xMax} stroke="#e2e8f0" />
              <AxisLeft scale={yScale} hideTicks tickLabelProps={() => ({ fill: '#475569', fontSize: 12, fontWeight: 'bold' })} />
              <For each={horizontalData}>
                {(d, i) => (
                  <g>
                    <Bar y={yScale(d.label)} x={0} height={yScale.bandwidth()} width={xScale(d.value)} fill={colors[i() % colors.length]} rx={4} class="transition-all duration-300 hover:opacity-80 cursor-pointer" />
                    <Text x={xScale(d.value) + 8} y={(yScale(d.label) ?? 0) + yScale.bandwidth() / 2} verticalAnchor="middle" fill="#64748b" font-size="12px" font-weight="bold">{`${d.value}%`}</Text>
                  </g>
                )}
              </For>
            </Group>
          </svg>
        </div>
      </div>
    </div>
  );
};
