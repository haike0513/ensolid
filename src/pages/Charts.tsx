/**
 * Charts 页面
 */

import type { Component, JSX } from "solid-js";
import { createSignal, For, Show, createMemo } from "solid-js";
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
// 新增图表
import { FunnelChart } from "./charts/FunnelChart";
import { GaugeChart } from "./charts/GaugeChart";
import { TreemapChart } from "./charts/TreemapChart";
import { SunburstChart } from "./charts/SunburstChart";
import { WaterfallChart } from "./charts/WaterfallChart";
import { PolarBarChart } from "./charts/PolarBarChart";
import { LiquidChart } from "./charts/LiquidChart";
import { ParallelChart } from "./charts/ParallelChart";
import { SankeyChart } from "./charts/SankeyChart";
import { WordCloudChart } from "./charts/WordCloudChart";
import { NegativeBarChart } from "./charts/NegativeBarChart";
import { HorizontalBarChart } from "./charts/HorizontalBarChart";
// 新增 ECharts 移植图表
import { CalendarChart } from "./charts/CalendarChart";
import { PictorialBarChart } from "./charts/PictorialBarChart";
import { TreeChart } from "./charts/TreeChart";
import { ThemeRiverChart } from "./charts/ThemeRiverChart";
import { GanttChart } from "./charts/GanttChart";
import { GraphChart } from "./charts/GraphChart";
import { NightingaleChart } from "./charts/NightingaleChart";
import { DynamicLineChart } from "./charts/DynamicLineChart";
import { MixedChart } from "./charts/MixedChart";
import { PunchCardChart } from "./charts/PunchCardChart";
import { LollipopChart } from "./charts/LollipopChart";
import { CircularPackingChart } from "./charts/CircularPackingChart";
import { RadialTreeChart } from "./charts/RadialTreeChart";
import { BulletChart } from "./charts/BulletChart";
import { GroupedBarChart } from "./charts/GroupedBarChart";
import { StreamGraph } from "./charts/StreamGraph";
import { SlopeChart } from "./charts/SlopeChart";
import { RidgelineChart } from "./charts/RidgelineChart";
import { MarimekkoChart } from "./charts/MarimekkoChart";
import { DumbbellChart } from "./charts/DumbbellChart";
import { BumpChart } from "./charts/BumpChart";
import { ViolinPlot } from "./charts/ViolinPlot";
import { SpiralChart } from "./charts/SpiralChart";
import { WaffleChart } from "./charts/WaffleChart";
import { TernaryPlot } from "./charts/TernaryPlot";
import { ArcDiagram } from "./charts/ArcDiagram";
import { ChordDiagram } from "./charts/ChordDiagram";
import { ForceDirectedGraph } from "./charts/ForceDirectedGraph";
import { EdgeBundlingChart } from "./charts/EdgeBundlingChart";

type ChartCategory = "base" | "comparison" | "distribution" | "trend" | "special" | "relation";

interface ChartItem {
  id: string;
  name: string;
  component: Component;
  category: ChartCategory;
  icon: string;
  description: string;
}

interface CategoryInfo {
  id: ChartCategory;
  name: string;
  icon: string;
  description: string;
  gradient: string;
  borderGradient: string;
}

const getCategories = (t: any): CategoryInfo[] => [
  {
    id: "base",
    name: t().chartsPage.categories.base.name,
    icon: "📊",
    description: t().chartsPage.categories.base.description,
    gradient: "from-blue-500 to-cyan-500",
    borderGradient: "from-blue-500/20 to-cyan-500/20",
  },
  {
    id: "comparison",
    name: t().chartsPage.categories.comparison.name,
    icon: "📈",
    description: t().chartsPage.categories.comparison.description,
    gradient: "from-teal-500 to-emerald-500",
    borderGradient: "from-teal-500/20 to-emerald-500/20",
  },
  {
    id: "distribution",
    name: t().chartsPage.categories.distribution.name,
    icon: "🔬",
    description: t().chartsPage.categories.distribution.description,
    gradient: "from-orange-500 to-amber-500",
    borderGradient: "from-orange-500/20 to-amber-500/20",
  },
  {
    id: "trend",
    name: t().chartsPage.categories.trend.name,
    icon: "📉",
    description: t().chartsPage.categories.trend.description,
    gradient: "from-violet-500 to-purple-500",
    borderGradient: "from-violet-500/20 to-purple-500/20",
  },
  {
    id: "special",
    name: t().chartsPage.categories.special.name,
    icon: "✨",
    description: t().chartsPage.categories.special.description,
    gradient: "from-pink-500 to-rose-500",
    borderGradient: "from-pink-500/20 to-rose-500/20",
  },
  {
    id: "relation",
    name: t().chartsPage.categories.relation.name,
    icon: "🔗",
    description: t().chartsPage.categories.relation.description,
    gradient: "from-indigo-500 to-blue-500",
    borderGradient: "from-indigo-500/20 to-blue-500/20",
  },
];

const getChartItems = (t: any): ChartItem[] => [
  // 基础图表
  {
    id: "bar",
    name: t().charts.bar.name,
    component: BarChart,
    category: "base",
    icon: "📊",
    description: t().charts.bar.description,
  },
  {
    id: "line",
    name: t().charts.line.name,
    component: LineChart,
    category: "base",
    icon: "📈",
    description: t().charts.line.description,
  },
  {
    id: "area",
    name: t().charts.area.name,
    component: AreaChart,
    category: "base",
    icon: "📐",
    description: t().charts.area.description,
  },
  {
    id: "pie",
    name: t().charts.pie.name,
    component: PieChart,
    category: "base",
    icon: "🥧",
    description: t().charts.pie.description,
  },
  {
    id: "donut",
    name: t().charts.donut.name,
    component: DonutChart,
    category: "base",
    icon: "🍩",
    description: t().charts.donut.description,
  },
  {
    id: "horizontal-bar",
    name: t().charts.horizontalBar.name,
    component: HorizontalBarChart,
    category: "base",
    icon: "📊",
    description: t().charts.horizontalBar.description,
  },
  {
    id: "pictorial-bar",
    name: t().charts.pictorialBar.name,
    component: PictorialBarChart,
    category: "base",
    icon: "🎨",
    description: t().charts.pictorialBar.description,
  },
  // 数据对比
  {
    id: "stacked-bar",
    name: t().charts.stackedBar.name,
    component: StackedBarChart,
    category: "comparison",
    icon: "📊",
    description: t().charts.stackedBar.description,
  },
  {
    id: "multi-line",
    name: t().charts.multiLine.name,
    component: MultiLineChart,
    category: "comparison",
    icon: "📉",
    description: t().charts.multiLine.description,
  },
  {
    id: "radar",
    name: t().charts.radar.name,
    component: RadarChart,
    category: "comparison",
    icon: "🎯",
    description: t().charts.radar.description,
  },
  {
    id: "radial-bar",
    name: t().charts.radialBar.name,
    component: RadialBarChart,
    category: "comparison",
    icon: "🌀",
    description: t().charts.radialBar.description,
  },
  {
    id: "negative-bar",
    name: t().charts.negativeBar.name,
    component: NegativeBarChart,
    category: "comparison",
    icon: "⚖️",
    description: t().charts.negativeBar.description,
  },
  {
    id: "polar-bar",
    name: t().charts.polarBar.name,
    component: PolarBarChart,
    category: "comparison",
    icon: "🎡",
    description: t().charts.polarBar.description,
  },
  {
    id: "parallel",
    name: t().charts.parallel.name,
    component: ParallelChart,
    category: "comparison",
    icon: "📏",
    description: t().charts.parallel.description,
  },
  // 数据分布
  {
    id: "histogram",
    name: t().charts.histogram.name,
    component: Histogram,
    category: "distribution",
    icon: "📊",
    description: t().charts.histogram.description,
  },
  {
    id: "box-plot",
    name: t().charts.boxPlot.name,
    component: BoxPlot,
    category: "distribution",
    icon: "📦",
    description: t().charts.boxPlot.description,
  },
  {
    id: "scatter",
    name: t().charts.scatter.name,
    component: ScatterPlot,
    category: "distribution",
    icon: "⚪",
    description: t().charts.scatter.description,
  },
  {
    id: "bubble",
    name: t().charts.bubble.name,
    component: BubbleChart,
    category: "distribution",
    icon: "🫧",
    description: t().charts.bubble.description,
  },
  {
    id: "heatmap",
    name: t().charts.heatmap.name,
    component: Heatmap,
    category: "distribution",
    icon: "🔥",
    description: t().charts.heatmap.description,
  },
  {
    id: "treemap",
    name: t().charts.treemap.name,
    component: TreemapChart,
    category: "distribution",
    icon: "🗂️",
    description: t().charts.treemap.description,
  },
  // 趋势分析
  {
    id: "stacked-area",
    name: t().charts.stackedArea.name,
    component: StackedAreaChart,
    category: "trend",
    icon: "📐",
    description: t().charts.stackedArea.description,
  },
  {
    id: "step-line",
    name: t().charts.stepLine.name,
    component: StepLineChart,
    category: "trend",
    icon: "📶",
    description: t().charts.stepLine.description,
  },
  {
    id: "candlestick",
    name: t().charts.candlestick.name,
    component: CandlestickChart,
    category: "trend",
    icon: "📈",
    description: t().charts.candlestick.description,
  },
  {
    id: "waterfall",
    name: t().charts.waterfall.name,
    component: WaterfallChart,
    category: "trend",
    icon: "📉",
    description: t().charts.waterfall.description,
  },
  {
    id: "theme-river",
    name: t().charts.themeRiver.name,
    component: ThemeRiverChart,
    category: "trend",
    icon: "🌊",
    description: t().charts.themeRiver.description,
  },
  {
    id: "gantt",
    name: t().charts.gantt.name,
    component: GanttChart,
    category: "trend",
    icon: "📅",
    description: t().charts.gantt.description,
  },
  // 特殊图表
  {
    id: "funnel",
    name: t().charts.funnel.name,
    component: FunnelChart,
    category: "special",
    icon: "🔻",
    description: t().charts.funnel.description,
  },
  {
    id: "gauge",
    name: t().charts.gauge.name,
    component: GaugeChart,
    category: "special",
    icon: "⏱️",
    description: t().charts.gauge.description,
  },
  {
    id: "sunburst",
    name: t().charts.sunburst.name,
    component: SunburstChart,
    category: "special",
    icon: "☀️",
    description: t().charts.sunburst.description,
  },
  {
    id: "liquid",
    name: t().charts.liquid.name,
    component: LiquidChart,
    category: "special",
    icon: "💧",
    description: t().charts.liquid.description,
  },
  {
    id: "wordcloud",
    name: t().charts.wordcloud.name,
    component: WordCloudChart,
    category: "special",
    icon: "☁️",
    description: t().charts.wordcloud.description,
  },
  {
    id: "calendar",
    name: t().charts.calendar.name,
    component: CalendarChart,
    category: "special",
    icon: "📅",
    description: t().charts.calendar.description,
  },
  // 关系图表
  {
    id: "sankey",
    name: t().charts.sankey.name,
    component: SankeyChart,
    category: "relation",
    icon: "🔀",
    description: t().charts.sankey.description,
  },
  {
    id: "tree",
    name: t().charts.tree.name,
    component: TreeChart,
    category: "relation",
    icon: "🌲",
    description: t().charts.tree.description,
  },
  {
    id: "graph",
    name: t().charts.graph.name,
    component: GraphChart,
    category: "relation",
    icon: "🕸️",
    description: t().charts.graph.description,
  },
  // 新增图表 - 放在适当分类
  {
    id: "nightingale",
    name: t().charts.nightingale.name,
    component: NightingaleChart,
    category: "comparison",
    icon: "🌹",
    description: t().charts.nightingale.description,
  },
  {
    id: "mixed",
    name: t().charts.mixed.name,
    component: MixedChart,
    category: "comparison",
    icon: "📉",
    description: t().charts.mixed.description,
  },
  {
    id: "dynamic-line",
    name: t().charts.dynamicLine.name,
    component: DynamicLineChart,
    category: "trend",
    icon: "⚡",
    description: t().charts.dynamicLine.description,
  },
  {
    id: "punch-card",
    name: t().charts.punchCard.name,
    component: PunchCardChart,
    category: "distribution",
    icon: "🎫",
    description: t().charts.punchCard.description,
  },
  {
    id: "lollipop",
    name: t().charts.lollipop.name,
    component: LollipopChart,
    category: "comparison",
    icon: "🍭",
    description: t().charts.lollipop.description,
  },
  {
    id: "circular-packing",
    name: t().charts.circularPacking.name,
    component: CircularPackingChart,
    category: "relation",
    icon: "🫧",
    description: t().charts.circularPacking.description,
  },
  {
    id: "radial-tree",
    name: t().charts.radialTree.name,
    component: RadialTreeChart,
    category: "relation",
    icon: "🕸️",
    description: t().charts.radialTree.description,
  },
  {
    id: "bullet",
    name: t().charts.bullet.name,
    component: BulletChart,
    category: "comparison",
    icon: "📏",
    description: t().charts.bullet.description,
  },
  {
    id: "grouped-bar",
    name: t().charts.groupedBar.name,
    component: GroupedBarChart,
    category: "comparison",
    icon: "📊",
    description: t().charts.groupedBar.description,
  },
  {
    id: "stream",
    name: t().charts.stream.name,
    component: StreamGraph,
    category: "trend",
    icon: "🌊",
    description: t().charts.stream.description,
  },
  {
    id: "slope",
    name: t().charts.slope.name,
    component: SlopeChart,
    category: "trend",
    icon: "📈",
    description: t().charts.slope.description,
  },
  {
    id: "ridgeline",
    name: t().charts.ridgeline.name,
    component: RidgelineChart,
    category: "distribution",
    icon: "🏔️",
    description: t().charts.ridgeline.description,
  },
  {
    id: "marimekko",
    name: t().charts.marimekko.name,
    component: MarimekkoChart,
    category: "comparison",
    icon: "🧱",
    description: t().charts.marimekko.description,
  },
  {
    id: "dumbbell",
    name: t().charts.dumbbell.name,
    component: DumbbellChart,
    category: "comparison",
    icon: "🏋️",
    description: t().charts.dumbbell.description,
  },
  {
    id: "bump",
    name: t().charts.bump.name,
    component: BumpChart,
    category: "trend",
    icon: "🎢",
    description: t().charts.bump.description,
  },
  {
    id: "violin",
    name: t().charts.violin.name,
    component: ViolinPlot,
    category: "distribution",
    icon: "🎻",
    description: t().charts.violin.description,
  },
  {
    id: "spiral",
    name: t().charts.spiral.name,
    component: SpiralChart,
    category: "special",
    icon: "🌀",
    description: t().charts.spiral.description,
  },
  {
    id: "waffle",
    name: t().charts.waffle.name,
    component: WaffleChart,
    category: "distribution",
    icon: "🧇",
    description: t().charts.waffle.description,
  },
  {
    id: "ternary",
    name: t().charts.ternary.name,
    component: TernaryPlot,
    category: "relation",
    icon: "🔺",
    description: t().charts.ternary.description,
  },
  {
    id: "arc",
    name: t().charts.arc.name,
    component: ArcDiagram,
    category: "relation",
    icon: "🌈",
    description: t().charts.arc.description,
  },
  {
    id: "chord",
    name: t().charts.chord.name,
    component: ChordDiagram,
    category: "relation",
    icon: "🕸️",
    description: t().charts.chord.description,
  },
  {
    id: "force",
    name: t().charts.force.name,
    component: ForceDirectedGraph,
    category: "relation",
    icon: "⚡",
    description: t().charts.force.description,
  },
  {
    id: "edge-bundling",
    name: t().charts.edgeBundling.name,
    component: EdgeBundlingChart,
    category: "relation",
    icon: "🧶",
    description: t().charts.edgeBundling.description,
  },
];

import { useI18n } from "../i18n";

export const ChartsPage: Component = () => {
  const { t } = useI18n();
  const categories = getCategories(t);
  const chartItems = getChartItems(t);
  const [selectedCategory, setSelectedCategory] =
    createSignal<ChartCategory>("base");
  const [selectedChart, setSelectedChart] = createSignal<string | null>(null);

  // 当前分类信息
  const currentCategoryInfo = createMemo(() => {
    return categories.find((c) => c.id === selectedCategory());
  });

  // 过滤后的图表列表
  const filteredCharts = createMemo(() => {
    return chartItems.filter((chart) => chart.category === selectedCategory());
  });

  // 当前选中的图表详情
  const currentChartDetail = createMemo(() => {
    return chartItems.find((c) => c.id === selectedChart());
  });

  // 统计信息
  const stats = createMemo(() => {
    return {
      total: chartItems.length,
      categories: categories.length,
    };
  });

  return (
    <div class="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* 顶部标题区域 */}
      <div class="border-b bg-background/50 backdrop-blur-sm sticky top-0 z-10">
        <div class="container mx-auto px-4 py-6">
          <div class="flex items-center justify-between">
            <div>
              <div class="inline-flex items-center gap-2 mb-2 px-3 py-1 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-purple-500/20">
                <span class="text-xl">📊</span>
                <span class="text-xs font-medium bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Data Visualization
                </span>
              </div>
              <h1 class="text-3xl font-bold tracking-tight mb-2 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
                {t().chartsPage.title}
              </h1>
              <p class="text-muted-foreground">
                {t().chartsPage.subtitle.replace("{total}", stats().total.toString()).replace("{categories}", stats().categories.toString())}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="container mx-auto px-4 py-6">
        <div class="flex gap-6">
          {/* 左侧导航栏 */}
          <aside class="w-72 shrink-0">
            <div class="sticky top-32 space-y-4">
              {/* 分类选择 */}
              <div class="bg-card border-2 border-muted rounded-xl p-4">
                <div class="flex items-center gap-2 mb-3">
                  <span class="text-lg">📂</span>
                  <span class="text-sm font-semibold">{t().chartsPage.categoryTitle}</span>
                </div>
                <div class="space-y-2">
                  <For each={categories}>
                    {(category) => (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCategory(category.id);
                          setSelectedChart(null);
                        }}
                        class={`w-full text-left px-4 py-3 rounded-lg text-sm transition-all duration-300 relative ${
                          selectedCategory() === category.id
                            ? `bg-gradient-to-r ${category.borderGradient} border-2 border-transparent bg-clip-padding`
                            : "hover:bg-accent hover:translate-x-1"
                        }`}
                      >
                        <div class="flex items-center gap-3">
                          <span class="text-xl">{category.icon}</span>
                          <div class="flex-1">
                            <div
                              class={`font-medium ${selectedCategory() === category.id ? "text-foreground" : ""}`}
                            >
                              {category.name}
                            </div>
                            <div class="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                              {category.description}
                            </div>
                          </div>
                          {selectedCategory() === category.id && (
                            <div
                              class={`w-1 h-8 rounded-full bg-gradient-to-b ${category.gradient}`}
                            ></div>
                          )}
                        </div>
                      </button>
                    )}
                  </For>
                </div>
              </div>
            </div>
          </aside>

          {/* 主内容区 */}
          <main class="flex-1 min-w-0 pb-20">
            {/* 顶部图表列表 (Horizontal) */}
            <div class="mb-6 overflow-x-auto pb-2 scrollbar-thin">
              <div class="flex gap-3 min-w-min">
                <For each={filteredCharts()}>
                  {(chart) => (
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedChart(
                          selectedChart() === chart.id ? null : chart.id,
                        )
                      }
                      class={`shrink-0 flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all duration-300 ${
                        selectedChart() === chart.id
                          ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/25 scale-105"
                          : "bg-card border-muted hover:border-primary/50 hover:bg-accent hover:-translate-y-0.5"
                      }`}
                    >
                      <span class="text-xl">{chart.icon}</span>
                      <div class="text-left">
                        <div class="font-medium text-sm whitespace-nowrap">
                          {chart.name}
                        </div>
                      </div>
                    </button>
                  )}
                </For>
              </div>
            </div>
            <Show when={selectedChart() && currentChartDetail()}>
              {/* 单个图表详情视图 */}
              <div class="relative group">
                <div class="absolute -inset-1 bg-gradient-to-r from-primary/20 via-blue-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div class="relative bg-card border-2 border-muted rounded-2xl shadow-xl overflow-hidden">
                  {/* 图表信息头部 */}
                  <div class="bg-gradient-to-r from-primary/10 via-blue-500/10 to-purple-500/10 border-b border-border p-6 backdrop-blur-sm">
                    <div class="flex items-start gap-4">
                      <div class="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-blue-500/20 text-3xl">
                        {currentChartDetail()!.icon}
                      </div>
                      <div class="flex-1">
                        <div class="flex items-center gap-3 mb-2">
                          <h2 class="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                            {currentChartDetail()!.name}
                          </h2>
                          <span class="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                            {categories.find(c => c.id === currentChartDetail()!.category)?.name}
                          </span>
                        </div>
                        <p class="text-sm text-muted-foreground">
                          {currentChartDetail()!.description}
                        </p>
                      </div>
                        <button
                        type="button"
                        onClick={() => setSelectedChart(null)}
                        class="px-3 py-1.5 text-sm bg-muted hover:bg-muted/80 rounded-lg transition-colors"
                      >
                        {t().chartsPage.backToList}
                      </button>
                    </div>
                  </div>

                  {/* 图表内容 */}
                  <div class="p-8">
                    {(() => {
                      const chart = currentChartDetail();
                      if (!chart) return null;
                      const ChartComponent = chart.component;
                      return <ChartComponent />;
                    })()}
                  </div>
                </div>
              </div>
            </Show>

            <Show when={!selectedChart()}>
              {/* 分类网格视图 */}
              <section>
                <Show when={currentCategoryInfo()}>
                  {(categoryInfo) => (
                    <div class="flex items-center gap-4 mb-8">
                      <div
                        class={`h-10 w-1 bg-gradient-to-b ${categoryInfo().gradient} rounded-full`}
                      ></div>
                      <div>
                        <div class="flex items-center gap-3">
                          <span class="text-2xl">{categoryInfo().icon}</span>
                          <h2 class="text-2xl font-bold">
                            {categoryInfo().name}
                          </h2>
                        </div>
                        <p class="text-muted-foreground mt-1">
                          {categoryInfo().description}
                        </p>
                      </div>
                    </div>
                  )}
                </Show>
                <div class="grid grid-cols-1 xl:grid-cols-2 gap-8">
                  <For each={filteredCharts()}>
                    {(chart) => {
                      const ChartComponent = chart.component;
                      return (
                        <div
                          class="group cursor-pointer transition-transform duration-300 hover:scale-[1.01]"
                          onClick={() => setSelectedChart(chart.id)}
                        >
                          <ChartComponent />
                        </div>
                      );
                    }}
                  </For>
                </div>
              </section>
            </Show>
          </main>
        </div>
      </div>
    </div>
  );
};
