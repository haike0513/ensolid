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
  const { path, fromX, fromY, toX, toY } = props;
  
  // 如果有明确的坐标，计算路径；否则使用提供的 path
  let finalPath = path;
  if (fromX !== undefined && fromY !== undefined && toX !== undefined && toY !== undefined) {
    const midX = fromX + (toX - fromX) * HALF;
    finalPath = `M${fromX},${fromY} C ${midX},${fromY} ${midX},${toY} ${toX},${toY}`;
  }
  
  if (!finalPath) {
    return null;
  }
  
  return (
    <g>
      <path
        class="animated"
        d={finalPath}
        fill="none"
        stroke="var(--color-ring)"
        stroke-width="1"
      />
      {toX !== undefined && toY !== undefined && (
        <circle
          cx={toX}
          cy={toY}
          fill="#fff"
          r="3"
          stroke="var(--color-ring)"
          stroke-width="1"
        />
      )}
    </g>
  );
};
