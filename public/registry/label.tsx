import type { Component, JSX } from "solid-js";
import { splitProps } from "solid-js";
import * as LabelPrimitive from "@ensolid/radix";
import { cn } from "./utils";

export interface LabelProps extends LabelPrimitive.LabelProps {
    children?: JSX.Element;
}

export const Label: Component<LabelProps> = (props) => {
    const [local, others] = splitProps(props, ["class", "children"]);

    return (
        <LabelPrimitive.Label
            class={cn(
                "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                local.class,
            )}
            {...others}
        >
            {local.children}
        </LabelPrimitive.Label>
    );
};
