import type { Component } from "solid-js";
import { For } from "solid-js";
import { AxisBottom, AxisLeft, GridRows, Group, scaleBand, scaleLinear, Bar, stack, max, sum } from "@ensolid/visx";

const stackedBarData = [
    { category: "Q1", productA: 20, productB: 15, productC: 10 },
    { category: "Q2", productA: 25, productB: 18, productC: 12 },
    { category: "Q3", productA: 30, productB: 22, productC: 15 },
    { category: "Q4", productA: 35, productB: 25, productC: 18 },
  ];

export const StackedBarChart: Component = () => {
    const width = 600;
    const height = 400;
    const margin = { top: 40, right: 30, bottom: 50, left: 50 };
    const xMax = width - margin.left - margin.right;
    const yMax = height - margin.top - margin.bottom;

  const stackKeys = ["productA", "productB", "productC"];
  const stackColors = ["#3b82f6", "#10b981", "#f59e0b"];
  const stackedData = stack()
    .keys(stackKeys)
    .value((d: any, key: string) => d[key])(stackedBarData as any);

  const xScale = scaleBand<string>()
    .range([0, xMax])
    .domain(stackedBarData.map((d) => d.category))
    .padding(0.4);

  const yScale = scaleLinear<number>()
    .range([yMax, 0])
    .domain([0, max(stackedData, (d) => sum(d, (item: any) => item[1])) ?? 0]);

  return (
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
              scale={yScale}
              width={xMax}
              stroke="#e2e8f0"
            />
            <AxisBottom scale={xScale} top={yMax} />
            <AxisLeft scale={yScale} />
            <For each={stackedData}>
              {(series, seriesIndex) => (
                <For each={series}>
                  {(d: any, itemIndex) => {
                    const y0 = d[0] ?? 0;
                    const y1 = d[1] ?? 0;
                    const barHeight = (yScale(y0) ?? yMax) - (yScale(y1) ?? 0);
                    const barY = yScale(y1) ?? 0;
                    return (
                      <Bar
                        x={xScale(stackedBarData[itemIndex()]?.category ?? "")}
                        y={barY}
                        width={xScale.bandwidth()}
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
  );
};
