/**
 * Charts 页面
 */

import type { Component } from "solid-js";
import { For } from "solid-js";
import { 
  Group, Bar, AxisBottom, AxisLeft, LinePath, Area, Pie, Arc, GridRows, GridColumns, Text,
  scaleBand, scaleLinear,
  max, extent,
  curveMonotoneX,
  arc as d3Arc
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

const stockData = Array.from({ length: 50 }, (_, i) => ({
  date: new Date(2023, 0, i + 1),
  value: 100 + Math.random() * 50 - 25 + i * 2
}));

const pieData = [
  { label: 'Chrome', usage: 65, color: '#4285F4' },
  { label: 'Safari', usage: 20, color: '#34A853' },
  { label: 'Firefox', usage: 10, color: '#EA4335' },
  { label: 'Edge', usage: 5, color: '#FBBC05' },
];

export const ChartsPage: Component = () => {
  const width = 600;
  const height = 400;
  const margin = { top: 40, right: 30, bottom: 50, left: 50 };
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  // Bar Chart Scales
  const xScaleBar = scaleBand<string>()
    .range([0, xMax])
    .domain(barData.map((d) => d.label))
    .padding(0.4);

  const yScaleBar = scaleLinear<number>()
    .range([yMax, 0])
    .domain([0, max(barData, (d) => d.value) ?? 0]);

  // Line Chart Scales
  const xScaleLine = scaleLinear<number>()
    .range([0, xMax])
    .domain(extent(lineData, (d) => d.x) as [number, number]);

  const yScaleLine = scaleLinear<number>()
    .range([yMax, 0])
    .domain([0, max(lineData, (d) => d.y) ?? 0]);
    
  // Area Chart Scales
  const xScaleArea = scaleLinear<number>()
    .range([0, xMax])
    .domain(extent(stockData, (d) => d.date.getTime()) as [number, number]);
    
  const yScaleArea = scaleLinear<number>()
    .range([yMax, 0])
    .domain([0, max(stockData, (d) => d.value) ?? 0]);

  return (
    <div class="container mx-auto px-4 py-12 space-y-16">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-4xl font-bold tracking-tight mb-8">Charts Example</h1>
        
        {/* Bar Chart */}
        <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
          <h2 class="text-2xl font-semibold mb-6">Bar Chart</h2>
          <div class="flex justify-center overflow-x-auto">
            <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
              <rect width={width} height={height} fill="#f8fafc" rx={14} />
              <Group top={margin.top} left={margin.left}>
                <GridRows scale={yScaleBar} width={xMax} stroke="#e2e8f0" />
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
                    <GridRows scale={yScaleLine} width={xMax} stroke="#e2e8f0" />
                    <GridColumns scale={xScaleLine} height={yMax} stroke="#e2e8f0" />
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
        
        {/* Area Chart */}
        <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
           <h2 class="text-2xl font-semibold mb-6">Area Chart</h2>
           <div class="flex justify-center overflow-x-auto">
            <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
                <Group top={margin.top} left={margin.left}>
                    <GridRows scale={yScaleArea} width={xMax} stroke="#e2e8f0" />
                    <AxisBottom 
                        scale={xScaleArea} 
                        top={yMax} 
                        numTicks={5} 
                        tickFormat={(d: any) => new Date(d).toLocaleDateString()}
                    />
                    <AxisLeft scale={yScaleArea} />
                    <Area
                        data={stockData}
                        x={(d: any) => xScaleArea(d.date.getTime()) ?? 0}
                        y0={() => yScaleArea(0) ?? yMax}
                        y1={(d: any) => yScaleArea(d.value) ?? 0}
                        fill="#8b5cf6"
                        fill-opacity={0.4}
                        curve={curveMonotoneX}
                    />
                    <LinePath
                         data={stockData}
                         x={(d: any) => xScaleArea(d.date.getTime()) ?? 0}
                         y={(d: any) => yScaleArea(d.value) ?? 0}
                         stroke="#8b5cf6"
                         stroke-width={2}
                         curve={curveMonotoneX}
                    />
                </Group>
            </svg>
           </div>
        </div>

        {/* Pie Chart */}
        <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
           <h2 class="text-2xl font-semibold mb-6">Pie Chart</h2>
           <div class="flex justify-center overflow-x-auto">
            <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
                <Group top={height / 2} left={width / 2}>
                    <Pie
                        data={pieData}
                        value={(d) => d.usage}
                        padAngle={0.02}
                    >
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
                                            transform={`translate(${d3Arc().innerRadius(100).outerRadius(180).centroid(arcDatum as any)})`}
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
                            </Group>
                        )}
                    </Pie>
                </Group>
            </svg>
           </div>
        </div>

      </div>
    </div>
  );
};
