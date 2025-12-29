/**
 * Message 组件 - 移植自 Vercel AI Elements
 *
 * 用于显示单条聊天消息的组件，支持分支、附件等功能
 */

import type { Component, JSX } from "solid-js";
import {
  children as solidChildren,
  createContext,
  createEffect,
  createSignal,
  For,
  Show,
  splitProps,
  useContext,
} from "solid-js";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/components/ui/utils";
import type { FileUIPart, UIMessage } from "ai";

// 简单的图标组件
const ChevronLeftIcon = (props: { size?: number; class?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.size || 14}
    height={props.size || 14}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class={props.class}
  >
    <path d="m15 18-6-6 6-6" />
  </svg>
);

const ChevronRightIcon = (props: { size?: number; class?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.size || 14}
    height={props.size || 14}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class={props.class}
  >
    <path d="m9 18 6-6-6-6" />
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

export type MessageProps = JSX.HTMLAttributes<HTMLDivElement> & {
  from: UIMessage["role"];
};

export const Message: Component<MessageProps> = (props) => {
  const [local, others] = splitProps(props, ["class", "from"]);

  return (
    <div
      class={cn(
        "group flex w-full max-w-[95%] flex-col gap-2",
        local.from === "user" ? "is-user ml-auto justify-end" : "is-assistant",
        local.class,
      )}
      {...others}
    />
  );
};

export type MessageContentProps = JSX.HTMLAttributes<HTMLDivElement>;

export const MessageContent: Component<MessageContentProps> = (props) => {
  const [local, others] = splitProps(props, ["class", "children"]);

  return (
    <div
      class={cn(
        "is-user:dark flex w-fit max-w-full min-w-0 flex-col gap-2 overflow-hidden text-sm",
        "group-[.is-user]:ml-auto group-[.is-user]:rounded-lg group-[.is-user]:bg-secondary group-[.is-user]:px-4 group-[.is-user]:py-3 group-[.is-user]:text-foreground",
        "group-[.is-assistant]:text-foreground",
        local.class,
      )}
      {...others}
    >
      {local.children}
    </div>
  );
};

export type MessageActionsProps = JSX.HTMLAttributes<HTMLDivElement>;

export const MessageActions: Component<MessageActionsProps> = (props) => {
  const [local, others] = splitProps(props, ["class", "children"]);

  return (
    <div class={cn("flex items-center gap-1", local.class)} {...others}>
      {local.children}
    </div>
  );
};

export type MessageActionProps = JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
  tooltip?: string;
  label?: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon" | "icon-sm";
};

export const MessageAction: Component<MessageActionProps> = (props) => {
  const [local, others] = splitProps(props, [
    "tooltip",
    "label",
    "variant",
    "size",
    "children",
  ]);

  const button = (
    <Button
      size={local.size === "icon-sm" ? "icon" : local.size}
      type="button"
      variant={local.variant || "ghost"}
      {...others}
    >
      {local.children}
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

type MessageBranchContextType = {
  currentBranch: () => number;
  totalBranches: () => number;
  goToPrevious: () => void;
  goToNext: () => void;
  branches: () => JSX.Element[];
  setBranches: (branches: JSX.Element[]) => void;
};

const MessageBranchContext = createContext<MessageBranchContextType>();

const useMessageBranch = () => {
  const context = useContext(MessageBranchContext);
  if (!context) {
    throw new Error(
      "MessageBranch components must be used within MessageBranch",
    );
  }
  return context;
};

export type MessageBranchProps = JSX.HTMLAttributes<HTMLDivElement> & {
  defaultBranch?: number;
  onBranchChange?: (branchIndex: number) => void;
};

export const MessageBranch: Component<MessageBranchProps> = (props) => {
  const [local, others] = splitProps(props, [
    "defaultBranch",
    "onBranchChange",
    "class",
    "children",
  ]);
  const [currentBranch, setCurrentBranch] = createSignal(
    local.defaultBranch ?? 0,
  );
  const [branches, setBranches] = createSignal<JSX.Element[]>([]);

  const handleBranchChange = (newBranch: number) => {
    setCurrentBranch(newBranch);
    local.onBranchChange?.(newBranch);
  };

  const goToPrevious = () => {
    const total = branches().length;
    const newBranch = currentBranch() > 0 ? currentBranch() - 1 : total - 1;
    handleBranchChange(newBranch);
  };

  const goToNext = () => {
    const total = branches().length;
    const newBranch = currentBranch() < total - 1 ? currentBranch() + 1 : 0;
    handleBranchChange(newBranch);
  };

  const contextValue: MessageBranchContextType = {
    currentBranch,
    totalBranches: () => branches().length,
    goToPrevious,
    goToNext,
    branches,
    setBranches,
  };

  return (
    <MessageBranchContext.Provider value={contextValue}>
      <div
        class={cn("grid w-full gap-2 [&>div]:pb-0", local.class)}
        {...others}
      >
        {local.children}
      </div>
    </MessageBranchContext.Provider>
  );
};

export type MessageBranchContentProps = JSX.HTMLAttributes<HTMLDivElement>;

export const MessageBranchContent: Component<MessageBranchContentProps> = (
  props,
) => {
  const { currentBranch, setBranches, branches } = useMessageBranch();
  const resolvedChildren = solidChildren(() => props.children);

  createEffect(() => {
    const childrenArray = resolvedChildren();
    if (childrenArray) {
      const array = Array.isArray(childrenArray)
        ? childrenArray
        : [childrenArray];
      const elements = array.filter((child) =>
        child != null && typeof child === "object"
      ) as JSX.Element[];
      if (elements.length !== branches().length) {
        setBranches(elements);
      }
    }
  });

  return (
    <For each={branches()}>
      {(branch, index) => (
        <div
          class={cn(
            "grid gap-2 overflow-hidden [&>div]:pb-0",
            index() === currentBranch() ? "block" : "hidden",
          )}
        >
          {branch}
        </div>
      )}
    </For>
  );
};

export type MessageBranchSelectorProps = JSX.HTMLAttributes<HTMLDivElement> & {
  from: UIMessage["role"];
};

export const MessageBranchSelector: Component<MessageBranchSelectorProps> = (
  props,
) => {
  const { totalBranches } = useMessageBranch();
  const [local, others] = splitProps(props, ["class", "from"]);

  // Don't render if there's only one branch
  if (totalBranches() <= 1) {
    return null;
  }

  return (
    <div
      class={cn(
        "[&>*:not(:first-child)]:rounded-l-md [&>*:not(:last-child)]:rounded-r-md flex",
        local.class,
      )}
      {...others}
    />
  );
};

export type MessageBranchPreviousProps = JSX.ButtonHTMLAttributes<
  HTMLButtonElement
>;

export const MessageBranchPrevious: Component<MessageBranchPreviousProps> = (
  props,
) => {
  const { goToPrevious, totalBranches } = useMessageBranch();
  const [local, others] = splitProps(props, ["children"]);

  return (
    <Button
      aria-label="Previous branch"
      disabled={totalBranches() <= 1}
      onClick={goToPrevious}
      size="icon"
      type="button"
      variant="ghost"
      {...others}
    >
      {local.children ?? <ChevronLeftIcon size={14} />}
    </Button>
  );
};

export type MessageBranchNextProps = JSX.ButtonHTMLAttributes<
  HTMLButtonElement
>;

export const MessageBranchNext: Component<MessageBranchNextProps> = (props) => {
  const { goToNext, totalBranches } = useMessageBranch();
  const [local, others] = splitProps(props, ["class", "children"]);

  return (
    <Button
      aria-label="Next branch"
      disabled={totalBranches() <= 1}
      onClick={goToNext}
      size="icon"
      type="button"
      variant="ghost"
      {...others}
    >
      {local.children ?? <ChevronRightIcon size={14} />}
    </Button>
  );
};

export type MessageBranchPageProps = JSX.HTMLAttributes<HTMLSpanElement>;

export const MessageBranchPage: Component<MessageBranchPageProps> = (props) => {
  const { currentBranch, totalBranches } = useMessageBranch();
  const [local, others] = splitProps(props, ["class"]);

  return (
    <span
      class={cn(
        "border-none bg-transparent text-muted-foreground shadow-none px-3 py-1.5 text-sm",
        local.class,
      )}
      {...others}
    >
      {currentBranch() + 1} of {totalBranches()}
    </span>
  );
};

import { Streamdown } from "@ensolid/streamdown";

export type MessageResponseProps = JSX.HTMLAttributes<HTMLDivElement> & {
  children?: JSX.Element | string;
  /**
   * 是否使用流式渲染模式（默认：true，适合 AI 流式响应）
   */
  streaming?: boolean;
  /**
   * 是否解析不完整的 markdown（默认：true，适合流式内容）
   */
  parseIncompleteMarkdown?: boolean;
};

// 使用 Streamdown 进行 markdown 渲染的组件
export const MessageResponse: Component<MessageResponseProps> = (props) => {
  const [local, others] = splitProps(props, [
    "class",
    "children",
    "streaming",
    "parseIncompleteMarkdown",
  ]);

  const streaming = () => local.streaming ?? true;
  const parseIncomplete = () => local.parseIncompleteMarkdown ?? true;

  // 使用 solidChildren 解析 children，支持字符串和 JSX 元素
  const resolvedChildren = solidChildren(() => local.children);

  // 提取字符串内容用于 Streamdown 渲染
  const markdownContent = () => {
    const children = resolvedChildren();

    // 如果直接是字符串，直接返回
    if (typeof children === "string") {
      return children;
    }

    // 如果是数组，提取所有字符串并合并
    if (Array.isArray(children)) {
      const textParts = children
        .map((c) => (typeof c === "string" ? c : ""))
        .filter((c) => c.length > 0);
      return textParts.length > 0 ? textParts.join("") : "";
    }

    // 其他情况返回空字符串
    return "";
  };

  // 判断是否有可渲染的 markdown 内容
  const hasMarkdownContent = () => {
    const content = markdownContent();
    return content.length > 0;
  };

  return (
    <div
      class={cn(
        "size-full [&>*:first-child]:mt-0 [&>*:last-child]:mb-0",
        local.class,
      )}
      {...others}
    >
      <Show
        when={hasMarkdownContent()}
        fallback={
          // 如果没有 markdown 内容，直接渲染原始 children

            <div class="prose prose-sm max-w-none dark:prose-invert">
              {resolvedChildren()}
            </div>

        }
      >
        <Streamdown
          mode={streaming() ? "streaming" : "static"}
          parseIncompleteMarkdown={parseIncomplete()}
          class="prose prose-sm max-w-none dark:prose-invert
            prose-headings:font-semibold
            prose-p:leading-relaxed
            prose-pre:bg-muted
            prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
            prose-a:text-primary prose-a:underline
            prose-strong:font-semibold
            prose-ul:list-disc prose-ul:pl-6
            prose-ol:list-decimal prose-ol:pl-6
            prose-blockquote:border-l-4 prose-blockquote:border-muted-foreground prose-blockquote:pl-4 prose-blockquote:italic
            prose-table:border-collapse prose-table:border prose-table:border-border
            prose-th:border prose-th:border-border prose-th:p-2 prose-th:bg-muted
            prose-td:border prose-td:border-border prose-td:p-2"
        >
          {markdownContent()}
        </Streamdown>
      </Show>
    </div>
  );
};

export type MessageAttachmentProps = JSX.HTMLAttributes<HTMLDivElement> & {
  data: FileUIPart;
  onRemove?: () => void;
};

export const MessageAttachment: Component<MessageAttachmentProps> = (props) => {
  const [local, others] = splitProps(props, ["data", "onRemove", "class"]);
  const filename = local.data.filename || "";
  const mediaType = local.data.mediaType?.startsWith("image/") && local.data.url
    ? "image"
    : "file";
  const isImage = mediaType === "image";
  const attachmentLabel = filename || (isImage ? "Image" : "Attachment");

  return (
    <div
      class={cn(
        "group relative size-24 overflow-hidden rounded-lg",
        local.class,
      )}
      {...others}
    >
      <Show
        when={isImage}
        fallback={
          <>
            <Tooltip>
              <TooltipTrigger asChild>
                <div class="flex size-full shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  <PaperclipIcon size={16} />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{attachmentLabel}</p>
              </TooltipContent>
            </Tooltip>
            <Show when={local.onRemove}>
              <Button
                aria-label="Remove attachment"
                class="size-6 shrink-0 rounded-full p-0 opacity-0 transition-opacity hover:bg-accent group-hover:opacity-100 [&>svg]:size-3 absolute top-2 right-2"
                onClick={(e) => {
                  e.stopPropagation();
                  local.onRemove?.();
                }}
                type="button"
                variant="ghost"
              >
                <XIcon />
                <span class="sr-only">Remove</span>
              </Button>
            </Show>
          </>
        }
      >
        <img
          alt={filename || "attachment"}
          class="size-full object-cover"
          height={100}
          src={local.data.url}
          width={100}
        />
        <Show when={local.onRemove}>
          <Button
            aria-label="Remove attachment"
            class="absolute top-2 right-2 size-6 rounded-full bg-background/80 p-0 opacity-0 backdrop-blur-sm transition-opacity hover:bg-background group-hover:opacity-100 [&>svg]:size-3"
            onClick={(e) => {
              e.stopPropagation();
              local.onRemove?.();
            }}
            type="button"
            variant="ghost"
          >
            <XIcon />
            <span class="sr-only">Remove</span>
          </Button>
        </Show>
      </Show>
    </div>
  );
};

export type MessageAttachmentsProps = JSX.HTMLAttributes<HTMLDivElement>;

export const MessageAttachments: Component<MessageAttachmentsProps> = (
  props,
) => {
  const [local, others] = splitProps(props, ["class", "children"]);

  if (!local.children) {
    return null;
  }

  return (
    <div
      class={cn(
        "ml-auto flex w-fit flex-wrap items-start gap-2",
        local.class,
      )}
      {...others}
    >
      {local.children}
    </div>
  );
};

export type MessageToolbarProps = JSX.HTMLAttributes<HTMLDivElement>;

export const MessageToolbar: Component<MessageToolbarProps> = (props) => {
  const [local, others] = splitProps(props, ["class", "children"]);

  return (
    <div
      class={cn(
        "mt-4 flex w-full items-center justify-between gap-4",
        local.class,
      )}
      {...others}
    >
      {local.children}
    </div>
  );
};
