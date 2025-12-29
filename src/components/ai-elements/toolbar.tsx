/**
 * Toolbar 组件 - 移植自 Vercel AI Elements
 * 
 * 用于显示节点工具栏的组件
 */

import type { Component, JSX } from "solid-js";
import { splitProps } from "solid-js";
import { Panel, type PanelPosition } from "@ensolid/solidflow";
import { cn } from "@/components/ui/utils";

export type ToolbarProps = JSX.HTMLAttributes<HTMLDivElement> & {
  position?: PanelPosition;
};

export const Toolbar: Component<ToolbarProps> = (props) => {
  const [local, others] = splitProps(props, ["class", "position", "children"]);
  return (
    <Panel
      position={local.position || "bottom"}
      class={cn(
        "flex items-center gap-1 rounded-sm border bg-background p-1.5",
        local.class
      )}
      {...others}
    >
      {local.children}
    </Panel>
  );
};
