import type { Component } from "solid-js";
import { For } from "solid-js";
import { AxisBottom, AxisLeft, GridRows, Group, Bar } from "@ensolid/visx";
import { scaleBand, scaleLinear } from "d3-scale";
import { min, max } from "d3-array";

const histogramData = Array.from({ length: 100 }, () => Math.random() * 100);

export const Histogram: Component = () => {
    const width = 600;
    const height = 400;
    const margin = { top: 40, right: 30, bottom: 50, left: 50 };
    const xMax = width - margin.left - margin.right;
    const yMax = height - margin.top - margin.bottom;

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

  const xScale = scaleBand<number>()
    .range([0, xMax])
    .domain(histogramBins.map((_, i) => i))
    .padding(0.1);

  const yScale = scaleLinear<number>()
    .range([yMax, 0])
    .domain([0, max(histogramBins, (d) => d.count) ?? 0]);

  return (
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
              scale={yScale}
              width={xMax}
              stroke="#e2e8f0"
            />
            <AxisBottom scale={xScale} top={yMax} />
            <AxisLeft scale={yScale} />
            <For each={histogramBins}>
              {(bin, i) => {
                const barHeight = yMax - (yScale(bin.count) ?? 0);
                return (
                  <Bar
                    x={xScale(i())}
                    y={yMax - barHeight}
                    width={xScale.bandwidth()}
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
  );
};
