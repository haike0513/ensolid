/**
 * Conversation 组件 - 移植自 Vercel AI Elements
 * 
 * 用于显示对话列表的组件，支持自动滚动到底部
 */

import type { Component, JSX } from "solid-js";
import { createSignal, createEffect, onCleanup, Show, splitProps } from "solid-js";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/components/ui/utils";

// 简单的箭头向下图标
const ArrowDownIcon = (props: { size?: number; class?: string }) => (
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
    <path d="M12 5v14" />
    <path d="m19 12-7 7-7-7" />
  </svg>
);

export type ConversationProps = JSX.HTMLAttributes<HTMLDivElement> & {
  initial?: "smooth" | "auto";
  resize?: "smooth" | "auto";
  role?: string;
};

export const Conversation: Component<ConversationProps> = (props) => {
  const [local, others] = splitProps(props, ["class", "initial", "resize", "role"]);
  let containerRef: HTMLDivElement | undefined;
  let contentRef: HTMLDivElement | undefined;
  const [isAtBottom, setIsAtBottom] = createSignal(true);

  const checkIfAtBottom = () => {
    if (!containerRef || !contentRef) return;
    const container = containerRef;
    const content = contentRef;
    const threshold = 50; // 50px threshold
    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight < threshold;
    setIsAtBottom(isNearBottom);
  };

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    if (containerRef) {
      containerRef.scrollTo({
        top: containerRef.scrollHeight,
        behavior,
      });
    }
  };

  createEffect(() => {
    if (!containerRef) return;
    
    const container = containerRef;
    container.addEventListener("scroll", checkIfAtBottom);
    const resizeObserver = new ResizeObserver(() => {
      checkIfAtBottom();
      if (isAtBottom()) {
        scrollToBottom(local.resize === "smooth" ? "smooth" : "auto");
      }
    });
    
    if (contentRef) {
      resizeObserver.observe(contentRef);
    }

    // 初始滚动
    if (local.initial === "smooth") {
      scrollToBottom("smooth");
    } else {
      scrollToBottom("auto");
    }

    onCleanup(() => {
      container.removeEventListener("scroll", checkIfAtBottom);
      resizeObserver.disconnect();
    });
  });

  return (
    <div
      ref={containerRef}
      class={cn("relative flex-1 overflow-y-auto", local.class)}
      role={local.role || "log"}
      {...others}
    >
      <div ref={contentRef} class="flex flex-col gap-8 p-4">
        {props.children}
      </div>
    </div>
  );
};

export type ConversationContentProps = JSX.HTMLAttributes<HTMLDivElement>;

export const ConversationContent: Component<ConversationContentProps> = (props) => {
  const [local, others] = splitProps(props, ["class", "children"]);
  
  return (
    <div
      class={cn("flex flex-col gap-8 p-4", local.class)}
      {...others}
    >
      {local.children}
    </div>
  );
};

export type ConversationEmptyStateProps = JSX.HTMLAttributes<HTMLDivElement> & {
  title?: string;
  description?: string;
  icon?: JSX.Element;
};

export const ConversationEmptyState: Component<ConversationEmptyStateProps> = (props) => {
  const [local, others] = splitProps(props, ["class", "title", "description", "icon", "children"]);
  
  return (
    <div
      class={cn(
        "flex size-full flex-col items-center justify-center gap-3 p-8 text-center",
        local.class
      )}
      {...others}
    >
      {local.children ?? (
        <>
          {local.icon && <div class="text-muted-foreground">{local.icon}</div>}
          <div class="space-y-1">
            <h3 class="font-medium text-sm">{local.title || "No messages yet"}</h3>
            {local.description && (
              <p class="text-muted-foreground text-sm">{local.description}</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export type ConversationScrollButtonProps = JSX.ButtonHTMLAttributes<HTMLButtonElement>;

export const ConversationScrollButton: Component<ConversationScrollButtonProps> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  let containerRef: HTMLDivElement | undefined;
  const [isAtBottom, setIsAtBottom] = createSignal(true);

  const checkIfAtBottom = () => {
    if (!containerRef) return;
    const container = containerRef;
    const threshold = 50;
    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight < threshold;
    setIsAtBottom(isNearBottom);
  };

  const scrollToBottom = () => {
    if (containerRef) {
      containerRef.scrollTo({
        top: containerRef.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  createEffect(() => {
    if (!containerRef) return;
    const container = containerRef;
    container.addEventListener("scroll", checkIfAtBottom);
    checkIfAtBottom();
    
    onCleanup(() => {
      container.removeEventListener("scroll", checkIfAtBottom);
    });
  });

  // 查找最近的 Conversation 容器
  createEffect(() => {
    const findContainer = () => {
      let element = containerRef?.parentElement;
      while (element) {
        if (element.getAttribute("role") === "log" || element.classList.contains("overflow-y-auto")) {
          containerRef = element as HTMLDivElement;
          break;
        }
        element = element.parentElement;
      }
    };
    findContainer();
  });

  return (
    <Show when={!isAtBottom()}>
      <Button
        class={cn(
          "absolute bottom-4 left-[50%] translate-x-[-50%] rounded-full",
          local.class
        )}
        onClick={scrollToBottom}
        size="icon"
        type="button"
        variant="outline"
        {...others}
      >
        <ArrowDownIcon size={16} />
      </Button>
    </Show>
  );
};
