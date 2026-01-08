import type { Component } from "solid-js";
import { For, createMemo } from "solid-js";
import { Group } from "@ensolid/visx";
import { scaleLinear, scaleBand } from "d3-scale";
import { area, curveCatmullRom } from "d3-shape";

// --- Kernel Density Estimation Helper ---
function kernelDensityEstimator(kernel: (v: number) => number, X: number[]) {
  return function (V: number[]) {
    return X.map(function (x) {
      return [
        x,
        d3Mean(V, function (v) {
          return kernel(x - v);
        }),
      ];
    });
  };
}
function kernelEpanechnikov(k: number) {
  return function (v: number) {
    return Math.abs((v /= k)) <= 1 ? (0.75 * (1 - v * v)) / k : 0;
  };
}
function d3Mean(array: number[], accessor: (v: number) => number) {
  let sum = 0;
  let count = 0;
  for (const element of array) {
    const value = accessor(element);
    if (value !== undefined && value !== null && !isNaN(value)) {
      sum += value;
      count++;
    }
  }
  return sum / count;
}
// ----------------------------------------

const categories = ["Species A", "Species B", "Species C"];
const rawData = {
  "Species A": [10, 12, 15, 14, 13, 11, 10, 20, 22, 21, 25, 24, 18, 15, 16],
  "Species B": [20, 25, 22, 28, 30, 35, 32, 25, 20, 15, 18, 22, 28, 32, 30],
  "Species C": [5, 8, 7, 9, 10, 12, 8, 6, 5, 4, 8, 10, 15, 12, 11],
};

export const ViolinPlot: Component = () => {
  const width = 600;
  const height = 400;
  const margin = { top: 40, right: 30, bottom: 40, left: 60 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // Compute KDEs
  const processedData = createMemo(() => {
    const kde = kernelDensityEstimator(
      kernelEpanechnikov(7),
      Array.from({ length: 40 }, (_, i) => i), // 0 to 40 domain
    );
    
    return categories.map((cat) => {
      const values = rawData[cat as keyof typeof rawData];
      const density = kde(values);
      return { category: cat, density };
    });
  });

  const xScale = scaleBand()
    .domain(categories)
    .range([0, innerWidth])
    .padding(0.05);

  const yDomain = [0, 40];
  const yScale = scaleLinear().domain(yDomain).range([innerHeight, 0]);

  // Max width of the violin
  const xNumScale = scaleLinear()
    .domain([
      0,
      Math.max(
        ...processedData().flatMap((d) => d.density.map((p) => p[1] as number)),
      ),
    ])
    .range([0, xScale.bandwidth() / 2]);

  const areaGenerator = area<any[]>()
    .x0((d) => -xNumScale(d[1])) // Left side
    .x1((d) => xNumScale(d[1]))  // Right side
    .y((d) => yScale(d[0]))
    .curve(curveCatmullRom);

  return (
    <div class="group relative">
      <div class="absolute -inset-1 bg-gradient-to-r from-pink-500/20 to-rose-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div class="relative bg-card border-2 border-muted rounded-2xl p-6 shadow-xl overflow-hidden transition-all duration-300 hover:border-pink-500/30">
        <div class="flex items-center gap-3 mb-6">
          <div class="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500/20 to-rose-500/20">
            <span class="text-2xl">🎻</span>
          </div>
          <div>
            <h2 class="text-2xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
              小提琴图
            </h2>
            <p class="text-xs text-muted-foreground">
              Violin Plot - 数据分布密度
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
              {/* Y Axis Grid */}
              <For each={yScale.ticks(5)}>
                {(tick) => (
                  <g transform={`translate(0,${yScale(tick)})`}>
                    <line
                      x2={innerWidth}
                      stroke="currentColor"
                      stroke-opacity="0.1"
                    />
                    <text
                      x={-10}
                      dy="0.32em"
                      text-anchor="end"
                      font-size="10px"
                      class="fill-muted-foreground"
                    >
                      {tick}
                    </text>
                  </g>
                )}
              </For>

              <For each={processedData()}>
                {(d, i) => (
                  <g transform={`translate(${xScale(d.category)! + xScale.bandwidth() / 2}, 0)`}>
                    <path
                      d={areaGenerator(d.density as any) || ""}
                      fill={i() === 0 ? "#ec4899" : i() === 1 ? "#8b5cf6" : "#f43f5e"}
                      fill-opacity={0.6}
                      stroke={i() === 0 ? "#db2777" : i() === 1 ? "#7c3aed" : "#e11d48"}
                      stroke-width={1.5}
                      class="transition-all duration-300 hover:fill-opacity-80"
                    />
                    <text
                      y={innerHeight + 20}
                      text-anchor="middle"
                      font-size="12px"
                      class="fill-foreground font-medium"
                    >
                      {d.category}
                    </text>
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
