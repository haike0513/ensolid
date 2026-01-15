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
import { PlaygroundChatbot } from "./ai-playground/Chatbot";
import { Completion } from "@/components/ai-elements/completion";
import { TextGeneration } from "@/components/ai-elements/text-generation";
import { AIChat } from "./ai-playground/AIChat";
import {
  clearAIGatewayApiKey,
  getAIGatewayApiKey,
  setAIGatewayApiKey,
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
    <div class="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* 顶部标题区域 */}
      <div class="border-b bg-background/50 backdrop-blur-sm">
        <div class="container mx-auto px-4 py-8">
          <div class="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 backdrop-blur-sm border border-violet-500/20">
            <span class="text-xl">🤖</span>
            <span class="text-xs font-medium bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                {t().aiPlayground.badge}
            </span>
          </div>
          <h1 class="text-4xl font-bold tracking-tight mb-3 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-violet-600 bg-clip-text text-transparent">
            {t().aiPlayground.title}
          </h1>
          <p class="text-muted-foreground text-lg">
            {t().aiPlayground.subtitle}
          </p>
        </div>
      </div>

      <div class="container mx-auto px-4 max-w-6xl py-8">

        {/* 功能标签页 */}
        <div class="relative group">
          <div class="absolute -inset-1 bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 rounded-2xl blur-xl opacity-50"></div>
          <div class="relative">
            <Tabs defaultValue="aichat" class="w-full">
              <TabsList class="grid w-full grid-cols-5 mb-6 h-auto p-1 bg-card/50 backdrop-blur-sm border-2 border-muted rounded-xl">
                <TabsTrigger value="aichat" class="data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600 data-[state=active]:to-fuchsia-600 data-[state=active]:text-white rounded-lg transition-all duration-300">
                  <span class="flex items-center gap-2">
                    <span>🤖</span>
                    <span>{t().aiPlayground.tabs.aichat}</span>
                  </span>
                </TabsTrigger>
                <TabsTrigger value="chat" class="data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600 data-[state=active]:to-fuchsia-600 data-[state=active]:text-white rounded-lg transition-all duration-300">
                  <span class="flex items-center gap-2">
                    <span>💬</span>
                    <span>{t().aiPlayground.tabs.chat}</span>
                  </span>
                </TabsTrigger>
                <TabsTrigger value="completion" class="data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600 data-[state=active]:to-fuchsia-600 data-[state=active]:text-white rounded-lg transition-all duration-300">
                  <span class="flex items-center gap-2">
                    <span>✨</span>
                    <span>{t().aiPlayground.tabs.completion}</span>
                  </span>
                </TabsTrigger>
                <TabsTrigger value="generate" class="data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600 data-[state=active]:to-fuchsia-600 data-[state=active]:text-white rounded-lg transition-all duration-300">
                  <span class="flex items-center gap-2">
                    <span>🎯</span>
                    <span>{t().aiPlayground.tabs.generate}</span>
                  </span>
                </TabsTrigger>
                <TabsTrigger value="settings" class="data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600 data-[state=active]:to-fuchsia-600 data-[state=active]:text-white rounded-lg transition-all duration-300">
                  <span class="flex items-center gap-2">
                    <span>⚙️</span>
                    <span>{t().aiPlayground.tabs.settings}</span>
                  </span>
                </TabsTrigger>
              </TabsList>

          {/* AI Chat 标签页 */}
          <TabsContent value="aichat" class="space-y-4">
            <AIChat
              modelId="gateway:meituan/longcat-flash-chat"
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
            <div class="h-[600px]">
              <PlaygroundChatbot
                api="/api/chat"
                id="ai-playground-chat"
                placeholder={t().aiPlayground.input.placeholder}
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
                <CardTitle>{t().aiPlayground.completion.title}</CardTitle>
                <CardDescription>
                  {t().aiPlayground.completion.description}
                </CardDescription>
              </CardHeader>
            </Card>
            <Completion
              api="/api/completion"
              id="ai-playground-completion"
              title={t().aiPlayground.completion.title}
              description={t().aiPlayground.completion.description}
              placeholder={t().aiPlayground.completion.placeholder}
            />
          </TabsContent>

          {/* 文本生成标签页 */}
          <TabsContent value="generate" class="space-y-4">
            <TextGeneration
              api="/api/generate-text"
              model="openrouter:meituan/longcat-flash-thinking"
              title={t().aiPlayground.generateText.title}
              description={t().aiPlayground.generateText.description}
              placeholder={t().aiPlayground.generateText.placeholder}
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
                  <Label for="api-key">
                    {t().aiPlayground.config.apiKeyLabel}
                  </Label>
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
          </div>
        </div>

        {/* 功能卡片 */}
        <div class="mt-8">
          <div class="flex items-center gap-3 mb-6">
            <span class="text-2xl">✨</span>
            <h2 class="text-2xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
              {t().aiPlayground.features.title}
            </h2>
          </div>
          <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div class="group relative">
              <div class="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
              <div class="relative bg-card border-2 border-muted rounded-xl p-6 transition-all duration-300 hover:border-blue-500/30 hover:-translate-y-1">
                <div class="flex items-center gap-3 mb-3">
                  <div class="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20">
                    <span class="text-2xl">💬</span>
                  </div>
                  <h3 class="text-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    {t().aiPlayground.features.chat.title}
                  </h3>
                </div>
                <p class="text-sm text-muted-foreground leading-relaxed">
                  {t().aiPlayground.features.chat.description}
                </p>
              </div>
            </div>

            <div class="group relative">
              <div class="absolute -inset-0.5 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
              <div class="relative bg-card border-2 border-muted rounded-xl p-6 transition-all duration-300 hover:border-green-500/30 hover:-translate-y-1">
                <div class="flex items-center gap-3 mb-3">
                  <div class="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20">
                    <span class="text-2xl">💻</span>
                  </div>
                  <h3 class="text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    {t().aiPlayground.features.code.title}
                  </h3>
                </div>
                <p class="text-sm text-muted-foreground leading-relaxed">
                  {t().aiPlayground.features.code.description}
                </p>
              </div>
            </div>

            <div class="group relative">
              <div class="absolute -inset-0.5 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
              <div class="relative bg-card border-2 border-muted rounded-xl p-6 transition-all duration-300 hover:border-purple-500/30 hover:-translate-y-1">
                <div class="flex items-center gap-3 mb-3">
                  <div class="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                    <span class="text-2xl">🎨</span>
                  </div>
                  <h3 class="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {t().aiPlayground.features.image.title}
                  </h3>
                </div>
                <p class="text-sm text-muted-foreground leading-relaxed">
                  {t().aiPlayground.features.image.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
