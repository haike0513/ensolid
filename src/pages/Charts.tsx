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

type ChartCategory =
  | "基础图表"
  | "数据对比"
  | "数据分布"
  | "趋势分析"
  | "特殊图表"
  | "关系图表";

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

const categories: CategoryInfo[] = [
  {
    id: "基础图表",
    name: "基础图表",
    icon: "📊",
    description: "最常用的数据展示形式，适用于大多数场景",
    gradient: "from-blue-500 to-cyan-500",
    borderGradient: "from-blue-500/20 to-cyan-500/20",
  },
  {
    id: "数据对比",
    name: "数据对比",
    icon: "📈",
    description: "用于多维度数据对比和分类展示",
    gradient: "from-teal-500 to-emerald-500",
    borderGradient: "from-teal-500/20 to-emerald-500/20",
  },
  {
    id: "数据分布",
    name: "数据分布",
    icon: "🔬",
    description: "展示数据的分布情况、离散程度和相关性",
    gradient: "from-orange-500 to-amber-500",
    borderGradient: "from-orange-500/20 to-amber-500/20",
  },
  {
    id: "趋势分析",
    name: "趋势分析",
    icon: "📉",
    description: "展示数据的累积变化和趋势走向",
    gradient: "from-violet-500 to-purple-500",
    borderGradient: "from-violet-500/20 to-purple-500/20",
  },
  {
    id: "特殊图表",
    name: "特殊图表",
    icon: "✨",
    description: "独特的可视化形式，适用于特定场景",
    gradient: "from-pink-500 to-rose-500",
    borderGradient: "from-pink-500/20 to-rose-500/20",
  },
  {
    id: "关系图表",
    name: "关系图表",
    icon: "🔗",
    description: "展示数据间的关联和流转关系",
    gradient: "from-indigo-500 to-blue-500",
    borderGradient: "from-indigo-500/20 to-blue-500/20",
  },
];

const chartItems: ChartItem[] = [
  // 基础图表
  {
    id: "bar",
    name: "柱状图",
    component: BarChart,
    category: "基础图表",
    icon: "📊",
    description: "展示分类数据对比",
  },
  {
    id: "line",
    name: "折线图",
    component: LineChart,
    category: "基础图表",
    icon: "📈",
    description: "展示数据趋势变化",
  },
  {
    id: "area",
    name: "面积图",
    component: AreaChart,
    category: "基础图表",
    icon: "📐",
    description: "强调数据量的累积",
  },
  {
    id: "pie",
    name: "饼图",
    component: PieChart,
    category: "基础图表",
    icon: "🥧",
    description: "展示占比关系",
  },
  {
    id: "donut",
    name: "环形图",
    component: DonutChart,
    category: "基础图表",
    icon: "🍩",
    description: "中心带空白的饼图",
  },
  {
    id: "horizontal-bar",
    name: "横向柱状图",
    component: HorizontalBarChart,
    category: "基础图表",
    icon: "📊",
    description: "横向排名展示",
  },
  {
    id: "pictorial-bar",
    name: "象形柱图",
    component: PictorialBarChart,
    category: "基础图表",
    icon: "🎨",
    description: "创意形象化展示",
  },
  // 数据对比
  {
    id: "stacked-bar",
    name: "堆叠柱状图",
    component: StackedBarChart,
    category: "数据对比",
    icon: "📊",
    description: "多维度数据堆叠对比",
  },
  {
    id: "multi-line",
    name: "多折线图",
    component: MultiLineChart,
    category: "数据对比",
    icon: "📉",
    description: "多系列趋势对比",
  },
  {
    id: "radar",
    name: "雷达图",
    component: RadarChart,
    category: "数据对比",
    icon: "🎯",
    description: "多维度能力对比",
  },
  {
    id: "radial-bar",
    name: "径向柱状图",
    component: RadialBarChart,
    category: "数据对比",
    icon: "🌀",
    description: "环形柱状对比",
  },
  {
    id: "negative-bar",
    name: "正负条形图",
    component: NegativeBarChart,
    category: "数据对比",
    icon: "⚖️",
    description: "正负数据对比",
  },
  {
    id: "polar-bar",
    name: "极坐标柱状图",
    component: PolarBarChart,
    category: "数据对比",
    icon: "🎡",
    description: "环形数据对比",
  },
  {
    id: "parallel",
    name: "平行坐标图",
    component: ParallelChart,
    category: "数据对比",
    icon: "📏",
    description: "多维度数据分析",
  },
  // 数据分布
  {
    id: "histogram",
    name: "直方图",
    component: Histogram,
    category: "数据分布",
    icon: "📊",
    description: "展示数据分布频率",
  },
  {
    id: "box-plot",
    name: "箱线图",
    component: BoxPlot,
    category: "数据分布",
    icon: "📦",
    description: "展示数据离散程度",
  },
  {
    id: "scatter",
    name: "散点图",
    component: ScatterPlot,
    category: "数据分布",
    icon: "⚪",
    description: "展示数据相关性",
  },
  {
    id: "bubble",
    name: "气泡图",
    component: BubbleChart,
    category: "数据分布",
    icon: "🫧",
    description: "三维数据展示",
  },
  {
    id: "heatmap",
    name: "热力图",
    component: Heatmap,
    category: "数据分布",
    icon: "🔥",
    description: "矩阵数据密度展示",
  },
  {
    id: "treemap",
    name: "矩形树图",
    component: TreemapChart,
    category: "数据分布",
    icon: "🗂️",
    description: "层级占比分析",
  },
  // 趋势分析
  {
    id: "stacked-area",
    name: "堆叠面积图",
    component: StackedAreaChart,
    category: "趋势分析",
    icon: "📐",
    description: "多系列累积趋势",
  },
  {
    id: "step-line",
    name: "阶梯图",
    component: StepLineChart,
    category: "趋势分析",
    icon: "📶",
    description: "阶跃数据变化",
  },
  {
    id: "candlestick",
    name: "K线图",
    component: CandlestickChart,
    category: "趋势分析",
    icon: "📈",
    description: "金融数据走势",
  },
  {
    id: "waterfall",
    name: "瀑布图",
    component: WaterfallChart,
    category: "趋势分析",
    icon: "📉",
    description: "增减变化分析",
  },
  {
    id: "theme-river",
    name: "主题河流图",
    component: ThemeRiverChart,
    category: "趋势分析",
    icon: "🌊",
    description: "事件流趋势分析",
  },
  {
    id: "gantt",
    name: "甘特图",
    component: GanttChart,
    category: "趋势分析",
    icon: "📅",
    description: "项目进度管理",
  },
  // 特殊图表
  {
    id: "funnel",
    name: "漏斗图",
    component: FunnelChart,
    category: "特殊图表",
    icon: "🔻",
    description: "转化率分析",
  },
  {
    id: "gauge",
    name: "仪表盘",
    component: GaugeChart,
    category: "特殊图表",
    icon: "⏱️",
    description: "完成度展示",
  },
  {
    id: "sunburst",
    name: "旭日图",
    component: SunburstChart,
    category: "特殊图表",
    icon: "☀️",
    description: "多层级结构展示",
  },
  {
    id: "liquid",
    name: "水球图",
    component: LiquidChart,
    category: "特殊图表",
    icon: "💧",
    description: "完成进度展示",
  },
  {
    id: "wordcloud",
    name: "词云图",
    component: WordCloudChart,
    category: "特殊图表",
    icon: "☁️",
    description: "关键词分析",
  },
  {
    id: "calendar",
    name: "日历图",
    component: CalendarChart,
    category: "特殊图表",
    icon: "📅",
    description: "时间维度数据分布",
  },
  // 关系图表
  {
    id: "sankey",
    name: "桑基图",
    component: SankeyChart,
    category: "关系图表",
    icon: "🔀",
    description: "流量分布分析",
  },
  {
    id: "tree",
    name: "树图",
    component: TreeChart,
    category: "关系图表",
    icon: "🌲",
    description: "层级结构展示",
  },
  {
    id: "graph",
    name: "关系图",
    component: GraphChart,
    category: "关系图表",
    icon: "🕸️",
    description: "节点链接关系",
  },
  // 新增图表 - 放在适当分类
  {
    id: "nightingale",
    name: "南丁格尔玫瑰图",
    component: NightingaleChart,
    category: "数据对比",
    icon: "🌹",
    description: "极坐标半径对比",
  },
  {
    id: "mixed",
    name: "折柱混合图",
    component: MixedChart,
    category: "数据对比",
    icon: "📉",
    description: "多维度双轴分析",
  },
  {
    id: "dynamic-line",
    name: "动态折线图",
    component: DynamicLineChart,
    category: "趋势分析",
    icon: "⚡",
    description: "实时数据监控",
  },
  {
    id: "punch-card",
    name: "打卡图",
    component: PunchCardChart,
    category: "数据分布",
    icon: "🎫",
    description: "时间段活跃度分布",
  },
  {
    id: "lollipop",
    name: "棒棒糖图",
    component: LollipopChart,
    category: "数据对比",
    icon: "🍭",
    description: "类别数据对比",
  },
  {
    id: "circular-packing",
    name: "圆形打包图",
    component: CircularPackingChart,
    category: "关系图表",
    icon: "🫧",
    description: "层级数据包含关系",
  },
  {
    id: "radial-tree",
    name: "径向树图",
    component: RadialTreeChart,
    category: "关系图表",
    icon: "🕸️",
    description: "辐射状层级结构",
  },
  {
    id: "bullet",
    name: "子弹图",
    component: BulletChart,
    category: "数据对比",
    icon: "📏",
    description: "目标达成情况对比",
  },
];

export const ChartsPage: Component = () => {
  const [selectedCategory, setSelectedCategory] =
    createSignal<ChartCategory>("基础图表");
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
                图表画廊
              </h1>
              <p class="text-muted-foreground">
                探索 {stats().total} 个数据可视化图表，涵盖 {stats().categories}{" "}
                个分类
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
                  <span class="text-sm font-semibold">图表分类</span>
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
                            {currentChartDetail()!.category}
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
                        返回列表
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
