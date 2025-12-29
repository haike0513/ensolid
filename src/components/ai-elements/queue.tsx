/**
 * Queue 组件 - 移植自 Vercel AI Elements
 * 
 * 用于显示队列/待办列表的组件
 */

import type { Component, JSX } from "solid-js";
import { splitProps } from "solid-js";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/components/ui/utils";

// 图标组件
const ChevronDownIcon = (props: { size?: number; class?: string }) => (
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
    <path d="m6 9 6 6 6-6" />
  </svg>
);

const PaperclipIcon = (props: { size?: number; class?: string }) => (
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
    <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
  </svg>
);

export type QueueMessagePart = {
  type: string;
  text?: string;
  url?: string;
  filename?: string;
  mediaType?: string;
};

export type QueueMessage = {
  id: string;
  parts: QueueMessagePart[];
};

export type QueueTodo = {
  id: string;
  title: string;
  description?: string;
  status?: "pending" | "completed";
};

export type QueueItemProps = JSX.LiHTMLAttributes<HTMLLIElement>;

export const QueueItem: Component<QueueItemProps> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <li
      class={cn(
        "group flex flex-col gap-1 rounded-md px-3 py-1 text-sm transition-colors hover:bg-muted",
        local.class
      )}
      {...others}
    />
  );
};

export type QueueItemIndicatorProps = JSX.HTMLAttributes<HTMLSpanElement> & {
  completed?: boolean;
};

export const QueueItemIndicator: Component<QueueItemIndicatorProps> = (
  props
) => {
  const [local, others] = splitProps(props, ["class", "completed"]);
  return (
    <span
      class={cn(
        "mt-0.5 inline-block size-2.5 rounded-full border",
        local.completed
          ? "border-muted-foreground/20 bg-muted-foreground/10"
          : "border-muted-foreground/50",
        local.class
      )}
      {...others}
    />
  );
};

export type QueueItemContentProps = JSX.HTMLAttributes<HTMLSpanElement> & {
  completed?: boolean;
};

export const QueueItemContent: Component<QueueItemContentProps> = (props) => {
  const [local, others] = splitProps(props, ["class", "completed"]);
  return (
    <span
      class={cn(
        "line-clamp-1 grow break-words",
        local.completed
          ? "text-muted-foreground/50 line-through"
          : "text-muted-foreground",
        local.class
      )}
      {...others}
    />
  );
};

export type QueueItemDescriptionProps = JSX.HTMLAttributes<HTMLDivElement> & {
  completed?: boolean;
};

export const QueueItemDescription: Component<QueueItemDescriptionProps> = (
  props
) => {
  const [local, others] = splitProps(props, ["class", "completed"]);
  return (
    <div
      class={cn(
        "ml-6 text-xs",
        local.completed
          ? "text-muted-foreground/40 line-through"
          : "text-muted-foreground",
        local.class
      )}
      {...others}
    />
  );
};

export type QueueItemActionsProps = JSX.HTMLAttributes<HTMLDivElement>;

export const QueueItemActions: Component<QueueItemActionsProps> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return <div class={cn("flex gap-1", local.class)} {...others} />;
};

export type QueueItemActionProps = JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
};

export const QueueItemAction: Component<QueueItemActionProps> = (props) => {
  const [local, others] = splitProps(props, ["class", "variant", "size"]);
  return (
    <Button
      class={cn(
        "size-auto rounded p-1 text-muted-foreground opacity-0 transition-opacity hover:bg-muted-foreground/10 hover:text-foreground group-hover:opacity-100",
        local.class
      )}
      size={local.size || "icon"}
      type="button"
      variant={local.variant || "ghost"}
      {...others}
    />
  );
};

export type QueueItemAttachmentProps = JSX.HTMLAttributes<HTMLDivElement>;

export const QueueItemAttachment: Component<QueueItemAttachmentProps> = (
  props
) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <div class={cn("mt-1 flex flex-wrap gap-2", local.class)} {...others} />
  );
};

export type QueueItemImageProps = JSX.ImgHTMLAttributes<HTMLImageElement>;

export const QueueItemImage: Component<QueueItemImageProps> = (props) => {
  const [local, others] = splitProps(props, ["class", "alt"]);
  return (
    <img
      alt={local.alt || ""}
      class={cn("h-8 w-8 rounded border object-cover", local.class)}
      height={32}
      width={32}
      {...others}
    />
  );
};

export type QueueItemFileProps = JSX.HTMLAttributes<HTMLSpanElement>;

export const QueueItemFile: Component<QueueItemFileProps> = (props) => {
  const [local, others] = splitProps(props, ["class", "children"]);
  return (
    <span
      class={cn(
        "flex items-center gap-1 rounded border bg-muted px-2 py-1 text-xs",
        local.class
      )}
      {...others}
    >
      <PaperclipIcon size={12} />
      <span class="max-w-[100px] truncate">{local.children}</span>
    </span>
  );
};

export type QueueListProps = JSX.HTMLAttributes<HTMLDivElement>;

export const QueueList: Component<QueueListProps> = (props) => {
  const [local, others] = splitProps(props, ["class", "children"]);
  return (
    <ScrollArea class={cn("-mb-1 mt-2", local.class)} {...others}>
      <div class="max-h-40 pr-4">
        <ul>{local.children}</ul>
      </div>
    </ScrollArea>
  );
};

export type QueueSectionProps = JSX.HTMLAttributes<HTMLDivElement> & {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export const QueueSection: Component<QueueSectionProps> = (props) => {
  const [local, others] = splitProps(props, [
    "class",
    "defaultOpen",
    "open",
    "onOpenChange",
  ]);
  return (
    <Collapsible
      class={cn(local.class)}
      defaultOpen={local.defaultOpen ?? true}
      open={local.open}
      onOpenChange={local.onOpenChange}
      {...others}
    />
  );
};

export type QueueSectionTriggerProps = JSX.ButtonHTMLAttributes<HTMLButtonElement>;

export const QueueSectionTrigger: Component<QueueSectionTriggerProps> = (
  props
) => {
  const [local, others] = splitProps(props, ["class", "children"]);
  return (
    <CollapsibleTrigger asChild>
      <button
        class={cn(
          "group flex w-full items-center justify-between rounded-md bg-muted/40 px-3 py-2 text-left font-medium text-muted-foreground text-sm transition-colors hover:bg-muted",
          local.class
        )}
        type="button"
        {...others}
      >
        {local.children}
      </button>
    </CollapsibleTrigger>
  );
};

export type QueueSectionLabelProps = JSX.HTMLAttributes<HTMLSpanElement> & {
  count?: number;
  label: string;
  icon?: JSX.Element;
};

export const QueueSectionLabel: Component<QueueSectionLabelProps> = (props) => {
  const [local, others] = splitProps(props, ["class", "count", "label", "icon"]);
  return (
    <span class={cn("flex items-center gap-2", local.class)} {...others}>
      <ChevronDownIcon
        size={16}
        class="group-data-[state=closed]:-rotate-90 transition-transform"
      />
      {local.icon}
      <span>
        {local.count} {local.label}
      </span>
    </span>
  );
};

export type QueueSectionContentProps = JSX.HTMLAttributes<HTMLDivElement>;

export const QueueSectionContent: Component<QueueSectionContentProps> = (
  props
) => {
  const [local, others] = splitProps(props, ["class"]);
  return <CollapsibleContent class={cn(local.class)} {...others} />;
};

export type QueueProps = JSX.HTMLAttributes<HTMLDivElement>;

export const Queue: Component<QueueProps> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <div
      class={cn(
        "flex flex-col gap-2 rounded-xl border border-border bg-background px-3 pt-2 pb-2 shadow-xs",
        local.class
      )}
      {...others}
    />
  );
};
