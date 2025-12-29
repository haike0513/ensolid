/**
 * ChainOfThought 组件 - 移植自 Vercel AI Elements
 * 
 * 用于显示思维链过程的组件
 */

import type { Component, JSX } from "solid-js";
import {
  createContext,
  useContext,
  createSignal,
  createMemo,
  splitProps,
  Show,
} from "solid-js";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/components/ui/utils";

// 图标组件
const BrainIcon = (props: { size?: number; class?: string }) => (
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
    <path d="M12 5a3 3 0 1 0-5.997.142 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588 4 4 0 0 0 7.636 2.106 3 3 0 0 0 .164-1.606 3 3 0 0 0 .164-1.606 4 4 0 0 0 .556-6.588 4 4 0 0 0-2.526-5.77A3 3 0 0 0 12 5Z" />
    <path d="M12 5a3 3 0 1 1 5.997.142 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588 4 4 0 0 1-7.636 2.106 3 3 0 0 1-.164-1.606 3 3 0 0 1-.164-1.606 4 4 0 0 1-.556-6.588 4 4 0 0 1 2.526-5.77A3 3 0 0 1 12 5Z" />
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

const DotIcon = (props: { size?: number; class?: string }) => (
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
    <circle cx="12" cy="12" r="1" />
  </svg>
);

type ChainOfThoughtContextValue = {
  isOpen: () => boolean;
  setIsOpen: (open: boolean) => void;
};

const ChainOfThoughtContext = createContext<ChainOfThoughtContextValue>();

const useChainOfThought = () => {
  const context = useContext(ChainOfThoughtContext);
  if (!context) {
    throw new Error(
      "ChainOfThought components must be used within ChainOfThought"
    );
  }
  return context;
};

export type ChainOfThoughtProps = JSX.HTMLAttributes<HTMLDivElement> & {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export const ChainOfThought: Component<ChainOfThoughtProps> = (props) => {
  const [local, others] = splitProps(props, [
    "class",
    "open",
    "defaultOpen",
    "onOpenChange",
    "children",
  ]);

  const isControlled = () => local.open !== undefined;
  const [internalOpen, setInternalOpen] = createSignal(
    local.defaultOpen ?? false
  );
  const isOpen = () => (isControlled() ? local.open! : internalOpen());

  const setIsOpen = (newOpen: boolean) => {
    if (!isControlled()) {
      setInternalOpen(newOpen);
    }
    local.onOpenChange?.(newOpen);
  };

  const chainOfThoughtContext: ChainOfThoughtContextValue = {
    isOpen,
    setIsOpen,
  };

  return (
    <ChainOfThoughtContext.Provider value={chainOfThoughtContext}>
      <div
        class={cn("not-prose max-w-prose space-y-4", local.class)}
        {...others}
      >
        {local.children}
      </div>
    </ChainOfThoughtContext.Provider>
  );
};

export type ChainOfThoughtHeaderProps = JSX.ButtonHTMLAttributes<HTMLButtonElement>;

export const ChainOfThoughtHeader: Component<ChainOfThoughtHeaderProps> = (
  props
) => {
  const { isOpen, setIsOpen } = useChainOfThought();
  const [local, others] = splitProps(props, ["class", "children"]);

  return (
    <Collapsible onOpenChange={setIsOpen} open={isOpen()}>
      <CollapsibleTrigger
        class={cn(
          "flex w-full items-center gap-2 text-muted-foreground text-sm transition-colors hover:text-foreground",
          local.class
        )}
        {...others}
      >
        <BrainIcon size={16} />
        <span class="flex-1 text-left">
          {local.children ?? "Chain of Thought"}
        </span>
        <ChevronDownIcon
          size={16}
          class={cn(
            "transition-transform",
            isOpen() ? "rotate-180" : "rotate-0"
          )}
        />
      </CollapsibleTrigger>
    </Collapsible>
  );
};

export type ChainOfThoughtStepProps = JSX.HTMLAttributes<HTMLDivElement> & {
  icon?: Component<{ size?: number; class?: string }>;
  label: JSX.Element;
  description?: JSX.Element;
  status?: "complete" | "active" | "pending";
};

export const ChainOfThoughtStep: Component<ChainOfThoughtStepProps> = (
  props
) => {
  const [local, others] = splitProps(props, [
    "class",
    "icon",
    "label",
    "description",
    "status",
    "children",
  ]);

  const Icon = local.icon || DotIcon;
  const status = local.status || "complete";

  const statusStyles = {
    complete: "text-muted-foreground",
    active: "text-foreground",
    pending: "text-muted-foreground/50",
  };

  return (
    <div
      class={cn(
        "flex gap-2 text-sm",
        statusStyles[status],
        "fade-in-0 slide-in-from-top-2 animate-in",
        local.class
      )}
      {...others}
    >
      <div class="relative mt-0.5">
        <Icon size={16} />
        <div class="-mx-px absolute top-7 bottom-0 left-1/2 w-px bg-border" />
      </div>
      <div class="flex-1 space-y-2 overflow-hidden">
        <div>{local.label}</div>
        <Show when={local.description}>
          <div class="text-muted-foreground text-xs">{local.description}</div>
        </Show>
        {local.children}
      </div>
    </div>
  );
};

export type ChainOfThoughtSearchResultsProps = JSX.HTMLAttributes<HTMLDivElement>;

export const ChainOfThoughtSearchResults: Component<
  ChainOfThoughtSearchResultsProps
> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <div class={cn("flex flex-wrap items-center gap-2", local.class)} {...others} />
  );
};

export type ChainOfThoughtSearchResultProps = JSX.HTMLAttributes<HTMLDivElement>;

export const ChainOfThoughtSearchResult: Component<
  ChainOfThoughtSearchResultProps
> = (props) => {
  const [local, others] = splitProps(props, ["class", "children"]);
  return (
    <Badge
      class={cn("gap-1 px-2 py-0.5 font-normal text-xs", local.class)}
      variant="secondary"
      {...others}
    >
      {local.children}
    </Badge>
  );
};

export type ChainOfThoughtContentProps = JSX.HTMLAttributes<HTMLDivElement>;

export const ChainOfThoughtContent: Component<ChainOfThoughtContentProps> = (
  props
) => {
  const { isOpen } = useChainOfThought();
  const [local, others] = splitProps(props, ["class", "children"]);

  return (
    <Collapsible open={isOpen()}>
      <CollapsibleContent
        class={cn(
          "mt-2 space-y-3",
          "data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-2 data-[state=open]:slide-in-from-top-2 text-popover-foreground outline-none data-[state=closed]:animate-out data-[state=open]:animate-in",
          local.class
        )}
        {...others}
      >
        {local.children}
      </CollapsibleContent>
    </Collapsible>
  );
};

export type ChainOfThoughtImageProps = JSX.HTMLAttributes<HTMLDivElement> & {
  caption?: string;
};

export const ChainOfThoughtImage: Component<ChainOfThoughtImageProps> = (
  props
) => {
  const [local, others] = splitProps(props, ["class", "children", "caption"]);
  return (
    <div class={cn("mt-2 space-y-2", local.class)} {...others}>
      <div class="relative flex max-h-[22rem] items-center justify-center overflow-hidden rounded-lg bg-muted p-3">
        {local.children}
      </div>
      <Show when={local.caption}>
        <p class="text-muted-foreground text-xs">{local.caption}</p>
      </Show>
    </div>
  );
};
