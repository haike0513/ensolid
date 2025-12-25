import type { Component, JSX } from "solid-js";
import { splitProps } from "solid-js";
import * as CheckboxPrimitive from "@resolid/radix";
import { cn } from "./utils";

export interface CheckboxProps extends CheckboxPrimitive.CheckboxProps {
  children?: JSX.Element;
}

export const Checkbox: Component<CheckboxProps> = (props) => {
  const [local, others] = splitProps(props, ["class", "children"]);

  return (
    <CheckboxPrimitive.Checkbox
      class={cn(
        "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
        local.class
      )}
      {...others}
    />
  );
};

