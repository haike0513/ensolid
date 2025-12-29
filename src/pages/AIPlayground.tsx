/**
 * AI Playground 页面 - 使用 AI Elements 组件
 */

import type { Component } from "solid-js";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useI18n } from "@/i18n";
import { Chatbot } from "@/components/ai-elements/chatbot";
import { Completion } from "@/components/ai-elements/completion";
import { AIChat } from "@/components/AIChat";

export const AIPlaygroundPage: Component = () => {
  const { t } = useI18n();

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

        {/* 功能标签页 */}
        <Tabs defaultValue="aichat" class="w-full">
          <TabsList class="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="aichat">AI Chat</TabsTrigger>
            <TabsTrigger value="chat">聊天对话</TabsTrigger>
            <TabsTrigger value="completion">文本补全</TabsTrigger>
          </TabsList>

          {/* AI Chat 标签页 */}
          <TabsContent value="aichat" class="space-y-4">
            <AIChat
              api="/api/chat"
              id="ai-playground-aichat"
              showTitleCard={true}
              height="600px"
              onError={(err: Error) => {
                console.error("Chat error:", err);
              }}
            />
          </TabsContent>

          {/* 聊天标签页 */}
          <TabsContent value="chat" class="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t().aiPlayground.chat.title}</CardTitle>
                <CardDescription>
                  {t().aiPlayground.chat.description}
                </CardDescription>
              </CardHeader>
            </Card>
            <div class="h-[600px]">
              <Chatbot
                api="/api/chat"
                id="ai-playground-chat"
                title={t().aiPlayground.chat.title}
                placeholder={t().aiPlayground.input.placeholder}
                showTitle={true}
                showClearButton={true}
                onError={(err: Error) => {
                  console.error("Chat error:", err);
                }}
              />
            </div>
          </TabsContent>

          {/* 文本补全标签页 */}
          <TabsContent value="completion" class="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>文本补全</CardTitle>
                <CardDescription>
                  输入提示文本，AI 将为您补全内容
                </CardDescription>
              </CardHeader>
            </Card>
            <Completion
              api="/api/completion"
              id="ai-playground-completion"
              title="文本补全"
              description="输入提示文本，AI 将为您补全内容"
              placeholder="输入提示..."
            />
          </TabsContent>
        </Tabs>

        {/* 功能卡片 */}
        <div class="mt-8">
          <h2 class="mb-4 text-2xl font-semibold">
            {t().aiPlayground.features.title}
          </h2>
          <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle class="text-lg">
                  {t().aiPlayground.features.chat.title}
                </CardTitle>
                <CardDescription>
                  {t().aiPlayground.features.chat.description}
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle class="text-lg">
                  {t().aiPlayground.features.code.title}
                </CardTitle>
                <CardDescription>
                  {t().aiPlayground.features.code.description}
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle class="text-lg">
                  {t().aiPlayground.features.image.title}
                </CardTitle>
                <CardDescription>
                  {t().aiPlayground.features.image.description}
                </CardDescription>
              </CardHeader>
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
