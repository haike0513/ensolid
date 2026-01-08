import type { Component } from "solid-js";
import { For, createSignal, onCleanup, onMount } from "solid-js";
import { AxisBottom, AxisLeft, GridColumns, GridRows, Group, LinePath } from "@ensolid/visx";
import { scaleLinear } from "d3-scale";
import { curveMonotoneX } from "d3-shape";
import { extent, max } from "d3-array";

export const DynamicLineChart: Component = () => {
    const width = 600;
    const height = 400;
    const margin = { top: 40, right: 30, bottom: 50, left: 50 };
    const xMax = width - margin.left - margin.right;
    const yMax = height - margin.top - margin.bottom;

    const [data, setData] = createSignal(Array.from({ length: 20 }, (_, i) => ({
      x: i,
      y: Math.random() * 50 + 10
    })));

    // Real-time update simulation
    const timer = setInterval(() => {
        setData(prev => {
            const nextX = (prev[prev.length - 1]?.x ?? 0) + 1;
            const nextY = Math.random() * 50 + 10;
            // Keep last 20 points, logic: remove first, add next
            const newData = [...prev.slice(1), { x: nextX, y: nextY }];
            // Re-index x to keep chart stable or let it flow?
            // Let's re-index x from 0 to 19 to make it look like a shifting window
            return newData.map((d, i) => ({ x: i, y: d.y }));
        });
    }, 1000);

    onCleanup(() => clearInterval(timer));

    const xScale = scaleLinear<number>()
        .range([0, xMax])
        .domain([0, 19]); // Fixed domain for sliding window

    // Dynamic Y domain
    const yScale = () => scaleLinear<number>()
        .range([yMax, 0])
        .domain([0, 80]); // Fixed Y range for stability, or could be dynamic

    return (
        <div class="group relative">
            <div class="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div class="relative bg-card border-2 border-muted rounded-2xl p-6 shadow-xl overflow-hidden transition-all duration-300 hover:border-blue-500/30">
                <div class="flex items-center gap-3 mb-6">
                    <div class="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20">
                        <span class="text-2xl">⚡</span>
                    </div>
                    <div>
                        <h2 class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                            动态折线图
                        </h2>
                        <p class="text-xs text-muted-foreground">
                            Dynamic Line Chart - 实时数据监控
                        </p>
                    </div>
                </div>
                <div class="flex justify-center overflow-x-auto w-full">
                    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} class="max-w-full h-auto">
                        <Group top={margin.top} left={margin.left}>
                            <GridRows scale={yScale()} width={xMax} stroke="#e2e8f0" />
                            <GridColumns scale={xScale} height={yMax} stroke="#e2e8f0" />
                            <AxisBottom scale={xScale} top={yMax} tickFormat={(d: any) => `${d}s`} />
                            <AxisLeft scale={yScale()} />
                            <LinePath
                                data={data()}
                                x={(d) => xScale(d.x) ?? 0}
                                y={(d) => yScale()(d.y) ?? 0}
                                stroke="#0ea5e9"
                                stroke-width={3}
                                curve={curveMonotoneX}
                            />
                            <For each={data()}>
                                {(d) => (
                                    <circle
                                        cx={xScale(d.x)}
                                        cy={yScale()(d.y)}
                                        r={4}
                                        fill="#ffffff"
                                        stroke="#0ea5e9"
                                        stroke-width={2}
                                        class="transition-all duration-200"
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
