import type { Component, JSX } from "solid-js";
import { splitProps } from "solid-js";
import * as ToolbarPrimitive from "@ensolid/radix";
import { cn } from "./utils";

export interface ToolbarProps extends ToolbarPrimitive.ToolbarProps {
    children?: JSX.Element;
}

const ToolbarBase: Component<ToolbarProps> = (props) => {
    const [local, others] = splitProps(props, ["class", "children"]);

    return (
        <ToolbarPrimitive.Toolbar
            class={cn(
                "relative flex w-full items-center space-x-1 border-b px-1",
                local.class,
            )}
            {...others}
        >
            {local.children}
        </ToolbarPrimitive.Toolbar>
    );
};

export const Toolbar = Object.assign(ToolbarBase, {
    ToggleGroup: null as any,
    ToggleItem: null as any,
    Separator: null as any,
    Link: null as any,
    Button: null as any,
});

export interface ToolbarToggleGroupProps extends ToolbarPrimitive.ToolbarToggleGroupProps {
    children?: JSX.Element;
}

export const ToolbarToggleGroup: Component<ToolbarToggleGroupProps> = (props) => {
    const [local, others] = splitProps(props, ["class", "children", "type", "value", "defaultValue", "onValueChange", "disabled"]);

    return (
        <ToolbarPrimitive.ToolbarToggleGroup
            class={cn("flex items-center", local.class)}
            {...others}
        >
            {local.children}
        </ToolbarPrimitive.ToolbarToggleGroup>
    );
};

export interface ToolbarToggleItemProps extends ToolbarPrimitive.ToolbarToggleItemProps {
    children?: JSX.Element;
}

export const ToolbarToggleItem: Component<ToolbarToggleItemProps> = (props) => {
    const [local, others] = splitProps(props, ["class", "children", "disabled"]);

    return (
        <ToolbarPrimitive.ToolbarToggleItem
            class={cn(
                "inline-flex items-center justify-center rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground",
                local.class,
            )}
            {...others}
        >
            {local.children}
        </ToolbarPrimitive.ToolbarToggleItem>
    );
};

export interface ToolbarSeparatorProps extends ToolbarPrimitive.ToolbarSeparatorProps {
}

export const ToolbarSeparator: Component<ToolbarSeparatorProps> = (props) => {
    const [local, others] = splitProps(props, ["class"]);

    return (
        <ToolbarPrimitive.ToolbarSeparator
            class={cn("-mx-1 my-1 h-px w-px bg-border", local.class)}
            {...others}
        />
    );
};

export interface ToolbarLinkProps extends ToolbarPrimitive.ToolbarLinkProps {
    children?: JSX.Element;
}

export const ToolbarLink: Component<ToolbarLinkProps> = (props) => {
    const [local, others] = splitProps(props, ["class", "children"]);

    return (
        <ToolbarPrimitive.ToolbarLink
            class={cn(
                "inline-flex items-center justify-center rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                local.class,
            )}
            {...others}
        >
            {local.children}
        </ToolbarPrimitive.ToolbarLink>
    );
};

export interface ToolbarButtonProps extends ToolbarPrimitive.ToolbarButtonProps {
    children?: JSX.Element;
}

export const ToolbarButton: Component<ToolbarButtonProps> = (props) => {
    const [local, others] = splitProps(props, ["class", "children", "asChild"]);

    return (
        <ToolbarPrimitive.ToolbarButton
            class={cn(
                "inline-flex items-center justify-center rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                local.class,
            )}
            {...others}
        >
            {local.children}
        </ToolbarPrimitive.ToolbarButton>
    );
};

Toolbar.ToggleGroup = ToolbarToggleGroup;
Toolbar.ToggleItem = ToolbarToggleItem;
Toolbar.Separator = ToolbarSeparator;
Toolbar.Link = ToolbarLink;
Toolbar.Button = ToolbarButton;

