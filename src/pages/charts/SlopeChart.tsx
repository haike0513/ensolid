import type { Component } from "solid-js";
import { For, createMemo } from "solid-js";
import { Group, Line, AxisBottom, AxisLeft, Text } from "@ensolid/visx";
import { scaleLinear, scalePoint } from "d3-scale";

const data = [
  { country: "Norway", y2010: 80, y2020: 85 },
  { country: "Sweden", y2010: 75, y2020: 82 },
  { country: "Denmark", y2010: 78, y2020: 80 },
  { country: "Finland", y2010: 72, y2020: 79 },
  { country: "Iceland", y2010: 70, y2020: 76 },
  { country: "Germany", y2010: 65, y2020: 68 },
];

export const SlopeChart: Component = () => {
  const width = 600;
  const height = 400;
  const margin = { top: 40, right: 100, bottom: 40, left: 100 };
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  const years = ["2010", "2020"];

  const xScale = scalePoint()
    .domain(years)
    .range([0, xMax])
    .padding(0.1);

  const yScale = scaleLinear()
    .domain([60, 90])
    .range([yMax, 0]);

  return (
    <div class="group relative">
      <div class="absolute -inset-1 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div class="relative bg-card border-2 border-muted rounded-2xl p-6 shadow-xl overflow-hidden transition-all duration-300 hover:border-orange-500/30">
        <div class="flex items-center gap-3 mb-6">
          <div class="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20">
            <span class="text-2xl">📈</span>
          </div>
          <div>
            <h2 class="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              斜率图
            </h2>
            <p class="text-xs text-muted-foreground">
              Slope Chart - 两个时间点对比
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
              {/* Vertical Axes for both years */}
              <line x1={0} y1={0} x2={0} y2={yMax} stroke="#e2e8f0" />
              <line x1={xMax} y1={0} x2={xMax} y2={yMax} stroke="#e2e8f0" />
              
              {/* Year Labels */}
              <Text x={0} y={yMax + 20} textAnchor="middle" font-size="14" fill="#64748b">2010</Text>
              <Text x={xMax} y={yMax + 20} textAnchor="middle" font-size="14" fill="#64748b">2020</Text>

              <For each={data}>
                {(d) => (
                  <g class="transition-opacity hover:opacity-80">
                    <Line
                      from={{ x: 0, y: yScale(d.y2010) }}
                      to={{ x: xMax, y: yScale(d.y2020) }}
                      stroke={d.y2020 > d.y2010 ? "#22c55e" : "#ef4444"}
                      stroke-width={2}
                    />
                    <circle cx={0} cy={yScale(d.y2010)} r={4} fill="#fff" stroke={d.y2020 > d.y2010 ? "#22c55e" : "#ef4444"} stroke-width={2} />
                    <circle cx={xMax} cy={yScale(d.y2020)} r={4} fill="#fff" stroke={d.y2020 > d.y2010 ? "#22c55e" : "#ef4444"} stroke-width={2} />
                    
                    {/* Labels */}
                    <Text x={-10} y={yScale(d.y2010)} dy={4} textAnchor="end" font-size="12" fill="#64748b">{`${d.country} ${d.y2010}`}</Text>
                    <Text x={xMax + 10} y={yScale(d.y2020)} dy={4} textAnchor="start" font-size="12" fill="#64748b">{`${d.y2020}`}</Text>
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
