/**
 * AI Playground Chatbot 组件
 *
 * 专为 AI Playground 页面定制的聊天机器人组件
 */

import type { Component } from "solid-js";
import { createMemo, For, Show } from "solid-js";
import { type Message, useChat, type UseChatOptions } from "@ensolid/aisolid";
import { GatewayChatTransport } from "@/ai";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/components/ui/utils";
import { useI18n } from "@/i18n";

export interface PlaygroundChatbotProps {
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
   * 使用 GatewayChatTransport 的模型 ID
   * 如果提供此选项，将使用 GatewayChatTransport 而不是 HTTP API
   * 例如: "gateway:gpt-4" 或 "gpt-4"
   */
  modelId?: string;
}

export const PlaygroundChatbot: Component<PlaygroundChatbotProps> = (props) => {
  const { t } = useI18n();

  // 如果提供了 modelId，创建 GatewayChatTransport
  const transport = props.modelId
    ? new GatewayChatTransport(props.modelId)
    : undefined;

  // 使用 useChat，如果提供了 transport 则使用 transport，否则使用 api
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
    ...(transport ? { transport } : { api: props.api || "/api/chat" }),
    id: props.id,
    initialMessages: props.initialMessages,
    onResponse: props.onResponse,
    onFinish: props.onFinish,
    onError: props.onError,
    headers: props.headers,
    body: props.body,
  } as UseChatOptions);

  const clearChat = () => {
    setMessages([]);
  };

  const hasMessages = createMemo(() => messages().length > 0);

  return (
    <Card class={cn("flex flex-col h-full", props.class)}>
      <CardContent class="flex flex-col h-full p-0">
        {/* 标题栏 */}
        <CardHeader class="border-b">
          <div class="flex items-center justify-between">
            <div>
              <CardTitle>{t().aiPlayground.chat.title}</CardTitle>
              <CardDescription>
                {t().aiPlayground.chat.description}
              </CardDescription>
            </div>
            <Show when={hasMessages()}>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearChat}
              >
                {t().aiPlayground.chat.clear}
              </Button>
            </Show>
          </div>
        </CardHeader>

        {/* 消息区域 */}
        <ScrollArea class="flex-1 p-4">
          <div class="space-y-4">
            <Show
              when={hasMessages()}
              fallback={
                <div class="flex items-center justify-center h-full text-center text-muted-foreground py-8">
                  <div>
                    <p class="text-lg mb-2">👋</p>
                    <p>{t().aiPlayground.chat.empty}</p>
                  </div>
                </div>
              }
            >
              <For each={messages()}>
                {(message) => (
                  <div
                    class={cn(
                      "flex gap-3",
                      message.role === "user" ? "justify-end" : "justify-start",
                    )}
                  >
                    <div
                      class={cn(
                        "max-w-[80%] rounded-lg px-4 py-2",
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted",
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
                      <div class="w-2 h-2 bg-current rounded-full animate-pulse">
                      </div>
                      <span class="text-sm text-muted-foreground">
                        {t().aiPlayground.input.processing}
                      </span>
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
            placeholder={props.placeholder ||
              t().aiPlayground.input.placeholder}
            class="resize-none"
            disabled={isLoading()}
            rows={3}
          />
          <div class="flex gap-2">
            <Button
              type="submit"
              disabled={isLoading() || !input().trim()}
              class="flex-1"
            >
              {isLoading()
                ? t().aiPlayground.input.processing
                : t().aiPlayground.input.submit}
            </Button>
            <Show when={isLoading()}>
              <Button
                type="button"
                variant="outline"
                onClick={stop}
              >
                {t().aiPlayground.input.stop}
              </Button>
            </Show>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
