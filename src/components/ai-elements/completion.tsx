/**
 * Completion 组件 - 移植自 Vercel AI Elements
 * 
 * 一个文本补全 UI 组件，集成了 useCompletion hook
 */

import type { Component, JSX } from "solid-js";
import { Show } from "solid-js";
import { useCompletion } from "@ensolid/aisolid";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { cn } from "@/components/ui/utils";

export interface CompletionProps {
  /**
   * API 端点 URL
   */
  api?: string;
  /**
   * 用于持久化的唯一 ID
   */
  id?: string;
  /**
   * 初始补全内容
   */
  initialCompletion?: string;
  /**
   * 初始输入值
   */
  initialInput?: string;
  /**
   * 自定义类名
   */
  class?: string;
  /**
   * 输入框占位符
   */
  placeholder?: string;
  /**
   * 标题
   */
  title?: string;
  /**
   * 描述
   */
  description?: string;
  /**
   * 响应回调
   */
  onResponse?: (response: Response) => void | Promise<void>;
  /**
   * 完成回调
   */
  onFinish?: (prompt: string, completion: string) => void | Promise<void>;
  /**
   * 错误回调
   */
  onError?: (error: Error) => void;
  /**
   * 自定义请求头
   */
  headers?: Record<string, string> | Headers;
  /**
   * 自定义请求体
   */
  body?: Record<string, any>;
  /**
   * 最大 token 数
   */
  maxTokens?: number;
}

export const Completion: Component<CompletionProps> = (props) => {
  const {
    completion,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
    stop,
  } = useCompletion({
    api: props.api || "/api/completion",
    id: props.id,
    initialCompletion: props.initialCompletion,
    initialInput: props.initialInput,
    onResponse: props.onResponse,
    onFinish: props.onFinish,
    onError: props.onError,
    headers: props.headers,
    body: props.body,
    maxTokens: props.maxTokens,
  });

  return (
    <div class={cn("space-y-6", props.class)}>
      {/* 输入区域 */}
      <Card>
        <CardHeader>
          <CardTitle>{props.title || "文本补全"}</CardTitle>
          <CardDescription>
            {props.description || "输入提示文本，AI 将为您补全内容"}
          </CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <form onSubmit={handleSubmit}>
            <Textarea
              value={input()}
              onInput={handleInputChange}
              placeholder={props.placeholder || "输入提示..."}
              class="min-h-[200px] resize-none"
              disabled={isLoading()}
            />
            <div class="flex gap-2 mt-4">
              <Button
                type="submit"
                disabled={isLoading() || !input().trim()}
                class="flex-1"
              >
                {isLoading() ? "生成中..." : "生成"}
              </Button>
              <Show when={isLoading()}>
                <Button
                  type="button"
                  variant="outline"
                  onClick={stop}
                >
                  停止
                </Button>
              </Show>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* 输出区域 */}
      <Card>
        <CardHeader>
          <CardTitle>补全结果</CardTitle>
          <CardDescription>AI 生成的补全内容将显示在这里</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="min-h-[200px] rounded-md border bg-muted/50 p-4">
            <Show
              when={completion()}
              fallback={
                <p class="text-sm text-muted-foreground">
                  等待输入...
                </p>
              }
            >
              <p class="text-sm whitespace-pre-wrap">{completion()}</p>
            </Show>
          </div>
        </CardContent>
      </Card>

      {/* 错误提示 */}
      <Show when={error()}>
        <Card class="border-destructive">
          <CardContent class="pt-6">
            <div class="text-sm text-destructive">
              <strong>错误：</strong> {error()?.message}
            </div>
          </CardContent>
        </Card>
      </Show>
    </div>
  );
};
