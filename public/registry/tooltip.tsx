import type { Component, JSX } from "solid-js";
import { splitProps } from "solid-js";
import * as TooltipPrimitive from "@ensolid/radix";
import { cn } from "./utils";

// Tooltip Provider
export interface TooltipProviderProps extends TooltipPrimitive.TooltipProviderProps {
  children?: JSX.Element;
}

export const TooltipProvider: Component<TooltipProviderProps> = (props) => {
  return <TooltipPrimitive.TooltipProvider {...props} />;
};

// Tooltip Root
export interface TooltipProps extends TooltipPrimitive.TooltipProps {
  children?: JSX.Element;
}

const TooltipBase: Component<TooltipProps> = (props) => {
  return <TooltipPrimitive.Tooltip {...props} />;
};

export const Tooltip = Object.assign(TooltipBase, {
  Trigger: null as any,
  Content: null as any,
  Provider: TooltipProvider,
});

// Tooltip Trigger
export interface TooltipTriggerProps extends TooltipPrimitive.TooltipTriggerProps {
  children?: JSX.Element;
}

export const TooltipTrigger: Component<TooltipTriggerProps> = (props) => {
  return <TooltipPrimitive.TooltipTrigger {...props} />;
};

// Tooltip Content
export interface TooltipContentProps extends TooltipPrimitive.TooltipContentProps {
  children?: JSX.Element;
}

export const TooltipContent: Component<TooltipContentProps> = (props) => {
  const [local, others] = splitProps(props, ["class", "children", "sideOffset"]);

  return (
    <TooltipPrimitive.TooltipContent
      sideOffset={local.sideOffset ?? 4}
      class={cn(
        "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        local.class
      )}
      {...others}
    >
      {local.children}
    </TooltipPrimitive.TooltipContent>
  );
};

// Assign sub-components
Tooltip.Trigger = TooltipTrigger;
Tooltip.Content = TooltipContent;
