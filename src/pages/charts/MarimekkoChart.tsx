import type { Component } from "solid-js";
import { For, createMemo } from "solid-js";
import { Group } from "@ensolid/visx";
import { scaleLinear, scaleOrdinal } from "d3-scale";

interface Segment {
  label: string;
  value: number;
}

interface Category {
  name: string;
  value: number; // Total value for width
  segments: Segment[];
}

const dataRaw = [
  {
    name: "Q1",
    segments: [
      { label: "Phone", value: 30 },
      { label: "Laptop", value: 40 },
      { label: "Tablet", value: 20 },
    ],
  },
  {
    name: "Q2",
    segments: [
      { label: "Phone", value: 50 },
      { label: "Laptop", value: 20 },
      { label: "Tablet", value: 50 },
    ],
  },
  {
    name: "Q3",
    segments: [
      { label: "Phone", value: 20 },
      { label: "Laptop", value: 60 },
      { label: "Tablet", value: 10 },
    ],
  },
  {
    name: "Q4",
    segments: [
      { label: "Phone", value: 40 },
      { label: "Laptop", value: 30 },
      { label: "Tablet", value: 30 },
    ],
  },
];

export const MarimekkoChart: Component = () => {
  const width = 600;
  const height = 400;
  const margin = { top: 40, right: 30, bottom: 40, left: 40 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // Process data for layout
  const chartData = createMemo(() => {
    let xAccumulator = 0;
    const totalValue = dataRaw.reduce((sum, cat) => {
      const catTotal = cat.segments.reduce((s, seg) => s + seg.value, 0);
      return sum + catTotal;
    }, 0);

    return dataRaw.map((cat) => {
      const catTotal = cat.segments.reduce((s, seg) => s + seg.value, 0);
      const widthRatio = catTotal / totalValue;
      const x = xAccumulator;
      xAccumulator += widthRatio;
      
      let yAccumulator = 0;
      const segments = cat.segments.map(seg => {
        const heightRatio = seg.value / catTotal;
        const y = yAccumulator;
        yAccumulator += heightRatio;
        return {
          ...seg,
          y,
          height: heightRatio
        };
      });

      return {
        ...cat,
        total: catTotal,
        x,
        width: widthRatio,
        segments
      };
    });
  });

  const xScale = scaleLinear().domain([0, 1]).range([0, innerWidth]);
  const yScale = scaleLinear().domain([0, 1]).range([innerHeight, 0]);
  const colorScale = scaleOrdinal<string, string>()
    .domain(["Phone", "Laptop", "Tablet"])
    .range(["#3b82f6", "#10b981", "#f59e0b"]);

  return (
    <div class="group relative">
      <div class="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div class="relative bg-card border-2 border-muted rounded-2xl p-6 shadow-xl overflow-hidden transition-all duration-300 hover:border-blue-500/30">
        <div class="flex items-center gap-3 mb-6">
          <div class="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20">
            <span class="text-2xl">🧱</span>
          </div>
          <div>
            <h2 class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              马赛克图
            </h2>
            <p class="text-xs text-muted-foreground">
              Marimekko Chart - 不等宽堆叠柱状图
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
              <For each={chartData()}>
                {(cat) => (
                  <g transform={`translate(${xScale(cat.x)}, 0)`}>
                    <For each={cat.segments}>
                      {(seg) => (
                        <rect
                          x={0}
                          y={yScale(seg.y + seg.height)}
                          width={xScale(cat.width) - 2} // -2 for gap
                          height={Math.abs(yScale(seg.y) - yScale(seg.y + seg.height)) - 2} // -2 for gap
                          fill={colorScale(seg.label)}
                          rx={2}
                          class="transition-all duration-300 hover:opacity-80 cursor-pointer"
                        >
                          <title>{`${cat.name} - ${seg.label}: ${seg.value}`}</title>
                        </rect>
                      )}
                    </For>
                     <text
                      x={xScale(cat.width) / 2}
                      y={innerHeight + 15}
                      text-anchor="middle"
                      font-size="10px"
                      class="fill-muted-foreground"
                    >
                      {cat.name}
                    </text>
                  </g>
                )}
              </For>
              {/* Y Axis Labels */}
              <For each={[0, 0.25, 0.5, 0.75, 1]}>
                {(tick) => (
                  <text
                    x={-10}
                    y={yScale(tick)}
                    dy="0.32em"
                    text-anchor="end"
                    font-size="10px"
                    class="fill-muted-foreground"
                  >
                    {tick * 100}%
                  </text>
                )}
              </For>
            </Group>
          </svg>
        </div>
      </div>
    </div>
  );
};
