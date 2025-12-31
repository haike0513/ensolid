import type { Component } from "solid-js";
import { For } from "solid-js";
import { Group, Text, Arc, arc as d3Arc, scaleLinear } from "@ensolid/visx";

const polarData = [
  { name: "周一", value: 120, color: "#6366f1" },
  { name: "周二", value: 200, color: "#8b5cf6" },
  { name: "周三", value: 150, color: "#a855f7" },
  { name: "周四", value: 80, color: "#d946ef" },
  { name: "周五", value: 170, color: "#ec4899" },
  { name: "周六", value: 110, color: "#f43f5e" },
  { name: "周日", value: 90, color: "#fb7185" },
];

export const PolarBarChart: Component = () => {
  const width = 600;
  const height = 400;
  const centerX = width / 2;
  const centerY = height / 2;
  const innerRadius = 40;
  const outerRadius = 160;

  const maxValue = Math.max(...polarData.map((d) => d.value));
  const angleStep = (Math.PI * 2) / polarData.length;

  const radiusScale = scaleLinear<number>()
    .domain([0, maxValue])
    .range([innerRadius, outerRadius]);

  const arcGenerator = d3Arc();

  return (
    <div class="group relative">
      <div class="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-rose-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
      </div>
      <div class="relative bg-card border-2 border-muted rounded-2xl p-6 shadow-xl overflow-hidden transition-all duration-300 hover:border-indigo-500/30">
        <div class="flex items-center gap-3 mb-6">
          <div class="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-rose-500/20">
            <span class="text-2xl">🎡</span>
          </div>
          <div>
            <h2 class="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-rose-600 bg-clip-text text-transparent">
              极坐标柱状图
            </h2>
            <p class="text-xs text-muted-foreground">
              Polar Bar Chart - 环形数据对比
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
              {/* 背景网格圆环 */}
              <For each={[0.25, 0.5, 0.75, 1]}>
                {(ratio) => (
                  <circle
                    r={innerRadius + (outerRadius - innerRadius) * ratio}
                    fill="none"
                    stroke="#e2e8f0"
                    stroke-width={1}
                    stroke-dasharray="4 4"
                  />
                )}
              </For>

              {/* 极坐标柱状 */}
              <For each={polarData}>
                {(d, i) => {
                  const startAngle = i() * angleStep - Math.PI / 2;
                  const endAngle = startAngle + angleStep * 0.8;
                  const radius = radiusScale(d.value);

                  const pathData = arcGenerator({
                    innerRadius: innerRadius,
                    outerRadius: radius,
                    startAngle: startAngle + Math.PI / 2,
                    endAngle: endAngle + Math.PI / 2,
                  });

                  // 标签位置
                  const labelAngle = startAngle + (angleStep * 0.4);
                  const labelRadius = outerRadius + 20;

                  return (
                    <g>
                      <path
                        d={pathData ?? ""}
                        fill={d.color}
                        class="transition-all duration-300 hover:opacity-80 cursor-pointer"
                        stroke="#ffffff"
                        stroke-width={1}
                      />
                      <Text
                        x={Math.cos(labelAngle) * labelRadius}
                        y={Math.sin(labelAngle) * labelRadius}
                        textAnchor="middle"
                        verticalAnchor="middle"
                        fill="#64748b"
                        font-size="12px"
                      >{d.name}</Text>
                    </g>
                  );
                }}
              </For>

              {/* 中心标签 */}
              <circle r={innerRadius - 5} fill="#f1f5f9" />
              <Text
                textAnchor="middle"
                verticalAnchor="middle"
                fill="#1e293b"
                font-size="12px"
                font-weight="bold"
              >活跃度</Text>
            </Group>
          </svg>
        </div>
      </div>
    </div>
  );
};
