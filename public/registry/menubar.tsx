import type { Component, JSX } from "solid-js";
import { splitProps } from "solid-js";
import * as MenubarPrimitive from "@ensolid/radix";
import { cn } from "./utils";

export interface MenubarProps extends MenubarPrimitive.MenubarProps {
    children?: JSX.Element;
}

const MenubarBase: Component<MenubarProps> = (props) => {
    return <MenubarPrimitive.Menubar {...props} />;
};

export const Menubar = Object.assign(MenubarBase, {
    Menu: null as any,
    Trigger: null as any,
    Content: null as any,
    Item: null as any,
    Separator: null as any,
});

export interface MenubarMenuProps extends MenubarPrimitive.MenubarMenuProps {
    children?: JSX.Element;
}

export const MenubarMenu: Component<MenubarMenuProps> = (props) => {
    return <MenubarPrimitive.MenubarMenu {...props} />;
};

export interface MenubarTriggerProps extends MenubarPrimitive.MenubarTriggerProps {
    children?: JSX.Element;
}

export const MenubarTrigger: Component<MenubarTriggerProps> = (props) => {
    const [local, others] = splitProps(props, ["class", "children", "asChild", "onClick"]);

    return (
        <MenubarPrimitive.MenubarTrigger
            class={cn(
                "flex cursor-default select-none items-center rounded-sm px-3 py-1.5 text-sm font-medium outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
                local.class,
            )}
            {...others}
        >
            {local.children}
        </MenubarPrimitive.MenubarTrigger>
    );
};

export interface MenubarContentProps extends MenubarPrimitive.MenubarContentProps {
    children?: JSX.Element;
}

export const MenubarContent: Component<MenubarContentProps> = (props) => {
    const [local, others] = splitProps(props, ["class", "children"] as const);

    return (
        <MenubarPrimitive.MenubarContent
            class={cn(
                "z-50 min-w-[12rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
                local.class,
            )}
            {...others}
        >
            {local.children}
        </MenubarPrimitive.MenubarContent>
    );
};

export interface MenubarItemProps extends MenubarPrimitive.MenubarItemProps {
    children?: JSX.Element;
}

export const MenubarItem: Component<MenubarItemProps> = (props) => {
    const [local, others] = splitProps(props, ["class", "children", "disabled", "asChild", "onClick"]);

    return (
        <MenubarPrimitive.MenubarItem
            class={cn(
                "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                local.class,
            )}
            {...others}
        >
            {local.children}
        </MenubarPrimitive.MenubarItem>
    );
};

export interface MenubarSeparatorProps extends MenubarPrimitive.MenubarSeparatorProps {
}

export const MenubarSeparator: Component<MenubarSeparatorProps> = (props) => {
    const [local, others] = splitProps(props, ["class"]);

    return (
        <MenubarPrimitive.MenubarSeparator
            class={cn("-mx-1 my-1 h-px bg-muted", local.class)}
            {...others}
        />
    );
};

Menubar.Menu = MenubarMenu;
Menubar.Trigger = MenubarTrigger;
Menubar.Content = MenubarContent;
Menubar.Item = MenubarItem;
Menubar.Separator = MenubarSeparator;

