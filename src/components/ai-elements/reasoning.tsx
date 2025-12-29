/**
 * Reasoning 组件 - 移植自 Vercel AI Elements
 * 
 * 用于显示 AI 推理过程的组件
 */

import type { Component, JSX } from "solid-js";
import {
  createContext,
  useContext,
  createSignal,
  createEffect,
  createMemo,
  onCleanup,
  splitProps,
  Show,
} from "solid-js";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/components/ui/utils";
import { Shimmer } from "./shimmer";

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

type ReasoningContextValue = {
  isStreaming: () => boolean;
  isOpen: () => boolean;
  setIsOpen: (open: boolean) => void;
  duration: () => number | undefined;
};

const ReasoningContext = createContext<ReasoningContextValue>();

export const useReasoning = () => {
  const context = useContext(ReasoningContext);
  if (!context) {
    throw new Error("Reasoning components must be used within Reasoning");
  }
  return context;
};

export type ReasoningProps = JSX.HTMLAttributes<HTMLDivElement> & {
  isStreaming?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  duration?: number;
};

const AUTO_CLOSE_DELAY = 1000;
const MS_IN_S = 1000;

export const Reasoning: Component<ReasoningProps> = (props) => {
  const [local, others] = splitProps(props, [
    "class",
    "isStreaming",
    "open",
    "defaultOpen",
    "onOpenChange",
    "duration",
    "children",
  ]);

  const isControlled = () => local.open !== undefined;
  const [internalOpen, setInternalOpen] = createSignal(
    local.defaultOpen ?? true
  );
  const isOpen = () => (isControlled() ? local.open! : internalOpen());

  const setIsOpen = (newOpen: boolean) => {
    if (!isControlled()) {
      setInternalOpen(newOpen);
    }
    local.onOpenChange?.(newOpen);
  };

  const [duration, setDuration] = createSignal<number | undefined>(
    local.duration
  );
  const [hasAutoClosed, setHasAutoClosed] = createSignal(false);
  const [startTime, setStartTime] = createSignal<number | null>(null);

  // Track duration when streaming starts and ends
  createEffect(() => {
    if (local.isStreaming) {
      if (startTime() === null) {
        setStartTime(Date.now());
      }
    } else if (startTime() !== null) {
      setDuration(Math.ceil((Date.now() - startTime()) / MS_IN_S));
      setStartTime(null);
    }
  });

  // Auto-open when streaming starts, auto-close when streaming ends (once only)
  createEffect(() => {
    if (
      local.defaultOpen &&
      !local.isStreaming &&
      isOpen() &&
      !hasAutoClosed()
    ) {
      const timer = setTimeout(() => {
        setIsOpen(false);
        setHasAutoClosed(true);
      }, AUTO_CLOSE_DELAY);

      onCleanup(() => clearTimeout(timer));
    }
  });

  const handleOpenChange = (newOpen: boolean) => {
    setIsOpen(newOpen);
  };

  const contextValue: ReasoningContextValue = {
    isStreaming: () => local.isStreaming ?? false,
    isOpen,
    setIsOpen,
    duration,
  };

  return (
    <ReasoningContext.Provider value={contextValue}>
      <Collapsible
        class={cn("not-prose mb-4", local.class)}
        onOpenChange={handleOpenChange}
        open={isOpen()}
        {...others}
      >
        {local.children}
      </Collapsible>
    </ReasoningContext.Provider>
  );
};

export type ReasoningTriggerProps = JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
  getThinkingMessage?: (
    isStreaming: boolean,
    duration?: number
  ) => JSX.Element;
};

const defaultGetThinkingMessage = (
  isStreaming: boolean,
  duration?: number
) => {
  if (isStreaming || duration === 0) {
    return <Shimmer duration={1}>Thinking...</Shimmer>;
  }
  if (duration === undefined) {
    return <p>Thought for a few seconds</p>;
  }
  return <p>Thought for {duration} seconds</p>;
};

export const ReasoningTrigger: Component<ReasoningTriggerProps> = (props) => {
  const { isStreaming, isOpen, duration } = useReasoning();
  const [local, others] = splitProps(props, [
    "class",
    "children",
    "getThinkingMessage",
  ]);

  const thinkingMessage = createMemo(() =>
    (local.getThinkingMessage || defaultGetThinkingMessage)(
      isStreaming(),
      duration()
    )
  );

  return (
    <CollapsibleTrigger
      class={cn(
        "flex w-full items-center gap-2 text-muted-foreground text-sm transition-colors hover:text-foreground",
        local.class
      )}
      {...others}
    >
      {local.children ?? (
        <>
          <BrainIcon size={16} />
          {thinkingMessage()}
          <ChevronDownIcon
            size={16}
            class={cn(
              "transition-transform",
              isOpen() ? "rotate-180" : "rotate-0"
            )}
          />
        </>
      )}
    </CollapsibleTrigger>
  );
};

export type ReasoningContentProps = JSX.HTMLAttributes<HTMLDivElement> & {
  children: string;
};

export const ReasoningContent: Component<ReasoningContentProps> = (props) => {
  const [local, others] = splitProps(props, ["class", "children"]);

  return (
    <CollapsibleContent
      class={cn(
        "mt-4 text-sm",
        "data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-2 data-[state=open]:slide-in-from-top-2 text-muted-foreground outline-none data-[state=closed]:animate-out data-[state=open]:animate-in",
        local.class
      )}
      {...others}
    >
      <div class="prose prose-sm max-w-none">{local.children}</div>
    </CollapsibleContent>
  );
};
