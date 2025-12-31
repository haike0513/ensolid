import type { Component } from "solid-js";
import { For } from "solid-js";
import { Group, Text, Arc } from "@ensolid/visx";

const gaugeValue = 72; // 当前值 (0-100)

export const GaugeChart: Component = () => {
  const width = 600;
  const height = 400;
  const centerX = width / 2;
  const centerY = height / 2 + 30;
  const radius = 150;
  const innerRadius = 120;
  
  // 仪表盘起始和结束角度 (半圆)
  const startAngle = -Math.PI * 0.75;
  const endAngle = Math.PI * 0.75;
  const totalAngle = endAngle - startAngle;
  
  // 计算指针角度
  const valueAngle = startAngle + (gaugeValue / 100) * totalAngle;

  // 刻度数据
  const ticks = [0, 25, 50, 75, 100];
  
  // 颜色分段
  const segments = [
    { start: 0, end: 30, color: "#ef4444" },
    { start: 30, end: 70, color: "#f59e0b" },
    { start: 70, end: 100, color: "#22c55e" },
  ];

  return (
    <div class="group relative">
      <div class="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
      </div>
      <div class="relative bg-card border-2 border-muted rounded-2xl p-6 shadow-xl overflow-hidden transition-all duration-300 hover:border-emerald-500/30">
        <div class="flex items-center gap-3 mb-6">
          <div class="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20">
            <span class="text-2xl">⏱️</span>
          </div>
          <div>
            <h2 class="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
              仪表盘
            </h2>
            <p class="text-xs text-muted-foreground">
              Gauge Chart - 完成度展示
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
            <Group top={centerY} left={centerX}>
              {/* 背景弧 */}
              <path
                d={`
                  M ${Math.cos(startAngle) * radius} ${Math.sin(startAngle) * radius}
                  A ${radius} ${radius} 0 1 1 ${Math.cos(endAngle) * radius} ${Math.sin(endAngle) * radius}
                `}
                fill="none"
                stroke="#e2e8f0"
                stroke-width={30}
                stroke-linecap="round"
              />

              {/* 颜色分段 */}
              <For each={segments}>
                {(seg) => {
                  const segStartAngle = startAngle + (seg.start / 100) * totalAngle;
                  const segEndAngle = startAngle + (seg.end / 100) * totalAngle;
                  const largeArcFlag = segEndAngle - segStartAngle > Math.PI ? 1 : 0;
                  
                  return (
                    <path
                      d={`
                        M ${Math.cos(segStartAngle) * radius} ${Math.sin(segStartAngle) * radius}
                        A ${radius} ${radius} 0 ${largeArcFlag} 1 ${Math.cos(segEndAngle) * radius} ${Math.sin(segEndAngle) * radius}
                      `}
                      fill="none"
                      stroke={seg.color}
                      stroke-width={30}
                      stroke-linecap="butt"
                      opacity={0.3}
                    />
                  );
                }}
              </For>

              {/* 当前值弧 */}
              <path
                d={`
                  M ${Math.cos(startAngle) * radius} ${Math.sin(startAngle) * radius}
                  A ${radius} ${radius} 0 ${valueAngle - startAngle > Math.PI ? 1 : 0} 1 ${Math.cos(valueAngle) * radius} ${Math.sin(valueAngle) * radius}
                `}
                fill="none"
                stroke={gaugeValue >= 70 ? "#22c55e" : gaugeValue >= 30 ? "#f59e0b" : "#ef4444"}
                stroke-width={30}
                stroke-linecap="round"
                class="transition-all duration-500"
              />

              {/* 刻度 */}
              <For each={ticks}>
                {(tick) => {
                  const tickAngle = startAngle + (tick / 100) * totalAngle;
                  const tickX1 = Math.cos(tickAngle) * (radius + 20);
                  const tickY1 = Math.sin(tickAngle) * (radius + 20);
                  const tickX2 = Math.cos(tickAngle) * (radius + 30);
                  const tickY2 = Math.sin(tickAngle) * (radius + 30);
                  const labelX = Math.cos(tickAngle) * (radius + 45);
                  const labelY = Math.sin(tickAngle) * (radius + 45);
                  
                  return (
                    <g>
                      <line
                        x1={tickX1}
                        y1={tickY1}
                        x2={tickX2}
                        y2={tickY2}
                        stroke="#94a3b8"
                        stroke-width={2}
                      />
                      <Text
                        x={labelX}
                        y={labelY}
                        textAnchor="middle"
                        verticalAnchor="middle"
                        fill="#64748b"
                        font-size="12px"
                      >{tick}</Text>
                    </g>
                  );
                }}
              </For>

              {/* 指针 */}
              <line
                x1={0}
                y1={0}
                x2={Math.cos(valueAngle) * (radius - 40)}
                y2={Math.sin(valueAngle) * (radius - 40)}
                stroke="#1e293b"
                stroke-width={4}
                stroke-linecap="round"
                class="transition-all duration-500"
              />
              <circle r={10} fill="#1e293b" />

              {/* 中心数值 */}
              <Text
                y={60}
                textAnchor="middle"
                verticalAnchor="middle"
                fill="#1e293b"
                font-size="48px"
                font-weight="bold"
              >{`${gaugeValue}%`}</Text>
              <Text
                y={90}
                textAnchor="middle"
                verticalAnchor="middle"
                fill="#64748b"
                font-size="14px"
              >
                完成率
              </Text>
            </Group>
          </svg>
        </div>
      </div>
    </div>
  );
};
