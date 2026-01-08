import type { Component } from "solid-js";
import { AxisBottom, AxisLeft, Group, LinePath, Area, GridRows } from "@ensolid/visx";
import { scaleLinear } from "d3-scale";
import { curveMonotoneX } from "d3-shape";
import { extent, max } from "d3-array";

const stockData = Array.from({ length: 50 }, (_, i) => ({
    date: new Date(2023, 0, i + 1),
    value: 100 + Math.random() * 50 - 25 + i * 2,
  }));

export const AreaChart: Component = () => {
    const width = 600;
    const height = 400;
    const margin = { top: 40, right: 30, bottom: 50, left: 50 };
    const xMax = width - margin.left - margin.right;
    const yMax = height - margin.top - margin.bottom;

  const xScale = scaleLinear<number>()
    .range([0, xMax])
    .domain(extent(stockData, (d: {date: Date}) => d.date.getTime()) as [number, number]);

  const yScale = scaleLinear<number>()
    .range([yMax, 0])
    .domain([0, max(stockData, (d: {value: number}) => d.value) ?? 0]);

  return (
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
                      scale={yScale}
                      width={xMax}
                      stroke="#e2e8f0"
                    />
                    <AxisBottom
                      scale={xScale}
                      top={yMax}
                      numTicks={5}
                      tickFormat={(d: any) => new Date(d).toLocaleDateString()}
                    />
                    <AxisLeft scale={yScale} />
                    <Area
                      data={stockData}
                      x={(d: any) => xScale(d.date.getTime()) ?? 0}
                      y0={() => yScale(0) ?? yMax}
                      y1={(d: any) => yScale(d.value) ?? 0}
                      fill="#8b5cf6"
                      fill-opacity={0.4}
                      curve={curveMonotoneX}
                    />
                    <LinePath
                      data={stockData}
                      x={(d: any) => xScale(d.date.getTime()) ?? 0}
                      y={(d: any) => yScale(d.value) ?? 0}
                      stroke="#8b5cf6"
                      stroke-width={2}
                      curve={curveMonotoneX}
                    />
                  </Group>
                </svg>
              </div>
            </div>
          </div>
  );
};
