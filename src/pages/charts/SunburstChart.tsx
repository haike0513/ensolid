import type { Component } from "solid-js";
import { For } from "solid-js";
import { Group, Text, Arc, arc as d3Arc, Pie } from "@ensolid/visx";

const sunburstData = {
  name: "全部",
  children: [
    {
      name: "亚洲",
      value: 40,
      color: "#6366f1",
      children: [
        { name: "中国", value: 20, color: "#818cf8" },
        { name: "日本", value: 12, color: "#a5b4fc" },
        { name: "韩国", value: 8, color: "#c7d2fe" },
      ],
    },
    {
      name: "欧洲",
      value: 30,
      color: "#8b5cf6",
      children: [
        { name: "德国", value: 12, color: "#a78bfa" },
        { name: "法国", value: 10, color: "#c4b5fd" },
        { name: "英国", value: 8, color: "#ddd6fe" },
      ],
    },
    {
      name: "美洲",
      value: 30,
      color: "#a855f7",
      children: [
        { name: "美国", value: 18, color: "#c084fc" },
        { name: "加拿大", value: 7, color: "#d8b4fe" },
        { name: "巴西", value: 5, color: "#e9d5ff" },
      ],
    },
  ],
};

export const SunburstChart: Component = () => {
  const width = 600;
  const height = 400;
  const centerX = width / 2;
  const centerY = height / 2;

  // 内圈和外圈半径
  const innerRadius1 = 60;
  const outerRadius1 = 110;
  const innerRadius2 = 115;
  const outerRadius2 = 165;

  // 计算第一层数据
  const level1Data = sunburstData.children;
  const totalValue = level1Data.reduce((sum, d) => sum + d.value, 0);

  // 计算角度
  let currentAngle = 0;
  const level1Arcs = level1Data.map((d) => {
    const angle = (d.value / totalValue) * Math.PI * 2;
    const arc = {
      ...d,
      startAngle: currentAngle,
      endAngle: currentAngle + angle,
    };
    currentAngle += angle;
    return arc;
  });

  // 计算第二层数据
  const level2Arcs: Array<{
    name: string;
    value: number;
    color: string;
    startAngle: number;
    endAngle: number;
  }> = [];

  level1Arcs.forEach((parent) => {
    if (parent.children) {
      const parentTotal = parent.children.reduce((sum, c) => sum + c.value, 0);
      let childAngle = parent.startAngle;
      parent.children.forEach((child) => {
        const angle =
          (child.value / parentTotal) * (parent.endAngle - parent.startAngle);
        level2Arcs.push({
          ...child,
          startAngle: childAngle,
          endAngle: childAngle + angle,
        });
        childAngle += angle;
      });
    }
  });

  const arcGenerator = d3Arc();

  return (
    <div class="group relative">
      <div class="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-violet-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div class="relative bg-card border-2 border-muted rounded-2xl p-6 shadow-xl overflow-hidden transition-all duration-300 hover:border-purple-500/30">
        <div class="flex items-center gap-3 mb-6">
          <div class="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-violet-500/20">
            <span class="text-2xl">☀️</span>
          </div>
          <div>
            <h2 class="text-2xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
              旭日图
            </h2>
            <p class="text-xs text-muted-foreground">
              Sunburst Chart - 多层级结构展示
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
              {/* 中心圆 */}
              <circle r={innerRadius1 - 5} fill="#f1f5f9" />
              <Text
                textAnchor="middle"
                verticalAnchor="middle"
                fill="#1e293b"
                font-size="14px"
                font-weight="bold"
              >
                全球市场
              </Text>

              {/* 第一层 */}
              <For each={level1Arcs}>
                {(arc) => {
                  const pathData = arcGenerator({
                    innerRadius: innerRadius1,
                    outerRadius: outerRadius1,
                    startAngle: arc.startAngle,
                    endAngle: arc.endAngle,
                  });
                  const midAngle =
                    (arc.startAngle + arc.endAngle) / 2 - Math.PI / 2;
                  const labelRadius = (innerRadius1 + outerRadius1) / 2;

                  return (
                    <g>
                      <path
                        d={pathData ?? ""}
                        fill={arc.color}
                        stroke="#ffffff"
                        stroke-width={2}
                        class="transition-all duration-300 hover:opacity-80 cursor-pointer"
                      />
                      <Text
                        x={Math.cos(midAngle) * labelRadius}
                        y={Math.sin(midAngle) * labelRadius}
                        textAnchor="middle"
                        verticalAnchor="middle"
                        fill="#ffffff"
                        font-size="12px"
                        font-weight="bold"
                      >
                        {arc.name}
                      </Text>
                    </g>
                  );
                }}
              </For>

              {/* 第二层 */}
              <For each={level2Arcs}>
                {(arc) => {
                  const pathData = arcGenerator({
                    innerRadius: innerRadius2,
                    outerRadius: outerRadius2,
                    startAngle: arc.startAngle,
                    endAngle: arc.endAngle,
                  });
                  const midAngle =
                    (arc.startAngle + arc.endAngle) / 2 - Math.PI / 2;
                  const labelRadius = (innerRadius2 + outerRadius2) / 2;
                  const arcSpan = arc.endAngle - arc.startAngle;

                  return (
                    <g>
                      <path
                        d={pathData ?? ""}
                        fill={arc.color}
                        stroke="#ffffff"
                        stroke-width={2}
                        class="transition-all duration-300 hover:opacity-80 cursor-pointer"
                      />
                      {arcSpan > 0.3 && (
                        <Text
                          x={Math.cos(midAngle) * labelRadius}
                          y={Math.sin(midAngle) * labelRadius}
                          textAnchor="middle"
                          verticalAnchor="middle"
                          fill="#374151"
                          font-size="10px"
                        >
                          {arc.name}
                        </Text>
                      )}
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
