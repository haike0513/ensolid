import type { Component } from "solid-js";
import { For } from "solid-js";
import { AxisBottom, AxisLeft, Group, scaleBand, scaleLinear, scaleOrdinal } from "@ensolid/visx";

const hours = Array.from({ length: 24 }, (_, i) => i);
const days = ["Saturday", "Friday", "Thursday", "Wednesday", "Tuesday", "Monday", "Sunday"];

const generateData = () => {
  return days.flatMap((day) =>
    hours.map((hour) => ({
      day,
      hour,
      value: Math.floor(Math.random() * 20),
    }))
  );
};

const data = generateData();

export const PunchCardChart: Component = () => {
    const width = 800;
    const height = 400;
    const margin = { top: 40, right: 30, bottom: 50, left: 80 };
    const xMax = width - margin.left - margin.right;
    const yMax = height - margin.top - margin.bottom;

    const xScale = scaleBand<number>()
        .range([0, xMax])
        .domain(hours)
        .padding(0);

    const yScale = scaleBand<string>()
        .range([yMax, 0]) // Top to bottom
        .domain(days)
        .padding(0);

    const rScale = scaleLinear<number>()
        .range([0, 10])
        .domain([0, 20]);
    
    const colorScale = scaleLinear<string>()
        .range(["#bae6fd", "#0284c7"])
        .domain([0, 20]);

    return (
        <div class="group relative">
            <div class="absolute -inset-1 bg-gradient-to-r from-sky-500/20 to-blue-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            </div>
            <div class="relative bg-card border-2 border-muted rounded-2xl p-6 shadow-xl overflow-hidden transition-all duration-300 hover:border-sky-500/30">
                <div class="flex items-center gap-3 mb-6">
                    <div class="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500/20 to-blue-500/20">
                        <span class="text-2xl">🎫</span>
                    </div>
                    <div>
                        <h2 class="text-2xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
                            打卡图
                        </h2>
                        <p class="text-xs text-muted-foreground">
                            Punch Card - 时间段活跃度分布
                        </p>
                    </div>
                </div>
                <div class="flex justify-center overflow-x-auto w-full">
                    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} class="max-w-full h-auto">
                        <Group top={margin.top} left={margin.left}>
                            <AxisBottom
                                scale={xScale}
                                top={yMax}
                                tickFormat={(d: any) => `${d}`}
                            />
                            <AxisLeft scale={yScale} />
                            
                            {/* Grid Lines - Optional */}
                            <For each={days}>
                                {(day) => (
                                    <line
                                        x1={0}
                                        y1={yScale(day)! + yScale.bandwidth()/2}
                                        x2={xMax}
                                        y2={yScale(day)! + yScale.bandwidth()/2}
                                        stroke="#f1f5f9"
                                    />
                                )}
                            </For>
                             <For each={hours}>
                                {(hour) => (
                                    <line
                                        x1={xScale(hour)! + xScale.bandwidth()/2}
                                        y1={0}
                                        x2={xScale(hour)! + xScale.bandwidth()/2}
                                        y2={yMax}
                                        stroke="#f1f5f9"
                                    />
                                )}
                            </For>

                            <For each={data}>
                                {(d) => (
                                    <circle
                                        cx={xScale(d.hour)! + xScale.bandwidth() / 2}
                                        cy={yScale(d.day)! + yScale.bandwidth() / 2}
                                        r={rScale(d.value)}
                                        fill={colorScale(d.value)}
                                        class="transition-all duration-300 hover:opacity-80 hover:scale-110"
                                        style={{ "transform-origin": "center" }}
                                    >
                                        <title>{`${d.day} ${d.hour}:00 - Count: ${d.value}`}</title>
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
