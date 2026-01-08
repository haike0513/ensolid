import type { Component } from "solid-js";
import { For, createMemo } from "solid-js";
import { Group } from "@ensolid/visx";
import { scaleLinear, scalePoint } from "d3-scale";
import { line, curveBumpX } from "d3-shape";

// Data: Rankings of teams over 5 years
const years = [2020, 2021, 2022, 2023, 2024];
const teams = [
  { name: "Team A", ranks: [1, 2, 1, 3, 1], color: "#3b82f6" },
  { name: "Team B", ranks: [2, 1, 3, 1, 2], color: "#10b981" },
  { name: "Team C", ranks: [3, 4, 2, 4, 3], color: "#f59e0b" },
  { name: "Team D", ranks: [4, 3, 4, 2, 5], color: "#ef4444" },
  { name: "Team E", ranks: [5, 5, 5, 5, 4], color: "#8b5cf6" },
];

export const BumpChart: Component = () => {
  const width = 600;
  const height = 400;
  const margin = { top: 40, right: 100, bottom: 40, left: 40 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // Scales
  const xScale = scalePoint<number>()
    .domain(years)
    .range([0, innerWidth])
    .padding(0.1);

  const yScale = scaleLinear()
    .domain([1, 5]) // Ranks 1 to 5
    .range([0, innerHeight]);

  // Generators
  const lineGenerator = line<number>()
    .x((d, i) => xScale(years[i])!)
    .y((d) => yScale(d))
    .curve(curveBumpX); // The magic curve for bump charts

  return (
    <div class="group relative">
      <div class="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div class="relative bg-card border-2 border-muted rounded-2xl p-6 shadow-xl overflow-hidden transition-all duration-300 hover:border-cyan-500/30">
        <div class="flex items-center gap-3 mb-6">
          <div class="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20">
            <span class="text-2xl">🎢</span>
          </div>
          <div>
            <h2 class="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
              凹凸图
            </h2>
            <p class="text-xs text-muted-foreground">
              Bump Chart - 排名变化展示
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
              {/* Grid Lines (Years) */}
              <For each={years}>
                {(year) => (
                  <g transform={`translate(${xScale(year)},0)`}>
                    <line
                      y2={innerHeight}
                      stroke="currentColor"
                      stroke-opacity="0.1"
                      stroke-dasharray="4"
                    />
                    <text
                      y={innerHeight + 20}
                      text-anchor="middle"
                      font-size="12px"
                      class="fill-muted-foreground"
                    >
                      {year}
                    </text>
                  </g>
                )}
              </For>

               {/* Paths */}
              <For each={teams}>
                {(team) => (
                  <g class="group/line">
                    <path
                      d={lineGenerator(team.ranks) || ""}
                      fill="none"
                      stroke={team.color}
                      stroke-width={4}
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="transition-all duration-300 opacity-80 group-hover/line:opacity-100 group-hover/line:stroke-[6px]"
                    />
                    {/* Start Label */}
                    <text
                      x={xScale(years[0])! - 15}
                      y={yScale(team.ranks[0])!}
                      dy="0.32em"
                      text-anchor="end"
                      font-size="12px"
                      fill={team.color}
                      font-weight="bold"
                    >
                      {team.ranks[0]}
                    </text>
                    {/* End Label */}
                    <text
                      x={xScale(years[years.length - 1])! + 15}
                      y={yScale(team.ranks[team.ranks.length - 1])!}
                      dy="0.32em"
                      text-anchor="start"
                      font-size="12px"
                      fill={team.color}
                      font-weight="bold"
                    >
                      {team.name}
                    </text>
                    
                    {/* Dots */}
                    <For each={team.ranks}>
                      {(rank, i) => (
                         <circle
                           cx={xScale(years[i()])}
                           cy={yScale(rank)}
                           r={4}
                           fill={team.color}
                           class="opacity-0 group-hover/line:opacity-100 transition-opacity"
                         />
                      )}
                    </For>
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
