import type { Component, JSX } from "solid-js";
import { splitProps } from "solid-js";
import * as ProgressPrimitive from "@ensolid/radix";
import { cn } from "./utils";

export interface ProgressProps extends ProgressPrimitive.ProgressProps {
  value?: number;
}

export const Progress: Component<ProgressProps> = (props) => {
  const [local, others] = splitProps(props, ["class", "value"]);

  return (
    <ProgressPrimitive.Progress
      class={cn(
        "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
        local.class
      )}
      {...others}
    >
      <ProgressPrimitive.ProgressIndicator
        class="h-full w-full flex-1 bg-primary transition-all"
        style={{ transform: `translateX(-${100 - (local.value ?? 0)}%)` }}
      />
    </ProgressPrimitive.Progress>
  );
};
