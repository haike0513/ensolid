import type { Component, JSX } from "solid-js";
import { splitProps } from "solid-js";
import * as CheckboxPrimitive from "@ensolid/radix";
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
    >
      <CheckboxPrimitive.CheckboxIndicator class="flex items-center justify-center text-current">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="h-4 w-4"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </CheckboxPrimitive.CheckboxIndicator>
    </CheckboxPrimitive.Checkbox>
  );
};
