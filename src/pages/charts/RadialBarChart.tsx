import type { Component } from "solid-js";
import { For } from "solid-js";
import { Arc, Group } from "@ensolid/visx";
import { scaleBand, scaleLinear, scaleSqrt } from "d3-scale";

const radialData = [
  { name: "Design", score: 90, color: "#f43f5e" },
  { name: "Code", score: 85, color: "#8b5cf6" },
  { name: "Test", score: 70, color: "#0ea5e9" },
  { name: "Deploy", score: 60, color: "#10b981" },
  { name: "Docs", score: 80, color: "#f59e0b" },
];

export const RadialBarChart: Component = () => {
  const width = 400;
  const height = 400;
  const innerRadius = 30;
  const outerRadius = 180;

  const xScale = scaleBand<string>()
    .range([0, 2 * Math.PI])
    .domain(radialData.map((d) => d.name))
    .align(0);

  const yScale = scaleLinear<number>()
    .range([innerRadius, outerRadius])
    .domain([0, 100]); // score 0-100

  return (
    <div class="group relative">
      <div class="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div class="relative bg-card border-2 border-muted rounded-2xl p-6 shadow-xl overflow-hidden transition-all duration-300 hover:border-cyan-500/30">
        <div class="flex items-center gap-3 mb-6">
          <div class="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20">
            <span class="text-2xl">🎯</span>
          </div>
          <div>
            <h2 class="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
              径向柱状图
            </h2>
            <p class="text-xs text-muted-foreground">
              Radial Bar Chart - 极坐标对比
            </p>
          </div>
        </div>
        <div class="flex justify-center overflow-x-auto w-full">
          <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} class="max-w-full h-auto">
            <Group top={height / 2} left={width / 2}>
              {/* Background Circles */}
              <For each={[25, 50, 75, 100]}>
                {(tick) => (
                  <circle
                    r={yScale(tick)}
                    fill="none"
                    stroke="#e2e8f0"
                    stroke-width={1}
                    stroke-dasharray="4 4"
                  />
                )}
              </For>
              <For each={radialData}>
                {(d) => (
                  <Arc
                    startAngle={xScale(d.name) ?? 0}
                    endAngle={(xScale(d.name) ?? 0) + xScale.bandwidth()}
                    innerRadius={innerRadius}
                    outerRadius={yScale(d.score)}
                    fill={d.color}
                    padAngle={0.02}
                    cornerRadius={4}
                    class="transition-all duration-300 hover:opacity-80"
                  />
                )}
              </For>
            </Group>
          </svg>
        </div>
      </div>
    </div>
  );
};
