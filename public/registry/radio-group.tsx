import type { Component, JSX } from "solid-js";
import { splitProps } from "solid-js";
import * as RadioGroupPrimitive from "@ensolid/radix";
import { cn } from "./utils";

// RadioGroup Root
export interface RadioGroupProps extends RadioGroupPrimitive.RadioGroupProps {
  children?: JSX.Element;
}

const RadioGroupBase: Component<RadioGroupProps> = (props) => {
  const [local, others] = splitProps(props, ["class", "children"]);

  return (
    <RadioGroupPrimitive.RadioGroup
      class={cn("grid gap-2", local.class)}
      {...others}
    >
      {local.children}
    </RadioGroupPrimitive.RadioGroup>
  );
};

export const RadioGroup = Object.assign(RadioGroupBase, {
  Item: null as any,
});

// RadioGroup Item
export interface RadioGroupItemProps extends RadioGroupPrimitive.RadioGroupItemProps {
  children?: JSX.Element;
}

export const RadioGroupItem: Component<RadioGroupItemProps> = (props) => {
  const [local, others] = splitProps(props, ["class", "children"]);

  return (
    <RadioGroupPrimitive.RadioGroupItem
      class={cn(
        "aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        local.class
      )}
      {...others}
    >
      <RadioGroupPrimitive.RadioGroupIndicator class="flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="h-2.5 w-2.5"
        >
          <circle cx="12" cy="12" r="10" />
        </svg>
      </RadioGroupPrimitive.RadioGroupIndicator>
    </RadioGroupPrimitive.RadioGroupItem>
  );
};

// Assign sub-components
RadioGroup.Item = RadioGroupItem;
