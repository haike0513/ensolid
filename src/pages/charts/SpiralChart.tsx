import type { Component } from "solid-js";
import { For, createMemo } from "solid-js";
import { Group } from "@ensolid/visx";
import { scaleLinear, scaleSequential } from "d3-scale";
import { interpolateTurbo } from "d3-scale-chromatic"; // Need to check if available, if not use simple interpolator

// If d3-scale-chromatic is not available, we use a custom interpolator
const interpolateColor = (t: number) => {
  // Simple detailed rainbow
  return `hsl(${t * 360}, 70%, 50%)`;
};

// Generate spiral data
const generateSpiralData = (count: number) => {
  const data = [];
  for (let i = 0; i < count; i++) {
    const angle = 0.1 * i;
    const r = 5 + 0.5 * angle; 
    // archimedean spiral r = a + b * theta
    // x = r * cos(theta), y = r * sin(theta)
    const x = r * Math.cos(angle);
    const y = r * Math.sin(angle);
    const value = Math.sin(angle * 0.5) * 50 + 50 + Math.random() * 20; // Some value
    data.push({ i, x, y, value, r, angle });
  }
  return data;
};

export const SpiralChart: Component = () => {
  const width = 600;
  const height = 400;
  const cx = width / 2;
  const cy = height / 2;

  const data = createMemo(() => generateSpiralData(300));
  
  const valueScale = scaleLinear().domain([0, 120]).range([2, 8]); // size of dot

  return (
    <div class="group relative">
      <div class="absolute -inset-1 bg-gradient-to-r from-fuchsia-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div class="relative bg-card border-2 border-muted rounded-2xl p-6 shadow-xl overflow-hidden transition-all duration-300 hover:border-fuchsia-500/30">
        <div class="flex items-center gap-3 mb-6">
          <div class="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-fuchsia-500/20 to-purple-500/20">
            <span class="text-2xl">🌀</span>
          </div>
          <div>
            <h2 class="text-2xl font-bold bg-gradient-to-r from-fuchsia-600 to-purple-600 bg-clip-text text-transparent">
              螺旋图
            </h2>
            <p class="text-xs text-muted-foreground">
              Spiral Chart - 周期性数据展示
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
             <Group top={cy} left={cx}>
               {/* Connecting Line */}
               {/* 
               <path
                 d={`M${data().map(d => `${d.x},${d.y}`).join("L")}`}
                 fill="none"
                 stroke="currentColor"
                 stroke-opacity="0.2"
                 stroke-width="1"
               />
               */}
               
               <For each={data()}>
                 {(d, i) => (
                   <circle
                     cx={d.x * 2.5} // Scale up radius
                     cy={d.y * 2.5}
                     r={valueScale(d.value)}
                     fill={interpolateColor(i() / data().length)}
                     class="transition-all duration-300 hover:r-10 cursor-pointer opacity-80 hover:opacity-100"
                   >
                     <title>{`Value: ${d.value.toFixed(1)}`}</title>
                   </circle>
                 )}
               </For>
             </Group>
          </svg>
        </div>
      </div>
    </div>
  );
};
