import type { Component, JSX } from "solid-js";
import { splitProps, Show, createSignal } from "solid-js";
import * as AvatarPrimitive from "@resolid/radix";
import { cn } from "./utils";

export interface AvatarProps extends AvatarPrimitive.AvatarProps {
    children?: JSX.Element;
}

const AvatarBase: Component<AvatarProps> = (props) => {
    return <AvatarPrimitive.Avatar {...props} />;
};

export const Avatar = Object.assign(AvatarBase, {
    Image: null as any,
    Fallback: null as any,
});

export interface AvatarImageProps extends AvatarPrimitive.AvatarImageProps {
    children?: JSX.Element;
}

export const AvatarImage: Component<AvatarImageProps> = (props) => {
    const [local, others] = splitProps(props, ["class", "src", "alt", "onLoadingStatusChange", "onLoad", "onError"]);

    return (
        <AvatarPrimitive.AvatarImage
            class={cn("aspect-square h-full w-full", local.class)}
            {...others}
        />
    );
};

export interface AvatarFallbackProps extends AvatarPrimitive.AvatarFallbackProps {
    children?: JSX.Element;
}

export const AvatarFallback: Component<AvatarFallbackProps> = (props) => {
    const [local, others] = splitProps(props, ["class", "children", "delayMs"]);

    return (
        <AvatarPrimitive.AvatarFallback
            class={cn(
                "flex h-full w-full items-center justify-center rounded-full bg-muted",
                local.class,
            )}
            {...others}
        >
            {local.children}
        </AvatarPrimitive.AvatarFallback>
    );
};

Avatar.Image = AvatarImage;
Avatar.Fallback = AvatarFallback;

