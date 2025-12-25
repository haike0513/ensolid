import type { Component, JSX } from "solid-js";
import { splitProps } from "solid-js";
import * as NavigationMenuPrimitive from "@resolid/radix";
import { cn } from "./utils";

export interface NavigationMenuProps extends NavigationMenuPrimitive.NavigationMenuProps {
    children?: JSX.Element;
}

const NavigationMenuBase: Component<NavigationMenuProps> = (props) => {
    return <NavigationMenuPrimitive.NavigationMenu {...props} />;
};

export const NavigationMenu = Object.assign(NavigationMenuBase, {
    List: null as any,
    Item: null as any,
    Trigger: null as any,
    Content: null as any,
    Link: null as any,
    Indicator: null as any,
    Viewport: null as any,
});

export interface NavigationMenuListProps extends NavigationMenuPrimitive.NavigationMenuListProps {
    children?: JSX.Element;
}

export const NavigationMenuList: Component<NavigationMenuListProps> = (props) => {
    const [local, others] = splitProps(props, ["class", "children"]);

    return (
        <NavigationMenuPrimitive.NavigationMenuList
            class={cn(
                "group flex flex-1 list-none items-center justify-center space-x-1",
                local.class,
            )}
            {...others}
        >
            {local.children}
        </NavigationMenuPrimitive.NavigationMenuList>
    );
};

export interface NavigationMenuItemProps extends NavigationMenuPrimitive.NavigationMenuItemProps {
    children?: JSX.Element;
}

export const NavigationMenuItem: Component<NavigationMenuItemProps> = (props) => {
    return <NavigationMenuPrimitive.NavigationMenuItem {...props} />;
};

export interface NavigationMenuTriggerProps extends NavigationMenuPrimitive.NavigationMenuTriggerProps {
    children?: JSX.Element;
}

export const NavigationMenuTrigger: Component<NavigationMenuTriggerProps> = (props) => {
    const [local, others] = splitProps(props, ["class", "children", "asChild", "onClick"]);

    return (
        <NavigationMenuPrimitive.NavigationMenuTrigger
            class={cn(
                "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50",
                local.class,
            )}
            {...others}
        >
            {local.children}
        </NavigationMenuPrimitive.NavigationMenuTrigger>
    );
};

export interface NavigationMenuContentProps extends NavigationMenuPrimitive.NavigationMenuContentProps {
    children?: JSX.Element;
}

export const NavigationMenuContent: Component<NavigationMenuContentProps> = (props) => {
    const [local, others] = splitProps(props, ["class", "children"] as const);

    return (
        <NavigationMenuPrimitive.NavigationMenuContent
            class={cn(
                "left-0 top-0 w-full data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 md:absolute md:w-auto",
                local.class,
            )}
            {...others}
        >
            {local.children}
        </NavigationMenuPrimitive.NavigationMenuContent>
    );
};

export interface NavigationMenuLinkProps extends NavigationMenuPrimitive.NavigationMenuLinkProps {
    children?: JSX.Element;
}

export const NavigationMenuLink: Component<NavigationMenuLinkProps> = (props) => {
    const [local, others] = splitProps(props, ["class", "children", "asChild"]);

    return (
        <NavigationMenuPrimitive.NavigationMenuLink
            class={cn(
                "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50",
                local.class,
            )}
            {...others}
        >
            {local.children}
        </NavigationMenuPrimitive.NavigationMenuLink>
    );
};

export interface NavigationMenuIndicatorProps extends NavigationMenuPrimitive.NavigationMenuIndicatorProps {
    children?: JSX.Element;
}

export const NavigationMenuIndicator: Component<NavigationMenuIndicatorProps> = (props) => {
    const [local, others] = splitProps(props, ["class", "children"]);

    return (
        <NavigationMenuPrimitive.NavigationMenuIndicator
            class={cn(
                "top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in",
                local.class,
            )}
            {...others}
        >
            {local.children}
        </NavigationMenuPrimitive.NavigationMenuIndicator>
    );
};

export interface NavigationMenuViewportProps extends NavigationMenuPrimitive.NavigationMenuViewportProps {
    children?: JSX.Element;
}

export const NavigationMenuViewport: Component<NavigationMenuViewportProps> = (props) => {
    const [local, others] = splitProps(props, ["class", "children"]);

    return (
        <NavigationMenuPrimitive.NavigationMenuViewport
            class={cn(
                "relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full origin-top overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 md:w-[var(--radix-navigation-menu-viewport-width)]",
                local.class,
            )}
            {...others}
        >
            {local.children}
        </NavigationMenuPrimitive.NavigationMenuViewport>
    );
};

NavigationMenu.List = NavigationMenuList;
NavigationMenu.Item = NavigationMenuItem;
NavigationMenu.Trigger = NavigationMenuTrigger;
NavigationMenu.Content = NavigationMenuContent;
NavigationMenu.Link = NavigationMenuLink;
NavigationMenu.Indicator = NavigationMenuIndicator;
NavigationMenu.Viewport = NavigationMenuViewport;

