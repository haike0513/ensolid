import type { Component } from "solid-js";
import { For, createMemo } from "solid-js";
import { Group } from "@ensolid/visx";
import { chord, ribbon } from "d3-chord";
import { scaleOrdinal } from "d3-scale";
import { arc } from "d3-shape";

// Matrix of relationships (e.g., flow between 4 groups)
const matrix = [
  [11975, 5871, 8916, 2868],
  [1951, 10048, 2060, 6171],
  [8010, 16145, 8090, 8045],
  [1013, 990, 940, 6907],
];

const labels = ["Group A", "Group B", "Group C", "Group D"];
const colors = ["#ef4444", "#3b82f6", "#10b981", "#f59e0b"];

export const ChordDiagram: Component = () => {
  const width = 600;
  const height = 600;
  const outerRadius = Math.min(width, height) * 0.5 - 60;
  const innerRadius = outerRadius - 20;

  const chordGenerator = chord()
    .padAngle(0.05)
    .sortSubgroups(((a: number, b: number) => b - a) as any); // Simple sort

  const arcGenerator = arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius);

  const ribbonGenerator = ribbon()
    .radius(innerRadius);

  const colorScale = scaleOrdinal<string, string>(colors).domain(labels);

  const chords = createMemo(() => chordGenerator(matrix as any));

  return (
    <div class="group relative">
      <div class="absolute -inset-1 bg-gradient-to-r from-rose-500/20 to-orange-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div class="relative bg-card border-2 border-muted rounded-2xl p-6 shadow-xl overflow-hidden transition-all duration-300 hover:border-rose-500/30">
        <div class="flex items-center gap-3 mb-6">
          <div class="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500/20 to-orange-500/20">
            <span class="text-2xl">🕸️</span>
          </div>
          <div>
            <h2 class="text-2xl font-bold bg-gradient-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent">
              弦图
            </h2>
            <p class="text-xs text-muted-foreground">
              Chord Diagram - 复杂关系流转
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
            <Group left={width / 2} top={height / 2}>
              {/* Groups (Outer Arcs) */}
              <For each={chords().groups}>
                {(group, i) => (
                  <g class="transition-opacity duration-300 hover:opacity-80 cursor-pointer">
                    <path
                      d={arcGenerator(group as any) || ""}
                      fill={colorScale(labels[group.index])}
                      stroke={colorScale(labels[group.index])}
                    />
                    <text
                      dy={-5}
                      transform={`rotate(${
                        ((group.startAngle + group.endAngle) / 2) * (180 / Math.PI) - 90
                      }) translate(${outerRadius + 10}) ${
                        ((group.startAngle + group.endAngle) / 2) > Math.PI ? "rotate(180)" : ""
                      }`}
                      text-anchor={((group.startAngle + group.endAngle) / 2) > Math.PI ? "end" : "start"}
                      class="text-xs font-semibold fill-muted-foreground"
                    >
                      {labels[i()]}
                    </text>
                  </g>
                )}
              </For>

              {/* Ribbons (Inner Connections) */}
              <For each={chords()}>
                {(chordRel) => (
                  <path
                    d={(ribbonGenerator(chordRel as any) as unknown as string) || ""}
                    fill={colorScale(labels[chordRel.source.index])} // Use source color using correct index
                    stroke={colorScale(labels[chordRel.source.index])}
                    fill-opacity={0.6}
                    class="transition-all duration-300 hover:fill-opacity-90 hover:stroke-opacity-100"
                  >
                    <title>
                      {`${labels[chordRel.source.index]} → ${labels[chordRel.target.index]}: ${chordRel.source.value}\n${labels[chordRel.target.index]} → ${labels[chordRel.source.index]}: ${chordRel.target.value}`}
                    </title>
                  </path>
                )}
              </For>
            </Group>
          </svg>
        </div>
      </div>
    </div>
  );
};
