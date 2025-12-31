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
  curveLinear,
  extent,
  GridColumns,
  GridRows,
  Group,
  LinePath,
  max,
  min,
  Pie,
  scaleBand,
  scaleLinear,
  scaleOrdinal,
  scaleSqrt,
  stack,
  sum,
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

// Scatter Plot Data
const scatterData = Array.from({ length: 50 }, (_, i) => ({
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 20 + 5,
}));

// Stacked Bar Chart Data
const stackedBarData = [
  { category: "Q1", productA: 20, productB: 15, productC: 10 },
  { category: "Q2", productA: 25, productB: 18, productC: 12 },
  { category: "Q3", productA: 30, productB: 22, productC: 15 },
  { category: "Q4", productA: 35, productB: 25, productC: 18 },
];

// Multi-line Chart Data
const multiLineData = Array.from({ length: 12 }, (_, i) => ({
  month: i + 1,
  sales: 50 + Math.random() * 30 + i * 2,
  revenue: 30 + Math.random() * 20 + i * 1.5,
  profit: 20 + Math.random() * 15 + i * 1,
}));

// Bubble Chart Data
const bubbleData = Array.from({ length: 30 }, (_, i) => ({
  x: Math.random() * 100,
  y: Math.random() * 100,
  value: Math.random() * 1000 + 100,
  category: ["A", "B", "C"][Math.floor(Math.random() * 3)],
}));

// Stacked Area Chart Data
const stackedAreaData = Array.from({ length: 20 }, (_, i) => ({
  date: i,
  series1: 20 + Math.random() * 10 + i,
  series2: 15 + Math.random() * 8 + i * 0.8,
  series3: 10 + Math.random() * 5 + i * 0.5,
}));

// Histogram Data
const histogramData = Array.from({ length: 100 }, () => Math.random() * 100);

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

  // Scatter Plot Scales
  const xScaleScatter = scaleLinear<number>()
    .range([0, xMax])
    .domain([0, max(scatterData, (d) => d.x) ?? 100]);

  const yScaleScatter = scaleLinear<number>()
    .range([yMax, 0])
    .domain([0, max(scatterData, (d) => d.y) ?? 100]);

  const sizeScaleScatter = scaleSqrt<number>()
    .range([4, 20])
    .domain([min(scatterData, (d) => d.size) ?? 5, max(scatterData, (d) => d.size) ?? 25]);

  // Stacked Bar Chart Scales
  const stackKeys = ["productA", "productB", "productC"];
  const stackColors = ["#3b82f6", "#10b981", "#f59e0b"];
  const stackedData = stack()
    .keys(stackKeys)
    .value((d: any, key: string) => d[key])(stackedBarData as any);

  const xScaleStacked = scaleBand<string>()
    .range([0, xMax])
    .domain(stackedBarData.map((d) => d.category))
    .padding(0.4);

  const yScaleStacked = scaleLinear<number>()
    .range([yMax, 0])
    .domain([0, max(stackedData, (d) => sum(d, (item: any) => item[1])) ?? 0]);

  // Multi-line Chart Scales
  const xScaleMultiLine = scaleLinear<number>()
    .range([0, xMax])
    .domain(extent(multiLineData, (d) => d.month) as [number, number]);

  const yScaleMultiLine = scaleLinear<number>()
    .range([yMax, 0])
    .domain([
      0,
      max(multiLineData, (d) => Math.max(d.sales, d.revenue, d.profit)) ?? 100,
    ]);

  const multiLineColors = ["#3b82f6", "#10b981", "#f59e0b"];

  // Bubble Chart Scales
  const xScaleBubble = scaleLinear<number>()
    .range([0, xMax])
    .domain([0, max(bubbleData, (d) => d.x) ?? 100]);

  const yScaleBubble = scaleLinear<number>()
    .range([yMax, 0])
    .domain([0, max(bubbleData, (d) => d.y) ?? 100]);

  const sizeScaleBubble = scaleSqrt<number>()
    .range([5, 40])
    .domain([min(bubbleData, (d) => d.value) ?? 100, max(bubbleData, (d) => d.value) ?? 1100]);

  const colorScaleBubble = scaleOrdinal<string, string>()
    .domain(["A", "B", "C"])
    .range(["#3b82f6", "#10b981", "#f59e0b"]);

  // Stacked Area Chart Scales
  const areaStackKeys = ["series1", "series2", "series3"];
  const areaStackColors = ["#3b82f6", "#10b981", "#f59e0b"];
  const stackedAreaDataStacked = stack()
    .keys(areaStackKeys)
    .value((d: any, key: string) => d[key])(stackedAreaData as any);

  const xScaleStackedArea = scaleLinear<number>()
    .range([0, xMax])
    .domain(extent(stackedAreaData, (d) => d.date) as [number, number]);

  const yScaleStackedArea = scaleLinear<number>()
    .range([yMax, 0])
    .domain([
      0,
      max(stackedAreaDataStacked, (d) => sum(d, (item: any) => item[1])) ?? 0,
    ]);

  // Histogram Scales
  const bins = 10;
  const binWidth = (max(histogramData) ?? 100 - (min(histogramData) ?? 0)) / bins;
  const histogramBins = Array.from({ length: bins }, (_, i) => {
    const start = (min(histogramData) ?? 0) + i * binWidth;
    const end = start + binWidth;
    return {
      start,
      end,
      count: histogramData.filter((d) => d >= start && d < end).length,
    };
  });

  const xScaleHistogram = scaleBand<number>()
    .range([0, xMax])
    .domain(histogramBins.map((_, i) => i))
    .padding(0.1);

  const yScaleHistogram = scaleLinear<number>()
    .range([yMax, 0])
    .domain([0, max(histogramBins, (d) => d.count) ?? 0]);

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
          <div class="flex flex-wrap gap-6 mt-6">
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
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500">
              </div>
              <span class="text-sm text-muted-foreground">散点图</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500">
              </div>
              <span class="text-sm text-muted-foreground">堆叠柱状图</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500">
              </div>
              <span class="text-sm text-muted-foreground">多系列折线图</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full bg-gradient-to-r from-pink-500 to-rose-500">
              </div>
              <span class="text-sm text-muted-foreground">气泡图</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full bg-gradient-to-r from-violet-500 to-purple-500">
              </div>
              <span class="text-sm text-muted-foreground">堆叠面积图</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500">
              </div>
              <span class="text-sm text-muted-foreground">直方图</span>
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

          {/* Scatter Plot */}
          <div class="group relative">
            <div class="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-blue-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            </div>
            <div class="relative bg-card border-2 border-muted rounded-2xl p-6 shadow-xl overflow-hidden transition-all duration-300 hover:border-indigo-500/30">
              <div class="flex items-center gap-3 mb-6">
                <div class="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-blue-500/20">
                  <span class="text-2xl">🔵</span>
                </div>
                <div>
                  <h2 class="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                    散点图
                  </h2>
                  <p class="text-xs text-muted-foreground">
                    Scatter Plot - 相关性分析
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
                      scale={yScaleScatter}
                      width={xMax}
                      stroke="#e2e8f0"
                    />
                    <GridColumns
                      scale={xScaleScatter}
                      height={yMax}
                      stroke="#e2e8f0"
                    />
                    <AxisBottom scale={xScaleScatter} top={yMax} />
                    <AxisLeft scale={yScaleScatter} />
                    <For each={scatterData}>
                      {(d) => (
                        <circle
                          cx={xScaleScatter(d.x)}
                          cy={yScaleScatter(d.y)}
                          r={sizeScaleScatter(d.size)}
                          fill="#6366f1"
                          fill-opacity={0.6}
                          stroke="#4f46e5"
                          stroke-width={1}
                          class="transition-all duration-200 hover:opacity-100 hover:r-8"
                        />
                      )}
                    </For>
                  </Group>
                </svg>
              </div>
            </div>
          </div>

          {/* Stacked Bar Chart */}
          <div class="group relative">
            <div class="absolute -inset-1 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            </div>
            <div class="relative bg-card border-2 border-muted rounded-2xl p-6 shadow-xl overflow-hidden transition-all duration-300 hover:border-teal-500/30">
              <div class="flex items-center gap-3 mb-6">
                <div class="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500/20 to-cyan-500/20">
                  <span class="text-2xl">📊</span>
                </div>
                <div>
                  <h2 class="text-2xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                    堆叠柱状图
                  </h2>
                  <p class="text-xs text-muted-foreground">
                    Stacked Bar Chart - 多维度对比
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
                      scale={yScaleStacked}
                      width={xMax}
                      stroke="#e2e8f0"
                    />
                    <AxisBottom scale={xScaleStacked} top={yMax} />
                    <AxisLeft scale={yScaleStacked} />
                    <For each={stackedData}>
                      {(series, seriesIndex) => (
                        <For each={series}>
                          {(d: any, itemIndex) => {
                            const y0 = d[0] ?? 0;
                            const y1 = d[1] ?? 0;
                            const barHeight = (yScaleStacked(y0) ?? yMax) - (yScaleStacked(y1) ?? 0);
                            const barY = yScaleStacked(y1) ?? 0;
                            return (
                              <Bar
                                x={xScaleStacked(stackedBarData[itemIndex()]?.category ?? "")}
                                y={barY}
                                width={xScaleStacked.bandwidth()}
                                height={barHeight}
                                fill={stackColors[seriesIndex()]}
                                rx={4}
                                class="transition-all duration-300 hover:opacity-80"
                              />
                            );
                          }}
                        </For>
                      )}
                    </For>
                  </Group>
                </svg>
              </div>
            </div>
          </div>

          {/* Multi-line Chart */}
          <div class="group relative">
            <div class="absolute -inset-1 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            </div>
            <div class="relative bg-card border-2 border-muted rounded-2xl p-6 shadow-xl overflow-hidden transition-all duration-300 hover:border-yellow-500/30">
              <div class="flex items-center gap-3 mb-6">
                <div class="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20">
                  <span class="text-2xl">📈</span>
                </div>
                <div>
                  <h2 class="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                    多系列折线图
                  </h2>
                  <p class="text-xs text-muted-foreground">
                    Multi-line Chart - 多指标趋势
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
                      scale={yScaleMultiLine}
                      width={xMax}
                      stroke="#e2e8f0"
                    />
                    <GridColumns
                      scale={xScaleMultiLine}
                      height={yMax}
                      stroke="#e2e8f0"
                    />
                    <AxisBottom scale={xScaleMultiLine} top={yMax} />
                    <AxisLeft scale={yScaleMultiLine} />
                    <LinePath
                      data={multiLineData}
                      x={(d) => xScaleMultiLine(d.month) ?? 0}
                      y={(d) => yScaleMultiLine(d.sales) ?? 0}
                      stroke={multiLineColors[0]}
                      stroke-width={3}
                      curve={curveMonotoneX}
                    />
                    <LinePath
                      data={multiLineData}
                      x={(d) => xScaleMultiLine(d.month) ?? 0}
                      y={(d) => yScaleMultiLine(d.revenue) ?? 0}
                      stroke={multiLineColors[1]}
                      stroke-width={3}
                      curve={curveMonotoneX}
                    />
                    <LinePath
                      data={multiLineData}
                      x={(d) => xScaleMultiLine(d.month) ?? 0}
                      y={(d) => yScaleMultiLine(d.profit) ?? 0}
                      stroke={multiLineColors[2]}
                      stroke-width={3}
                      curve={curveMonotoneX}
                    />
                  </Group>
                </svg>
              </div>
            </div>
          </div>

          {/* Bubble Chart */}
          <div class="group relative">
            <div class="absolute -inset-1 bg-gradient-to-r from-pink-500/20 to-rose-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            </div>
            <div class="relative bg-card border-2 border-muted rounded-2xl p-6 shadow-xl overflow-hidden transition-all duration-300 hover:border-pink-500/30">
              <div class="flex items-center gap-3 mb-6">
                <div class="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500/20 to-rose-500/20">
                  <span class="text-2xl">🫧</span>
                </div>
                <div>
                  <h2 class="text-2xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                    气泡图
                  </h2>
                  <p class="text-xs text-muted-foreground">
                    Bubble Chart - 三维数据展示
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
                      scale={yScaleBubble}
                      width={xMax}
                      stroke="#e2e8f0"
                    />
                    <GridColumns
                      scale={xScaleBubble}
                      height={yMax}
                      stroke="#e2e8f0"
                    />
                    <AxisBottom scale={xScaleBubble} top={yMax} />
                    <AxisLeft scale={yScaleBubble} />
                    <For each={bubbleData}>
                      {(d) => (
                        <circle
                          cx={xScaleBubble(d.x)}
                          cy={yScaleBubble(d.y)}
                          r={sizeScaleBubble(d.value)}
                          fill={colorScaleBubble(d.category)}
                          fill-opacity={0.6}
                          stroke={colorScaleBubble(d.category)}
                          stroke-width={2}
                          class="transition-all duration-200 hover:opacity-100 hover:r-45"
                        />
                      )}
                    </For>
                  </Group>
                </svg>
              </div>
            </div>
          </div>

          {/* Stacked Area Chart */}
          <div class="group relative">
            <div class="absolute -inset-1 bg-gradient-to-r from-violet-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            </div>
            <div class="relative bg-card border-2 border-muted rounded-2xl p-6 shadow-xl overflow-hidden transition-all duration-300 hover:border-violet-500/30">
              <div class="flex items-center gap-3 mb-6">
                <div class="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20">
                  <span class="text-2xl">📉</span>
                </div>
                <div>
                  <h2 class="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                    堆叠面积图
                  </h2>
                  <p class="text-xs text-muted-foreground">
                    Stacked Area Chart - 累积数据展示
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
                      scale={yScaleStackedArea}
                      width={xMax}
                      stroke="#e2e8f0"
                    />
                    <AxisBottom scale={xScaleStackedArea} top={yMax} />
                    <AxisLeft scale={yScaleStackedArea} />
                    <For each={stackedAreaDataStacked}>
                      {(series, seriesIndex) => {
                        return (
                          <Area
                            data={series}
                            x={(d: any, i: number) => {
                              return xScaleStackedArea(stackedAreaData[i]?.date ?? 0) ?? 0;
                            }}
                            y0={(d: any) => yScaleStackedArea(d[0] ?? 0) ?? yMax}
                            y1={(d: any) => yScaleStackedArea(d[1] ?? 0) ?? 0}
                            fill={areaStackColors[seriesIndex()]}
                            fill-opacity={0.6}
                            curve={curveMonotoneX}
                          />
                        );
                      }}
                    </For>
                  </Group>
                </svg>
              </div>
            </div>
          </div>

          {/* Histogram */}
          <div class="group relative">
            <div class="absolute -inset-1 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            </div>
            <div class="relative bg-card border-2 border-muted rounded-2xl p-6 shadow-xl overflow-hidden transition-all duration-300 hover:border-amber-500/30">
              <div class="flex items-center gap-3 mb-6">
                <div class="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-yellow-500/20">
                  <span class="text-2xl">📊</span>
                </div>
                <div>
                  <h2 class="text-2xl font-bold bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
                    直方图
                  </h2>
                  <p class="text-xs text-muted-foreground">
                    Histogram - 数据分布分析
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
                      scale={yScaleHistogram}
                      width={xMax}
                      stroke="#e2e8f0"
                    />
                    <AxisBottom scale={xScaleHistogram} top={yMax} />
                    <AxisLeft scale={yScaleHistogram} />
                    <For each={histogramBins}>
                      {(bin, i) => {
                        const barHeight = yMax - (yScaleHistogram(bin.count) ?? 0);
                        return (
                          <Bar
                            x={xScaleHistogram(i())}
                            y={yMax - barHeight}
                            width={xScaleHistogram.bandwidth()}
                            height={barHeight}
                            fill="#f59e0b"
                            rx={4}
                            class="transition-all duration-300 hover:opacity-80"
                          />
                        );
                      }}
                    </For>
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
