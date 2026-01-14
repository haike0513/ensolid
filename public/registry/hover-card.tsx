import type { Component, JSX } from "solid-js";
import { splitProps } from "solid-js";
import * as HoverCardPrimitive from "@ensolid/radix";
import { cn } from "./utils";

// HoverCard Root
export interface HoverCardProps extends HoverCardPrimitive.HoverCardProps {
  children?: JSX.Element;
}

const HoverCardBase: Component<HoverCardProps> = (props) => {
  return <HoverCardPrimitive.HoverCard {...props} />;
};

export const HoverCard = Object.assign(HoverCardBase, {
  Trigger: null as any,
  Content: null as any,
});

// HoverCard Trigger
export interface HoverCardTriggerProps extends HoverCardPrimitive.HoverCardTriggerProps {
  children?: JSX.Element;
}

export const HoverCardTrigger: Component<HoverCardTriggerProps> = (props) => {
  return <HoverCardPrimitive.HoverCardTrigger {...props} />;
};

// HoverCard Content
export interface HoverCardContentProps extends HoverCardPrimitive.HoverCardContentProps {
  children?: JSX.Element;
}

export const HoverCardContent: Component<HoverCardContentProps> = (props) => {
  const [local, others] = splitProps(props, ["class", "children", "align", "sideOffset"]);

  return (
    <HoverCardPrimitive.HoverCardContent
      align={local.align ?? "center"}
      sideOffset={local.sideOffset ?? 4}
      class={cn(
        "z-50 w-64 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        local.class
      )}
      {...others}
    >
      {local.children}
    </HoverCardPrimitive.HoverCardContent>
  );
};

// Assign sub-components
HoverCard.Trigger = HoverCardTrigger;
HoverCard.Content = HoverCardContent;
