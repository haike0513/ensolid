import type { Component } from "solid-js";
import { For } from "solid-js";
import { AxisBottom, AxisLeft, GridRows, Group, scaleBand, scaleLinear, Bar, Text, max, min } from "@ensolid/visx";

const waterfallData = [
  { label: "期初", value: 1000, isTotal: true },
  { label: "销售收入", value: 500, isIncrease: true },
  { label: "投资收益", value: 200, isIncrease: true },
  { label: "成本支出", value: -300, isIncrease: false },
  { label: "税费", value: -150, isIncrease: false },
  { label: "运营费用", value: -100, isIncrease: false },
  { label: "期末", value: 1150, isTotal: true },
];

// 计算累积值
let cumulative = 0;
const processedData = waterfallData.map((d, i) => {
  if (d.isTotal) {
    cumulative = d.value;
    return { ...d, start: 0, end: d.value };
  }
  const start = cumulative;
  cumulative += d.value;
  return { ...d, start, end: cumulative };
});

export const WaterfallChart: Component = () => {
  const width = 600;
  const height = 400;
  const margin = { top: 40, right: 30, bottom: 60, left: 60 };
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  const xScale = scaleBand<string>()
    .range([0, xMax])
    .domain(processedData.map((d) => d.label))
    .padding(0.3);

  const allValues = processedData.flatMap((d) => [d.start, d.end]);
  const yScale = scaleLinear<number>()
    .range([yMax, 0])
    .domain([Math.min(0, min(allValues) ?? 0), max(allValues) ?? 0])
    .nice();

  return (
    <div class="group relative">
      <div class="absolute -inset-1 bg-gradient-to-r from-sky-500/20 to-blue-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
      </div>
      <div class="relative bg-card border-2 border-muted rounded-2xl p-6 shadow-xl overflow-hidden transition-all duration-300 hover:border-sky-500/30">
        <div class="flex items-center gap-3 mb-6">
          <div class="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500/20 to-blue-500/20">
            <span class="text-2xl">📉</span>
          </div>
          <div>
            <h2 class="text-2xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
              瀑布图
            </h2>
            <p class="text-xs text-muted-foreground">
              Waterfall Chart - 增减变化分析
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
            <rect width={width} height={height} fill="#f8fafc" rx={14} />
            <Group top={margin.top} left={margin.left}>
              <GridRows scale={yScale} width={xMax} stroke="#e2e8f0" />
              <AxisBottom 
                scale={xScale} 
                top={yMax}
                tickLabelProps={() => ({
                  fill: '#64748b',
                  fontSize: 11,
                  textAnchor: 'middle',
                })}
              />
              <AxisLeft scale={yScale} />
              
              <For each={processedData}>
                {(d, i) => {
                  const barHeight = Math.abs(yScale(d.start) - yScale(d.end));
                  const barY = Math.min(yScale(d.start), yScale(d.end));
                  
                  let fill = "#3b82f6"; // 总计 - 蓝色
                  if (!d.isTotal) {
                    fill = d.value >= 0 ? "#22c55e" : "#ef4444"; // 增加绿色，减少红色
                  }

                  return (
                    <g>
                      <Bar
                        class="transition-all duration-300 hover:opacity-80 cursor-pointer"
                        x={xScale(d.label)}
                        y={barY}
                        width={xScale.bandwidth()}
                        height={barHeight}
                        fill={fill}
                        rx={4}
                      />
                      {/* 连接线 */}
                      {i() < processedData.length - 1 && !d.isTotal && (
                        <line
                          x1={(xScale(d.label) ?? 0) + xScale.bandwidth()}
                          y1={yScale(d.end)}
                          x2={(xScale(processedData[i() + 1].label) ?? 0)}
                          y2={yScale(d.end)}
                          stroke="#94a3b8"
                          stroke-dasharray="4 2"
                          stroke-width={1}
                        />
                      )}
                      {/* 数值标签 */}
                      <Text
                        x={(xScale(d.label) ?? 0) + xScale.bandwidth() / 2}
                        y={barY - 5}
                        textAnchor="middle"
                        fill="#64748b"
                        font-size="11px"
                        font-weight="bold"
                      >{d.isTotal ? d.value : (d.value >= 0 ? `+${d.value}` : d.value)}</Text>
                    </g>
                  );
                }}
              </For>
            </Group>
          </svg>
        </div>
      </div>
    </div>
  );
};
