import type { Component } from "solid-js";
import { For } from "solid-js";
import { Group, Text, LinePath } from "@ensolid/visx";
import { scaleLinear } from "d3-scale";

const dimensions = ["价格", "质量", "服务", "速度", "创新"];
const parallelData = [
  { name: "产品A", values: [80, 90, 70, 85, 75], color: "#6366f1" },
  { name: "产品B", values: [60, 75, 90, 70, 85], color: "#8b5cf6" },
  { name: "产品C", values: [90, 60, 80, 95, 60], color: "#a855f7" },
  { name: "产品D", values: [70, 85, 65, 80, 90], color: "#d946ef" },
];

export const ParallelChart: Component = () => {
  const width = 600;
  const height = 400;
  const margin = { top: 60, right: 40, bottom: 40, left: 40 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const xStep = innerWidth / (dimensions.length - 1);
  const yScale = scaleLinear<number>().domain([0, 100]).range([innerHeight, 0]);

  return (
    <div class="group relative">
      <div class="absolute -inset-1 bg-gradient-to-r from-violet-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div class="relative bg-card border-2 border-muted rounded-2xl p-6 shadow-xl overflow-hidden transition-all duration-300 hover:border-violet-500/30">
        <div class="flex items-center gap-3 mb-6">
          <div class="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20">
            <span class="text-2xl">📏</span>
          </div>
          <div>
            <h2 class="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              平行坐标图
            </h2>
            <p class="text-xs text-muted-foreground">Parallel - 多维度分析</p>
          </div>
        </div>
        <div class="flex justify-center overflow-x-auto w-full">
          <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} class="max-w-full h-auto">
            <rect width={width} height={height} fill="#f8fafc" rx={14} />
            <Group top={margin.top} left={margin.left}>
              <For each={dimensions}>
                {(dim, i) => (
                  <g>
                    <line x1={i() * xStep} y1={0} x2={i() * xStep} y2={innerHeight} stroke="#cbd5e1" stroke-width={2} />
                    <Text x={i() * xStep} y={-15} textAnchor="middle" fill="#475569" font-size="12px" font-weight="bold">{dim}</Text>
                  </g>
                )}
              </For>
              <For each={parallelData}>
                {(item) => (
                  <g>
                    <LinePath data={item.values.map((v, i) => ({ x: i * xStep, y: yScale(v) }))} x={(d) => d.x} y={(d) => d.y} stroke={item.color} stroke-width={2.5} class="transition-all duration-300 hover:stroke-[4px] cursor-pointer" />
                    <For each={item.values}>{(v, i) => <circle cx={i() * xStep} cy={yScale(v)} r={5} fill={item.color} stroke="#fff" stroke-width={2} />}</For>
                  </g>
                )}
              </For>
            </Group>
          </svg>
        </div>
      </div>
    </div>
  );
};
