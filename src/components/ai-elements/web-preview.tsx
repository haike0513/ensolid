/**
 * WebPreview 组件 - 移植自 Vercel AI Elements
 * 
 * 用于预览网页的组件
 */

import type { Component, JSX } from "solid-js";
import {
  createContext,
  useContext,
  createSignal,
  createEffect,
  splitProps,
  Show,
  For,
} from "solid-js";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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

export type WebPreviewContextValue = {
  url: () => string;
  setUrl: (url: string) => void;
  consoleOpen: () => boolean;
  setConsoleOpen: (open: boolean) => void;
};

const WebPreviewContext = createContext<WebPreviewContextValue>();

const useWebPreview = () => {
  const context = useContext(WebPreviewContext);
  if (!context) {
    throw new Error("WebPreview components must be used within a WebPreview");
  }
  return context;
};

export type WebPreviewProps = JSX.HTMLAttributes<HTMLDivElement> & {
  defaultUrl?: string;
  onUrlChange?: (url: string) => void;
};

export const WebPreview: Component<WebPreviewProps> = (props) => {
  const [local, others] = splitProps(props, [
    "class",
    "children",
    "defaultUrl",
    "onUrlChange",
  ]);

  const [url, setUrl] = createSignal(local.defaultUrl || "");
  const [consoleOpen, setConsoleOpen] = createSignal(false);

  const handleUrlChange = (newUrl: string) => {
    setUrl(newUrl);
    local.onUrlChange?.(newUrl);
  };

  const contextValue: WebPreviewContextValue = {
    url,
    setUrl: handleUrlChange,
    consoleOpen,
    setConsoleOpen,
  };

  return (
    <WebPreviewContext.Provider value={contextValue}>
      <div
        class={cn(
          "flex size-full flex-col rounded-lg border bg-card",
          local.class
        )}
        {...others}
      >
        {local.children}
      </div>
    </WebPreviewContext.Provider>
  );
};

export type WebPreviewNavigationProps = JSX.HTMLAttributes<HTMLDivElement>;

export const WebPreviewNavigation: Component<WebPreviewNavigationProps> = (
  props
) => {
  const [local, others] = splitProps(props, ["class", "children"]);
  return (
    <div
      class={cn("flex items-center gap-1 border-b p-2", local.class)}
      {...others}
    >
      {local.children}
    </div>
  );
};

export type WebPreviewNavigationButtonProps = JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
  tooltip?: string;
};

export const WebPreviewNavigationButton: Component<
  WebPreviewNavigationButtonProps
> = (props) => {
  const [local, others] = splitProps(props, [
    "class",
    "tooltip",
    "children",
    "disabled",
    "onClick",
  ]);

  const button = (
    <Button
      class={cn("h-8 w-8 p-0 hover:text-foreground", local.class)}
      disabled={local.disabled}
      onClick={local.onClick}
      size="sm"
      variant="ghost"
      {...others}
    >
      {local.children}
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

export type WebPreviewUrlProps = JSX.InputHTMLAttributes<HTMLInputElement>;

export const WebPreviewUrl: Component<WebPreviewUrlProps> = (props) => {
  const { url, setUrl } = useWebPreview();
  const [local, others] = splitProps(props, [
    "value",
    "onChange",
    "onKeyDown",
    "class",
    "placeholder",
  ]);
  const [inputValue, setInputValue] = createSignal(local.value?.toString() || url());

  // Sync input value with context URL when it changes externally
  createEffect(() => {
    setInputValue(url());
  });

  const handleChange = (event: Event) => {
    const target = event.currentTarget as HTMLInputElement;
    setInputValue(target.value);
    local.onChange?.(event as any);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      const target = event.currentTarget as HTMLInputElement;
      setUrl(target.value);
    }
    local.onKeyDown?.(event as any);
  };

  return (
    <Input
      class={cn("h-8 flex-1 text-sm", local.class)}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      placeholder={local.placeholder || "Enter URL..."}
      value={local.value?.toString() ?? inputValue()}
      {...others}
    />
  );
};

export type WebPreviewBodyProps = JSX.IframeHTMLAttributes<HTMLIFrameElement> & {
  loading?: JSX.Element;
};

export const WebPreviewBody: Component<WebPreviewBodyProps> = (props) => {
  const { url } = useWebPreview();
  const [local, others] = splitProps(props, ["class", "loading", "src"]);

  return (
    <div class="flex-1">
      <iframe
        class={cn("size-full", local.class)}
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation"
        src={(local.src ?? url()) || undefined}
        title="Preview"
        {...others}
      />
      <Show when={local.loading}>{local.loading}</Show>
    </div>
  );
};

export type WebPreviewConsoleProps = JSX.HTMLAttributes<HTMLDivElement> & {
  logs?: Array<{
    level: "log" | "warn" | "error";
    message: string;
    timestamp: Date;
  }>;
};

export const WebPreviewConsole: Component<WebPreviewConsoleProps> = (props) => {
  const { consoleOpen, setConsoleOpen } = useWebPreview();
  const [local, others] = splitProps(props, ["class", "logs", "children"]);

  const logs = () => local.logs || [];

  return (
    <Collapsible
      class={cn("border-t bg-muted/50 font-mono text-sm", local.class)}
      onOpenChange={setConsoleOpen}
      open={consoleOpen()}
      {...others}
    >
      <CollapsibleTrigger asChild>
        <Button
          class="flex w-full items-center justify-between p-4 text-left font-medium hover:bg-muted/50"
          variant="ghost"
        >
          Console
          <ChevronDownIcon
            size={16}
            class={cn(
              "transition-transform duration-200",
              consoleOpen() && "rotate-180"
            )}
          />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent
        class={cn(
          "px-4 pb-4",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 outline-none data-[state=closed]:animate-out data-[state=open]:animate-in"
        )}
      >
        <div class="max-h-48 space-y-1 overflow-y-auto">
          <Show
            when={logs().length > 0}
            fallback={<p class="text-muted-foreground">No console output</p>}
          >
            <For each={logs()}>
              {(log, index) => (
                <div
                  class={cn(
                    "text-xs",
                    log.level === "error" && "text-destructive",
                    log.level === "warn" && "text-yellow-600",
                    log.level === "log" && "text-foreground"
                  )}
                >
                  <span class="text-muted-foreground">
                    {log.timestamp.toLocaleTimeString()}
                  </span>{" "}
                  {log.message}
                </div>
              )}
            </For>
          </Show>
          {local.children}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
