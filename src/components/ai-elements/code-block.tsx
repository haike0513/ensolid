/**
 * CodeBlock 组件 - 移植自 Vercel AI Elements
 * 
 * 用于显示代码块的组件，支持语法高亮
 */

import type { Component, JSX } from "solid-js";
import { createSignal, createEffect, onCleanup, splitProps, Show } from "solid-js";
import { Button } from "@/components/ui/button";
import { cn } from "@/components/ui/utils";

// 简单的图标组件
const CheckIcon = (props: { size?: number; class?: string }) => (
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
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const CopyIcon = (props: { size?: number; class?: string }) => (
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
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
    <path d="M4 16c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2h8c1.1 0 2 .9 2 2" />
  </svg>
);

type CodeBlockProps = JSX.HTMLAttributes<HTMLDivElement> & {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
};

export const CodeBlock: Component<CodeBlockProps> = (props) => {
  const [local, others] = splitProps(props, ["code", "language", "showLineNumbers", "class", "children"]);
  const [html, setHtml] = createSignal<string>("");
  const [isCopied, setIsCopied] = createSignal(false);

  // 简单的代码高亮（可以后续替换为更完整的实现，如 shiki）
  createEffect(() => {
    // 这里使用简单的转义，实际项目中可以使用 shiki 或其他高亮库
    const escaped = local.code
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
    
    setHtml(`<pre><code>${escaped}</code></pre>`);
  });

  const copyToClipboard = async () => {
    if (typeof window === "undefined" || !navigator?.clipboard?.writeText) {
      return;
    }

    try {
      await navigator.clipboard.writeText(local.code);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  return (
    <div
      class={cn(
        "group relative w-full overflow-hidden rounded-md border bg-background text-foreground",
        local.class
      )}
      {...others}
    >
      <div class="relative">
        <div
          class="overflow-auto [&>pre]:m-0 [&>pre]:bg-background! [&>pre]:p-4 [&>pre]:text-foreground! [&>pre]:text-sm [&_code]:font-mono [&_code]:text-sm"
          innerHTML={html()}
        />
        <Show when={local.children}>
          <div class="absolute top-2 right-2 flex items-center gap-2">
            {local.children}
          </div>
        </Show>
      </div>
    </div>
  );
};

export type CodeBlockCopyButtonProps = JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
  code: string;
  onCopy?: () => void;
  onError?: (error: Error) => void;
  timeout?: number;
};

export const CodeBlockCopyButton: Component<CodeBlockCopyButtonProps> = (props) => {
  const [local, others] = splitProps(props, ["code", "onCopy", "onError", "timeout", "class", "children"]);
  const [isCopied, setIsCopied] = createSignal(false);

  const copyToClipboard = async () => {
    if (typeof window === "undefined" || !navigator?.clipboard?.writeText) {
      local.onError?.(new Error("Clipboard API not available"));
      return;
    }

    try {
      await navigator.clipboard.writeText(local.code);
      setIsCopied(true);
      local.onCopy?.();
      setTimeout(() => setIsCopied(false), local.timeout || 2000);
    } catch (error) {
      local.onError?.(error as Error);
    }
  };

  const Icon = () => isCopied() ? <CheckIcon size={14} /> : <CopyIcon size={14} />;

  return (
    <Button
      class={cn("shrink-0", local.class)}
      onClick={copyToClipboard}
      size="icon"
      variant="ghost"
      {...others}
    >
      {local.children ?? <Icon />}
    </Button>
  );
};
