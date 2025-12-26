import type { Component, JSX } from "solid-js";
import { splitProps } from "solid-js";
import * as SliderPrimitive from "@ensolid/radix";
import { cn } from "./utils";

export interface SliderProps extends SliderPrimitive.SliderProps {
    children?: JSX.Element;
}

export const Slider: Component<SliderProps> = (props) => {
    const [local, others] = splitProps(props, [
        "value",
        "defaultValue",
        "onValueChange",
        "min",
        "max",
        "step",
        "disabled",
        "class",
    ]);

    return (
        <SliderPrimitive.Slider
            class={cn(
                "relative flex w-full touch-none select-none items-center",
                local.class,
            )}
            value={local.value}
            defaultValue={local.defaultValue}
            onValueChange={local.onValueChange}
            min={local.min}
            max={local.max}
            step={local.step}
            disabled={local.disabled}
            {...others}
        />
    );
};

