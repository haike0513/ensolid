/**
 * Artifact 组件 - 移植自 Vercel AI Elements
 *
 * 用于显示 AI 生成的工作/工件的组件
 */

import type { Component, JSX } from "solid-js";
import { Show, splitProps } from "solid-js";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/components/ui/utils";

// 图标组件
const XIcon = (props: { size?: number; class?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.size || 16}
    height={props.size || 16}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class={props.class}
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

export type ArtifactProps = JSX.HTMLAttributes<HTMLDivElement>;

export const Artifact: Component<ArtifactProps> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <div
      class={cn(
        "flex flex-col overflow-hidden rounded-lg border bg-background shadow-sm",
        local.class,
      )}
      {...others}
    />
  );
};

export type ArtifactHeaderProps = JSX.HTMLAttributes<HTMLDivElement>;

export const ArtifactHeader: Component<ArtifactHeaderProps> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <div
      class={cn(
        "flex items-center justify-between border-b bg-muted/50 px-4 py-3",
        local.class,
      )}
      {...others}
    />
  );
};

export type ArtifactCloseProps = JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
};

export const ArtifactClose: Component<ArtifactCloseProps> = (props) => {
  const [local, others] = splitProps(props, [
    "class",
    "children",
    "size",
    "variant",
  ]);
  return (
    <Button
      class={cn(
        "size-8 p-0 text-muted-foreground hover:text-foreground",
        local.class,
      )}
      size={local.size || "sm"}
      type="button"
      variant={local.variant || "ghost"}
      {...others}
    >
      {local.children ?? <XIcon size={16} />}
      <span class="sr-only">Close</span>
    </Button>
  );
};

export type ArtifactTitleProps = JSX.HTMLAttributes<HTMLParagraphElement>;

export const ArtifactTitle: Component<ArtifactTitleProps> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <p
      class={cn("font-medium text-foreground text-sm", local.class)}
      {...others}
    />
  );
};

export type ArtifactDescriptionProps = JSX.HTMLAttributes<HTMLParagraphElement>;

export const ArtifactDescription: Component<ArtifactDescriptionProps> = (
  props,
) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <p class={cn("text-muted-foreground text-sm", local.class)} {...others} />
  );
};

export type ArtifactActionsProps = JSX.HTMLAttributes<HTMLDivElement>;

export const ArtifactActions: Component<ArtifactActionsProps> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return <div class={cn("flex items-center gap-1", local.class)} {...others} />;
};

export type ArtifactActionProps =
  & JSX.ButtonHTMLAttributes<HTMLButtonElement>
  & {
    tooltip?: string;
    label?: string;
    icon?: Component<{ size?: number; class?: string }>;
    variant?:
      | "default"
      | "destructive"
      | "outline"
      | "secondary"
      | "ghost"
      | "link";
    size?: "default" | "sm" | "lg" | "icon";
  };

export const ArtifactAction: Component<ArtifactActionProps> = (props) => {
  const [local, others] = splitProps(props, [
    "tooltip",
    "label",
    "icon",
    "class",
    "size",
    "variant",
    "children",
  ]);

  const Icon = local.icon;

  const button = (
    <Button
      class={cn(
        "size-8 p-0 text-muted-foreground hover:text-foreground",
        local.class,
      )}
      size={local.size || "sm"}
      type="button"
      variant={local.variant || "ghost"}
      {...others}
    >
      {Icon ? <Icon size={16} /> : local.children}
      <span class="sr-only">{local.label || local.tooltip}</span>
    </Button>
  );

  if (local.tooltip) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent>
          <p>{local.tooltip}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return button;
};

export type ArtifactContentProps = JSX.HTMLAttributes<HTMLDivElement>;

export const ArtifactContent: Component<ArtifactContentProps> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <div
      class={cn("flex-1 overflow-auto p-4", local.class)}
      {...others}
    />
  );
};
