/**
 * Chatbot 组件 - 移植自 Vercel AI Elements
 * 
 * 一个完整的聊天机器人 UI 组件，集成了 useChat hook
 */

import type { Component, JSX } from "solid-js";
import { For, Show, createMemo } from "solid-js";
import { useChat, type Message } from "@ensolid/aisolid";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/components/ui/utils";

export interface ChatbotProps {
  /**
   * API 端点 URL
   */
  api?: string;
  /**
   * 用于持久化的唯一 ID
   */
  id?: string;
  /**
   * 初始消息列表
   */
  initialMessages?: Message[];
  /**
   * 自定义类名
   */
  class?: string;
  /**
   * 输入框占位符
   */
  placeholder?: string;
  /**
   * 是否显示标题
   */
  showTitle?: boolean;
  /**
   * 标题文本
   */
  title?: string;
  /**
   * 响应回调
   */
  onResponse?: (response: Response) => void | Promise<void>;
  /**
   * 完成回调
   */
  onFinish?: (message: Message) => void | Promise<void>;
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
   * 是否显示清空按钮
   */
  showClearButton?: boolean;
  /**
   * 输入框最大高度
   */
  inputMaxHeight?: string;
}

export const Chatbot: Component<ChatbotProps> = (props) => {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
    stop,
    setMessages,
  } = useChat({
    api: props.api || "/api/chat",
    id: props.id,
    initialMessages: props.initialMessages,
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

  return (
    <Card class={cn("flex flex-col h-full", props.class)}>
      <CardContent class="flex flex-col h-full p-0">
        {/* 标题栏 */}
        <Show when={props.showTitle !== false}>
          <div class="flex items-center justify-between p-4 border-b">
            <h2 class="text-lg font-semibold">
              {props.title || "AI Chat"}
            </h2>
            <Show when={props.showClearButton !== false && hasMessages()}>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearChat}
              >
                清空
              </Button>
            </Show>
          </div>
        </Show>

        {/* 消息区域 */}
        <ScrollArea class="flex-1 p-4">
          <div class="space-y-4">
            <Show
              when={hasMessages()}
              fallback={
                <div class="flex items-center justify-center h-full text-center text-muted-foreground py-8">
                  <div>
                    <p class="text-lg mb-2">👋</p>
                    <p>开始与 AI 对话吧！</p>
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
                        {message.role === "user" ? "你" : "AI"}
                      </div>
                      <div class="text-sm whitespace-pre-wrap">
                        {message.content}
                      </div>
                      <Show when={message.createdAt}>
                        <div class="text-xs opacity-50 mt-1">
                          {new Date(message.createdAt!).toLocaleTimeString()}
                        </div>
                      </Show>
                    </div>
                  </div>
                )}
              </For>
              <Show when={isLoading()}>
                <div class="flex justify-start">
                  <div class="bg-muted rounded-lg px-4 py-2">
                    <div class="flex items-center gap-2">
                      <div class="w-2 h-2 bg-current rounded-full animate-pulse"></div>
                      <span class="text-sm text-muted-foreground">思考中...</span>
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
            class={cn("resize-none", props.inputMaxHeight && `max-h-[${props.inputMaxHeight}]`)}
            disabled={isLoading()}
            rows={3}
          />
          <div class="flex gap-2">
            <Button
              type="submit"
              disabled={isLoading() || !input().trim()}
              class="flex-1"
            >
              {isLoading() ? "发送中..." : "发送"}
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
  );
};
