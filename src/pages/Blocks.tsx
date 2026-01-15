/**
 * Blocks 页面
 */

import type { Component } from "solid-js";

import { FiberScene } from "../examples/fiber/Scene.fiber";
import { Canvas } from "@ensolid/fiber";
import { StreamdownExample } from "../examples/StreamdownExample";
import { useI18n } from "@/i18n";

export const BlocksPage: Component = () => {
  const { t } = useI18n();
  return (
    <div class="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* 顶部标题区域 */}
      <div class="border-b bg-background/50 backdrop-blur-sm">
        <div class="container mx-auto px-4 py-8">
          <div class="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10 backdrop-blur-sm border border-indigo-500/20">
            <span class="text-xl">🧩</span>
            <span class="text-xs font-medium bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {t().blocks.title}
            </span>
          </div>
          <h1 class="text-4xl font-bold tracking-tight mb-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            {t().blocks.title}
          </h1>
          <p class="text-muted-foreground text-lg">
            {t().blocks.subtitle}
          </p>
        </div>
      </div>

      <div class="container mx-auto px-4 py-12">
        <div class="max-w-6xl mx-auto space-y-8">
          {/* Streamdown Markdown 渲染 */}
          <div class="group relative">
            <div class="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div class="relative bg-card border-2 border-muted rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:border-blue-500/30">
              <div class="bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-blue-500/10 border-b border-border p-6 backdrop-blur-sm">
                <div class="flex items-center gap-4">
                  <div class="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20">
                    <span class="text-3xl">📝</span>
                  </div>
                  <div>
                    <h2 class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                      {t().blocks.streamdown.title}
                    </h2>
                    <p class="text-sm text-muted-foreground">
                      {t().blocks.streamdown.description}
                    </p>
                  </div>
                </div>
              </div>
              <div class="p-8">
                <StreamdownExample />
              </div>
            </div>
          </div>

          {/* Fiber Scene */}
          <div class="group relative">
            <div class="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div class="relative bg-card border-2 border-muted rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:border-purple-500/30">
              <div class="bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-purple-500/10 border-b border-border p-6 backdrop-blur-sm">
                <div class="flex items-center gap-4">
                  <div class="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                    <span class="text-3xl">🎨</span>
                  </div>
                  <div>
                    <h2 class="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      {t().blocks.fiber.title}
                    </h2>
                    <p class="text-sm text-muted-foreground">
                      {t().blocks.fiber.description}
                    </p>
                  </div>
                </div>
              </div>
              <div class="p-8">
                <div class="relative">
                  <div class="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-xl"></div>
                  <div class="relative h-[400px] w-full rounded-xl border-2 border-muted bg-gradient-to-br from-slate-950 to-slate-900 overflow-hidden shadow-2xl">
                    <Canvas>
                      <FiberScene />
                    </Canvas>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 功能说明卡片 */}
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="relative group">
              <div class="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
              <div class="relative bg-card border-2 border-muted rounded-xl p-6 transition-all duration-300 hover:border-blue-500/30">
                <div class="flex items-center gap-3 mb-4">
                  <span class="text-2xl">⚡</span>
                  <h3 class="text-lg font-bold">{t().blocks.features.performance.title}</h3>
                </div>
                <p class="text-sm text-muted-foreground leading-relaxed">
                  {t().blocks.features.performance.description}
                </p>
              </div>
            </div>

            <div class="relative group">
              <div class="absolute -inset-0.5 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
              <div class="relative bg-card border-2 border-muted rounded-xl p-6 transition-all duration-300 hover:border-purple-500/30">
                <div class="flex items-center gap-3 mb-4">
                  <span class="text-2xl">🎯</span>
                  <h3 class="text-lg font-bold">{t().blocks.features.integration.title}</h3>
                </div>
                <p class="text-sm text-muted-foreground leading-relaxed">
                  {t().blocks.features.integration.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

