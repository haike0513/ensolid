/**
 * 设置页面
 */

import type { Component } from "solid-js";
import { createSignal, onMount } from "solid-js";
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
import {
  getAIGatewayApiKey,
  setAIGatewayApiKey,
  clearAIGatewayApiKey,
} from "@/ai/config";

export const SettingsPage: Component = () => {
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
      <div class="container mx-auto px-4 max-w-4xl">
        {/* 页面标题 */}
        <div class="mb-8">
          <h1 class="mb-2 text-4xl font-bold tracking-tight">设置</h1>
          <p class="text-lg text-muted-foreground">
            管理您的应用配置和偏好设置
          </p>
        </div>

        {/* AI 配置 */}
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
      </div>
    </div>
  );
};
