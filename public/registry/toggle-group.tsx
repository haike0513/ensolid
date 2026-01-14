import type { Component, JSX } from "solid-js";
import { splitProps, For } from "solid-js";
import * as ToggleGroupPrimitive from "@ensolid/radix";
import { cn } from "./utils";
import { toggleVariants } from "./toggle";

export interface ToggleGroupProps extends ToggleGroupPrimitive.ToggleGroupProps {
  variant?: "default" | "outline";
  size?: "default" | "sm" | "lg";
}

const ToggleGroupBase: Component<ToggleGroupProps> = (props) => {
  const [local, others] = splitProps(props, ["class", "variant", "size", "children"]);

  return (
    <ToggleGroupPrimitive.ToggleGroup
      class={cn("flex items-center justify-center gap-1", local.class)}
      {...others}
    >
      {local.children}
    </ToggleGroupPrimitive.ToggleGroup>
  );
};

export const ToggleGroup = Object.assign(ToggleGroupBase, {
  Item: null as any,
});

export interface ToggleGroupItemProps extends ToggleGroupPrimitive.ToggleGroupItemProps {
  variant?: "default" | "outline";
  size?: "default" | "sm" | "lg";
}

export const ToggleGroupItem: Component<ToggleGroupItemProps> = (props) => {
  const [local, others] = splitProps(props, ["class", "variant", "size", "children"]);

  return (
    <ToggleGroupPrimitive.ToggleGroupItem
      class={cn(
        toggleVariants.base,
        toggleVariants.variant[local.variant ?? "default"],
        toggleVariants.size[local.size ?? "default"],
        local.class
      )}
      {...others}
    >
      {local.children}
    </ToggleGroupPrimitive.ToggleGroupItem>
  );
};

ToggleGroup.Item = ToggleGroupItem;
