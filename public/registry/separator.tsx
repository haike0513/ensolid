import type { Component, JSX } from "solid-js";
import { splitProps } from "solid-js";
import * as SeparatorPrimitive from "@ensolid/radix";
import { cn } from "./utils";

export interface SeparatorProps extends SeparatorPrimitive.SeparatorProps {
  orientation?: "horizontal" | "vertical";
  decorative?: boolean;
}

export const Separator: Component<SeparatorProps> = (props) => {
  const [local, others] = splitProps(props, ["class", "orientation", "decorative"]);

  return (
    <SeparatorPrimitive.Separator
      decorative={local.decorative ?? true}
      orientation={local.orientation ?? "horizontal"}
      class={cn(
        "shrink-0 bg-border",
        local.orientation === "vertical" ? "h-full w-[1px]" : "h-[1px] w-full",
        local.class
      )}
      {...others}
    />
  );
};
