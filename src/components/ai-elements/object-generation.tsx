/**
 * ObjectGeneration 组件 - 移植自 Vercel AI Elements
 * 
 * 用于生成结构化对象的 UI 组件
 */

import type { Component, JSX } from "solid-js";
import { Show, createSignal } from "solid-js";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { cn } from "@/components/ui/utils";

export interface ObjectGenerationProps {
  /**
   * API 端点 URL
   */
  api?: string;
  /**
   * 用于持久化的唯一 ID
   */
  id?: string;
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
  onFinish?: (object: any) => void | Promise<void>;
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
   * Schema 定义（Zod schema 字符串或对象）
   */
  schema?: string | object;
}

export const ObjectGeneration: Component<ObjectGenerationProps> = (props) => {
  const [input, setInput] = createSignal(props.initialInput || "");
  const [output, setOutput] = createSignal<any>(null);
  const [isLoading, setIsLoading] = createSignal(false);
  const [error, setError] = createSignal<Error | undefined>(undefined);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    if (!input().trim() || isLoading()) return;

    setIsLoading(true);
    setError(undefined);
    setOutput(null);

    try {
      const response = await fetch(props.api || "/api/object-generation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(props.headers instanceof Headers
            ? Object.fromEntries(props.headers.entries())
            : props.headers),
        },
        body: JSON.stringify({
          prompt: input(),
          schema: props.schema,
          ...props.body,
        }),
      });

      if (props.onResponse) {
        await props.onResponse(response);
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setOutput(data);

      if (props.onFinish) {
        await props.onFinish(data);
      }
    } catch (err: any) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      if (props.onError) {
        props.onError(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: Event | { target: { value: string } }) => {
    let value = "";
    if ("target" in e && e.target) {
      const target = e.target as HTMLInputElement | HTMLTextAreaElement;
      value = target.value || "";
    } else if ("currentTarget" in e && e.currentTarget) {
      const target = e.currentTarget as HTMLInputElement | HTMLTextAreaElement;
      value = target.value || "";
    }
    setInput(value);
  };

  return (
    <div class={cn("space-y-6", props.class)}>
      {/* 输入区域 */}
      <Card>
        <CardHeader>
          <CardTitle>{props.title || "对象生成"}</CardTitle>
          <CardDescription>
            {props.description || "输入提示文本，AI 将生成结构化对象"}
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
            </div>
          </form>
        </CardContent>
      </Card>

      {/* 输出区域 */}
      <Card>
        <CardHeader>
          <CardTitle>生成结果</CardTitle>
          <CardDescription>AI 生成的结构化对象将显示在这里</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="min-h-[200px] rounded-md border bg-muted/50 p-4">
            <Show
              when={output()}
              fallback={
                <p class="text-sm text-muted-foreground">等待输入...</p>
              }
            >
              <pre class="text-sm whitespace-pre-wrap overflow-auto">
                {JSON.stringify(output(), null, 2)}
              </pre>
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
