/**
 * Canvas 组件 - 移植自 Vercel AI Elements
 * 
 * 用于显示流程图的画布组件
 */

import type { Component, JSX } from "solid-js";
import { splitProps } from "solid-js";
import { Flow, Background, type FlowProps } from "@ensolid/solidflow";
import { cn } from "@/components/ui/utils";

export type CanvasProps = FlowProps & {
  children?: JSX.Element;
};

export const Canvas: Component<CanvasProps> = (props) => {
  const [local, others] = splitProps(props, [
    "class",
    "children",
    "deleteKeyCode",
    "fitView",
    "panOnDrag",
    "panOnScroll",
    "selectionOnDrag",
    "zoomOnDoubleClick",
  ]);

  return (
    <Flow
      deleteKeyCode={local.deleteKeyCode || ["Backspace", "Delete"]}
      fitView={local.fitView ?? true}
      panOnDrag={local.panOnDrag ?? false}
      panOnScroll={local.panOnScroll ?? true}
      selectionOnDrag={local.selectionOnDrag ?? true}
      zoomOnDoubleClick={local.zoomOnDoubleClick ?? false}
      class={cn(local.class)}
      {...others}
    >
      <Background bgColor="var(--sidebar)" />
      {local.children}
    </Flow>
  );
};
