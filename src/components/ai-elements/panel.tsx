/**
 * Panel 组件 - 移植自 Vercel AI Elements
 * 
 * 用于在流程图上显示面板的组件
 */

import type { Component, JSX } from "solid-js";
import { splitProps } from "solid-js";
import { Panel as PanelBase, type PanelPosition } from "@ensolid/solidflow";
import { cn } from "@/components/ui/utils";

export type PanelProps = JSX.HTMLAttributes<HTMLDivElement> & {
  position?: PanelPosition;
};

export const Panel: Component<PanelProps> = (props) => {
  const [local, others] = splitProps(props, ["class", "position", "children"]);
  return (
    <PanelBase
      position={local.position}
      class={cn("m-4 overflow-hidden rounded-md border bg-card p-1", local.class)}
      {...others}
    >
      {local.children}
    </PanelBase>
  );
};
