import type { Component, JSX } from "solid-js";
import { splitProps } from "solid-js";
import * as PopoverPrimitive from "@ensolid/radix";
import { cn } from "./utils";

// Popover Root
export interface PopoverProps extends PopoverPrimitive.PopoverProps {
  children?: JSX.Element;
}

const PopoverBase: Component<PopoverProps> = (props) => {
  return <PopoverPrimitive.Popover {...props} />;
};

export const Popover = Object.assign(PopoverBase, {
  Trigger: null as any,
  Content: null as any,
  Anchor: null as any,
  Close: null as any,
});

// Popover Trigger
export interface PopoverTriggerProps extends PopoverPrimitive.PopoverTriggerProps {
  children?: JSX.Element;
}

export const PopoverTrigger: Component<PopoverTriggerProps> = (props) => {
  return <PopoverPrimitive.PopoverTrigger {...props} />;
};

// Popover Anchor
export interface PopoverAnchorProps extends PopoverPrimitive.PopoverAnchorProps {
  children?: JSX.Element;
}

export const PopoverAnchor: Component<PopoverAnchorProps> = (props) => {
  return <PopoverPrimitive.PopoverAnchor {...props} />;
};

// Popover Content
export interface PopoverContentProps extends PopoverPrimitive.PopoverContentProps {
  children?: JSX.Element;
}

export const PopoverContent: Component<PopoverContentProps> = (props) => {
  const [local, others] = splitProps(props, ["class", "children", "align", "sideOffset"]);

  return (
    <PopoverPrimitive.PopoverContent
      align={local.align ?? "center"}
      sideOffset={local.sideOffset ?? 4}
      class={cn(
        "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        local.class
      )}
      {...others}
    >
      {local.children}
    </PopoverPrimitive.PopoverContent>
  );
};

// Popover Close
export interface PopoverCloseProps extends PopoverPrimitive.PopoverCloseProps {
  children?: JSX.Element;
}

export const PopoverClose: Component<PopoverCloseProps> = (props) => {
  return <PopoverPrimitive.PopoverClose {...props} />;
};

// Assign sub-components
Popover.Trigger = PopoverTrigger;
Popover.Content = PopoverContent;
Popover.Anchor = PopoverAnchor;
Popover.Close = PopoverClose;
