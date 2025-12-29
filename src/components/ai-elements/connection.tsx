/**
 * Connection 组件 - 移植自 Vercel AI Elements
 * 
 * 用于显示临时连接线的组件（连接时显示）
 * 注意：在 SolidFlow 中，连接线通过 Edge 组件渲染
 * 这个组件主要用于自定义连接线的样式
 */

import type { Component } from "solid-js";
import type { EdgeComponentProps, XYPosition } from "@ensolid/solidflow";

export type ConnectionProps = EdgeComponentProps & {
  fromX?: number;
  fromY?: number;
  toX?: number;
  toY?: number;
};

const HALF = 0.5;

export const Connection: Component<ConnectionProps> = (props) => {
  const { edge, path, fromX, fromY, toX, toY } = props;
  
  // 如果有明确的坐标，使用它们；否则使用 path
  const sourceX = fromX ?? edge.sourceX ?? 0;
  const sourceY = fromY ?? edge.sourceY ?? 0;
  const targetX = toX ?? edge.targetX ?? 0;
  const targetY = toY ?? edge.targetY ?? 0;
  
  // 计算贝塞尔曲线路径
  const midX = sourceX + (targetX - sourceX) * HALF;
  const bezierPath = `M${sourceX},${sourceY} C ${midX},${sourceY} ${midX},${targetY} ${targetX},${targetY}`;
  
  return (
    <g>
      <path
        class="animated"
        d={path || bezierPath}
        fill="none"
        stroke="var(--color-ring)"
        stroke-width="1"
      />
      <circle
        cx={targetX}
        cy={targetY}
        fill="#fff"
        r="3"
        stroke="var(--color-ring)"
        stroke-width="1"
      />
    </g>
  );
};
