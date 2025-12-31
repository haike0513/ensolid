import type { Component } from "solid-js";
import { Group, Text } from "@ensolid/visx";

const liquidValue = 65; // 百分比值

export const LiquidChart: Component = () => {
  const width = 600;
  const height = 400;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = 120;

  // 水面高度计算
  const waterHeight = (liquidValue / 100) * radius * 2;
  const waterY = centerY + radius - waterHeight;

  // 波浪参数
  const waveHeight = 8;
  const waveCount = 3;

  // 生成波浪路径
  const generateWavePath = (offset: number) => {
    const points: string[] = [];
    const step = (radius * 2) / 40;
    
    for (let x = -radius; x <= radius; x += step) {
      const waveY = Math.sin((x / radius) * Math.PI * waveCount + offset) * waveHeight;
      points.push(`${centerX + x},${waterY + waveY}`);
    }
    
    // 闭合路径 - 圆形裁剪
    points.push(`${centerX + radius},${centerY + radius}`);
    points.push(`${centerX - radius},${centerY + radius}`);
    
    return `M ${points.join(' L ')} Z`;
  };

  // 计算颜色
  const getColor = (value: number) => {
    if (value >= 70) return { main: "#22c55e", light: "#86efac" };
    if (value >= 40) return { main: "#f59e0b", light: "#fcd34d" };
    return { main: "#ef4444", light: "#fca5a5" };
  };

  const colors = getColor(liquidValue);

  return (
    <div class="group relative">
      <div class="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
      </div>
      <div class="relative bg-card border-2 border-muted rounded-2xl p-6 shadow-xl overflow-hidden transition-all duration-300 hover:border-cyan-500/30">
        <div class="flex items-center gap-3 mb-6">
          <div class="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20">
            <span class="text-2xl">💧</span>
          </div>
          <div>
            <h2 class="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
              水球图
            </h2>
            <p class="text-xs text-muted-foreground">
              Liquid Fill - 完成进度展示
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
            <defs>
              {/* 圆形裁剪 */}
              <clipPath id="liquidClip">
                <circle cx={centerX} cy={centerY} r={radius - 5} />
              </clipPath>
              
              {/* 渐变 */}
              <linearGradient id="liquidGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color={colors.light} stop-opacity="0.8" />
                <stop offset="100%" stop-color={colors.main} stop-opacity="1" />
              </linearGradient>
            </defs>

            <Group>
              {/* 外圈 */}
              <circle
                cx={centerX}
                cy={centerY}
                r={radius}
                fill="none"
                stroke={colors.main}
                stroke-width={4}
                opacity={0.3}
              />
              
              {/* 背景圆 */}
              <circle
                cx={centerX}
                cy={centerY}
                r={radius - 5}
                fill="#f1f5f9"
              />

              {/* 水波 - 使用裁剪 */}
              <g clip-path="url(#liquidClip)">
                {/* 第二层波浪 (背景) */}
                <path
                  d={generateWavePath(1)}
                  fill={colors.light}
                  opacity={0.5}
                >
                  <animate
                    attributeName="d"
                    dur="3s"
                    repeatCount="indefinite"
                    values={`${generateWavePath(0)};${generateWavePath(Math.PI)};${generateWavePath(Math.PI * 2)}`}
                  />
                </path>
                
                {/* 第一层波浪 (前景) */}
                <path
                  d={generateWavePath(0)}
                  fill="url(#liquidGradient)"
                >
                  <animate
                    attributeName="d"
                    dur="2s"
                    repeatCount="indefinite"
                    values={`${generateWavePath(0)};${generateWavePath(Math.PI)};${generateWavePath(Math.PI * 2)}`}
                  />
                </path>
              </g>

              {/* 中心文字 */}
              <Text
                x={centerX}
                y={centerY - 10}
                textAnchor="middle"
                verticalAnchor="middle"
                fill="#1e293b"
                font-size="48px"
                font-weight="bold"
              >{`${liquidValue}%`}</Text>
              <Text
                x={centerX}
                y={centerY + 30}
                textAnchor="middle"
                verticalAnchor="middle"
                fill="#64748b"
                font-size="14px"
              >任务完成度</Text>
            </Group>
          </svg>
        </div>
      </div>
    </div>
  );
};
