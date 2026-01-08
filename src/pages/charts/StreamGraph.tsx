import type { Component } from "solid-js";
import { Area, AxisBottom, AxisLeft, GridRows, Group } from "@ensolid/visx";
import { scaleLinear } from "d3-scale";
import { stack, stackOffsetWiggle, stackOrderInsideOut } from "d3-shape";
import { For } from "solid-js";

// Generate simpler stream data
const generateData = (pointCount: number, bumpCount: number) => {
  const arr = [];
  for (let i = 0; i < pointCount; i++) {
    // x value
    arr.push({ x: i, y0: 0, y1: 0, y2: 0 });
  }

  // Create "bumps" for each series
  for (let series = 0; series < 3; series++) {
     for (let i = 0; i < bumpCount; i++) {
        const x = Math.floor(Math.random() * pointCount);
        const height = 10 + Math.random() * 40;
        const width = 5 + Math.random() * 10;
        
        for (let j = Math.max(0, Math.floor(x - width)); j < Math.min(pointCount, Math.ceil(x + width)); j++) {
            const val = height * Math.exp(-Math.pow((j - x) / (width/2), 2));
            // @ts-ignore
            arr[j][`val${series}`] = (arr[j][`val${series}`] || 0) + val + Math.random() * 5;
        }
     }
  }
  
  // Fill missing
   for (let i = 0; i < pointCount; i++) {
        for(let s=0; s<3; s++) {
             // @ts-ignore
            if(!arr[i][`val${s}`]) arr[i][`val${s}`] = Math.random() * 2;
        }
    }

  return arr;
};

const data = generateData(50, 10);
const keys = ["val0", "val1", "val2"];
const colors = ["#ec4899", "#8b5cf6", "#3b82f6"];

export const StreamGraph: Component = () => {
  const width = 600;
  const height = 400;
  const margin = { top: 20, right: 30, bottom: 50, left: 30 };
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  // Stack generator
  const series = stack()
    .keys(keys)
    .offset(stackOffsetWiggle)
    .order(stackOrderInsideOut)(data as any);

  const xScale = scaleLinear()
    .domain([0, data.length - 1])
    .range([0, xMax]);

  // Find y min/max
  const maxY = Math.max(...series.flat().map(d => d[1]));
  const minY = Math.min(...series.flat().map(d => d[0]));
  
  const yScale = scaleLinear()
    .domain([minY, maxY])
    .range([yMax, 0]);

  return (
    <div class="group relative">
      <div class="absolute -inset-1 bg-gradient-to-r from-pink-500/20 to-blue-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div class="relative bg-card border-2 border-muted rounded-2xl p-6 shadow-xl overflow-hidden transition-all duration-300 hover:border-pink-500/30">
        <div class="flex items-center gap-3 mb-6">
          <div class="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500/20 to-blue-500/20">
            <span class="text-2xl">🌊</span>
          </div>
          <div>
            <h2 class="text-2xl font-bold bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">
              河流图
            </h2>
            <p class="text-xs text-muted-foreground">
              Stream Graph - 流动趋势展示
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
              <AxisBottom scale={xScale} top={yMax} tickFormat={(d) => `${d}`} numTicks={5} />
              
              <For each={series}>
                {(s, i) => (
                  <Area
                    data={s}
                    x={(d) => xScale(d.data.x) ?? 0}
                    y0={(d) => yScale(d[0]) ?? 0}
                    y1={(d) => yScale(d[1]) ?? 0}
                    fill={colors[i()]}
                    stroke="#fff"
                    stroke-width={0.5}
                    class="transition-opacity duration-300 hover:opacity-90"
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
