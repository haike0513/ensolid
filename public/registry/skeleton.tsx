import type { Component, JSX } from "solid-js";
import { splitProps } from "solid-js";
import { cn } from "./utils";

export interface SkeletonProps extends JSX.HTMLAttributes<HTMLDivElement> {}

export const Skeleton: Component<SkeletonProps> = (props) => {
  const [local, others] = splitProps(props, ["class"]);

  return (
    <div
      class={cn("animate-pulse rounded-md bg-muted", local.class)}
      {...others}
    />
  );
};
