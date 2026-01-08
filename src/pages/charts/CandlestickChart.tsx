import type { Component } from "solid-js";
import { For } from "solid-js";
import { AxisBottom, AxisLeft, GridRows, Group, Bar } from "@ensolid/visx";
import { scaleBand, scaleLinear } from "d3-scale";
import { min, max } from "d3-array";

const candlestickData = Array.from({ length: 30 }, (_, i) => {
  const base = 100 + Math.random() * 20;
  const change = (Math.random() - 0.5) * 10;
  const open = base;
  const close = base + change;
  const high = Math.max(open, close) + Math.random() * 5;
  const low = Math.min(open, close) - Math.random() * 5;
  return { date: `Day ${i + 1}`, open, high, low, close };
});

export const CandlestickChart: Component = () => {
  const width = 600;
  const height = 400;
  const margin = { top: 40, right: 30, bottom: 50, left: 50 };
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  const xScale = scaleBand<string>()
    .range([0, xMax])
    .domain(candlestickData.map((d) => d.date))
    .padding(0.3);

  const yScale = scaleLinear<number>()
    .range([yMax, 0])
    .domain([
      (min(candlestickData, (d) => d.low) ?? 0) - 5,
      (max(candlestickData, (d) => d.high) ?? 0) + 5,
    ]);

  return (
    <div class="group relative">
      <div class="absolute -inset-1 bg-gradient-to-r from-slate-500/20 to-zinc-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div class="relative bg-card border-2 border-muted rounded-2xl p-6 shadow-xl overflow-hidden transition-all duration-300 hover:border-slate-500/30">
        <div class="flex items-center gap-3 mb-6">
          <div class="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-slate-500/20 to-zinc-500/20">
            <span class="text-2xl">🕯️</span>
          </div>
          <div>
            <h2 class="text-2xl font-bold bg-gradient-to-r from-slate-600 to-zinc-600 bg-clip-text text-transparent">
              K线图
            </h2>
            <p class="text-xs text-muted-foreground">Candlestick - 金融数据分析</p>
          </div>
        </div>
        <div class="flex justify-center overflow-x-auto w-full">
          <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} class="max-w-full h-auto">
            <Group top={margin.top} left={margin.left}>
              <GridRows scale={yScale} width={xMax} stroke="#e2e8f0" />
              <AxisBottom scale={xScale} top={yMax} tickFormat={(_, i) => (i % 5 === 0 ? candlestickData[i].date : "")} />
              <AxisLeft scale={yScale} />
              <For each={candlestickData}>
                {(d) => {
                  const isUp = d.close > d.open;
                  const color = isUp ? "#10b981" : "#ef4444";
                  const barX = xScale(d.date) ?? 0;
                  const barWidth = xScale.bandwidth();
                  return (
                    <g>
                      <line
                        x1={barX + barWidth / 2}
                        x2={barX + barWidth / 2}
                        y1={yScale(d.high)}
                        y2={yScale(d.low)}
                        stroke={color}
                        stroke-width={1.5}
                      />
                      <Bar
                        x={barX}
                        y={yScale(Math.max(d.open, d.close))}
                        width={barWidth}
                        height={Math.abs(yScale(d.open) - yScale(d.close))}
                        fill={color}
                        rx={2}
                        class="transition-opacity hover:opacity-80"
                      />
                    </g>
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
