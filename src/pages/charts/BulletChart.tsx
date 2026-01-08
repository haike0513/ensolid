import type { Component } from "solid-js";
import { For, createMemo } from "solid-js";
import { Group, AxisBottom } from "@ensolid/visx";
import { scaleLinear } from "d3-scale";

interface BulletData {
  title: string;
  subtitle: string;
  ranges: number[];
  measures: number[];
  markers: number[];
}

const data: BulletData[] = [
  {
    title: "Revenue",
    subtitle: "US$, in thousands",
    ranges: [150, 225, 300],
    measures: [220, 270],
    markers: [250],
  },
  {
    title: "Profit",
    subtitle: "%",
    ranges: [20, 25, 30],
    measures: [21, 23],
    markers: [26],
  },
];

export const BulletChart: Component = () => {
  const width = 600;
  const height = 300; // Adjusted height for stacked bullets
  const margin = { top: 20, right: 30, bottom: 40, left: 120 };
  const innerWidth = width - margin.left - margin.right;
  const itemHeight = 60;
  const itemSpacing = 20;

  return (
    <div class="group relative">
      <div class="absolute -inset-1 bg-gradient-to-r from-orange-500/20 to-amber-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div class="relative bg-card border-2 border-muted rounded-2xl p-6 shadow-xl overflow-hidden transition-all duration-300 hover:border-orange-500/30">
        <div class="flex items-center gap-3 mb-6">
          <div class="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500/20 to-amber-500/20">
            <span class="text-2xl">📏</span>
          </div>
          <div>
            <h2 class="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
              子弹图
            </h2>
            <p class="text-xs text-muted-foreground">
              Bullet Chart - 目标达成情况
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
            <For each={data}>
              {(d, i) => {
                const maxVal = Math.max(...d.ranges);
                const scale = scaleLinear<number>()
                  .domain([0, maxVal])
                  .range([0, innerWidth]);

                const yPos = margin.top + i() * (itemHeight + itemSpacing);

                return (
                  <Group top={yPos} left={margin.left}>
                    {/* Title */}
                    <text
                      x={-10}
                      y={itemHeight / 2}
                      text-anchor="end"
                      alignment-baseline="middle"
                      font-weight="bold"
                      font-size="12px"
                      fill="#1e293b"
                    >
                      {d.title}
                    </text>
                    <text
                      x={-10}
                      y={itemHeight / 2 + 14}
                      text-anchor="end"
                      alignment-baseline="middle"
                      font-size="10px"
                      fill="#64748b"
                    >
                      {d.subtitle}
                    </text>

                    {/* Ranges (Background) */}
                    <For each={d.ranges.sort((a, b) => b - a)}>
                      {(r, ri) => (
                        <rect
                          x={0}
                          y={0}
                          width={scale(r)}
                          height={itemHeight}
                          fill={["#e2e8f0", "#cbd5e1", "#94a3b8"][ri() % 3]}
                        />
                      )}
                    </For>

                    {/* Measures (Bars) */}
                    <For each={d.measures.sort((a, b) => b - a)}>
                      {(m, mi) => (
                        <rect
                          x={0}
                          y={itemHeight / 3}
                          width={scale(m)}
                          height={itemHeight / 3}
                          fill={["#3b82f6", "#1d4ed8"][mi() % 2]}
                        />
                      )}
                    </For>

                    {/* Markers (Lines) */}
                    <For each={d.markers}>
                      {(m) => (
                        <line
                          x1={scale(m)}
                          x2={scale(m)}
                          y1={itemHeight * 0.1}
                          y2={itemHeight * 0.9}
                          stroke="#000"
                          stroke-width={2}
                        />
                      )}
                    </For>

                    {/* Axis */}
                     <AxisBottom
                        scale={scale}
                        top={itemHeight}
                        tickLabelProps={() => ({
                            fontSize: 10,
                            textAnchor: 'middle',
                            fill: '#94a3b8'
                        })}
                        stroke="#e2e8f0"
                        tickStroke="#e2e8f0"
                     />

                  </Group>
                );
              }}
            </For>
          </svg>
        </div>
      </div>
    </div>
  );
};
