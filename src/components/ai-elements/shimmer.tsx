/**
 * Shimmer 组件 - 移植自 Vercel AI Elements
 * 
 * 用于显示闪烁动画效果的文本组件
 */

import type { Component, JSX } from "solid-js";
import { createMemo, splitProps } from "solid-js";
import { cn } from "@/components/ui/utils";

export type TextShimmerProps = {
  children: string;
  as?: keyof JSX.IntrinsicElements;
  class?: string;
  duration?: number;
  spread?: number;
};

export const Shimmer: Component<TextShimmerProps> = (props) => {
  const [local, others] = splitProps(props, [
    "children",
    "as",
    "class",
    "duration",
    "spread",
  ]);

  const Component = local.as || "p";
  const duration = local.duration || 2;
  const spread = local.spread || 2;

  const dynamicSpread = createMemo(() => (local.children?.length ?? 0) * spread);

  return (
    <Component
      class={cn(
        "relative inline-block bg-[length:250%_100%,auto] bg-clip-text text-transparent animate-shimmer",
        "[--bg:linear-gradient(90deg,#0000_calc(50%-var(--spread)),var(--color-background),#0000_calc(50%+var(--spread)))] [background-repeat:no-repeat,padding-box]",
        local.class
      )}
      style={{
        "--spread": `${dynamicSpread()}px`,
        "background-image":
          "var(--bg), linear-gradient(var(--color-muted-foreground), var(--color-muted-foreground))",
        "animation-duration": `${duration}s`,
      } as JSX.CSSProperties}
      {...others}
    >
      {local.children}
    </Component>
  );
};
