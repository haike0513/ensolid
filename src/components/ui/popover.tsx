import type { Component, JSX } from "solid-js";
import { splitProps } from "solid-js";
import * as PopoverPrimitive from "@ensolid/radix";
import { cn } from "./utils";

export interface PopoverProps extends PopoverPrimitive.PopoverProps {
    children?: JSX.Element;
}

const PopoverBase: Component<PopoverProps> = (props) => {
    return <PopoverPrimitive.Popover {...props} />;
};

export const Popover = Object.assign(PopoverBase, {
    Trigger: null as any,
    Content: null as any,
});

export interface PopoverTriggerProps extends PopoverPrimitive.PopoverTriggerProps {
    children?: JSX.Element;
}

export const PopoverTrigger: Component<PopoverTriggerProps> = (props) => {
    const [local, others] = splitProps(props, [
        "class",
        "children",
        "asChild",
        "onClick",
    ]);

    return (
        <PopoverPrimitive.PopoverTrigger
            class={cn("", local.class)}
            {...others}
        >
            {local.children}
        </PopoverPrimitive.PopoverTrigger>
    );
};

export interface PopoverContentProps extends PopoverPrimitive.PopoverContentProps {
    children?: JSX.Element;
}

export const PopoverContent: Component<PopoverContentProps> = (props) => {
    const [local, others] = splitProps(props, ["class", "children"] as const);

    return (
        <PopoverPrimitive.PopoverContent
            class={cn(
                "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
                local.class,
            )}
            {...others}
        >
            {local.children}
        </PopoverPrimitive.PopoverContent>
    );
};

Popover.Trigger = PopoverTrigger;
Popover.Content = PopoverContent;

