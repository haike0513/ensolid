import type { Component } from "solid-js";
import { For, createMemo } from "solid-js";
import { Group } from "@ensolid/visx";
import { scaleLinear, scaleBand } from "d3-scale";
import { area, curveMonotoneX } from "d3-shape";

interface DataPoint {
  x: number;
  y: number;
}

interface Series {
  name: string;
  data: DataPoint[];
}

const generateData = () => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"];
  return months.map((month, i) => {
    // Generate bell-curve like data with some randomness
    const points: DataPoint[] = [];
    for (let j = 0; j <= 20; j++) {
      const x = j;
      // Gaussian function: a * exp(-(x-b)^2 / (2c^2))
      // Shift peak slightly for each month
      const center = 8 + Math.random() * 4;
      const width = 2 + Math.random();
      const height = 0.5 + Math.random() * 0.5;
      
      const y = height * Math.exp(-Math.pow(x - center, 2) / (2 * width * width));
      points.push({ x, y });
    }
    return { name: month, data: points };
  });
};

export const RidgelineChart: Component = () => {
  const width = 600;
  const height = 400;
  const margin = { top: 40, right: 20, bottom: 30, left: 50 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const data = createMemo(() => generateData());

  // Scales
  const xScale = scaleLinear()
    .domain([0, 20])
    .range([0, innerWidth]);

  const yScale = scaleBand()
    .domain(data().map((d) => d.name))
    .range([0, innerHeight])
    .paddingInner(0.2); // Not fully used for overlap, handled manually

  // Overlap height
  const rowHeight = scaleLinear().domain([0, 1]).range([0, 80]); // Max height of one curve

  const areaGenerator = area<DataPoint>()
    .x((d) => xScale(d.x))
    .y0(rowHeight(0))
    .y1((d) => rowHeight(0) - rowHeight(d.y)) // Draw upwards from baseline
    .curve(curveMonotoneX);

  return (
    <div class="group relative">
      <div class="absolute -inset-1 bg-gradient-to-r from-violet-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div class="relative bg-card border-2 border-muted rounded-2xl p-6 shadow-xl overflow-hidden transition-all duration-300 hover:border-violet-500/30">
        <div class="flex items-center gap-3 mb-6">
          <div class="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20">
            <span class="text-2xl">🏔️</span>
          </div>
          <div>
            <h2 class="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              山脊图
            </h2>
            <p class="text-xs text-muted-foreground">
              Ridgeline Plot - 多层级分布趋势
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
              <For each={data()}>
                {(series, i) => (
                  <g transform={`translate(0, ${yScale(series.name)!})`}>
                    {/* Area fill */}
                    <path
                      d={areaGenerator(series.data) || ""}
                      fill="url(#ridgelineGradient)"
                      fill-opacity={0.8}
                      stroke="currentColor"
                      stroke-width={1.5}
                      class="text-violet-500 transition-all duration-300 hover:fill-violet-400/80 hover:stroke-violet-600 z-10 hover:z-20 relative"
                    />
                    {/* Label */}
                    <text
                      x={-10}
                      y={rowHeight(0)}
                      text-anchor="end"
                      alignment-baseline="middle"
                      font-size="10px"
                      class="fill-muted-foreground"
                    >
                      {series.name}
                    </text>
                  </g>
                )}
              </For>
            </Group>
             <defs>
               <linearGradient id="ridgelineGradient" x1="0" y1="0" x2="0" y2="1">
                 <stop offset="0%" stop-color="currentColor" stop-opacity="0.6" class="text-violet-400" />
                 <stop offset="100%" stop-color="currentColor" stop-opacity="0.1" class="text-violet-400" />
               </linearGradient>
             </defs>
          </svg>
        </div>
      </div>
    </div>
  );
};
