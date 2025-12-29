/**
 * Edge 组件 - 移植自 Vercel AI Elements
 * 
 * 用于显示流程边的组件
 */

import type { Component } from "solid-js";
import { splitProps } from "solid-js";
import { Edge as EdgeBase, type EdgeComponentProps } from "@ensolid/solidflow";
import { cn } from "@/components/ui/utils";

export type EdgeProps = EdgeComponentProps & {
  className?: string;
};

export const Edge: Component<EdgeProps> = (props) => {
  const [local, others] = splitProps(props, ["class", "edge", "path"]);
  
  // 使用 SolidFlow 的 Edge 组件，但添加自定义样式
  return (
    <EdgeBase
      edge={local.edge}
      path={local.path}
      class={cn("stroke-1 stroke-ring", local.class)}
      {...others}
    />
  );
};

// 临时连接线组件（用于显示正在连接的线）
export type TemporaryEdgeProps = EdgeComponentProps;

export const TemporaryEdge: Component<TemporaryEdgeProps> = (props) => {
  const { edge, path } = props;
  
  return (
    <g>
      <path
        class="stroke-1 stroke-ring"
        d={path}
        fill="none"
        style={{
          "stroke-dasharray": "5, 5",
        }}
      />
    </g>
  );
};
