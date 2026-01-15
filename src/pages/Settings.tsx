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
    <div class="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* 顶部标题区域 */}
      <div class="border-b bg-background/50 backdrop-blur-sm">
        <div class="container mx-auto px-4 py-8">
          <div class="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full bg-gradient-to-r from-slate-500/10 to-gray-500/10 backdrop-blur-sm border border-slate-500/20">
            <span class="text-xl">⚙️</span>
            <span class="text-xs font-medium bg-gradient-to-r from-slate-600 to-gray-600 bg-clip-text text-transparent">
              {t().settings.badge}
            </span>
          </div>
          <h1 class="text-4xl font-bold tracking-tight mb-3 bg-gradient-to-r from-slate-700 via-gray-700 to-slate-700 bg-clip-text text-transparent">
            {t().settings.title}
          </h1>
          <p class="text-muted-foreground text-lg">
            {t().settings.subtitle}
          </p>
        </div>
      </div>

      <div class="container mx-auto px-4 max-w-4xl py-8">
        <div class="space-y-6">
          {/* AI 配置 */}
          <div class="group relative">
            <div class="absolute -inset-1 bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div class="relative bg-card border-2 border-muted rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:border-violet-500/30">
              <div class="bg-gradient-to-r from-violet-500/10 via-fuchsia-500/10 to-violet-500/10 border-b border-border p-6 backdrop-blur-sm">
                <div class="flex items-center gap-4">
                  <div class="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20">
                    <span class="text-3xl">🤖</span>
                  </div>
                  <div>
                    <h2 class="text-2xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                      {t().aiPlayground.config.title}
                    </h2>
                    <p class="text-sm text-muted-foreground">
                      {t().aiPlayground.config.description}
                    </p>
                  </div>
                </div>
              </div>
              <div class="p-8 space-y-6">
                <div class="space-y-3">
                  <Label for="api-key" class="text-base font-semibold">
                    {t().aiPlayground.config.apiKeyLabel}
                  </Label>
                  <div class="relative">
                    <Input
                      id="api-key"
                      type="password"
                      value={apiKey()}
                      onInput={(e) => setApiKey(e.currentTarget.value)}
                      placeholder={t().aiPlayground.config.apiKeyPlaceholder}
                      class="w-full h-12 px-4 text-base border-2 focus:ring-2 focus:ring-violet-500/50"
                    />
                  </div>
                </div>
                <div class="flex gap-3">
                  <Button 
                    onClick={handleSave} 
                    variant="default"
                    class="h-11 px-6 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 transition-all duration-300"
                  >
                    <span class="flex items-center gap-2">
                      <span>💾</span>
                      <span>{t().aiPlayground.config.save}</span>
                    </span>
                  </Button>
                  <Button 
                    onClick={handleClear} 
                    variant="outline"
                    class="h-11 px-6 border-2 hover:bg-muted transition-all duration-300"
                  >
                    <span class="flex items-center gap-2">
                      <span>🗑️</span>
                      <span>{t().aiPlayground.config.clear}</span>
                    </span>
                  </Button>
                </div>
                {message() && (
                  <div class="p-4 rounded-lg bg-muted/50 border border-border">
                    <p class="text-sm font-medium">{message()}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 其他设置卡片 */}
          <div class="grid gap-6 md:grid-cols-2">
            {/* 外观设置 */}
            <div class="group relative">
              <div class="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
              <div class="relative bg-card border-2 border-muted rounded-xl p-6 transition-all duration-300 hover:border-blue-500/30">
                <div class="flex items-center gap-3 mb-4">
                  <div class="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20">
                    <span class="text-2xl">🎨</span>
                  </div>
                  <div>
                    <h3 class="text-lg font-bold">{t().settings.appearance.title}</h3>
                    <p class="text-xs text-muted-foreground">{t().settings.appearance.description}</p>
                  </div>
                </div>
                <p class="text-sm text-muted-foreground">
                  {t().settings.appearance.content}
                </p>
              </div>
            </div>

            {/* 通知设置 */}
            <div class="group relative">
              <div class="absolute -inset-0.5 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
              <div class="relative bg-card border-2 border-muted rounded-xl p-6 transition-all duration-300 hover:border-green-500/30">
                <div class="flex items-center gap-3 mb-4">
                  <div class="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20">
                    <span class="text-2xl">🔔</span>
                  </div>
                  <div>
                    <h3 class="text-lg font-bold">{t().settings.notifications.title}</h3>
                    <p class="text-xs text-muted-foreground">{t().settings.notifications.description}</p>
                  </div>
                </div>
                <p class="text-sm text-muted-foreground">
                  {t().settings.notifications.content}
                </p>
              </div>
            </div>

            {/* 隐私设置 */}
            <div class="group relative">
              <div class="absolute -inset-0.5 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
              <div class="relative bg-card border-2 border-muted rounded-xl p-6 transition-all duration-300 hover:border-purple-500/30">
                <div class="flex items-center gap-3 mb-4">
                  <div class="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                    <span class="text-2xl">🔒</span>
                  </div>
                  <div>
                    <h3 class="text-lg font-bold">{t().settings.privacy.title}</h3>
                    <p class="text-xs text-muted-foreground">{t().settings.privacy.description}</p>
                  </div>
                </div>
                <p class="text-sm text-muted-foreground">
                  {t().settings.privacy.content}
                </p>
              </div>
            </div>

            {/* 高级设置 */}
            <div class="group relative">
              <div class="absolute -inset-0.5 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
              <div class="relative bg-card border-2 border-muted rounded-xl p-6 transition-all duration-300 hover:border-orange-500/30">
                <div class="flex items-center gap-3 mb-4">
                  <div class="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20">
                    <span class="text-2xl">⚡</span>
                  </div>
                  <div>
                    <h3 class="text-lg font-bold">{t().settings.advanced.title}</h3>
                    <p class="text-xs text-muted-foreground">{t().settings.advanced.description}</p>
                  </div>
                </div>
                <p class="text-sm text-muted-foreground">
                  {t().settings.advanced.content}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
