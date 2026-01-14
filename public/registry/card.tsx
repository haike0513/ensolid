import type { Component, JSX } from "solid-js";
import { splitProps } from "solid-js";
import { cn } from "./utils";

export interface CardProps extends JSX.HTMLAttributes<HTMLDivElement> {
  children?: JSX.Element;
}

export const Card: Component<CardProps> = (props) => {
  const [local, others] = splitProps(props, ["class", "children"]);

  return (
    <div
      class={cn(
        "rounded-lg border bg-card text-card-foreground shadow-sm",
        local.class
      )}
      {...others}
    >
      {local.children}
    </div>
  );
};

export interface CardHeaderProps extends JSX.HTMLAttributes<HTMLDivElement> {
  children?: JSX.Element;
}

export const CardHeader: Component<CardHeaderProps> = (props) => {
  const [local, others] = splitProps(props, ["class", "children"]);

  return (
    <div class={cn("flex flex-col space-y-1.5 p-6", local.class)} {...others}>
      {local.children}
    </div>
  );
};

export interface CardTitleProps extends JSX.HTMLAttributes<HTMLHeadingElement> {
  children?: JSX.Element;
}

export const CardTitle: Component<CardTitleProps> = (props) => {
  const [local, others] = splitProps(props, ["class", "children"]);

  return (
    <h3
      class={cn(
        "text-2xl font-semibold leading-none tracking-tight",
        local.class
      )}
      {...others}
    >
      {local.children}
    </h3>
  );
};

export interface CardDescriptionProps extends JSX.HTMLAttributes<HTMLParagraphElement> {
  children?: JSX.Element;
}

export const CardDescription: Component<CardDescriptionProps> = (props) => {
  const [local, others] = splitProps(props, ["class", "children"]);

  return (
    <p class={cn("text-sm text-muted-foreground", local.class)} {...others}>
      {local.children}
    </p>
  );
};

export interface CardContentProps extends JSX.HTMLAttributes<HTMLDivElement> {
  children?: JSX.Element;
}

export const CardContent: Component<CardContentProps> = (props) => {
  const [local, others] = splitProps(props, ["class", "children"]);

  return (
    <div class={cn("p-6 pt-0", local.class)} {...others}>
      {local.children}
    </div>
  );
};

export interface CardFooterProps extends JSX.HTMLAttributes<HTMLDivElement> {
  children?: JSX.Element;
}

export const CardFooter: Component<CardFooterProps> = (props) => {
  const [local, others] = splitProps(props, ["class", "children"]);

  return (
    <div class={cn("flex items-center p-6 pt-0", local.class)} {...others}>
      {local.children}
    </div>
  );
};

// 导出子组件
(Card as any).Header = CardHeader;
(Card as any).Title = CardTitle;
(Card as any).Description = CardDescription;
(Card as any).Content = CardContent;
(Card as any).Footer = CardFooter;

