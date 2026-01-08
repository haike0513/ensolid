import type { Component } from "solid-js";
import { For } from "solid-js";
import { Arc, Group, Pie, Text } from "@ensolid/visx";
import { arc as d3Arc } from "d3-shape";

const donutData = [
  { label: "Vue", usage: 40, color: "#42b883" },
  { label: "React", usage: 30, color: "#61dafb" },
  { label: "Angular", usage: 20, color: "#dd1b16" },
  { label: "Solid", usage: 10, color: "#2c4f7c" },
];

export const DonutChart: Component = () => {
  const width = 400;
  const height = 400;

  return (
    <div class="group relative">
      <div class="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div class="relative bg-card border-2 border-muted rounded-2xl p-6 shadow-xl overflow-hidden transition-all duration-300 hover:border-emerald-500/30">
        <div class="flex items-center gap-3 mb-6">
          <div class="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20">
            <span class="text-2xl">🍩</span>
          </div>
          <div>
            <h2 class="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              甜甜圈图
            </h2>
            <p class="text-xs text-muted-foreground">
              Donut Chart - 环形占比分析
            </p>
          </div>
        </div>
        <div class="flex justify-center overflow-x-auto w-full">
          <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} class="max-w-full h-auto">
            <Group top={height / 2} left={width / 2}>
              <Pie data={donutData} value={(d) => d.usage} padAngle={0.04}>
                {(arcs) => (
                  <Group>
                    <For each={arcs}>
                      {(arcDatum) => (
                        <g>
                          <Arc
                            data={arcDatum}
                            innerRadius={80}
                            outerRadius={150}
                            cornerRadius={6}
                            fill={arcDatum.data.color}
                            class="transition-all duration-300 hover:opacity-80"
                          />
                          <Text
                            transform={`translate(${d3Arc()
                              .innerRadius(80)
                              .outerRadius(150)
                              .centroid(arcDatum as any)})`}
                            textAnchor="middle"
                            verticalAnchor="middle"
                            fill="white"
                            font-size="12px"
                            font-weight="bold"
                            pointer-events="none"
                          >
                            {arcDatum.data.label}
                          </Text>
                        </g>
                      )}
                    </For>
                    <Text textAnchor="middle" verticalAnchor="middle" font-size="24px" font-weight="bold" fill="#fff">Usage</Text>
                  </Group>
                )}
              </Pie>
            </Group>
          </svg>
        </div>
      </div>
    </div>
  );
};
