/**
 * Assistant 组件 - 移植自 Vercel AI Elements
 * 
 * 一个助手对话 UI 组件，集成了 useAssistant hook
 */

import type { Component, JSX } from "solid-js";
import { For, Show, createMemo } from "solid-js";
import { useAssistant } from "@ensolid/aisolid";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/components/ui/utils";

export interface AssistantProps {
  /**
   * API 端点 URL
   */
  api?: string;
  /**
   * 用于持久化的唯一 ID
   */
  id?: string;
  /**
   * 线程 ID
   */
  threadId?: string;
  /**
   * 初始消息列表
   */
  initialMessages?: Array<{
    id: string;
    role: 'system' | 'user' | 'assistant' | 'function' | 'data' | 'tool';
    content: string;
    createdAt?: Date;
  }>;
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
  onFinish?: (message: any) => void | Promise<void>;
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
   * 是否显示标题
   */
  showTitle?: boolean;
  /**
   * 是否显示清空按钮
   */
  showClearButton?: boolean;
}

export const Assistant: Component<AssistantProps> = (props) => {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    status,
    error,
    stop,
    setMessages,
  } = useAssistant({
    api: props.api || "/api/assistant",
    id: props.id,
    threadId: props.threadId,
    initialMessages: props.initialMessages,
    initialInput: props.initialInput,
    onResponse: props.onResponse,
    onFinish: props.onFinish,
    onError: props.onError,
    headers: props.headers,
    body: props.body,
  });

  const clearChat = () => {
    setMessages([]);
  };

  const hasMessages = createMemo(() => messages().length > 0);
  const isInProgress = createMemo(() => status() === 'in_progress');

  return (
    <Card class={cn("flex flex-col h-full", props.class)}>
      <CardContent class="flex flex-col h-full p-0">
        {/* 标题栏 */}
        {props.showTitle !== false && (
          <div class="flex items-center justify-between p-4 border-b">
            <div>
              <h2 class="text-lg font-semibold">
                {props.title || "AI Assistant"}
              </h2>
              {props.description && (
                <p class="text-sm text-muted-foreground mt-1">
                  {props.description}
                </p>
              )}
            </div>
            {props.showClearButton !== false && hasMessages() && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearChat}
              >
                清空
              </Button>
            )}
          </div>
        )}

        {/* 消息区域 */}
        <ScrollArea class="flex-1 p-4">
          <div class="space-y-4">
            <Show
              when={hasMessages()}
              fallback={
                <div class="flex items-center justify-center h-full text-center text-muted-foreground py-8">
                  <div>
                    <p class="text-lg mb-2">🤖</p>
                    <p>开始与 AI 助手对话吧！</p>
                  </div>
                </div>
              }
            >
              <For each={messages()}>
                {(message) => (
                  <div
                    class={cn(
                      "flex gap-3",
                      message.role === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      class={cn(
                        "max-w-[80%] rounded-lg px-4 py-2",
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      )}
                    >
                      <div class="text-xs font-medium mb-1 opacity-70">
                        {message.role === "user" ? "你" : "助手"}
                      </div>
                      <div class="text-sm whitespace-pre-wrap">
                        {message.content}
                      </div>
                      {message.createdAt && (
                        <div class="text-xs opacity-50 mt-1">
                          {new Date(message.createdAt).toLocaleTimeString()}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </For>
              <Show when={isInProgress()}>
                <div class="flex justify-start">
                  <div class="bg-muted rounded-lg px-4 py-2">
                    <div class="flex items-center gap-2">
                      <div class="w-2 h-2 bg-current rounded-full animate-pulse"></div>
                      <span class="text-sm text-muted-foreground">处理中...</span>
                    </div>
                  </div>
                </div>
              </Show>
            </Show>
          </div>
        </ScrollArea>

        {/* 错误提示 */}
        <Show when={error()}>
          <div class="px-4 py-2 bg-destructive/10 text-destructive text-sm border-t">
            <strong>错误：</strong> {error()?.message}
          </div>
        </Show>

        {/* 输入区域 */}
        <form
          onSubmit={handleSubmit}
          class="p-4 border-t space-y-2"
        >
          <Textarea
            value={input()}
            onInput={handleInputChange}
            placeholder={props.placeholder || "输入消息..."}
            class="resize-none"
            disabled={isInProgress()}
            rows={3}
          />
          <div class="flex gap-2">
            <Button
              type="submit"
              disabled={isInProgress() || !input().trim()}
              class="flex-1"
            >
              {isInProgress() ? "发送中..." : "发送"}
            </Button>
            <Show when={isInProgress()}>
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
  );
};
