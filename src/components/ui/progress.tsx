import type { Component, JSX } from "solid-js";
import { splitProps } from "solid-js";
import * as ProgressPrimitive from "@ensolid/radix";
import { cn } from "./utils";

export interface ProgressProps extends ProgressPrimitive.ProgressProps {
    children?: JSX.Element;
}

export const Progress: Component<ProgressProps> = (props) => {
    const [local, others] = splitProps(props, [
        "value",
        "max",
        "showValue",
        "class",
        "children",
    ]);

    return (
        <ProgressPrimitive.Progress
            class={cn(
                "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
                local.class,
            )}
            value={local.value}
            max={local.max}
            showValue={local.showValue}
            {...others}
        >
            {local.children}
        </ProgressPrimitive.Progress>
    );
};

