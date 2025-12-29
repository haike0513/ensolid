/**
 * Sources 组件 - 移植自 Vercel AI Elements
 * 
 * 用于显示引用来源的组件
 */

import type { Component, JSX } from "solid-js";
import { splitProps } from "solid-js";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/components/ui/utils";

// 简单的图标组件
const BookIcon = (props: { size?: number; class?: string }) => (
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
    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
  </svg>
);

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

export type SourcesProps = JSX.HTMLAttributes<HTMLDivElement>;

export const Sources: Component<SourcesProps> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  
  return (
    <Collapsible
      class={cn("not-prose mb-4 text-primary text-xs", local.class)}
      {...others}
    >
      {props.children}
    </Collapsible>
  );
};

export type SourcesTriggerProps = JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
  count: number;
};

export const SourcesTrigger: Component<SourcesTriggerProps> = (props) => {
  const [local, others] = splitProps(props, ["class", "count", "children"]);
  
  return (
    <CollapsibleTrigger
      class={cn("flex items-center gap-2", local.class)}
      {...others}
    >
      {local.children ?? (
        <>
          <p class="font-medium">Used {local.count} sources</p>
          <ChevronDownIcon size={16} />
        </>
      )}
    </CollapsibleTrigger>
  );
};

export type SourcesContentProps = JSX.HTMLAttributes<HTMLDivElement>;

export const SourcesContent: Component<SourcesContentProps> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  
  return (
    <CollapsibleContent
      class={cn(
        "mt-3 flex w-fit flex-col gap-2",
        "data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-2 data-[state=open]:slide-in-from-top-2 outline-none data-[state=closed]:animate-out data-[state=open]:animate-in",
        local.class
      )}
      {...others}
    >
      {props.children}
    </CollapsibleContent>
  );
};

export type SourceProps = JSX.AnchorHTMLAttributes<HTMLAnchorElement> & {
  title?: string;
};

export const Source: Component<SourceProps> = (props) => {
  const [local, others] = splitProps(props, ["href", "title", "children"]);
  
  return (
    <a
      class="flex items-center gap-2"
      href={local.href}
      rel="noreferrer"
      target="_blank"
      {...others}
    >
      {local.children ?? (
        <>
          <BookIcon size={16} />
          <span class="block font-medium">{local.title}</span>
        </>
      )}
    </a>
  );
};
