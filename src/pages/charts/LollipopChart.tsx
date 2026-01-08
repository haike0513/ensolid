import type { Component } from "solid-js";
import { For, createMemo } from "solid-js";
import { Group, AxisBottom, AxisLeft } from "@ensolid/visx";
import { scaleBand, scaleLinear } from "d3-scale";

const data = [
  { country: "United States", value: 12394 },
  { country: "Russia", value: 6148 },
  { country: "Germany", value: 1653 },
  { country: "France", value: 2162 },
  { country: "United Kingdom", value: 1214 },
  { country: "China", value: 1131 },
  { country: "Spain", value: 814 },
  { country: "Netherlands", value: 1167 },
  { country: "Italy", value: 660 },
  { country: "Israel", value: 1263 },
].sort((a, b) => a.value - b.value);

export const LollipopChart: Component = () => {
  const width = 600;
  const height = 400;
  const margin = { top: 40, right: 30, bottom: 50, left: 100 };
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  const yScale = scaleBand<string>()
    .range([yMax, 0])
    .domain(data.map(d => d.country))
    .padding(0.4);

  const xScale = scaleLinear<number>()
    .range([0, xMax])
    .domain([0, 13000]);

  return (
    <div class="group relative">
      <div class="absolute -inset-1 bg-gradient-to-r from-pink-500/20 to-rose-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
      </div>
      <div class="relative bg-card border-2 border-muted rounded-2xl p-6 shadow-xl overflow-hidden transition-all duration-300 hover:border-pink-500/30">
        <div class="flex items-center gap-3 mb-6">
          <div class="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500/20 to-rose-500/20">
            <span class="text-2xl">🍭</span>
          </div>
          <div>
            <h2 class="text-2xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
              棒棒糖图
            </h2>
            <p class="text-xs text-muted-foreground">
              Lollipop Chart - 类别数据对比
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
              <AxisBottom
                scale={xScale}
                top={yMax}
              />
              <AxisLeft scale={yScale} />
              
              <For each={data}>
                {(d) => (
                  <Group>
                    <line
                      x1={0}
                      y1={yScale(d.country)! + yScale.bandwidth() / 2}
                      x2={xScale(d.value)}
                      y2={yScale(d.country)! + yScale.bandwidth() / 2}
                      stroke="#cbd5e1"
                      stroke-width={1}
                    />
                    <circle
                      cx={xScale(d.value)}
                      cy={yScale(d.country)! + yScale.bandwidth() / 2}
                      r={6}
                      fill="#ec4899"
                      stroke="#be185d"
                      stroke-width={2}
                      class="transition-all duration-300 hover:r-8 cursor-pointer"
                    >
                      <title>{`${d.country}: ${d.value}`}</title>
                    </circle>
                  </Group>
                )}
              </For>
            </Group>
          </svg>
        </div>
      </div>
    </div>
  );
};
