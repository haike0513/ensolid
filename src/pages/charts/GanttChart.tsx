import type { Component } from "solid-js";
import { For } from "solid-js";
import { Group, Text, scaleBand, scaleTime } from "@ensolid/visx";

const ganttData = [
  { task: "Research", start: new Date(2024, 0, 1), end: new Date(2024, 0, 5), color: "#6366f1" },
  { task: "Design", start: new Date(2024, 0, 5), end: new Date(2024, 0, 12), color: "#8b5cf6" },
  { task: "Development", start: new Date(2024, 0, 10), end: new Date(2024, 1, 5), color: "#a855f7" },
  { task: "Testing", start: new Date(2024, 1, 1), end: new Date(2024, 1, 15), color: "#d946ef" },
  { task: "Deployment", start: new Date(2024, 1, 15), end: new Date(2024, 1, 20), color: "#ec4899" },
];

export const GanttChart: Component = () => {
  const width = 600;
  const height = 400;
  const margin = { top: 40, right: 30, bottom: 40, left: 100 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const yScale = scaleBand<string>()
    .domain(ganttData.map(d => d.task))
    .range([0, innerHeight])
    .padding(0.3);

  const minDate = new Date(Math.min(...ganttData.map(d => d.start.getTime())));
  const maxDate = new Date(Math.max(...ganttData.map(d => d.end.getTime())));

  const xScale = scaleTime()
    .domain([minDate, maxDate])
    .range([0, innerWidth]);

  return (
    <div class="group relative">
      <div class="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
      </div>
      <div class="relative bg-card border-2 border-muted rounded-2xl p-6 shadow-xl overflow-hidden transition-all duration-300 hover:border-blue-500/30">
        <div class="flex items-center gap-3 mb-6">
          <div class="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20">
            <span class="text-2xl">📅</span>
          </div>
          <div>
            <h2 class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              甘特图
            </h2>
            <p class="text-xs text-muted-foreground">
              Gantt Chart - 项目进度管理
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
              {/* 网格线 */}
              <For each={xScale.ticks(5)}>
                {(tick) => (
                  <g transform={`translate(${xScale(tick)}, 0)`}>
                    <line y2={innerHeight} stroke="#e2e8f0" stroke-dasharray="2 2" />
                    <Text y={innerHeight + 20} textAnchor="middle" font-size="10px" fill="#94a3b8">
                      {tick.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </Text>
                  </g>
                )}
              </For>

              {/* 任务条 */}
              <For each={ganttData}>
                {(d) => (
                  <g transform={`translate(0, ${yScale(d.task)})`}>
                    <rect
                      x={xScale(d.start)}
                      width={xScale(d.end) - xScale(d.start)}
                      height={yScale.bandwidth()}
                      fill={d.color}
                      rx={4}
                      fill-opacity={0.8}
                      class="transition-all duration-300 hover:fill-opacity-100 cursor-pointer"
                    />
                    <Text
                      x={-10}
                      y={yScale.bandwidth() / 2}
                      textAnchor="end"
                      verticalAnchor="middle"
                      font-size="12px"
                      font-weight="bold"
                      fill="#475569"
                    >
                      {d.task}
                    </Text>
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
