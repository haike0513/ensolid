import type { Component, JSX } from "solid-js";
import { splitProps } from "solid-js";
import * as ContextMenuPrimitive from "@resolid/radix";
import { cn } from "./utils";

export interface ContextMenuProps extends ContextMenuPrimitive.ContextMenuProps {
    children?: JSX.Element;
}

const ContextMenuBase: Component<ContextMenuProps> = (props) => {
    return <ContextMenuPrimitive.ContextMenu {...props} />;
};

export const ContextMenu = Object.assign(ContextMenuBase, {
    Trigger: null as any,
    Content: null as any,
    Item: null as any,
    Label: null as any,
    Separator: null as any,
});

export interface ContextMenuTriggerProps extends ContextMenuPrimitive.ContextMenuTriggerProps {
    children?: JSX.Element;
}

export const ContextMenuTrigger: Component<ContextMenuTriggerProps> = (props) => {
    const [local, others] = splitProps(props, ["class", "children", "asChild", "onContextMenu"]);

    return (
        <ContextMenuPrimitive.ContextMenuTrigger
            class={cn("", local.class)}
            {...others}
        >
            {local.children}
        </ContextMenuPrimitive.ContextMenuTrigger>
    );
};

export interface ContextMenuContentProps extends ContextMenuPrimitive.ContextMenuContentProps {
    children?: JSX.Element;
}

export const ContextMenuContent: Component<ContextMenuContentProps> = (props) => {
    const [local, others] = splitProps(props, ["class", "children"] as const);

    return (
        <ContextMenuPrimitive.ContextMenuContent
            class={cn(
                "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
                local.class,
            )}
            {...others}
        >
            {local.children}
        </ContextMenuPrimitive.ContextMenuContent>
    );
};

export interface ContextMenuItemProps extends ContextMenuPrimitive.ContextMenuItemProps {
    children?: JSX.Element;
}

export const ContextMenuItem: Component<ContextMenuItemProps> = (props) => {
    const [local, others] = splitProps(props, ["class", "children", "disabled", "asChild", "onClick"]);

    return (
        <ContextMenuPrimitive.ContextMenuItem
            class={cn(
                "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                local.class,
            )}
            {...others}
        >
            {local.children}
        </ContextMenuPrimitive.ContextMenuItem>
    );
};

export interface ContextMenuLabelProps extends ContextMenuPrimitive.ContextMenuLabelProps {
    children?: JSX.Element;
}

export const ContextMenuLabel: Component<ContextMenuLabelProps> = (props) => {
    const [local, others] = splitProps(props, ["class", "children"]);

    return (
        <ContextMenuPrimitive.ContextMenuLabel
            class={cn(
                "px-2 py-1.5 text-sm font-semibold text-foreground",
                local.class,
            )}
            {...others}
        >
            {local.children}
        </ContextMenuPrimitive.ContextMenuLabel>
    );
};

export interface ContextMenuSeparatorProps extends ContextMenuPrimitive.ContextMenuSeparatorProps {
}

export const ContextMenuSeparator: Component<ContextMenuSeparatorProps> = (props) => {
    const [local, others] = splitProps(props, ["class"]);

    return (
        <ContextMenuPrimitive.ContextMenuSeparator
            class={cn("-mx-1 my-1 h-px bg-border", local.class)}
            {...others}
        />
    );
};

ContextMenu.Trigger = ContextMenuTrigger;
ContextMenu.Content = ContextMenuContent;
ContextMenu.Item = ContextMenuItem;
ContextMenu.Label = ContextMenuLabel;
ContextMenu.Separator = ContextMenuSeparator;

