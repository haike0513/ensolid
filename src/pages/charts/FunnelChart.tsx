import type { Component } from "solid-js";
import { For } from "solid-js";
import { Group, Text } from "@ensolid/visx";

const funnelData = [
  { stage: "访问", value: 100, color: "#6366f1" },
  { stage: "点击", value: 80, color: "#8b5cf6" },
  { stage: "咨询", value: 60, color: "#a855f7" },
  { stage: "订单", value: 40, color: "#d946ef" },
  { stage: "成交", value: 20, color: "#ec4899" },
];

export const FunnelChart: Component = () => {
  const width = 600;
  const height = 400;
  const margin = { top: 40, right: 80, bottom: 40, left: 80 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const maxValue = Math.max(...funnelData.map((d) => d.value));
  const stageHeight = innerHeight / funnelData.length;

  return (
    <div class="group relative">
      <div class="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-pink-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
      </div>
      <div class="relative bg-card border-2 border-muted rounded-2xl p-6 shadow-xl overflow-hidden transition-all duration-300 hover:border-indigo-500/30">
        <div class="flex items-center gap-3 mb-6">
          <div class="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-pink-500/20">
            <span class="text-2xl">🔻</span>
          </div>
          <div>
            <h2 class="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
              漏斗图
            </h2>
            <p class="text-xs text-muted-foreground">
              Funnel Chart - 转化率分析
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
              <For each={funnelData}>
                {(d, i) => {
                  const currentWidth = (d.value / maxValue) * innerWidth;
                  const nextWidth = i() < funnelData.length - 1 
                    ? (funnelData[i() + 1].value / maxValue) * innerWidth 
                    : currentWidth * 0.5;
                  const y = i() * stageHeight;
                  const centerX = innerWidth / 2;

                  // 梯形路径
                  const path = `
                    M ${centerX - currentWidth / 2} ${y}
                    L ${centerX + currentWidth / 2} ${y}
                    L ${centerX + nextWidth / 2} ${y + stageHeight}
                    L ${centerX - nextWidth / 2} ${y + stageHeight}
                    Z
                  `;

                  return (
                    <g>
                      <path
                        d={path}
                        fill={d.color}
                        class="transition-all duration-300 hover:opacity-80 cursor-pointer"
                        stroke="#ffffff"
                        stroke-width={2}
                      />
                      <Text
                        x={centerX}
                        y={y + stageHeight / 2}
                        textAnchor="middle"
                        verticalAnchor="middle"
                        fill="#ffffff"
                        font-size="14px"
                        font-weight="bold"
                      >
                        {d.stage}
                      </Text>
                      <Text
                        x={centerX + currentWidth / 2 + 15}
                        y={y + stageHeight / 2}
                        textAnchor="start"
                        verticalAnchor="middle"
                        fill="#64748b"
                        font-size="12px"
                      >
                        {d.value}%
                      </Text>
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
