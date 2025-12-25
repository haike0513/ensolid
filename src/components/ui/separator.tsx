import type { Component, JSX } from "solid-js";
import { splitProps } from "solid-js";
import * as SeparatorPrimitive from "@resolid/radix";
import { cn } from "./utils";

export interface SeparatorProps extends SeparatorPrimitive.SeparatorProps {
    children?: JSX.Element;
}

export const Separator: Component<SeparatorProps> = (props) => {
    const [local, others] = splitProps(props, ["class", "orientation"]);

    return (
        <SeparatorPrimitive.Separator
            orientation={local.orientation}
            class={cn(
                "shrink-0 bg-border",
                local.orientation === "vertical"
                    ? "h-full w-[1px]"
                    : "h-[1px] w-full",
                local.class,
            )}
            {...others}
        />
    );
};
