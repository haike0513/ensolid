import type { Component } from "solid-js";
import { For } from "solid-js";
import { AxisBottom, AxisLeft, Group, Bar, LinePath, GridRows } from "@ensolid/visx";
import { scaleBand, scaleLinear } from "d3-scale";
import { curveMonotoneX } from "d3-shape";

const data = [
  { month: "Jan", evaporation: 2.0, precipitation: 2.6, temperature: 2.0 },
  { month: "Feb", evaporation: 4.9, precipitation: 5.9, temperature: 2.2 },
  { month: "Mar", evaporation: 7.0, precipitation: 9.0, temperature: 3.3 },
  { month: "Apr", evaporation: 23.2, precipitation: 26.4, temperature: 4.5 },
  { month: "May", evaporation: 25.6, precipitation: 28.7, temperature: 6.3 },
  { month: "Jun", evaporation: 76.7, precipitation: 70.7, temperature: 10.2 },
  { month: "Jul", evaporation: 135.6, precipitation: 175.6, temperature: 20.3 },
  { month: "Aug", evaporation: 162.2, precipitation: 182.2, temperature: 23.4 },
  { month: "Sep", evaporation: 32.6, precipitation: 48.7, temperature: 23.0 },
  { month: "Oct", evaporation: 20.0, precipitation: 18.8, temperature: 16.5 },
  { month: "Nov", evaporation: 6.4, precipitation: 6.0, temperature: 12.0 },
  { month: "Dec", evaporation: 3.3, precipitation: 2.3, temperature: 6.2 },
];

export const MixedChart: Component = () => {
  const width = 800;
  const height = 400;
  const margin = { top: 40, right: 60, bottom: 50, left: 60 };
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  // X scale (Categories)
  const xScale = scaleBand<string>()
    .range([0, xMax])
    .domain(data.map(d => d.month))
    .padding(0.2);

  // Y1 scale (Bar - Precipitation/Evaporation)
  const y1Scale = scaleLinear<number>()
    .range([yMax, 0])
    .domain([0, 200]);

  // Y2 scale (Line - Temperature)
  const y2Scale = scaleLinear<number>()
    .range([yMax, 0])
    .domain([0, 30]);

  return (
    <div class="group relative">
      <div class="absolute -inset-1 bg-gradient-to-r from-slate-500/20 to-zinc-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
      </div>
      <div class="relative bg-card border-2 border-muted rounded-2xl p-6 shadow-xl overflow-hidden transition-all duration-300 hover:border-slate-500/30">
        <div class="flex items-center gap-3 mb-6">
          <div class="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-slate-500/20 to-zinc-500/20">
            <span class="text-2xl">📊</span>
          </div>
          <div>
            <h2 class="text-2xl font-bold bg-gradient-to-r from-slate-600 to-zinc-600 bg-clip-text text-transparent">
              折柱混合图
            </h2>
            <p class="text-xs text-muted-foreground">
              Mixed Chart - 多维度双轴分析
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
              <GridRows scale={y1Scale} width={xMax} stroke="#f1f5f9" />
              
              {/* Bars: Evaporation */}
              <For each={data}>
                {(d) => (
                  <Bar
                    x={xScale(d.month)}
                    y={y1Scale(d.evaporation)}
                    width={xScale.bandwidth() / 2}
                    height={yMax - y1Scale(d.evaporation)}
                    fill="#94a3b8"
                    opacity={0.8}
                  />
                )}
              </For>
              
               {/* Bars: Precipitation */}
               <For each={data}>
                {(d) => (
                  <Bar
                    x={xScale(d.month)! + xScale.bandwidth() / 2}
                    y={y1Scale(d.precipitation)}
                    width={xScale.bandwidth() / 2}
                    height={yMax - y1Scale(d.precipitation)}
                    fill="#64748b"
                    opacity={0.8}
                  />
                )}
              </For>

              {/* Line: Temperature */}
              <LinePath
                data={data}
                x={(d) => xScale(d.month)! + xScale.bandwidth()/2}
                y={(d) => y2Scale(d.temperature)}
                stroke="#eab308"
                stroke-width={3}
                curve={curveMonotoneX}
              />
              <For each={data}>
                {(d) => (
                   <circle
                      cx={xScale(d.month)! + xScale.bandwidth()/2}
                      cy={y2Scale(d.temperature)}
                      r={4}
                      fill="white"
                      stroke="#eab308"
                      stroke-width={2}
                   />
                )}
              </For>

              <AxisBottom
                scale={xScale}
                top={yMax}
              />
              <AxisLeft 
                scale={y1Scale}
                stroke="#64748b" 
                tickLabelProps={() => ({ fill: "#64748b", fontSize: 11, dx: -2 })}
              />
              {/* Secondary Axis simulated with AxisLeft on right side - keeping it simple for now or omitting if not supported */}
              <AxisLeft 
                scale={y2Scale} 
                left={xMax} 
                stroke="#eab308"
                tickLabelProps={() => ({ fill: "#eab308", fontSize: 11, dx: 2 })}
              />
            </Group>
          </svg>
        </div>
      </div>
    </div>
  );
};
