import type { Component, JSX } from "solid-js";
import { splitProps } from "solid-js";
import * as ScrollAreaPrimitive from "@ensolid/radix";
import { cn } from "./utils";

// ScrollArea Root
export interface ScrollAreaProps extends ScrollAreaPrimitive.ScrollAreaProps {
  children?: JSX.Element;
}

const ScrollAreaBase: Component<ScrollAreaProps> = (props) => {
  const [local, others] = splitProps(props, ["class", "children"]);

  return (
    <ScrollAreaPrimitive.ScrollArea
      class={cn("relative overflow-hidden", local.class)}
      {...others}
    >
      <ScrollAreaPrimitive.ScrollAreaViewport class="h-full w-full rounded-[inherit]">
        {local.children}
      </ScrollAreaPrimitive.ScrollAreaViewport>
      <ScrollBar />
      <ScrollAreaPrimitive.ScrollAreaCorner />
    </ScrollAreaPrimitive.ScrollArea>
  );
};

export const ScrollArea = Object.assign(ScrollAreaBase, {
  Viewport: null as any,
  Scrollbar: null as any,
  Thumb: null as any,
  Corner: null as any,
});

// ScrollBar
export interface ScrollBarProps extends ScrollAreaPrimitive.ScrollAreaScrollbarProps {
  orientation?: "vertical" | "horizontal";
}

export const ScrollBar: Component<ScrollBarProps> = (props) => {
  const [local, others] = splitProps(props, ["class", "orientation"]);

  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      orientation={local.orientation ?? "vertical"}
      class={cn(
        "flex touch-none select-none transition-colors",
        local.orientation === "vertical"
          ? "h-full w-2.5 border-l border-l-transparent p-[1px]"
          : "h-2.5 flex-col border-t border-t-transparent p-[1px]",
        local.class
      )}
      {...others}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb class="relative flex-1 rounded-full bg-border" />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  );
};

// Assign sub-components
ScrollArea.Viewport = ScrollAreaPrimitive.ScrollAreaViewport;
ScrollArea.Scrollbar = ScrollBar;
ScrollArea.Thumb = ScrollAreaPrimitive.ScrollAreaThumb;
ScrollArea.Corner = ScrollAreaPrimitive.ScrollAreaCorner;
