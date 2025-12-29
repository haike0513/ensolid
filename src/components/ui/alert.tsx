import type { Component, JSX } from "solid-js";
import { splitProps } from "solid-js";
import { cn } from "./utils";

export interface AlertProps extends JSX.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "destructive";
}

export const Alert: Component<AlertProps> = (props) => {
  const [local, others] = splitProps(props, ["class", "variant"]);

  return (
    <div
      role="alert"
      class={cn(
        "relative w-full rounded-lg border p-4",
        local.variant === "destructive"
          ? "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive"
          : "bg-background text-foreground",
        local.class
      )}
      {...others}
    />
  );
};

export interface AlertTitleProps extends JSX.HTMLAttributes<HTMLHeadingElement> {}

export const AlertTitle: Component<AlertTitleProps> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <h5
      class={cn("mb-1 font-medium leading-none tracking-tight", local.class)}
      {...others}
    />
  );
};

export interface AlertDescriptionProps extends JSX.HTMLAttributes<HTMLDivElement> {}

export const AlertDescription: Component<AlertDescriptionProps> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <div
      class={cn("text-sm [&_p]:leading-relaxed", local.class)}
      {...others}
    />
  );
};
