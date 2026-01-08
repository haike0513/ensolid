import type { Component } from "solid-js";
import { For } from "solid-js";
import { Area, AxisBottom, AxisLeft, GridRows, Group } from "@ensolid/visx";
import { scaleLinear } from "d3-scale";
import { stack, curveMonotoneX } from "d3-shape";
import { extent, max, sum } from "d3-array";

const stackedAreaData = Array.from({ length: 20 }, (_, i) => ({
    date: i,
    series1: 20 + Math.random() * 10 + i,
    series2: 15 + Math.random() * 8 + i * 0.8,
    series3: 10 + Math.random() * 5 + i * 0.5,
  }));

export const StackedAreaChart: Component = () => {
    const width = 600;
    const height = 400;
    const margin = { top: 40, right: 30, bottom: 50, left: 50 };
    const xMax = width - margin.left - margin.right;
    const yMax = height - margin.top - margin.bottom;

  const areaStackKeys = ["series1", "series2", "series3"];
  const areaStackColors = ["#3b82f6", "#10b981", "#f59e0b"];
  const stackedData = stack()
    .keys(areaStackKeys)
    .value((d: any, key: string) => d[key])(stackedAreaData as any);

  const xScale = scaleLinear<number>()
    .range([0, xMax])
    .domain(extent(stackedAreaData, (d: {date: number}) => d.date) as [number, number]);

  const yScale = scaleLinear<number>()
    .range([yMax, 0])
    .domain([
      0,
      max(stackedData, (d) => sum(d, (item: any) => item[1])) ?? 0,
    ]);

  return (
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
              scale={yScale}
              width={xMax}
              stroke="#e2e8f0"
            />
            <AxisBottom scale={xScale} top={yMax} />
            <AxisLeft scale={yScale} />
            <For each={stackedData}>
              {(series, seriesIndex) => {
                return (
                  <Area
                    data={series}
                    x={(d: any, i: number) => {
                      return xScale(stackedAreaData[i]?.date ?? 0) ?? 0;
                    }}
                    y0={(d: any) => yScale(d[0] ?? 0) ?? yMax}
                    y1={(d: any) => yScale(d[1] ?? 0) ?? 0}
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
  );
};
