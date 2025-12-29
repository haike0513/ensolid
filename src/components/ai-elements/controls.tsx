/**
 * Controls 组件 - 移植自 Vercel AI Elements
 * 
 * 用于显示流程图控制按钮的组件
 */

import type { Component, JSX } from "solid-js";
import { splitProps } from "solid-js";
import { Controls as ControlsBase, type PanelPosition } from "@ensolid/solidflow";
import { cn } from "@/components/ui/utils";

export type ControlsProps = JSX.HTMLAttributes<HTMLDivElement> & {
  position?: PanelPosition;
};

export const Controls: Component<ControlsProps> = (props) => {
  const [local, others] = splitProps(props, ["class", "position"]);
  return (
    <ControlsBase
      position={local.position}
      class={cn(
        "gap-px overflow-hidden rounded-md border bg-card p-1 shadow-none!",
        "[&>button]:rounded-md [&>button]:border-none! [&>button]:bg-transparent! [&>button]:hover:bg-secondary!",
        local.class
      )}
      {...others}
    />
  );
};
