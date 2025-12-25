import type { Component, JSX } from "solid-js";
import { splitProps } from "solid-js";
import * as TooltipPrimitive from "@resolid/radix";
import { cn } from "./utils";

export interface TooltipProps extends TooltipPrimitive.TooltipProps {
    children?: JSX.Element;
}

export const Tooltip = TooltipPrimitive.Tooltip;

export interface TooltipTriggerProps extends TooltipPrimitive.TooltipTriggerProps {
    children?: JSX.Element;
}

export const TooltipTrigger: Component<TooltipTriggerProps> = (props) => {
    const [local, others] = splitProps(props, [
        "class",
        "children",
        "asChild",
    ]);

    return (
        <TooltipPrimitive.TooltipTrigger
            class={cn("", local.class)}
            {...others}
        >
            {local.children}
        </TooltipPrimitive.TooltipTrigger>
    );
};

export interface TooltipContentProps extends TooltipPrimitive.TooltipContentProps {
    children?: JSX.Element;
}

export const TooltipContent: Component<TooltipContentProps> = (props) => {
    const [local, others] = splitProps(props, ["class", "children"] as const);

    return (
        <TooltipPrimitive.TooltipContent
            class={cn(
                "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
                local.class,
            )}
            {...others}
        >
            {local.children}
        </TooltipPrimitive.TooltipContent>
    );
};

(Tooltip as any).Trigger = TooltipTrigger;
(Tooltip as any).Content = TooltipContent;

