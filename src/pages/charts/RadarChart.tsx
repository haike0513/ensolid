import type { Component } from "solid-js";
import { For } from "solid-js";
import { Group, Text } from "@ensolid/visx";
import { scaleLinear } from "d3-scale";

const radarData = [
  { attribute: "Speed", value: 90 },
  { attribute: "Power", value: 85 },
  { attribute: "Defense", value: 70 },
  { attribute: "Agility", value: 80 },
  { attribute: "Magic", value: 60 },
  { attribute: "Stamina", value: 75 },
];

export const RadarChart: Component = () => {
    const width = 600;
    const height = 400;
    const margin = { top: 40, right: 30, bottom: 50, left: 50 };
    const xMax = width - margin.left - margin.right;
    const yMax = height - margin.top - margin.bottom;

  const radarRadius = Math.min(xMax, yMax) / 2;
  const radarAngleStep = (Math.PI * 2) / radarData.length;
  const radarScale = scaleLinear<number>()
    .range([0, radarRadius])
    .domain([0, 100]);

  const radarPoints = radarData.map((d, i) => {
    const angle = i * radarAngleStep - Math.PI / 2;
    const r = radarScale(d.value);
    return [Math.cos(angle) * r, Math.sin(angle) * r];
  });
  const radarPolygonPoints = radarPoints.map((p) => p.join(",")).join(" ");

  return (
    <div class="group relative">
    <div class="absolute -inset-1 bg-gradient-to-r from-red-500/20 to-rose-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
    </div>
    <div class="relative bg-card border-2 border-muted rounded-2xl p-6 shadow-xl overflow-hidden transition-all duration-300 hover:border-red-500/30">
      <div class="flex items-center gap-3 mb-6">
        <div class="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-red-500/20 to-rose-500/20">
          <span class="text-2xl">🕸️</span>
        </div>
        <div>
          <h2 class="text-2xl font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
            雷达图
          </h2>
          <p class="text-xs text-muted-foreground">
            Radar Chart - 多维能力评估
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
            {/* Grid Circles */}
            <For each={[20, 40, 60, 80, 100]}>
              {(t) => (
                <circle
                  r={radarScale(t)}
                  fill="none"
                  stroke="#e2e8f0"
                  stroke-width={1}
                  stroke-dasharray="4 4"
                />
              )}
            </For>
            {/* Axis Lines */}
            <For each={radarData}>
              {(_, i) => {
                const angle = i() * radarAngleStep - Math.PI / 2;
                const r = radarRadius;
                const x = Math.cos(angle) * r;
                const y = Math.sin(angle) * r;
                return (
                  <line
                    x1={0}
                    y1={0}
                    x2={x}
                    y2={y}
                    stroke="#e2e8f0"
                    stroke-width={1}
                  />
                );
              }}
            </For>
            {/* Data Polygon */}
            <polygon
              points={radarPolygonPoints}
              fill="#ef4444"
              fill-opacity={0.3}
              stroke="#ef4444"
              stroke-width={2}
              class="transition-all duration-300 hover:fill-opacity-50"
            />
            {/* Data Points */}
            <For each={radarPoints}>
              {(p, i) => (
                <g>
                  <circle
                    cx={p[0]}
                    cy={p[1]}
                    r={4}
                    fill="#ef4444"
                    class="transition-all duration-200 hover:r-6"
                  />
                  <Text
                    x={Math.cos(i() * radarAngleStep - Math.PI / 2) * (radarRadius + 20)}
                    y={Math.sin(i() * radarAngleStep - Math.PI / 2) * (radarRadius + 20)}
                    textAnchor="middle"
                    verticalAnchor="middle"
                    font-size="12px"
                    fill="#64748b"
                  >{radarData[i()].attribute}</Text>
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
