import type { Component } from "solid-js";
import { For } from "solid-js";
import { Group } from "@ensolid/visx";
import { area, stack, stackOffsetWiggle, stackOrderNone, curveBasis } from "d3-shape";
import { scaleLinear, scalePoint } from "d3-scale";

const themes = ["Social", "Search", "Mobile", "Email", "Video"];
const timeSteps = 15;

const themeRiverData = Array.from({ length: timeSteps }).map((_, i) => {
  const d: any = { time: i };
  themes.forEach(theme => {
    d[theme] = Math.max(5, Math.random() * 50 + (Math.sin(i / 2) + 1) * 20);
  });
  return d;
});

export const ThemeRiverChart: Component = () => {
  const width = 600;
  const height = 400;
  const margin = { top: 40, right: 30, bottom: 40, left: 30 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const stackGen = stack()
    .keys(themes)
    .offset(stackOffsetWiggle)
    .order(stackOrderNone);

  const series = stackGen(themeRiverData);

  const xScale = scaleLinear<number>()
    .domain([0, timeSteps - 1])
    .range([0, innerWidth]);

  const yScale = scaleLinear<number>()
    .domain([
      Math.min(...series.flatMap((s: any[]) => s.map((d: any) => d[0]))),
      Math.max(...series.flatMap((s: any[]) => s.map((d: any) => d[1])))
    ])
    .range([innerHeight, 0]);

  const areaGen = area<any>()
    .x((d: any) => xScale(d.data.time))
    .y0((d: any) => yScale(d[0]))
    .y1((d: any) => yScale(d[1]))
    .curve(curveBasis);

  const colors = ["#6366f1", "#8b5cf6", "#a855f7", "#d946ef", "#ec4899"];

  return (
    <div class="group relative">
      <div class="absolute -inset-1 bg-gradient-to-r from-violet-500/20 to-pink-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
      </div>
      <div class="relative bg-card border-2 border-muted rounded-2xl p-6 shadow-xl overflow-hidden transition-all duration-300 hover:border-violet-500/30">
        <div class="flex items-center gap-3 mb-6">
          <div class="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-pink-500/20">
            <span class="text-2xl">🌊</span>
          </div>
          <div>
            <h2 class="text-2xl font-bold bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">
              主题河流图
            </h2>
            <p class="text-xs text-muted-foreground">
              ThemeRiver - 事件流趋势分析
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
              <For each={series}>
                {(s, i) => (
                  <path
                    d={areaGen(s) || ""}
                    fill={colors[i() % colors.length]}
                    fill-opacity={0.7}
                    class="transition-all duration-300 hover:fill-opacity-100 cursor-pointer"
                  >
                    <title>{themes[i()]}</title>
                  </path>
                )}
              </For>
            </Group>
          </svg>
        </div>
        <div class="flex justify-center gap-4 mt-4">
          <For each={themes}>
            {(theme, i) => (
              <div class="flex items-center gap-1">
                <div class="w-3 h-3 rounded-full" style={{ "background-color": colors[i() % colors.length] }}></div>
                <span class="text-xs text-muted-foreground">{theme}</span>
              </div>
            )}
          </For>
        </div>
      </div>
    </div>
  );
};
