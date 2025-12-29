/**
 * Context 组件 - 移植自 Vercel AI Elements
 * 
 * 用于显示模型上下文使用情况的组件
 */

import type { Component, JSX } from "solid-js";
import {
  createContext,
  useContext,
  createMemo,
  splitProps,
  Show,
} from "solid-js";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/components/ui/utils";
import type { LanguageModelUsage } from "ai";

const PERCENT_MAX = 100;
const ICON_RADIUS = 10;
const ICON_VIEWBOX = 24;
const ICON_CENTER = 12;
const ICON_STROKE_WIDTH = 2;

type ModelId = string;

type ContextSchema = {
  usedTokens: () => number;
  maxTokens: () => number;
  usage?: () => LanguageModelUsage | undefined;
  modelId?: () => ModelId | undefined;
};

const ContextContext = createContext<ContextSchema>();

const useContextValue = () => {
  const context = useContext(ContextContext);
  if (!context) {
    throw new Error("Context components must be used within Context");
  }
  return context;
};

export type ContextProps = JSX.HTMLAttributes<HTMLDivElement> &
  ContextSchema & {
    openDelay?: number;
    closeDelay?: number;
  };

export const Context: Component<ContextProps> = (props) => {
  const [local, others] = splitProps(props, [
    "usedTokens",
    "maxTokens",
    "usage",
    "modelId",
    "openDelay",
    "closeDelay",
    "children",
  ]);

  const contextValue: ContextSchema = {
    usedTokens: typeof local.usedTokens === "function"
      ? local.usedTokens
      : () => local.usedTokens,
    maxTokens: typeof local.maxTokens === "function"
      ? local.maxTokens
      : () => local.maxTokens,
    usage: typeof local.usage === "function"
      ? local.usage
      : () => local.usage,
    modelId: typeof local.modelId === "function"
      ? local.modelId
      : () => local.modelId,
  };

  return (
    <ContextContext.Provider value={contextValue}>
      <HoverCard
        openDelay={local.openDelay || 0}
        closeDelay={local.closeDelay || 0}
        {...others}
      >
        {local.children}
      </HoverCard>
    </ContextContext.Provider>
  );
};

const ContextIcon: Component = () => {
  const { usedTokens, maxTokens } = useContextValue();
  const circumference = 2 * Math.PI * ICON_RADIUS;
  const usedPercent = createMemo(() => usedTokens() / maxTokens());
  const dashOffset = createMemo(() => circumference * (1 - usedPercent()));

  return (
    <svg
      aria-label="Model context usage"
      height="20"
      role="img"
      style={{ color: "currentcolor" }}
      viewBox={`0 0 ${ICON_VIEWBOX} ${ICON_VIEWBOX}`}
      width="20"
    >
      <circle
        cx={ICON_CENTER}
        cy={ICON_CENTER}
        fill="none"
        opacity="0.25"
        r={ICON_RADIUS}
        stroke="currentColor"
        stroke-width={ICON_STROKE_WIDTH}
      />
      <circle
        cx={ICON_CENTER}
        cy={ICON_CENTER}
        fill="none"
        opacity="0.7"
        r={ICON_RADIUS}
        stroke="currentColor"
        stroke-dasharray={`${circumference} ${circumference}`}
        stroke-dashoffset={dashOffset()}
        stroke-linecap="round"
        stroke-width={ICON_STROKE_WIDTH}
        style={{ transformOrigin: "center", transform: "rotate(-90deg)" }}
      />
    </svg>
  );
};

export type ContextTriggerProps = JSX.ButtonHTMLAttributes<HTMLButtonElement>;

export const ContextTrigger: Component<ContextTriggerProps> = (props) => {
  const { usedTokens, maxTokens } = useContextValue();
  const [local, others] = splitProps(props, ["children"]);

  const usedPercent = createMemo(() => usedTokens() / maxTokens());
  const renderedPercent = createMemo(() =>
    new Intl.NumberFormat("en-US", {
      style: "percent",
      maximumFractionDigits: 1,
    }).format(usedPercent())
  );

  return (
    <HoverCardTrigger asChild>
      {local.children ?? (
        <Button type="button" variant="ghost" {...others}>
          <span class="font-medium text-muted-foreground">
            {renderedPercent()}
          </span>
          <ContextIcon />
        </Button>
      )}
    </HoverCardTrigger>
  );
};

export type ContextContentProps = JSX.HTMLAttributes<HTMLDivElement>;

export const ContextContent: Component<ContextContentProps> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <HoverCardContent
      class={cn("min-w-60 divide-y overflow-hidden p-0", local.class)}
      {...others}
    />
  );
};

export type ContextContentHeaderProps = JSX.HTMLAttributes<HTMLDivElement>;

export const ContextContentHeader: Component<ContextContentHeaderProps> = (
  props
) => {
  const { usedTokens, maxTokens } = useContextValue();
  const [local, others] = splitProps(props, ["class", "children"]);

  const usedPercent = createMemo(() => usedTokens() / maxTokens());
  const displayPct = createMemo(() =>
    new Intl.NumberFormat("en-US", {
      style: "percent",
      maximumFractionDigits: 1,
    }).format(usedPercent())
  );
  const used = createMemo(() =>
    new Intl.NumberFormat("en-US", {
      notation: "compact",
    }).format(usedTokens())
  );
  const total = createMemo(() =>
    new Intl.NumberFormat("en-US", {
      notation: "compact",
    }).format(maxTokens())
  );

  return (
    <div class={cn("w-full space-y-2 p-3", local.class)} {...others}>
      {local.children ?? (
        <>
          <div class="flex items-center justify-between gap-3 text-xs">
            <p>{displayPct()}</p>
            <p class="font-mono text-muted-foreground">
              {used()} / {total()}
            </p>
          </div>
          <div class="space-y-2">
            <Progress
              class="bg-muted"
              value={usedPercent() * PERCENT_MAX}
              max={PERCENT_MAX}
            />
          </div>
        </>
      )}
    </div>
  );
};

export type ContextContentBodyProps = JSX.HTMLAttributes<HTMLDivElement>;

export const ContextContentBody: Component<ContextContentBodyProps> = (
  props
) => {
  const [local, others] = splitProps(props, ["class", "children"]);
  return (
    <div class={cn("w-full p-3", local.class)} {...others}>
      {local.children}
    </div>
  );
};

export type ContextContentFooterProps = JSX.HTMLAttributes<HTMLDivElement>;

export const ContextContentFooter: Component<ContextContentFooterProps> = (
  props
) => {
  const { modelId, usage } = useContextValue();
  const [local, others] = splitProps(props, ["class", "children"]);

  // 简化的成本计算（不依赖 tokenlens）
  const costUSD = createMemo(() => {
    const usageValue = usage?.();
    if (!usageValue || !modelId?.()) return undefined;
    // 这里可以添加简单的成本计算逻辑
    // 或者返回 undefined 让用户自定义显示
    return undefined;
  });

  const totalCost = createMemo(() => {
    const cost = costUSD();
    if (cost === undefined) return "—";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(cost);
  });

  return (
    <div
      class={cn(
        "flex w-full items-center justify-between gap-3 bg-secondary p-3 text-xs",
        local.class
      )}
      {...others}
    >
      {local.children ?? (
        <>
          <span class="text-muted-foreground">Total cost</span>
          <span>{totalCost()}</span>
        </>
      )}
    </div>
  );
};

export type ContextInputUsageProps = JSX.HTMLAttributes<HTMLDivElement>;

export const ContextInputUsage: Component<ContextInputUsageProps> = (props) => {
  const { usage } = useContextValue();
  const [local, others] = splitProps(props, ["class", "children"]);

  const inputTokens = createMemo(() => usage?.()?.inputTokens ?? 0);

  if (local.children) {
    return <div {...others}>{local.children}</div>;
  }

  if (inputTokens() === 0) {
    return null;
  }

  return (
    <div
      class={cn("flex items-center justify-between text-xs", local.class)}
      {...others}
    >
      <span class="text-muted-foreground">Input</span>
      <span>
        {new Intl.NumberFormat("en-US", {
          notation: "compact",
        }).format(inputTokens())}
      </span>
    </div>
  );
};

export type ContextOutputUsageProps = JSX.HTMLAttributes<HTMLDivElement>;

export const ContextOutputUsage: Component<ContextOutputUsageProps> = (props) => {
  const { usage } = useContextValue();
  const [local, others] = splitProps(props, ["class", "children"]);

  const outputTokens = createMemo(() => usage?.()?.outputTokens ?? 0);

  if (local.children) {
    return <div {...others}>{local.children}</div>;
  }

  if (outputTokens() === 0) {
    return null;
  }

  return (
    <div
      class={cn("flex items-center justify-between text-xs", local.class)}
      {...others}
    >
      <span class="text-muted-foreground">Output</span>
      <span>
        {new Intl.NumberFormat("en-US", {
          notation: "compact",
        }).format(outputTokens())}
      </span>
    </div>
  );
};

export type ContextReasoningUsageProps = JSX.HTMLAttributes<HTMLDivElement>;

export const ContextReasoningUsage: Component<ContextReasoningUsageProps> = (
  props
) => {
  const { usage } = useContextValue();
  const [local, others] = splitProps(props, ["class", "children"]);

  const reasoningTokens = createMemo(() => usage?.()?.reasoningTokens ?? 0);

  if (local.children) {
    return <div {...others}>{local.children}</div>;
  }

  if (reasoningTokens() === 0) {
    return null;
  }

  return (
    <div
      class={cn("flex items-center justify-between text-xs", local.class)}
      {...others}
    >
      <span class="text-muted-foreground">Reasoning</span>
      <span>
        {new Intl.NumberFormat("en-US", {
          notation: "compact",
        }).format(reasoningTokens())}
      </span>
    </div>
  );
};

export type ContextCacheUsageProps = JSX.HTMLAttributes<HTMLDivElement>;

export const ContextCacheUsage: Component<ContextCacheUsageProps> = (props) => {
  const { usage } = useContextValue();
  const [local, others] = splitProps(props, ["class", "children"]);

  const cacheTokens = createMemo(() => usage?.()?.cachedInputTokens ?? 0);

  if (local.children) {
    return <div {...others}>{local.children}</div>;
  }

  if (cacheTokens() === 0) {
    return null;
  }

  return (
    <div
      class={cn("flex items-center justify-between text-xs", local.class)}
      {...others}
    >
      <span class="text-muted-foreground">Cache</span>
      <span>
        {new Intl.NumberFormat("en-US", {
          notation: "compact",
        }).format(cacheTokens())}
      </span>
    </div>
  );
};
