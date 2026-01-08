import type { Component } from "solid-js";
import { For } from "solid-js";
import { Arc, Group, Pie, Text } from "@ensolid/visx";
import { arc as d3Arc } from "d3-shape";

const pieData = [
    { label: "Chrome", usage: 65, color: "#4285F4" },
    { label: "Safari", usage: 20, color: "#34A853" },
    { label: "Firefox", usage: 10, color: "#EA4335" },
    { label: "Edge", usage: 5, color: "#FBBC05" },
  ];

export const PieChart: Component = () => {
    const width = 600;
    const height = 400;

  return (
    <div class="group relative">
    <div class="absolute -inset-1 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
    </div>
    <div class="relative bg-card border-2 border-muted rounded-2xl p-6 shadow-xl overflow-hidden transition-all duration-300 hover:border-orange-500/30">
      <div class="flex items-center gap-3 mb-6">
        <div class="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20">
          <span class="text-2xl">🥧</span>
        </div>
        <div>
          <h2 class="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            饼图
          </h2>
          <p class="text-xs text-muted-foreground">
            Pie Chart - 占比分析
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
          <Group top={height / 2} left={width / 2}>
            <Pie data={pieData} value={(d) => d.usage} padAngle={0.02}>
              {(arcs) => (
                <Group>
                  <For each={arcs}>
                    {(arcDatum) => (
                      <g>
                        <Arc
                          data={arcDatum}
                          innerRadius={100}
                          outerRadius={180}
                          cornerRadius={4}
                          fill={arcDatum.data.color}
                          class="transition-all duration-300 hover:opacity-80"
                        />
                        <Text
                          transform={`translate(${
                            d3Arc()
                              .innerRadius(100)
                              .outerRadius(180)
                              .centroid(arcDatum as any)
                          })`}
                          textAnchor="middle"
                          verticalAnchor="middle"
                          fill="white"
                          font-size="12px"
                          font-weight="bold"
                          pointer-events="none"
                        >{arcDatum.data.label}</Text>
                      </g>
                    )}
                  </For>
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
