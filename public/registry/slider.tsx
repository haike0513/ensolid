import type { Component, JSX } from "solid-js";
import { splitProps } from "solid-js";
import * as SliderPrimitive from "@ensolid/radix";
import { cn } from "./utils";

export interface SliderProps extends SliderPrimitive.SliderProps {}

export const Slider: Component<SliderProps> = (props) => {
  const [local, others] = splitProps(props, ["class"]);

  return (
    <SliderPrimitive.Slider
      class={cn(
        "relative flex w-full touch-none select-none items-center",
        local.class
      )}
      {...others}
    >
      <SliderPrimitive.SliderTrack class="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
        <SliderPrimitive.SliderRange class="absolute h-full bg-primary" />
      </SliderPrimitive.SliderTrack>
      <SliderPrimitive.SliderThumb class="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
    </SliderPrimitive.Slider>
  );
};
