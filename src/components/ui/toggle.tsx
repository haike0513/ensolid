import type { Component, JSX } from "solid-js";
import { splitProps } from "solid-js";
import * as TogglePrimitive from "@resolid/radix";
import { cn } from "./utils";

export interface ToggleProps extends TogglePrimitive.ToggleProps {
    children?: JSX.Element;
}

export const Toggle: Component<ToggleProps> = (props) => {
    const [local, others] = splitProps(props, [
        "pressed",
        "defaultPressed",
        "onPressedChange",
        "disabled",
        "class",
        "children",
        "onClick",
    ]);

    return (
        <TogglePrimitive.Toggle
            class={cn(
                "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground",
                local.class,
            )}
            pressed={local.pressed}
            defaultPressed={local.defaultPressed}
            onPressedChange={local.onPressedChange}
            disabled={local.disabled}
            onClick={local.onClick}
            {...others}
        >
            {local.children}
        </TogglePrimitive.Toggle>
    );
};

