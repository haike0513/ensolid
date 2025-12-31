import type { Component } from "solid-js";
import { For } from "solid-js";
import { AxisBottom, AxisLeft, GridRows, Group, scaleBand, scaleLinear, Bar, min, max } from "@ensolid/visx";

const boxPlotData = [
  { label: "Group A", min: 10, q1: 30, median: 50, q3: 70, max: 90 },
  { label: "Group B", min: 20, q1: 40, median: 60, q3: 80, max: 100 },
  { label: "Group C", min: 0, q1: 20, median: 40, q3: 60, max: 80 },
  { label: "Group D", min: 15, q1: 35, median: 55, q3: 75, max: 95 },
];

export const BoxPlot: Component = () => {
  const width = 600;
  const height = 400;
  const margin = { top: 40, right: 30, bottom: 50, left: 50 };
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  const xScale = scaleBand<string>()
    .range([0, xMax])
    .domain(boxPlotData.map((d) => d.label))
    .padding(0.4);

  const yScale = scaleLinear<number>()
    .range([yMax, 0])
    .domain([0, 110]);

  return (
    <div class="group relative">
      <div class="absolute -inset-1 bg-gradient-to-r from-orange-500/20 to-amber-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div class="relative bg-card border-2 border-muted rounded-2xl p-6 shadow-xl overflow-hidden transition-all duration-300 hover:border-orange-500/30">
        <div class="flex items-center gap-3 mb-6">
          <div class="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500/20 to-amber-500/20">
            <span class="text-2xl">📦</span>
          </div>
          <div>
            <h2 class="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
              箱线图
            </h2>
            <p class="text-xs text-muted-foreground">Box Plot - 数据分布统计</p>
          </div>
        </div>
        <div class="flex justify-center overflow-x-auto w-full">
          <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} class="max-w-full h-auto">
            <Group top={margin.top} left={margin.left}>
              <GridRows scale={yScale} width={xMax} stroke="#e2e8f0" />
              <AxisBottom scale={xScale} top={yMax} />
              <AxisLeft scale={yScale} />
              <For each={boxPlotData}>
                {(d) => {
                  const barX = xScale(d.label) ?? 0;
                  const barWidth = xScale.bandwidth();
                  const center = barX + barWidth / 2;
                  return (
                    <g class="transition-all duration-300 hover:opacity-80 cursor-pointer">
                      {/* Range Line */}
                      <line
                        x1={center}
                        x2={center}
                        y1={yScale(d.min)}
                        y2={yScale(d.max)}
                        stroke="#f97316"
                        stroke-width={1.5}
                      />
                      <line x1={center - barWidth/3} x2={center + barWidth/3} y1={yScale(d.min)} y2={yScale(d.min)} stroke="#f97316" stroke-width={1.5} />
                      <line x1={center - barWidth/3} x2={center + barWidth/3} y1={yScale(d.max)} y2={yScale(d.max)} stroke="#f97316" stroke-width={1.5} />
                      
                      {/* Box */}
                      <rect
                        x={barX}
                        y={yScale(d.q3)}
                        width={barWidth}
                        height={yScale(d.q1) - yScale(d.q3)}
                        fill="#fdba74"
                        stroke="#f97316"
                        stroke-width={1.5}
                        rx={2}
                      />
                      
                      {/* Median */}
                      <line
                        x1={barX}
                        x2={barX + barWidth}
                        y1={yScale(d.median)}
                        y2={yScale(d.median)}
                        stroke="#c2410c"
                        stroke-width={2}
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
