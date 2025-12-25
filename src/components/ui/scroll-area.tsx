import type { Component, JSX } from "solid-js";
import { splitProps } from "solid-js";
import * as ScrollAreaPrimitive from "@resolid/radix";
import { cn } from "./utils";

export interface ScrollAreaProps extends ScrollAreaPrimitive.ScrollAreaProps {
    children?: JSX.Element;
}

const ScrollAreaBase: Component<ScrollAreaProps> = (props) => {
    const [local, others] = splitProps(props, ["class", "children", "orientation", "type"]);

    return (
        <ScrollAreaPrimitive.ScrollArea
            class={cn("relative overflow-hidden", local.class)}
            orientation={local.orientation}
            type={local.type}
            {...others}
        >
            {local.children}
        </ScrollAreaPrimitive.ScrollArea>
    );
};

export const ScrollArea = Object.assign(ScrollAreaBase, {
    Viewport: null as any,
    Scrollbar: null as any,
    Thumb: null as any,
    Corner: null as any,
});

export interface ScrollAreaViewportProps extends ScrollAreaPrimitive.ScrollAreaViewportProps {
    children?: JSX.Element;
}

export const ScrollAreaViewport: Component<ScrollAreaViewportProps> = (props) => {
    const [local, others] = splitProps(props, ["class", "children"]);

    return (
        <ScrollAreaPrimitive.ScrollAreaViewport
            class={cn("h-full w-full rounded-[inherit]", local.class)}
            {...others}
        >
            {local.children}
        </ScrollAreaPrimitive.ScrollAreaViewport>
    );
};

export interface ScrollAreaScrollbarProps extends ScrollAreaPrimitive.ScrollAreaScrollbarProps {
    children?: JSX.Element;
}

export const ScrollAreaScrollbar: Component<ScrollAreaScrollbarProps> = (props) => {
    const [local, others] = splitProps(props, ["class", "children", "orientation", "forceMount"]);

    return (
        <ScrollAreaPrimitive.ScrollAreaScrollbar
            class={cn(
                "flex touch-none select-none transition-colors",
                local.orientation === "vertical" &&
                "h-full w-2.5 border-l border-l-transparent p-[1px]",
                local.orientation === "horizontal" &&
                "h-2.5 flex-col border-t border-t-transparent p-[1px]",
                local.class,
            )}
            {...others}
        >
            {local.children}
        </ScrollAreaPrimitive.ScrollAreaScrollbar>
    );
};

export interface ScrollAreaThumbProps extends ScrollAreaPrimitive.ScrollAreaThumbProps {
    children?: JSX.Element;
}

export const ScrollAreaThumb: Component<ScrollAreaThumbProps> = (props) => {
    const [local, others] = splitProps(props, ["class", "children"]);

    return (
        <ScrollAreaPrimitive.ScrollAreaThumb
            class={cn(
                "relative flex-1 rounded-full bg-border",
                local.class,
            )}
            {...others}
        >
            {local.children}
        </ScrollAreaPrimitive.ScrollAreaThumb>
    );
};

export interface ScrollAreaCornerProps extends ScrollAreaPrimitive.ScrollAreaCornerProps {
}

export const ScrollAreaCorner: Component<ScrollAreaCornerProps> = (props) => {
    const [local, others] = splitProps(props, ["class"]);

    return (
        <ScrollAreaPrimitive.ScrollAreaCorner
            class={cn("", local.class)}
            {...others}
        />
    );
};

ScrollArea.Viewport = ScrollAreaViewport;
ScrollArea.Scrollbar = ScrollAreaScrollbar;
ScrollArea.Thumb = ScrollAreaThumb;
ScrollArea.Corner = ScrollAreaCorner;

