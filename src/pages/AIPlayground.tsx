/**
 * AI Playground 页面 - 集成 AI SDK Core 和 useChat
 */

import type { Component } from "solid-js";
import { For, Show } from "solid-js";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useI18n } from "@/i18n";
import { useChat } from "@ensolid/aisolid";

export const AIPlaygroundPage: Component = () => {
  const { t } = useI18n();
  
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
    api: "/api/chat",
    id: "ai-playground-chat",
    initialMessages: [],
    onError: (err: Error) => {
      console.error("Chat error:", err);
    },
  });

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div class="min-h-screen bg-background py-8">
      <div class="container mx-auto px-4 max-w-6xl">
        {/* 页面标题 */}
        <div class="mb-8 text-center">
          <h1 class="mb-2 text-4xl font-bold tracking-tight">
            {t().aiPlayground.title}
          </h1>
          <p class="text-lg text-muted-foreground">
            {t().aiPlayground.subtitle}
          </p>
        </div>

        {/* 聊天界面 */}
        <div class="grid gap-6 lg:grid-cols-3">
          {/* 聊天消息区域 */}
          <Card class="lg:col-span-2">
            <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-4">
              <div>
                <CardTitle>{t().aiPlayground.chat.title}</CardTitle>
                <CardDescription>
                  {t().aiPlayground.chat.description}
                </CardDescription>
              </div>
              <Show when={messages().length > 0}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearChat}
                >
                  {t().aiPlayground.chat.clear}
                </Button>
              </Show>
            </CardHeader>
            <CardContent>
              <ScrollArea class="h-[500px] w-full pr-4">
                <div class="space-y-4">
                  <Show
                    when={messages().length > 0}
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
                          class={`flex gap-3 ${
                            message.role === "user"
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          <div
                            class={`max-w-[80%] rounded-lg px-4 py-2 ${
                              message.role === "user"
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                            }`}
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
            </CardContent>
          </Card>

          {/* 输入和控制区域 */}
          <div class="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t().aiPlayground.input.title}</CardTitle>
                <CardDescription>
                  {t().aiPlayground.input.description}
                </CardDescription>
              </CardHeader>
              <CardContent class="space-y-4">
                <form onSubmit={handleSubmit}>
                  <Textarea
                    value={input()}
                    onInput={handleInputChange}
                    placeholder={t().aiPlayground.input.placeholder}
                    class="min-h-[200px] resize-none"
                    disabled={isLoading()}
                  />
                  <div class="flex gap-2 mt-4">
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

            {/* 功能卡片 */}
            <Card>
              <CardHeader>
                <CardTitle class="text-lg">
                  {t().aiPlayground.features.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div class="space-y-3">
                  <div>
                    <div class="font-medium text-sm mb-1">
                      {t().aiPlayground.features.chat.title}
                    </div>
                    <div class="text-xs text-muted-foreground">
                      {t().aiPlayground.features.chat.description}
                    </div>
                  </div>
                  <div>
                    <div class="font-medium text-sm mb-1">
                      {t().aiPlayground.features.code.title}
                    </div>
                    <div class="text-xs text-muted-foreground">
                      {t().aiPlayground.features.code.description}
                    </div>
                  </div>
                  <div>
                    <div class="font-medium text-sm mb-1">
                      {t().aiPlayground.features.image.title}
                    </div>
                    <div class="text-xs text-muted-foreground">
                      {t().aiPlayground.features.image.description}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* API 配置提示 */}
        <Card class="mt-6 border-muted">
          <CardHeader>
            <CardTitle class="text-sm">API 配置</CardTitle>
            <CardDescription class="text-xs">
              要使用 AI 功能，需要配置后端 API 端点。查看{" "}
              <code class="text-xs bg-muted px-1 py-0.5 rounded">
                src/api/chat.ts
              </code>{" "}
              了解如何设置。
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
};
