import { Component, JSX, splitProps } from "solid-js";
import type { Viewport } from "../../types";

export interface BackgroundProps {
  /**
   * 背景颜色
   * @default '#ffffff'
   */
  color?: string;
  /**
   * 背景网格大小
   * @default 20
   */
  gap?: number;
  /**
   * 背景线条宽度
   * @default 1
   */
  lineWidth?: number;
  /**
   * 背景线条颜色
   * @default '#e2e8f0'
   */
  lineColor?: string;
  /**
   * 背景变体
   * @default 'dots'
   */
  variant?: "dots" | "lines" | "cross";
  /**
   * 背景大小
   */
  size?: number;
  /**
   * 类名
   */
  className?: string;
  /**
   * 样式
   */
  style?: JSX.CSSProperties;
  /**
   * 视口信息
   */
  viewport?: Viewport;
}

export const Background: Component<BackgroundProps> = (props) => {
  const [local, others] = splitProps(props, [
    "color",
    "gap",
    "lineWidth",
    "lineColor",
    "variant",
    "size",
    "className",
    "style",
    "viewport",
  ]);

  const color = () => local.color ?? "#ffffff";
  const gap = () => local.gap ?? 20;
  const lineWidth = () => local.lineWidth ?? 1;
  const lineColor = () => local.lineColor ?? "#e2e8f0";
  const variant = () => local.variant ?? "dots";
  const size = () => local.size ?? gap();
  const viewport = () => local.viewport ?? { x: 0, y: 0, zoom: 1 };

  const patternId = () =>
    `solidflow-background-${variant()}-${gap()}-${size()}`;

  // 计算偏移量和缩放
  const scaledGap = () => gap() * viewport().zoom;
  const xOffset = () => viewport().x % scaledGap();
  const yOffset = () => viewport().y % scaledGap();

  // 确保圆形/点的大小也稍微跟缩放有关，或者保持固定（ReactFlow 默认是 scaledGap，但 dot radius 可能是固定的 visually?）
  // ReactFlow: gap 缩放，dot radius 好像不缩放或者有单独逻辑。
  // 通常我们希望网格随 zoom 变大变小。

  const createPattern = () => {
    const sGap = scaledGap();
    const radius = (local.size || 1) * viewport().zoom;
    const strokeWidth = lineWidth() * viewport().zoom;

    if (variant() === "dots") {
      return (
        <pattern
          id={patternId()}
          x={xOffset()}
          y={yOffset()}
          width={sGap}
          height={sGap}
          patternUnits="userSpaceOnUse"
        >
          <circle cx={sGap / 2} cy={sGap / 2} r={radius} fill={lineColor()} />
        </pattern>
      );
    } else if (variant() === "lines") {
      return (
        <pattern
          id={patternId()}
          x={xOffset()}
          y={yOffset()}
          width={sGap}
          height={sGap}
          patternUnits="userSpaceOnUse"
        >
          <line
            x1="0"
            y1={sGap}
            x2={sGap}
            y2={sGap}
            stroke={lineColor()}
            stroke-width={strokeWidth}
          />
          <line
            x1={sGap}
            y1="0"
            x2={sGap}
            y2={sGap}
            stroke={lineColor()}
            stroke-width={strokeWidth}
          />
        </pattern>
      );
    } else {
      // cross
      return (
        <pattern
          id={patternId()}
          x={xOffset()}
          y={yOffset()}
          width={sGap}
          height={sGap}
          patternUnits="userSpaceOnUse"
        >
          <path
            d={`M ${sGap / 2} 0 V ${sGap} M 0 ${sGap / 2} H ${sGap}`}
            stroke={lineColor()}
            stroke-width={strokeWidth}
          />
        </pattern>
      );
    }
  };

  // 注意：当 variant 改变时 patternId 改变，会自动更新。
  // xOffset 和 yOffset 改变会更新 pattern 的 x, y。

  return (
    <div
      {...others}
      class={local.className}
      classList={{
        "absolute inset-0 pointer-events-none": true,
      }}
      style={{
        "background-color": color(),
        ...local.style,
      }}
    >
      <svg class="absolute inset-0 w-full h-full">
        <defs>{createPattern()}</defs>
        <rect width="100%" height="100%" fill={`url(#${patternId()})`} />
      </svg>
    </div>
  );
};
