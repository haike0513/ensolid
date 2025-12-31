/**
 * Charts 页面
 */

import type { Component } from "solid-js";
import { AreaChart } from "./charts/AreaChart";
import { BarChart } from "./charts/BarChart";
import { BubbleChart } from "./charts/BubbleChart";
import { CandlestickChart } from "./charts/CandlestickChart";
import { DonutChart } from "./charts/DonutChart";
import { Heatmap } from "./charts/Heatmap";
import { Histogram } from "./charts/Histogram";
import { LineChart } from "./charts/LineChart";
import { MultiLineChart } from "./charts/MultiLineChart";
import { PieChart } from "./charts/PieChart";
import { RadarChart } from "./charts/RadarChart";
import { RadialBarChart } from "./charts/RadialBarChart";
import { ScatterPlot } from "./charts/ScatterPlot";
import { StackedAreaChart } from "./charts/StackedAreaChart";
import { StackedBarChart } from "./charts/StackedBarChart";
import { StepLineChart } from "./charts/StepLineChart";
import { BoxPlot } from "./charts/BoxPlot";

export const ChartsPage: Component = () => {
  return (
    <div class="min-h-screen bg-gradient-to-b from-background via-background to-muted/20 pb-20">
      {/* 顶部标题区域 */}
      <div class="border-b bg-background/50 backdrop-blur-sm sticky top-0 z-10">
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
            基于 @ensolid/visx 的数据可视化组件库展示
          </p>
        </div>
      </div>

      <div class="container mx-auto px-4 py-8 space-y-16">
        
        {/* Group 1: 基础图表 (Basic Charts) */}
        <section>
          <div class="flex items-center gap-4 mb-8">
            <div class="h-10 w-1 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full"></div>
            <div>
              <h2 class="text-2xl font-bold">基础图表</h2>
              <p class="text-muted-foreground">最常用的数据展示形式，适用于大多数场景</p>
            </div>
          </div>
          <div class="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <BarChart />
            <LineChart />
            <AreaChart />
            <PieChart />
            <DonutChart />
          </div>
        </section>

        {/* Group 2: 数据对比 (Comparison) */}
        <section>
          <div class="flex items-center gap-4 mb-8">
            <div class="h-10 w-1 bg-gradient-to-b from-teal-500 to-emerald-500 rounded-full"></div>
            <div>
              <h2 class="text-2xl font-bold">数据对比</h2>
              <p class="text-muted-foreground">用于多维度数据对比和分类展示</p>
            </div>
          </div>
          <div class="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <StackedBarChart />
            <MultiLineChart />
            <RadarChart />
            <RadialBarChart />
          </div>
        </section>

        {/* Group 3: 数据分布 (Distribution) */}
        <section>
          <div class="flex items-center gap-4 mb-8">
            <div class="h-10 w-1 bg-gradient-to-b from-orange-500 to-amber-500 rounded-full"></div>
            <div>
              <h2 class="text-2xl font-bold">数据分布</h2>
              <p class="text-muted-foreground">展示数据的分布情况、离散程度和相关性</p>
            </div>
          </div>
          <div class="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <Histogram />
            <BoxPlot />
            <ScatterPlot />
            <BubbleChart />
            <Heatmap />
          </div>
        </section>

        {/* Group 4: 趋势分析 (Trend Analysis) */}
        <section>
          <div class="flex items-center gap-4 mb-8">
            <div class="h-10 w-1 bg-gradient-to-b from-violet-500 to-purple-500 rounded-full"></div>
            <div>
              <h2 class="text-2xl font-bold">趋势分析</h2>
              <p class="text-muted-foreground">展示数据的累积变化和趋势走向</p>
            </div>
          </div>
          <div class="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <StackedAreaChart />
            <StepLineChart />
            <CandlestickChart />
          </div>
        </section>

      </div>
    </div>
  );
};
