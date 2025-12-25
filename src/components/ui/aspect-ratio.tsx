import type { Component, JSX } from "solid-js";
import { splitProps } from "solid-js";
import * as AspectRatioPrimitive from "@resolid/radix";
import { cn } from "./utils";

export interface AspectRatioProps extends AspectRatioPrimitive.AspectRatioProps {
    children?: JSX.Element;
}

export const AspectRatio: Component<AspectRatioProps> = (props) => {
    const [local, others] = splitProps(props, ["class", "children", "ratio"]);

    return (
        <AspectRatioPrimitive.AspectRatio
            class={cn("", local.class)}
            ratio={local.ratio}
            {...others}
        >
            {local.children}
        </AspectRatioPrimitive.AspectRatio>
    );
};

