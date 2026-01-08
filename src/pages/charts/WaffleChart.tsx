import type { Component } from "solid-js";
import { For, createMemo } from "solid-js";
import { Group } from "@ensolid/visx";
import { scaleOrdinal } from "d3-scale";

interface Data {
  label: string;
  value: number; // Percentage
}

const data: Data[] = [
  { label: "Product A", value: 33 },
  { label: "Product B", value: 25 },
  { label: "Product C", value: 17 },
  { label: "Product D", value: 15 },
  { label: "Product E", value: 10 },
];

export const WaffleChart: Component = () => {
  const width = 400;
  const height = 400;
  const margin = { top: 20, right: 20, bottom: 20, left: 20 };

  const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];
  const colorScale = scaleOrdinal<string, string>(colors).domain(
    data.map((d) => d.label),
  );

  const cells = createMemo(() => {
    const array = [];
    let currentDataIndex = 0;
    let currentDataCount = 0;

    for (let i = 0; i < 100; i++) {
      if (currentDataIndex >= data.length) break;

      const item = data[currentDataIndex];
      array.push({
        id: i,
        label: item.label,
        color: colorScale(item.label),
        x: (i % 10) * 35, // 30 size + 5 gap
        y: Math.floor(i / 10) * 35,
      });

      currentDataCount++;
      if (currentDataCount >= item.value) {
        currentDataCount = 0;
        currentDataIndex++;
      }
    }
    return array;
  });

  return (
    <div class="group relative">
      <div class="absolute -inset-1 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div class="relative bg-card border-2 border-muted rounded-2xl p-6 shadow-xl overflow-hidden transition-all duration-300 hover:border-yellow-500/30">
        <div class="flex items-center gap-3 mb-6">
          <div class="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20">
            <span class="text-2xl">🧇</span>
          </div>
          <div>
            <h2 class="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
              华夫饼图
            </h2>
            <p class="text-xs text-muted-foreground">
              Waffle Chart - 百分比构成展示
            </p>
          </div>
        </div>
        <div class="flex flex-col md:flex-row gap-8 items-center justify-center">
          <div class="relative">
            <svg
              width={350}
              height={350}
              viewBox="0 0 345 345"
              class="max-w-full h-auto"
            >
              <Group>
                <For each={cells()}>
                  {(cell) => (
                    <rect
                      x={cell.x}
                      y={cell.y}
                      width={30}
                      height={30}
                      rx={6}
                      fill={cell.color}
                      class="transition-all duration-300 hover:scale-110 hover:shadow-lg origin-center"
                    >
                      <title>{cell.label}</title>
                    </rect>
                  )}
                </For>
              </Group>
            </svg>
          </div>
          
          {/* Legend */}
          <div class="flex flex-col gap-3">
             <For each={data}>
               {(d) => (
                 <div class="flex items-center gap-3">
                   <div class="w-4 h-4 rounded bg-current" style={{ color: colorScale(d.label) }} />
                   <div class="text-sm font-medium">
                     {d.label} <span class="text-muted-foreground ml-1">({d.value}%)</span>
                   </div>
                 </div>
               )}
             </For>
          </div>
        </div>
      </div>
    </div>
  );
};
