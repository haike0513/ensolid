/**
 * InlineCitation 组件 - 移植自 Vercel AI Elements
 * 
 * 用于显示内联引用的组件
 */

import type { Component, JSX } from "solid-js";
import { splitProps, Show, For } from "solid-js";
import { Badge } from "@/components/ui/badge";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { cn } from "@/components/ui/utils";

export type InlineCitationProps = JSX.HTMLAttributes<HTMLSpanElement>;

export const InlineCitation: Component<InlineCitationProps> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <span
      class={cn("group inline items-center gap-1", local.class)}
      {...others}
    />
  );
};

export type InlineCitationTextProps = JSX.HTMLAttributes<HTMLSpanElement>;

export const InlineCitationText: Component<InlineCitationTextProps> = (
  props
) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <span
      class={cn("transition-colors group-hover:bg-accent", local.class)}
      {...others}
    />
  );
};

export type InlineCitationCardProps = JSX.HTMLAttributes<HTMLDivElement> & {
  openDelay?: number;
  closeDelay?: number;
};

export const InlineCitationCard: Component<InlineCitationCardProps> = (
  props
) => {
  const [local, others] = splitProps(props, ["openDelay", "closeDelay"]);
  return (
    <HoverCard
      openDelay={local.openDelay || 0}
      closeDelay={local.closeDelay || 0}
      {...others}
    />
  );
};

export type InlineCitationCardTriggerProps = JSX.HTMLAttributes<HTMLDivElement> & {
  sources: string[];
};

export const InlineCitationCardTrigger: Component<
  InlineCitationCardTriggerProps
> = (props) => {
  const [local, others] = splitProps(props, ["sources", "class"]);
  return (
    <HoverCardTrigger asChild>
      <Badge
        class={cn("ml-1 rounded-full", local.class)}
        variant="secondary"
        {...others}
      >
        <Show
          when={local.sources[0]}
          fallback="unknown"}
        >
          {() => {
            try {
              const url = new URL(local.sources[0]);
              return (
                <>
                  {url.hostname}{" "}
                  {local.sources.length > 1 && `+${local.sources.length - 1}`}
                </>
              );
            } catch {
              return local.sources[0];
            }
          }}
        </Show>
      </Badge>
    </HoverCardTrigger>
  );
};

export type InlineCitationCardBodyProps = JSX.HTMLAttributes<HTMLDivElement>;

export const InlineCitationCardBody: Component<
  InlineCitationCardBodyProps
> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <HoverCardContent class={cn("relative w-80 p-0", local.class)} {...others} />
  );
};

// 简化的轮播组件（不依赖 Carousel）
export type InlineCitationCarouselProps = JSX.HTMLAttributes<HTMLDivElement>;

export const InlineCitationCarousel: Component<
  InlineCitationCarouselProps
> = (props) => {
  const [local, others] = splitProps(props, ["class", "children"]);
  return (
    <div class={cn("w-full", local.class)} {...others}>
      {local.children}
    </div>
  );
};

export type InlineCitationCarouselContentProps = JSX.HTMLAttributes<HTMLDivElement>;

export const InlineCitationCarouselContent: Component<
  InlineCitationCarouselContentProps
> = (props) => {
  return <div {...props} />;
};

export type InlineCitationCarouselItemProps = JSX.HTMLAttributes<HTMLDivElement>;

export const InlineCitationCarouselItem: Component<
  InlineCitationCarouselItemProps
> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <div class={cn("w-full space-y-2 p-4 pl-8", local.class)} {...others} />
  );
};

export type InlineCitationCarouselHeaderProps = JSX.HTMLAttributes<HTMLDivElement>;

export const InlineCitationCarouselHeader: Component<
  InlineCitationCarouselHeaderProps
> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <div
      class={cn(
        "flex items-center justify-between gap-2 rounded-t-md bg-secondary p-2",
        local.class
      )}
      {...others}
    />
  );
};

export type InlineCitationCarouselIndexProps = JSX.HTMLAttributes<HTMLDivElement> & {
  current?: number;
  count?: number;
};

export const InlineCitationCarouselIndex: Component<
  InlineCitationCarouselIndexProps
> = (props) => {
  const [local, others] = splitProps(props, ["class", "children", "current", "count"]);
  return (
    <div
      class={cn(
        "flex flex-1 items-center justify-end px-3 py-1 text-muted-foreground text-xs",
        local.class
      )}
      {...others}
    >
      {local.children ?? (
        <Show when={local.current !== undefined && local.count !== undefined}>
          {`${local.current}/${local.count}`}
        </Show>
      )}
    </div>
  );
};

// 图标组件
const ArrowLeftIcon = (props: { size?: number; class?: string }) => (
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
    <path d="m12 19-7-7 7-7" />
    <path d="M19 12H5" />
  </svg>
);

const ArrowRightIcon = (props: { size?: number; class?: string }) => (
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
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

export type InlineCitationCarouselPrevProps = JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
  onClick?: () => void;
};

export const InlineCitationCarouselPrev: Component<
  InlineCitationCarouselPrevProps
> = (props) => {
  const [local, others] = splitProps(props, ["class", "onClick"]);
  return (
    <button
      aria-label="Previous"
      class={cn("shrink-0", local.class)}
      onClick={local.onClick}
      type="button"
      {...others}
    >
      <ArrowLeftIcon size={16} class="text-muted-foreground" />
    </button>
  );
};

export type InlineCitationCarouselNextProps = JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
  onClick?: () => void;
};

export const InlineCitationCarouselNext: Component<
  InlineCitationCarouselNextProps
> = (props) => {
  const [local, others] = splitProps(props, ["class", "onClick"]);
  return (
    <button
      aria-label="Next"
      class={cn("shrink-0", local.class)}
      onClick={local.onClick}
      type="button"
      {...others}
    >
      <ArrowRightIcon size={16} class="text-muted-foreground" />
    </button>
  );
};

export type InlineCitationSourceProps = JSX.HTMLAttributes<HTMLDivElement> & {
  title?: string;
  url?: string;
  description?: string;
};

export const InlineCitationSource: Component<InlineCitationSourceProps> = (
  props
) => {
  const [local, others] = splitProps(props, [
    "class",
    "title",
    "url",
    "description",
    "children",
  ]);
  return (
    <div class={cn("space-y-1", local.class)} {...others}>
      <Show when={local.title}>
        <h4 class="truncate font-medium text-sm leading-tight">{local.title}</h4>
      </Show>
      <Show when={local.url}>
        <p class="truncate break-all text-muted-foreground text-xs">{local.url}</p>
      </Show>
      <Show when={local.description}>
        <p class="line-clamp-3 text-muted-foreground text-sm leading-relaxed">
          {local.description}
        </p>
      </Show>
      {local.children}
    </div>
  );
};

export type InlineCitationQuoteProps = JSX.HTMLAttributes<HTMLQuoteElement>;

export const InlineCitationQuote: Component<InlineCitationQuoteProps> = (
  props
) => {
  const [local, others] = splitProps(props, ["class", "children"]);
  return (
    <blockquote
      class={cn(
        "border-muted border-l-2 pl-3 text-muted-foreground text-sm italic",
        local.class
      )}
      {...others}
    >
      {local.children}
    </blockquote>
  );
};
