import type { Component, JSX } from "solid-js";
import { splitProps } from "solid-js";
import * as AspectRatioPrimitive from "@ensolid/radix";
import { cn } from "./utils";

export interface AspectRatioProps extends AspectRatioPrimitive.AspectRatioProps {
  children?: JSX.Element;
}

export const AspectRatio: Component<AspectRatioProps> = (props) => {
  const [local, others] = splitProps(props, ["class", "children"]);

  return (
    <AspectRatioPrimitive.AspectRatio
      class={cn(local.class)}
      {...others}
    >
      {local.children}
    </AspectRatioPrimitive.AspectRatio>
  );
};
