import type { Component, JSX } from "solid-js";
import { splitProps } from "solid-js";
import * as AvatarPrimitive from "@ensolid/radix";
import { cn } from "./utils";

// Avatar Root
export interface AvatarProps extends AvatarPrimitive.AvatarProps {
  children?: JSX.Element;
}

const AvatarBase: Component<AvatarProps> = (props) => {
  const [local, others] = splitProps(props, ["class", "children"]);

  return (
    <AvatarPrimitive.Avatar
      class={cn(
        "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
        local.class
      )}
      {...others}
    >
      {local.children}
    </AvatarPrimitive.Avatar>
  );
};

export const Avatar = Object.assign(AvatarBase, {
  Image: null as any,
  Fallback: null as any,
});

// Avatar Image
export interface AvatarImageProps extends AvatarPrimitive.AvatarImageProps {}

export const AvatarImage: Component<AvatarImageProps> = (props) => {
  const [local, others] = splitProps(props, ["class"]);

  return (
    <AvatarPrimitive.AvatarImage
      class={cn("aspect-square h-full w-full", local.class)}
      {...others}
    />
  );
};

// Avatar Fallback
export interface AvatarFallbackProps extends AvatarPrimitive.AvatarFallbackProps {
  children?: JSX.Element;
}

export const AvatarFallback: Component<AvatarFallbackProps> = (props) => {
  const [local, others] = splitProps(props, ["class", "children"]);

  return (
    <AvatarPrimitive.AvatarFallback
      class={cn(
        "flex h-full w-full items-center justify-center rounded-full bg-muted",
        local.class
      )}
      {...others}
    >
      {local.children}
    </AvatarPrimitive.AvatarFallback>
  );
};

// Assign sub-components
Avatar.Image = AvatarImage;
Avatar.Fallback = AvatarFallback;
