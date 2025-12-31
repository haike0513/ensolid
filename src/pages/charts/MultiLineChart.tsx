import type { Component } from "solid-js";
import { AxisBottom, AxisLeft, GridColumns, GridRows, Group, LinePath, curveMonotoneX, extent, scaleLinear, max } from "@ensolid/visx";

const multiLineData = Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    sales: 50 + Math.random() * 30 + i * 2,
    revenue: 30 + Math.random() * 20 + i * 1.5,
    profit: 20 + Math.random() * 15 + i * 1,
  }));

export const MultiLineChart: Component = () => {
    const width = 600;
    const height = 400;
    const margin = { top: 40, right: 30, bottom: 50, left: 50 };
    const xMax = width - margin.left - margin.right;
    const yMax = height - margin.top - margin.bottom;

  const xScale = scaleLinear<number>()
    .range([0, xMax])
    .domain(extent(multiLineData, (d) => d.month) as [number, number]);

  const yScale = scaleLinear<number>()
    .range([yMax, 0])
    .domain([
      0,
      max(multiLineData, (d) => Math.max(d.sales, d.revenue, d.profit)) ?? 100,
    ]);

  const multiLineColors = ["#3b82f6", "#10b981", "#f59e0b"];

  return (
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
              scale={yScale}
              width={xMax}
              stroke="#e2e8f0"
            />
            <GridColumns
              scale={xScale}
              height={yMax}
              stroke="#e2e8f0"
            />
            <AxisBottom scale={xScale} top={yMax} />
            <AxisLeft scale={yScale} />
            <LinePath
              data={multiLineData}
              x={(d) => xScale(d.month) ?? 0}
              y={(d) => yScale(d.sales) ?? 0}
              stroke={multiLineColors[0]}
              stroke-width={3}
              curve={curveMonotoneX}
            />
            <LinePath
              data={multiLineData}
              x={(d) => xScale(d.month) ?? 0}
              y={(d) => yScale(d.revenue) ?? 0}
              stroke={multiLineColors[1]}
              stroke-width={3}
              curve={curveMonotoneX}
            />
            <LinePath
              data={multiLineData}
              x={(d) => xScale(d.month) ?? 0}
              y={(d) => yScale(d.profit) ?? 0}
              stroke={multiLineColors[2]}
              stroke-width={3}
              curve={curveMonotoneX}
            />
          </Group>
        </svg>
      </div>
    </div>
  </div>
  );
};
