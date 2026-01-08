import type { Component } from "solid-js";
import { For, createMemo } from "solid-js";
import { Group } from "@ensolid/visx";
import { scaleLinear, scaleBand } from "d3-scale";

const data = [
  { country: "China", prev: 65, current: 85 },
  { country: "USA", prev: 70, current: 75 },
  { country: "India", prev: 40, current: 60 },
  { country: "Japan", prev: 80, current: 82 },
  { country: "Germany", prev: 60, current: 55 },
  { country: "UK", prev: 55, current: 65 },
];

export const DumbbellChart: Component = () => {
  const width = 600;
  const height = 400;
  const margin = { top: 40, right: 30, bottom: 40, left: 60 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const yScale = scaleBand()
    .domain(data.map((d) => d.country))
    .range([0, innerHeight])
    .padding(0.4);

  const xScale = scaleLinear()
    .domain([0, 100])
    .range([0, innerWidth]);

  return (
    <div class="group relative">
      <div class="absolute -inset-1 bg-gradient-to-r from-orange-500/20 to-amber-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div class="relative bg-card border-2 border-muted rounded-2xl p-6 shadow-xl overflow-hidden transition-all duration-300 hover:border-orange-500/30">
        <div class="flex items-center gap-3 mb-6">
          <div class="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500/20 to-amber-500/20">
            <span class="text-2xl">🏋️</span>
          </div>
          <div>
            <h2 class="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
              哑铃图
            </h2>
            <p class="text-xs text-muted-foreground">
              Dumbbell Chart - 前后对比分析
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
            <Group left={margin.left} top={margin.top}>
              {/* X Axis Grid */}
              <For each={xScale.ticks(5)}>
                {(tick) => (
                  <g transform={`translate(${xScale(tick)},0)`}>
                    <line y2={innerHeight} stroke="currentColor" stroke-opacity="0.1" />
                    <text
                      y={innerHeight + 15}
                      text-anchor="middle"
                      font-size="10px"
                      class="fill-muted-foreground"
                    >
                      {tick}
                    </text>
                  </g>
                )}
              </For>

              <For each={data}>
                {(d) => {
                  const y = yScale(d.country)! + yScale.bandwidth() / 2;
                  const x1 = xScale(d.prev);
                  const x2 = xScale(d.current);
                  const color = d.current > d.prev ? "#10b981" : "#ef4444"; // Green up, Red down

                  return (
                    <g class="transition-all duration-300 hover:opacity-80">
                       <text
                        x={-10}
                        y={y}
                        dy="0.32em"
                        text-anchor="end"
                        font-size="12px"
                        class="fill-foreground font-medium"
                      >
                        {d.country}
                      </text>
                      {/* Connecting Line */}
                      <line
                        x1={x1}
                        x2={x2}
                        y1={y}
                        y2={y}
                        stroke="#94a3b8"
                        stroke-width={2}
                        stroke-linecap="round"
                      />
                      {/* Prev Dot */}
                      <circle
                        cx={x1}
                        cy={y}
                        r={6}
                        fill="#cbd5e1"
                      />
                      {/* Current Dot */}
                      <circle
                        cx={x2}
                        cy={y}
                        r={6}
                        fill={color}
                      />
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
