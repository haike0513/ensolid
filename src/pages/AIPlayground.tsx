/**
 * AI Playground 页面 - 使用 AI Elements 组件
 */

import type { Component } from "solid-js";
import { createSignal, onMount } from "solid-js";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n";
import { Chatbot } from "@/components/ai-elements/chatbot";
import { Completion } from "@/components/ai-elements/completion";
import { TextGeneration } from "@/components/ai-elements/text-generation";
import { AIChat } from "@/components/AIChat";
import {
  getAIGatewayApiKey,
  setAIGatewayApiKey,
  clearAIGatewayApiKey,
} from "@/ai/config";

export const AIPlaygroundPage: Component = () => {
  const { t } = useI18n();
  const [apiKey, setApiKey] = createSignal("");
  const [message, setMessage] = createSignal("");

  onMount(() => {
    // 加载已保存的 API Key
    setApiKey(getAIGatewayApiKey());
  });

  const handleSave = () => {
    try {
      if (apiKey().trim()) {
        setAIGatewayApiKey(apiKey());
        setMessage(t().aiPlayground.config.saved);
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage(t().aiPlayground.config.required);
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      setMessage(String(error));
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleClear = () => {
    try {
      clearAIGatewayApiKey();
      setApiKey("");
      setMessage(t().aiPlayground.config.cleared);
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage(String(error));
      setTimeout(() => setMessage(""), 3000);
    }
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

        {/* 功能标签页 */}
        <Tabs defaultValue="aichat" class="w-full">
          <TabsList class="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="aichat">AI Chat</TabsTrigger>
            <TabsTrigger value="chat">聊天对话</TabsTrigger>
            <TabsTrigger value="completion">文本补全</TabsTrigger>
            <TabsTrigger value="generate">文本生成</TabsTrigger>
            <TabsTrigger value="settings">设置</TabsTrigger>
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

          {/* 文本生成标签页 */}
          <TabsContent value="generate" class="space-y-4">
            <TextGeneration
              api="/api/generate-text"
              model="openrouter:meituan/longcat-flash-thinking"
              title="文本生成"
              description="使用 generateText API 生成文本内容（支持 registry 格式的模型 ID）"
              placeholder="输入提示文本，例如：Write a vegetarian lasagna recipe for 4 people."
              onError={(err: Error) => {
                console.error("Generate text error:", err);
              }}
            />
          </TabsContent>

          {/* 设置标签页 */}
          <TabsContent value="settings" class="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t().aiPlayground.config.title}</CardTitle>
                <CardDescription>
                  {t().aiPlayground.config.description}
                </CardDescription>
              </CardHeader>
              <div class="px-6 pb-6 space-y-4">
                <div class="space-y-2">
                  <Label for="api-key">{t().aiPlayground.config.apiKeyLabel}</Label>
                  <Input
                    id="api-key"
                    type="password"
                    value={apiKey()}
                    onInput={(e) => setApiKey(e.currentTarget.value)}
                    placeholder={t().aiPlayground.config.apiKeyPlaceholder}
                    class="w-full"
                  />
                </div>
                <div class="flex gap-2">
                  <Button onClick={handleSave} variant="default">
                    {t().aiPlayground.config.save}
                  </Button>
                  <Button onClick={handleClear} variant="outline">
                    {t().aiPlayground.config.clear}
                  </Button>
                </div>
                {message() && (
                  <p class="text-sm text-muted-foreground">{message()}</p>
                )}
              </div>
            </Card>
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
      </div>
    </div>
  );
};
