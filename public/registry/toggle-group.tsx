import type { Component, JSX } from "solid-js";
import { splitProps } from "solid-js";
import * as ToggleGroupPrimitive from "@ensolid/radix";
import { cn } from "./utils";

export interface ToggleGroupProps extends ToggleGroupPrimitive.ToggleGroupProps {
    children?: JSX.Element;
}

const ToggleGroupBase: Component<ToggleGroupProps> = (props) => {
    const [local, others] = splitProps(props, ["class", "children", "value", "defaultValue", "onValueChange", "type", "disabled", "rovingFocus"]);

    return (
        <ToggleGroupPrimitive.ToggleGroup
            class={cn("inline-flex items-center justify-center rounded-md bg-muted p-1 text-muted-foreground", local.class)}
            {...others}
        >
            {local.children}
        </ToggleGroupPrimitive.ToggleGroup>
    );
};

export const ToggleGroup = Object.assign(ToggleGroupBase, {
    Item: null as any,
});

export interface ToggleGroupItemProps extends ToggleGroupPrimitive.ToggleGroupItemProps {
    children?: JSX.Element;
}

export const ToggleGroupItem: Component<ToggleGroupItemProps> = (props) => {
    const [local, others] = splitProps(props, ["class", "children"]);

    return (
        <ToggleGroupPrimitive.ToggleGroupItem
            class={cn(
                "inline-flex items-center justify-center rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-background data-[state=on]:text-foreground data-[state=on]:shadow",
                local.class,
            )}
            {...others}
        >
            {local.children}
        </ToggleGroupPrimitive.ToggleGroupItem>
    );
};

ToggleGroup.Item = ToggleGroupItem;

