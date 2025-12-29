/**
 * Task 组件 - 移植自 Vercel AI Elements
 * 
 * 用于显示任务列表的组件
 */

import type { Component, JSX } from "solid-js";
import { splitProps } from "solid-js";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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

const SearchIcon = (props: { size?: number; class?: string }) => (
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
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

export type TaskItemFileProps = JSX.HTMLAttributes<HTMLDivElement>;

export const TaskItemFile: Component<TaskItemFileProps> = (props) => {
  const [local, others] = splitProps(props, ["class", "children"]);
  return (
    <div
      class={cn(
        "inline-flex items-center gap-1 rounded-md border bg-secondary px-1.5 py-0.5 text-foreground text-xs",
        local.class
      )}
      {...others}
    >
      {local.children}
    </div>
  );
};

export type TaskItemProps = JSX.HTMLAttributes<HTMLDivElement>;

export const TaskItem: Component<TaskItemProps> = (props) => {
  const [local, others] = splitProps(props, ["class", "children"]);
  return (
    <div
      class={cn("text-muted-foreground text-sm", local.class)}
      {...others}
    >
      {local.children}
    </div>
  );
};

export type TaskProps = JSX.HTMLAttributes<HTMLDivElement> & {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export const Task: Component<TaskProps> = (props) => {
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

export type TaskTriggerProps = JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
  title: string;
};

export const TaskTrigger: Component<TaskTriggerProps> = (props) => {
  const [local, others] = splitProps(props, ["class", "title", "children"]);
  return (
    <CollapsibleTrigger asChild class={cn("group", local.class)} {...others}>
      {local.children ?? (
        <div class="flex w-full cursor-pointer items-center gap-2 text-muted-foreground text-sm transition-colors hover:text-foreground">
          <SearchIcon size={16} />
          <p class="text-sm">{local.title}</p>
          <ChevronDownIcon
            size={16}
            class="transition-transform group-data-[state=open]:rotate-180"
          />
        </div>
      )}
    </CollapsibleTrigger>
  );
};

export type TaskContentProps = JSX.HTMLAttributes<HTMLDivElement>;

export const TaskContent: Component<TaskContentProps> = (props) => {
  const [local, others] = splitProps(props, ["class", "children"]);
  return (
    <CollapsibleContent
      class={cn(
        "data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-2 data-[state=open]:slide-in-from-top-2 text-popover-foreground outline-none data-[state=closed]:animate-out data-[state=open]:animate-in",
        local.class
      )}
      {...others}
    >
      <div class="mt-4 space-y-2 border-muted border-l-2 pl-4">
        {local.children}
      </div>
    </CollapsibleContent>
  );
};
