/**
 * Canvas 组件 - 移植自 Vercel AI Elements
 *
 * 用于显示流程图的画布组件
 */

import type { Component, JSX } from "solid-js";
import { splitProps } from "solid-js";
import { Background, Flow, type FlowProps } from "@ensolid/solidflow";
import { cn } from "@/components/ui/utils";

export type CanvasProps = FlowProps & {
  children?: JSX.Element;
  deleteKeyCode?: string[];
  selectionOnDrag?: boolean;
  class?: string;
};

export const Canvas: Component<CanvasProps> = (props) => {
  const {
    children,
    deleteKeyCode: _deleteKeyCode,
    selectionOnDrag,
    class: className,
    nodes,
    edges,
    ...flowProps
  } = props;

  return (
    <Flow
      fitView={props.fitView ?? true}
      panOnDrag={props.panOnDrag ?? false}
      panOnScroll={props.panOnScroll ?? true}
      selectNodesOnDrag={selectionOnDrag ?? true}
      zoomOnDoubleClick={props.zoomOnDoubleClick ?? false}
      nodes={nodes || []}
      edges={edges || []}
      className={className}
      {...flowProps}
    >
      <Background color="var(--sidebar)" />
      {children}
    </Flow>
  );
};
