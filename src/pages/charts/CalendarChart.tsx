import type { Component } from "solid-js";
import { For, createMemo } from "solid-js";
import { Group, Text } from "@ensolid/visx";
import { scaleLinear } from "d3-scale";
import { timeFormat } from "d3-time-format";

export const CalendarChart: Component = () => {
  const width = 800;
  const height = 200;
  const margin = { top: 40, right: 20, bottom: 20, left: 40 };

  const cellSize = 15;
  const year = 2024;

  const data = createMemo(() => {
    const days: { date: Date; value: number }[] = [];
    const start = new Date(year, 0, 1);
    const end = new Date(year + 1, 0, 1);
    for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
      days.push({
        date: new Date(d),
        value: Math.floor(Math.random() * 100),
      });
    }
    return days;
  });

  const colorScale = scaleLinear<string>()
    .domain([0, 50, 100])
    .range(["#ebedf0", "#9be9a8", "#216e39"]);

  const formatDate = timeFormat("%Y-%m-%d");
  const getDay = (d: Date) => d.getDay();
  const getWeek = (d: Date) => {
    const startOfYear = new Date(d.getFullYear(), 0, 1);
    const pastDays = (d.getTime() - startOfYear.getTime()) / 86400000;
    return Math.floor((pastDays + startOfYear.getDay()) / 7);
  };

  const months = createMemo<Date[]>(() => {
    const m: Date[] = [];
    for (let i = 0; i < 12; i++) {
        m.push(new Date(year, i, 1));
    }
    return m;
  });
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div class="group relative">
      <div class="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
      </div>
      <div class="relative bg-card border-2 border-muted rounded-2xl p-6 shadow-xl overflow-hidden transition-all duration-300 hover:border-emerald-500/30">
        <div class="flex items-center gap-3 mb-6">
          <div class="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20">
            <span class="text-2xl">📅</span>
          </div>
          <div>
            <h2 class="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              日历图
            </h2>
            <p class="text-xs text-muted-foreground">
              Calendar Chart - 时间维度数据分布
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
              {/* 月份标签 */}
              <For each={months()}>
                {(month) => (
                  <Text
                    x={getWeek(month) * (cellSize + 2)}
                    y={-10}
                    font-size="10px"
                    fill="#64748b"
                  >
                    {timeFormat("%b")(month)}
                  </Text>
                )}
              </For>

              {/* 星期标签 */}
              <For each={[1, 3, 5]}>
                {(day) => (
                  <Text
                    x={-30}
                    y={day * (cellSize + 2) + cellSize / 2}
                    verticalAnchor="middle"
                    font-size="10px"
                    fill="#64748b"
                  >
                    {weekDays[day]}
                  </Text>
                )}
              </For>

              {/* 日历方块 */}
              <For each={data()}>
                {(d) => (
                  <rect
                    x={getWeek(d.date) * (cellSize + 2)}
                    y={getDay(d.date) * (cellSize + 2)}
                    width={cellSize}
                    height={cellSize}
                    fill={colorScale(d.value)}
                    rx={2}
                    class="transition-all duration-200 hover:stroke-emerald-500 hover:stroke-2 cursor-pointer"
                  >
                    <title>{`${formatDate(d.date)}: ${d.value}`}</title>
                  </rect>
                )}
              </For>
            </Group>
          </svg>
        </div>
      </div>
    </div>
  );
};
