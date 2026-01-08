import type { Component } from "solid-js";
import { For } from "solid-js";
import { Arc, Group, Pie, Text } from "@ensolid/visx";
import { arc as d3Arc } from "d3-shape";
import { scaleLinear } from "d3-scale";
import { max } from "d3-array";

const roseData = [
  { label: "rose1", value: 40, color: "#ff7c7c" },
  { label: "rose2", value: 33, color: "#ffbc7c" },
  { label: "rose3", value: 28, color: "#ffff7c" },
  { label: "rose4", value: 22, color: "#7cff7c" },
  { label: "rose5", value: 20, color: "#7cffff" },
  { label: "rose6", value: 15, color: "#7c7cff" },
  { label: "rose7", value: 12, color: "#bc7cff" },
  { label: "rose8", value: 10, color: "#ff7cff" },
];

export const NightingaleChart: Component = () => {
  const width = 600;
  const height = 400;
  const radius = Math.min(width, height) / 2 - 40;

  const radiusScale = scaleLinear<number>()
    .range([50, radius])
    .domain([0, max(roseData, (d: {value: number}) => d.value) || 100]);

  return (
    <div class="group relative">
      <div class="absolute -inset-1 bg-gradient-to-r from-pink-500/20 to-rose-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
      </div>
      <div class="relative bg-card border-2 border-muted rounded-2xl p-6 shadow-xl overflow-hidden transition-all duration-300 hover:border-pink-500/30">
        <div class="flex items-center gap-3 mb-6">
          <div class="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500/20 to-rose-500/20">
            <span class="text-2xl">🌹</span>
          </div>
          <div>
            <h2 class="text-2xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
              南丁格尔玫瑰图
            </h2>
            <p class="text-xs text-muted-foreground">
              Nightingale Chart - 极坐标半径对比
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
              <Pie data={roseData} value={(d) => d.value}>
                {(arcs) => (
                  <Group>
                    <For each={arcs}>
                      {(arcDatum) => (
                        <g>
                          <Arc
                            data={arcDatum}
                            innerRadius={20}
                            outerRadius={(d) => radiusScale(d.data.value) ?? 0}
                            cornerRadius={4}
                            fill={arcDatum.data.color}
                            class="transition-all duration-300 hover:opacity-80"
                          />
                           <Text
                            transform={`translate(${
                              d3Arc()
                                .innerRadius(radiusScale(arcDatum.data.value) ?? 0 + 10)
                                .outerRadius(radiusScale(arcDatum.data.value) ?? 0 + 10)
                                .centroid(arcDatum as any)
                            })`}
                            textAnchor="middle"
                            verticalAnchor="middle"
                            fill={arcDatum.data.color}
                            font-size="10px"
                            font-weight="bold"
                            pointer-events="none"
                          >
                             {arcDatum.data.label}
                          </Text>
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
