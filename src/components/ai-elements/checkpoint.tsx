/**
 * Checkpoint 组件 - 移植自 Vercel AI Elements
 * 
 * 用于显示检查点的组件
 */

import type { Component, JSX } from "solid-js";
import { splitProps, Show } from "solid-js";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/components/ui/utils";

// 图标组件
const BookmarkIcon = (props: { size?: number; class?: string }) => (
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
    <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
  </svg>
);

export type CheckpointProps = JSX.HTMLAttributes<HTMLDivElement>;

export const Checkpoint: Component<CheckpointProps> = (props) => {
  const [local, others] = splitProps(props, ["class", "children"]);
  return (
    <div
      class={cn(
        "flex items-center gap-0.5 text-muted-foreground overflow-hidden",
        local.class
      )}
      {...others}
    >
      {local.children}
      <Separator />
    </div>
  );
};

export type CheckpointIconProps = JSX.HTMLAttributes<HTMLDivElement> & {
  size?: number;
};

export const CheckpointIcon: Component<CheckpointIconProps> = (props) => {
  const [local, others] = splitProps(props, ["class", "size", "children"]);
  return (
    <Show when={local.children} fallback={<BookmarkIcon size={local.size || 16} class={cn("shrink-0", local.class)} />}>
      {local.children}
    </Show>
  );
};

export type CheckpointTriggerProps = JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
  tooltip?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
};

export const CheckpointTrigger: Component<CheckpointTriggerProps> = (props) => {
  const [local, others] = splitProps(props, [
    "class",
    "children",
    "variant",
    "size",
    "tooltip",
  ]);

  const button = (
    <Button
      size={local.size || "sm"}
      type="button"
      variant={local.variant || "ghost"}
      {...others}
    >
      {local.children}
    </Button>
  );

  if (local.tooltip) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent align="start" side="bottom">
          {local.tooltip}
        </TooltipContent>
      </Tooltip>
    );
  }

  return button;
};
