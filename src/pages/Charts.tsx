/**
 * Charts 页面
 */

import type { Component } from "solid-js";
import { For } from "solid-js";
import {
  Arc,
  arc as d3Arc,
  Area,
  AxisBottom,
  AxisLeft,
  Bar,
  curveMonotoneX,
  extent,
  GridColumns,
  GridRows,
  Group,
  LinePath,
  max,
  Pie,
  scaleBand,
  scaleLinear,
  Text,
} from "@ensolid/visx";

// Mock Data
const barData = [
  { label: "A", value: 10 },
  { label: "B", value: 20 },
  { label: "C", value: 15 },
  { label: "D", value: 30 },
  { label: "E", value: 25 },
  { label: "F", value: 18 },
  { label: "G", value: 22 },
];

const lineData = Array.from({ length: 20 }, (_, i) => ({
  x: i,
  y: Math.sin(i / 3) * 10 + 15 + Math.random() * 5,
}));

const stockData = Array.from({ length: 50 }, (_, i) => ({
  date: new Date(2023, 0, i + 1),
  value: 100 + Math.random() * 50 - 25 + i * 2,
}));

const pieData = [
  { label: "Chrome", usage: 65, color: "#4285F4" },
  { label: "Safari", usage: 20, color: "#34A853" },
  { label: "Firefox", usage: 10, color: "#EA4335" },
  { label: "Edge", usage: 5, color: "#FBBC05" },
];

export const ChartsPage: Component = () => {
  const width = 600;
  const height = 400;
  const margin = { top: 40, right: 30, bottom: 50, left: 50 };
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  // Bar Chart Scales
  const xScaleBar = scaleBand<string>()
    .range([0, xMax])
    .domain(barData.map((d) => d.label))
    .padding(0.4);

  const yScaleBar = scaleLinear<number>()
    .range([yMax, 0])
    .domain([0, max(barData, (d) => d.value) ?? 0]);

  // Line Chart Scales
  const xScaleLine = scaleLinear<number>()
    .range([0, xMax])
    .domain(extent(lineData, (d) => d.x) as [number, number]);

  const yScaleLine = scaleLinear<number>()
    .range([yMax, 0])
    .domain([0, max(lineData, (d) => d.y) ?? 0]);

  // Area Chart Scales
  const xScaleArea = scaleLinear<number>()
    .range([0, xMax])
    .domain(extent(stockData, (d) => d.date.getTime()) as [number, number]);

  const yScaleArea = scaleLinear<number>()
    .range([yMax, 0])
    .domain([0, max(stockData, (d) => d.value) ?? 0]);

  return (
    <div class="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* 顶部标题区域 */}
      <div class="border-b bg-background/50 backdrop-blur-sm">
        <div class="container mx-auto px-4 py-8">
          <div class="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-purple-500/20">
            <span class="text-xl">📊</span>
            <span class="text-xs font-medium bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Data Visualization
            </span>
          </div>
          <h1 class="text-4xl font-bold tracking-tight mb-3 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
            图表画廊
          </h1>
          <p class="text-muted-foreground text-lg">
            基于 @ensolid/visx 的数据可视化组件，支持多种图表类型
          </p>

          {/* 统计信息 */}
          <div class="flex gap-6 mt-6">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500">
              </div>
              <span class="text-sm text-muted-foreground">柱状图</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-500">
              </div>
              <span class="text-sm text-muted-foreground">折线图</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500">
              </div>
              <span class="text-sm text-muted-foreground">面积图</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full bg-gradient-to-r from-orange-500 to-red-500">
              </div>
              <span class="text-sm text-muted-foreground">饼图</span>
            </div>
          </div>
        </div>
      </div>

      <div class="container mx-auto px-4 py-12">
        <div class="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Bar Chart */}
          <div class="group relative">
            <div class="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            </div>
            <div class="relative bg-card border-2 border-muted rounded-2xl p-6 shadow-xl overflow-hidden transition-all duration-300 hover:border-blue-500/30">
              <div class="flex items-center gap-3 mb-6">
                <div class="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20">
                  <span class="text-2xl">📊</span>
                </div>
                <div>
                  <h2 class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    柱状图
                  </h2>
                  <p class="text-xs text-muted-foreground">
                    Bar Chart - 数据对比分析
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
                  <rect width={width} height={height} fill="#f8fafc" rx={14} />
                  <Group top={margin.top} left={margin.left}>
                    <GridRows scale={yScaleBar} width={xMax} stroke="#e2e8f0" />
                    <AxisBottom scale={xScaleBar} top={yMax} />
                    <AxisLeft scale={yScaleBar} />
                    <For each={barData}>
                      {(d) => {
                        const barHeight = yMax - (yScaleBar(d.value) ?? 0);
                        return (
                          <Bar
                            class="transition-all duration-300 hover:opacity-80 cursor-pointer"
                            x={xScaleBar(d.label)}
                            y={yMax - barHeight}
                            width={xScaleBar.bandwidth()}
                            height={barHeight}
                            fill="#3b82f6"
                            rx={4}
                          />
                        );
                      }}
                    </For>
                  </Group>
                </svg>
              </div>
            </div>
          </div>

          {/* Line Chart */}
          <div class="group relative">
            <div class="absolute -inset-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            </div>
            <div class="relative bg-card border-2 border-muted rounded-2xl p-6 shadow-xl overflow-hidden transition-all duration-300 hover:border-green-500/30">
              <div class="flex items-center gap-3 mb-6">
                <div class="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20">
                  <span class="text-2xl">📈</span>
                </div>
                <div>
                  <h2 class="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    折线图
                  </h2>
                  <p class="text-xs text-muted-foreground">
                    Line Chart - 趋势变化分析
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
                    <GridRows
                      scale={yScaleLine}
                      width={xMax}
                      stroke="#e2e8f0"
                    />
                    <GridColumns
                      scale={xScaleLine}
                      height={yMax}
                      stroke="#e2e8f0"
                    />
                    <AxisBottom
                      scale={xScaleLine}
                      top={yMax}
                      tickFormat={(d: any) => `T${d}`}
                    />
                    <AxisLeft scale={yScaleLine} />
                    <LinePath
                      data={lineData}
                      x={(d: { x: number; y: number }) => xScaleLine(d.x) ?? 0}
                      y={(d: { x: number; y: number }) => yScaleLine(d.y) ?? 0}
                      stroke="#10b981"
                      stroke-width={3}
                      curve={curveMonotoneX}
                    />
                    <For each={lineData}>
                      {(d) => (
                        <circle
                          cx={xScaleLine(d.x)}
                          cy={yScaleLine(d.y)}
                          r={4}
                          fill="#ffffff"
                          stroke="#10b981"
                          stroke-width={2}
                          class="transition-all duration-200 hover:r-6 hover:fill-emerald-100"
                        />
                      )}
                    </For>
                  </Group>
                </svg>
              </div>
            </div>
          </div>

          {/* Area Chart */}
          <div class="group relative">
            <div class="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            </div>
            <div class="relative bg-card border-2 border-muted rounded-2xl p-6 shadow-xl overflow-hidden transition-all duration-300 hover:border-purple-500/30">
              <div class="flex items-center gap-3 mb-6">
                <div class="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                  <span class="text-2xl">📉</span>
                </div>
                <div>
                  <h2 class="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    面积图
                  </h2>
                  <p class="text-xs text-muted-foreground">
                    Area Chart - 数据范围展示
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
                    <GridRows
                      scale={yScaleArea}
                      width={xMax}
                      stroke="#e2e8f0"
                    />
                    <AxisBottom
                      scale={xScaleArea}
                      top={yMax}
                      numTicks={5}
                      tickFormat={(d: any) => new Date(d).toLocaleDateString()}
                    />
                    <AxisLeft scale={yScaleArea} />
                    <Area
                      data={stockData}
                      x={(d: any) => xScaleArea(d.date.getTime()) ?? 0}
                      y0={() => yScaleArea(0) ?? yMax}
                      y1={(d: any) => yScaleArea(d.value) ?? 0}
                      fill="#8b5cf6"
                      fill-opacity={0.4}
                      curve={curveMonotoneX}
                    />
                    <LinePath
                      data={stockData}
                      x={(d: any) => xScaleArea(d.date.getTime()) ?? 0}
                      y={(d: any) => yScaleArea(d.value) ?? 0}
                      stroke="#8b5cf6"
                      stroke-width={2}
                      curve={curveMonotoneX}
                    />
                  </Group>
                </svg>
              </div>
            </div>
          </div>

          {/* Pie Chart */}
          <div class="group relative">
            <div class="absolute -inset-1 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            </div>
            <div class="relative bg-card border-2 border-muted rounded-2xl p-6 shadow-xl overflow-hidden transition-all duration-300 hover:border-orange-500/30">
              <div class="flex items-center gap-3 mb-6">
                <div class="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20">
                  <span class="text-2xl">🥧</span>
                </div>
                <div>
                  <h2 class="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                    饼图
                  </h2>
                  <p class="text-xs text-muted-foreground">
                    Pie Chart - 占比分析
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
                  <Group top={height / 2} left={width / 2}>
                    <Pie data={pieData} value={(d) => d.usage} padAngle={0.02}>
                      {(arcs) => (
                        <Group>
                          <For each={arcs}>
                            {(arcDatum) => (
                              <g>
                                <Arc
                                  data={arcDatum}
                                  innerRadius={100}
                                  outerRadius={180}
                                  cornerRadius={4}
                                  fill={arcDatum.data.color}
                                  class="transition-all duration-300 hover:opacity-80"
                                />
                                <Text
                                  transform={`translate(${
                                    d3Arc()
                                      .innerRadius(100)
                                      .outerRadius(180)
                                      .centroid(arcDatum as any)
                                  })`}
                                  textAnchor="middle"
                                  verticalAnchor="middle"
                                  fill="white"
                                  font-size="12px"
                                  font-weight="bold"
                                  pointer-events="none"
                                >
                                  {arcDatum.data.label}
                                </Text>
                              </g>
                            )}
                          </For>
                        </Group>
                      )}
                    </Pie>
                  </Group>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
