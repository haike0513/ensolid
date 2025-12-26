/**
 * Charts 页面
 */

import type { Component } from "solid-js";
import { For } from "solid-js";
import { 
  Group, Bar, AxisBottom, AxisLeft, LinePath,
  scaleBand, scaleLinear,
  max, extent,
  curveMonotoneX
} from "@ensolid/visx";

// Mock Data
const barData = [
  { label: 'A', value: 10 },
  { label: 'B', value: 20 },
  { label: 'C', value: 15 },
  { label: 'D', value: 30 },
  { label: 'E', value: 25 },
  { label: 'F', value: 18 },
  { label: 'G', value: 22 },
];

const lineData = Array.from({ length: 20 }, (_, i) => ({
  x: i,
  y: Math.sin(i / 3) * 10 + 15 + Math.random() * 5
}));

export const ChartsPage: Component = () => {
  const width = 600;
  const height = 400;
  const margin = { top: 40, right: 30, bottom: 50, left: 50 };
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  // Bar Chart Scales
  const xScaleBar = scaleBand<string>()
    .range([0, xMax])
    .domain(barData.map((d: { label: string; value: number }) => d.label))
    .padding(0.4);

  const yScaleBar = scaleLinear<number>()
    .range([yMax, 0])
    .domain([0, max(barData, (d: { label: string; value: number }) => d.value) ?? 0]);

  // Line Chart Scales
  const xScaleLine = scaleLinear<number>()
    .range([0, xMax])
    .domain(extent(lineData, (d: { x: number; y: number }) => d.x) as [number, number]);

  const yScaleLine = scaleLinear<number>()
    .range([yMax, 0])
    .domain([0, max(lineData, (d: { x: number; y: number }) => d.y) ?? 0]);

  return (
    <div class="container mx-auto px-4 py-12 space-y-16">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-4xl font-bold tracking-tight mb-8">Charts Example</h1>
        
        {/* Bar Chart */}
        <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
          <h2 class="text-2xl font-semibold mb-6">Bar Chart</h2>
          <div class="flex justify-center overflow-x-auto">
            <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
              <rect width={width} height={height} fill="url(#gradients)" rx={14} />
              <Group top={margin.top} left={margin.left}>
                <AxisBottom scale={xScaleBar} top={yMax} />
                <AxisLeft scale={yScaleBar} />
                <For each={barData}>
                  {(d) => {
                    const barHeight = yMax - (yScaleBar(d.value) ?? 0);
                    return (
                      <Bar
                        class="transition-all duration-300 hover:opacity-80 cursor-pointer"
                        x={xScaleBar(d.label)}
                        y={yMax - barHeight}
                        width={xScaleBar.bandwidth()}
                        height={barHeight}
                        fill="#3b82f6"
                        rx={4}
                      />
                    );
                  }}
                </For>
              </Group>
            </svg>
          </div>
        </div>

        {/* Line Chart */}
        <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
           <h2 class="text-2xl font-semibold mb-6">Line Chart</h2>
           <div class="flex justify-center overflow-x-auto">
            <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
                <Group top={margin.top} left={margin.left}>
                    <AxisBottom scale={xScaleLine} top={yMax} tickFormat={(d: any) => `T${d}`} />
                    <AxisLeft scale={yScaleLine} />
                    <LinePath
                        data={lineData} 
                        x={(d: { x: number; y: number }) => xScaleLine(d.x) ?? 0}
                        y={(d: { x: number; y: number }) => yScaleLine(d.y) ?? 0}
                        stroke="#10b981"
                        stroke-width={3}
                        curve={curveMonotoneX}
                    />
                    <For each={lineData}>
                        {(d) => (
                            <circle
                                cx={xScaleLine(d.x)}
                                cy={yScaleLine(d.y)}
                                r={4}
                                fill="#ffffff"
                                stroke="#10b981"
                                stroke-width={2}
                                class="transition-all duration-200 hover:r-6 hover:fill-emerald-100"
                            />
                        )}
                    </For>
                </Group>
            </svg>
           </div>
        </div>

      </div>
    </div>
  );
};
