/**
 * ModelSelector 组件 - 移植自 Vercel AI Elements
 * 
 * 用于选择 AI 模型的组件（简化版，不依赖 Command 组件）
 */

import type { Component, JSX } from "solid-js";
import { splitProps } from "solid-js";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/components/ui/utils";

export type ModelSelectorProps = JSX.HTMLAttributes<HTMLDivElement> & {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export const ModelSelector: Component<ModelSelectorProps> = (props) => {
  return <Dialog {...props} />;
};

export type ModelSelectorTriggerProps = JSX.ButtonHTMLAttributes<HTMLButtonElement>;

export const ModelSelectorTrigger: Component<ModelSelectorTriggerProps> = (
  props
) => {
  return <DialogTrigger {...props} />;
};

export type ModelSelectorContentProps = JSX.HTMLAttributes<HTMLDivElement> & {
  title?: JSX.Element;
};

export const ModelSelectorContent: Component<ModelSelectorContentProps> = (
  props
) => {
  const [local, others] = splitProps(props, ["class", "children", "title"]);
  return (
    <DialogContent class={cn("p-0", local.class)} {...others}>
      <DialogTitle class="sr-only">
        {local.title ?? "Model Selector"}
      </DialogTitle>
      <div class="w-full">{local.children}</div>
    </DialogContent>
  );
};

// 简化的 Command 相关组件（使用普通 div 替代）
export type ModelSelectorInputProps = JSX.InputHTMLAttributes<HTMLInputElement>;

export const ModelSelectorInput: Component<ModelSelectorInputProps> = (
  props
) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <input
      class={cn(
        "h-auto w-full rounded-md border border-input bg-background px-3 py-3.5 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        local.class
      )}
      {...others}
    />
  );
};

export type ModelSelectorListProps = JSX.HTMLAttributes<HTMLDivElement>;

export const ModelSelectorList: Component<ModelSelectorListProps> = (props) => {
  return <div {...props} />;
};

export type ModelSelectorEmptyProps = JSX.HTMLAttributes<HTMLDivElement>;

export const ModelSelectorEmpty: Component<ModelSelectorEmptyProps> = (
  props
) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <div
      class={cn("py-6 text-center text-sm text-muted-foreground", local.class)}
      {...others}
    />
  );
};

export type ModelSelectorGroupProps = JSX.HTMLAttributes<HTMLDivElement>;

export const ModelSelectorGroup: Component<ModelSelectorGroupProps> = (
  props
) => {
  return <div {...props} />;
};

export type ModelSelectorItemProps = JSX.HTMLAttributes<HTMLDivElement> & {
  value?: string;
  onSelect?: () => void;
};

export const ModelSelectorItem: Component<ModelSelectorItemProps> = (props) => {
  const [local, others] = splitProps(props, ["class", "value", "onSelect"]);
  return (
    <div
      class={cn(
        "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
        local.class
      )}
      onClick={local.onSelect}
      {...others}
    />
  );
};

export type ModelSelectorShortcutProps = JSX.HTMLAttributes<HTMLSpanElement>;

export const ModelSelectorShortcut: Component<ModelSelectorShortcutProps> = (
  props
) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <span
      class={cn(
        "ml-auto text-xs tracking-widest text-muted-foreground",
        local.class
      )}
      {...others}
    />
  );
};

export type ModelSelectorSeparatorProps = JSX.HTMLAttributes<HTMLDivElement>;

export const ModelSelectorSeparator: Component<ModelSelectorSeparatorProps> = (
  props
) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <div class={cn("-mx-1 my-1 h-px bg-muted", local.class)} {...others} />
  );
};

export type ModelSelectorLogoProps = JSX.ImgHTMLAttributes<HTMLImageElement> & {
  provider: string;
};

export const ModelSelectorLogo: Component<ModelSelectorLogoProps> = (props) => {
  const [local, others] = splitProps(props, ["class", "provider", "alt"]);
  return (
    <img
      {...others}
      alt={local.alt || `${local.provider} logo`}
      class={cn("size-3 dark:invert", local.class)}
      height={12}
      src={`https://models.dev/logos/${local.provider}.svg`}
      width={12}
    />
  );
};

export type ModelSelectorLogoGroupProps = JSX.HTMLAttributes<HTMLDivElement>;

export const ModelSelectorLogoGroup: Component<ModelSelectorLogoGroupProps> = (
  props
) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <div
      class={cn(
        "-space-x-1 flex shrink-0 items-center [&>img]:rounded-full [&>img]:bg-background [&>img]:p-px [&>img]:ring-1 dark:[&>img]:bg-foreground",
        local.class
      )}
      {...others}
    />
  );
};

export type ModelSelectorNameProps = JSX.HTMLAttributes<HTMLSpanElement>;

export const ModelSelectorName: Component<ModelSelectorNameProps> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <span class={cn("flex-1 truncate text-left", local.class)} {...others} />
  );
};
