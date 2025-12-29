/**
 * StreamableValue 组件 - 移植自 Vercel AI Elements
 * 
 * 用于显示流式值的组件
 */

import type { Component, JSX } from "solid-js";
import { Show, createSignal, createEffect, onCleanup } from "solid-js";
import { cn } from "@/components/ui/utils";

export interface StreamableValueProps {
  /**
   * 流式值
   */
  value: () => string | undefined;
  /**
   * 自定义类名
   */
  class?: string;
  /**
   * 是否显示加载状态
   */
  isLoading?: () => boolean;
  /**
   * 空值时的占位文本
   */
  placeholder?: string;
  /**
   * 格式化函数
   */
  format?: (value: string) => string;
}

export const StreamableValue: Component<StreamableValueProps> = (props) => {
  const [displayValue, setDisplayValue] = createSignal<string>("");

  createEffect(() => {
    const value = props.value();
    if (value !== undefined) {
      if (props.format) {
        setDisplayValue(props.format(value));
      } else {
        setDisplayValue(value);
      }
    } else {
      setDisplayValue("");
    }
  });

  return (
    <div class={cn("min-h-[1rem]", props.class)}>
      <Show
        when={displayValue() || props.isLoading?.()}
        fallback={
          <span class="text-muted-foreground text-sm">
            {props.placeholder || "等待数据..."}
          </span>
        }
      >
        <div class="text-sm whitespace-pre-wrap">
          {displayValue()}
          <Show when={props.isLoading?.()}>
            <span class="inline-block w-2 h-2 bg-current rounded-full animate-pulse ml-1"></span>
          </Show>
        </div>
      </Show>
    </div>
  );
};
