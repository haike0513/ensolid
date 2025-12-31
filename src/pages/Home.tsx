/**
 * 首页 - 专业级重构版本
 */

import type { Component } from "solid-js";
import { A } from "@solidjs/router";
import { For } from "solid-js";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useI18n } from "@/i18n";

export const HomePage: Component = () => {
  const { t } = useI18n();

  const features = [
    {
      title: t().home.advantages.completeEcosystem.title,
      description: t().home.advantages.completeEcosystem.description,
      icon: "🎨",
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: t().home.advantages.typescript.title,
      description: t().home.advantages.typescript.description,
      icon: "🔒",
      color: "from-purple-500 to-pink-500",
    },
    {
      title: t().home.advantages.ssr.title,
      description: t().home.advantages.ssr.description,
      icon: "⚡",
      color: "from-green-500 to-emerald-500",
    },
    {
      title: t().home.advantages.accessibility.title,
      description: t().home.advantages.accessibility.description,
      icon: "♿",
      color: "from-orange-500 to-red-500",
    },
    {
      title: t().home.advantages.customizable.title,
      description: t().home.advantages.customizable.description,
      icon: "🎯",
      color: "from-indigo-500 to-blue-500",
    },
    {
      title: t().home.advantages.performance.title,
      description: t().home.advantages.performance.description,
      icon: "🚀",
      color: "from-teal-500 to-cyan-500",
    },
  ];

  const stats = [
    {
      label: t().home.stats.libraries,
      value: "3",
      desc: t().home.stats.librariesDesc,
    },
    {
      label: t().home.stats.components,
      value: "100+",
      desc: t().home.stats.componentsDesc,
    },
    {
      label: t().home.stats.typescript,
      value: "100%",
      desc: t().home.stats.typescriptDesc,
    },
    { label: t().home.stats.ssr, value: "✅", desc: t().home.stats.ssrDesc },
  ];

  const libraries = [
    {
      name: t().home.libraries.radix.name,
      title: t().home.libraries.radix.title,
      description: t().home.libraries.radix.description,
      count: "25+",
      link: "/components",
    },
    {
      name: t().home.libraries.baseui.name,
      title: t().home.libraries.baseui.title,
      description: t().home.libraries.baseui.description,
      count: "59+",
      link: "/components",
    },
    {
      name: t().home.libraries.solidflow.name,
      title: t().home.libraries.solidflow.title,
      description: t().home.libraries.solidflow.description,
      count: "5+",
      link: "/solidflow",
    },
  ];

  return (
    <div class="min-h-screen">
      {/* Hero 区域 - 增强版 */}
      <section class="relative overflow-hidden bg-gradient-to-b from-background via-primary/5 to-background py-24 sm:py-32 lg:py-40">
        {/* 背景装饰 */}
        <div class="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>
        <div
          class="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-30 animate-pulse"
          style={{ "animation-duration": "4s" }}
        >
        </div>
        <div
          class="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl opacity-20 animate-pulse"
          style={{ "animation-duration": "5s", "animation-delay": "1s" }}
        >
        </div>
        <div
          class="absolute bottom-1/4 left-1/2 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl opacity-25 animate-pulse"
          style={{ "animation-duration": "6s", "animation-delay": "2s" }}
        >
        </div>

        {/* 顶部装饰线 */}
        <div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent">
        </div>

        <div class="container relative mx-auto px-4 lg:px-8">
          <div class="mx-auto max-w-5xl text-center">
            {/* 徽章 */}
            <div class="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-5 py-2 text-sm font-medium backdrop-blur-sm animate-fade-in-down shadow-lg shadow-primary/5">
              <span class="text-xl">✨</span>
              <span class="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                {t().home.badge}
              </span>
            </div>

            {/* 主标题 */}
            <h1
              class="mb-8 text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl xl:text-8xl animate-fade-in-up"
              style={{ "animation-delay": "0.1s" }}
            >
              <span class="block bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent leading-tight">
                {t().home.title}
              </span>
            </h1>

            {/* 副标题 */}
            <p
              class="mb-4 text-xl text-foreground/80 sm:text-2xl lg:text-3xl font-medium animate-fade-in-up"
              style={{ "animation-delay": "0.2s" }}
            >
              {t().home.subtitle}
            </p>

            {/* 描述文字 */}
            <p
              class="mx-auto mb-10 max-w-3xl text-base sm:text-lg text-muted-foreground leading-relaxed animate-fade-in-up"
              style={{ "animation-delay": "0.3s" }}
            >
              {t().home.description}
            </p>

            {/* CTA按钮组 */}
            <div
              class="flex flex-col items-center justify-center gap-4 sm:flex-row animate-fade-in-up"
              style={{ "animation-delay": "0.4s" }}
            >
              <A href="/components">
                <Button
                  size="lg"
                  class="group relative h-14 px-10 text-base font-semibold overflow-hidden shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-1"
                >
                  <span class="relative z-10 flex items-center gap-2">
                    <span>{t().home.viewComponents}</span>
                    <svg
                      class="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </span>
                  <div class="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  </div>
                </Button>
              </A>
              <A href="/solidflow">
                <Button
                  size="lg"
                  variant="outline"
                  class="group h-14 px-10 text-base font-semibold border-2 transition-all duration-300 hover:bg-accent/50 hover:border-primary/40 hover:-translate-y-1 hover:shadow-lg"
                >
                  <span class="flex items-center gap-2">
                    <span>{t().home.viewFlow}</span>
                    <svg
                      class="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </span>
                </Button>
              </A>
            </div>

            {/* 信任指标 */}
            <div
              class="mt-16 flex flex-wrap items-center justify-center gap-8 opacity-60 animate-fade-in-up"
              style={{ "animation-delay": "0.5s" }}
            >
              <div class="flex items-center gap-2 text-sm text-muted-foreground">
                <svg
                  class="w-5 h-5 text-yellow-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span class="font-medium">开源项目</span>
              </div>
              <div class="flex items-center gap-2 text-sm text-muted-foreground">
                <svg
                  class="w-5 h-5 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span class="font-medium">TypeScript</span>
              </div>
              <div class="flex items-center gap-2 text-sm text-muted-foreground">
                <svg
                  class="w-5 h-5 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                <span class="font-medium">高性能</span>
              </div>
            </div>
          </div>
        </div>

        {/* 底部装饰线 */}
        <div class="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-border to-transparent">
        </div>
      </section>

      {/* 统计数据 - 增强版 */}
      <section class="relative border-y border-border/40 bg-gradient-to-b from-muted/30 via-muted/20 to-muted/30 py-16">
        <div class="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>
        <div class="container relative mx-auto px-4 lg:px-8">
          <div class="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            <For each={stats}>
              {(stat, index) => (
                <div
                  class="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-background to-muted/30 p-6 text-center border border-border/50 transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:-translate-y-2 animate-fade-in-up"
                  style={{ "animation-delay": `${index() * 100}ms` }}
                >
                  <div class="absolute inset-0 bg-gradient-to-br from-primary/5 to-blue-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  </div>
                  <div class="relative">
                    <div class="mb-3 text-4xl font-bold bg-gradient-to-br from-primary to-blue-600 bg-clip-text text-transparent sm:text-5xl transition-transform duration-300 group-hover:scale-110">
                      {stat.value}
                    </div>
                    <div class="text-sm font-semibold text-foreground mb-1">
                      {stat.label}
                    </div>
                    <div class="text-xs text-muted-foreground leading-relaxed">
                      {stat.desc}
                    </div>
                  </div>
                  {/* 装饰元素 */}
                  <div class="absolute -top-6 -right-6 w-20 h-20 bg-primary/10 rounded-full blur-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  </div>
                </div>
              )}
            </For>
          </div>
        </div>
      </section>

      {/* 项目优势 - 增强版 */}
      <section class="relative py-20 sm:py-32 overflow-hidden">
        {/* 背景装饰 */}
        <div class="absolute inset-0">
          <div class="absolute top-1/4 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl">
          </div>
          <div class="absolute bottom-1/4 right-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl">
          </div>
        </div>

        <div class="container relative mx-auto px-4 lg:px-8">
          <div class="mb-16 text-center">
            <div class="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-primary/10 backdrop-blur-sm border border-primary/20">
              <span class="text-xl">✨</span>
              <span class="text-sm font-medium text-primary">Features</span>
            </div>
            <h2 class="mb-6 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
              {t().home.advantages.title}
            </h2>
            <p class="mx-auto max-w-3xl text-lg text-muted-foreground leading-relaxed">
              {t().home.advantages.subtitle}
            </p>
          </div>

          <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <For each={features}>
              {(feature, index) => (
                <Card
                  class="group relative overflow-hidden border-2 border-border/50 transition-all duration-500 hover:border-primary/40 hover:shadow-2xl hover:-translate-y-2 animate-scale-in backdrop-blur-sm"
                  style={{
                    "animation-delay": `${index() * 100}ms`,
                  }}
                >
                  {/* 渐变背景 */}
                  <div
                    class={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 transition-opacity duration-500 group-hover:opacity-10`}
                  >
                  </div>

                  {/* 光晕效果 */}
                  <div class="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  </div>

                  <CardHeader>
                    <div class="mb-3 flex items-center gap-4">
                      <div class="relative">
                        <div
                          class={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-20 rounded-xl blur-xl transition-opacity duration-500 group-hover:opacity-40`}
                        >
                        </div>
                        <span class="relative text-4xl transition-transform duration-500 group-hover:scale-125 group-hover:rotate-12 inline-block">
                          {feature.icon}
                        </span>
                      </div>
                      <CardTitle class="text-xl font-bold transition-colors duration-300 group-hover:text-primary">
                        {feature.title}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription class="text-base leading-relaxed text-muted-foreground">
                      {feature.description}
                    </CardDescription>
                  </CardContent>

                  {/* 底部装饰线 */}
                  <div
                    class={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.color} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
                  >
                  </div>
                </Card>
              )}
            </For>
          </div>
        </div>
      </section>

      {/* 组件库展示 - 增强版 */}
      <section class="relative bg-gradient-to-b from-muted/20 via-muted/30 to-muted/20 py-20 sm:py-32 border-y border-border/40">
        <div class="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>

        <div class="container relative mx-auto px-4 lg:px-8">
          <div class="mb-16 text-center">
            <div class="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-blue-500/10 backdrop-blur-sm border border-blue-500/20">
              <span class="text-xl">📦</span>
              <span class="text-sm font-medium text-blue-600 dark:text-blue-400">
                Libraries
              </span>
            </div>
            <h2 class="mb-6 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl bg-gradient-to-r from-foreground via-blue-600 to-foreground bg-clip-text text-transparent">
              {t().home.libraries.title}
            </h2>
            <p class="mx-auto max-w-3xl text-lg text-muted-foreground leading-relaxed">
              {t().home.libraries.subtitle}
            </p>
          </div>

          <div class="grid gap-8 lg:grid-cols-3">
            <For each={libraries}>
              {(lib, index) => (
                <Card
                  class="group relative overflow-hidden border-2 border-border/50 transition-all duration-500 hover:border-primary/40 hover:shadow-2xl hover:-translate-y-2 animate-scale-in backdrop-blur-sm"
                  style={{
                    "animation-delay": `${index() * 150}ms`,
                  }}
                >
                  {/* 渐变背景 */}
                  <div class="absolute inset-0 bg-gradient-to-br from-primary/5 via-blue-500/5 to-purple-500/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  </div>

                  {/* 顶部装饰 */}
                  <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-blue-500 to-purple-500 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  </div>

                  {/* 光晕效果 */}
                  <div class="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-primary/20 to-blue-500/20 rounded-full blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  </div>

                  <CardHeader class="relative">
                    <div class="mb-3 flex items-center justify-between">
                      <CardTitle class="text-2xl font-bold transition-colors duration-300 group-hover:text-primary">
                        {lib.title}
                      </CardTitle>
                      <div class="relative">
                        <div class="absolute inset-0 bg-primary/20 rounded-full blur-lg opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                        </div>
                        <span class="relative inline-flex items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-blue-500/20 border-2 border-primary/30 px-4 py-1.5 text-sm font-bold text-primary shadow-lg transition-transform duration-500 group-hover:scale-110">
                          {lib.count}
                        </span>
                      </div>
                    </div>
                    <CardDescription class="text-sm font-medium text-muted-foreground">
                      {lib.name}
                    </CardDescription>
                  </CardHeader>

                  <CardContent class="relative">
                    <p class="mb-6 text-base text-muted-foreground leading-relaxed">
                      {lib.description}
                    </p>
                    <A href={lib.link}>
                      <Button
                        variant="outline"
                        class="group/btn w-full border-2 transition-all duration-300 hover:border-primary/50 hover:bg-primary/5"
                      >
                        <span class="flex items-center justify-center gap-2">
                          <span>{t().home.libraries.viewDetails}</span>
                          <svg
                            class="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M13 7l5 5m0 0l-5 5m5-5H6"
                            />
                          </svg>
                        </span>
                      </Button>
                    </A>
                  </CardContent>

                  {/* 底部装饰 */}
                  <div class="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  </div>
                </Card>
              )}
            </For>
          </div>

          {/* 底部说明 */}
          <div class="mt-16 text-center">
            <div class="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-background/50 backdrop-blur-sm border border-border/50 shadow-lg">
              <svg
                class="w-5 h-5 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              <span class="text-sm font-medium text-muted-foreground">
                持续更新中，敬请期待更多组件
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 技术栈 - 增强版 */}
      <section class="relative py-20 sm:py-32 overflow-hidden">
        {/* 背景装饰 */}
        <div class="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent">
        </div>
        <div class="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>
        <div
          class="absolute top-1/2 left-1/4 w-96 h-96 bg-primary/15 rounded-full blur-3xl opacity-30 animate-pulse"
          style={{ "animation-duration": "4s" }}
        >
        </div>
        <div
          class="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl opacity-25 animate-pulse"
          style={{ "animation-duration": "5s", "animation-delay": "1s" }}
        >
        </div>
        <div
          class="absolute bottom-1/4 left-1/2 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl opacity-20 animate-pulse"
          style={{ "animation-duration": "6s", "animation-delay": "2s" }}
        >
        </div>

        <div class="container mx-auto px-4 lg:px-8 relative z-10">
          <div class="mb-16 text-center">
            <div class="inline-flex items-center gap-2 mb-4 px-5 py-2.5 rounded-full bg-gradient-to-r from-primary/10 to-blue-500/10 backdrop-blur-sm border border-primary/20 shadow-lg shadow-primary/5">
              <span class="text-2xl">🛠️</span>
              <span class="text-sm font-semibold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                Technology Stack
              </span>
            </div>
            <h2 class="mb-6 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
              {t().home.techStack.title}
            </h2>
            <p class="mx-auto max-w-3xl text-lg text-muted-foreground leading-relaxed">
              {t().home.techStack.subtitle}
            </p>
          </div>

          <div class="mx-auto max-w-7xl">
            <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {/* SolidJS Card */}
              <div
                class="group relative animate-fade-in-up"
                style={{ "animation-delay": "0.1s" }}
              >
                <div class="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur-xl opacity-0 group-hover:opacity-75 transition duration-500">
                </div>
                <div class="relative h-full bg-gradient-to-br from-background to-muted/30 border-2 border-border/50 rounded-2xl p-8 transition-all duration-500 hover:border-blue-500/50 hover:-translate-y-3 hover:shadow-2xl backdrop-blur-sm">
                  <div class="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  </div>
                  <div class="relative">
                    <div class="mb-4 flex items-center justify-center">
                      <div class="flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 group-hover:scale-110 transition-transform duration-300">
                        <span class="text-4xl filter group-hover:drop-shadow-lg transition-all duration-300">
                          ⚛️
                        </span>
                      </div>
                    </div>
                    <h3 class="mb-2 text-xl font-bold text-center bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
                      SolidJS
                    </h3>
                    <p class="text-sm text-center text-muted-foreground leading-relaxed">
                      {t().home.techStack.solidjs}
                    </p>
                    <div class="mt-4 flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div class="w-2 h-2 rounded-full bg-blue-500 animate-pulse">
                      </div>
                      <div
                        class="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"
                        style={{ "animation-delay": "0.2s" }}
                      >
                      </div>
                      <div
                        class="w-2 h-2 rounded-full bg-blue-500 animate-pulse"
                        style={{ "animation-delay": "0.4s" }}
                      >
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* TypeScript Card */}
              <div
                class="group relative animate-fade-in-up"
                style={{ "animation-delay": "0.2s" }}
              >
                <div class="absolute -inset-1 bg-gradient-to-r from-blue-700 to-blue-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-75 transition duration-500">
                </div>
                <div class="relative h-full bg-gradient-to-br from-background to-muted/30 border-2 border-border/50 rounded-2xl p-8 transition-all duration-500 hover:border-blue-600/50 hover:-translate-y-3 hover:shadow-2xl backdrop-blur-sm">
                  <div class="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-blue-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  </div>
                  <div class="relative">
                    <div class="mb-4 flex items-center justify-center">
                      <div class="flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-blue-600/20 to-blue-500/20 group-hover:scale-110 transition-transform duration-300">
                        <span class="text-4xl filter group-hover:drop-shadow-lg transition-all duration-300">
                          📘
                        </span>
                      </div>
                    </div>
                    <h3 class="mb-2 text-xl font-bold text-center bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
                      TypeScript
                    </h3>
                    <p class="text-sm text-center text-muted-foreground leading-relaxed">
                      {t().home.techStack.typescript}
                    </p>
                    <div class="mt-4 flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div class="w-2 h-2 rounded-full bg-blue-600 animate-pulse">
                      </div>
                      <div
                        class="w-2 h-2 rounded-full bg-blue-500 animate-pulse"
                        style={{ "animation-delay": "0.2s" }}
                      >
                      </div>
                      <div
                        class="w-2 h-2 rounded-full bg-blue-600 animate-pulse"
                        style={{ "animation-delay": "0.4s" }}
                      >
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Vite Card */}
              <div
                class="group relative animate-fade-in-up"
                style={{ "animation-delay": "0.3s" }}
              >
                <div class="absolute -inset-1 bg-gradient-to-r from-purple-600 to-yellow-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-75 transition duration-500">
                </div>
                <div class="relative h-full bg-gradient-to-br from-background to-muted/30 border-2 border-border/50 rounded-2xl p-8 transition-all duration-500 hover:border-purple-500/50 hover:-translate-y-3 hover:shadow-2xl backdrop-blur-sm">
                  <div class="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-yellow-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  </div>
                  <div class="relative">
                    <div class="mb-4 flex items-center justify-center">
                      <div class="flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500/20 to-yellow-500/20 group-hover:scale-110 transition-transform duration-300">
                        <span class="text-4xl filter group-hover:drop-shadow-lg transition-all duration-300">
                          ⚡
                        </span>
                      </div>
                    </div>
                    <h3 class="mb-2 text-xl font-bold text-center bg-gradient-to-r from-purple-600 to-yellow-500 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
                      Vite
                    </h3>
                    <p class="text-sm text-center text-muted-foreground leading-relaxed">
                      {t().home.techStack.vite}
                    </p>
                    <div class="mt-4 flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div class="w-2 h-2 rounded-full bg-purple-500 animate-pulse">
                      </div>
                      <div
                        class="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"
                        style={{ "animation-delay": "0.2s" }}
                      >
                      </div>
                      <div
                        class="w-2 h-2 rounded-full bg-purple-500 animate-pulse"
                        style={{ "animation-delay": "0.4s" }}
                      >
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* pnpm Card */}
              <div
                class="group relative animate-fade-in-up"
                style={{ "animation-delay": "0.4s" }}
              >
                <div class="absolute -inset-1 bg-gradient-to-r from-orange-600 to-amber-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-75 transition duration-500">
                </div>
                <div class="relative h-full bg-gradient-to-br from-background to-muted/30 border-2 border-border/50 rounded-2xl p-8 transition-all duration-500 hover:border-orange-500/50 hover:-translate-y-3 hover:shadow-2xl backdrop-blur-sm">
                  <div class="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-amber-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  </div>
                  <div class="relative">
                    <div class="mb-4 flex items-center justify-center">
                      <div class="flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-orange-500/20 to-amber-500/20 group-hover:scale-110 transition-transform duration-300">
                        <span class="text-4xl filter group-hover:drop-shadow-lg transition-all duration-300">
                          📦
                        </span>
                      </div>
                    </div>
                    <h3 class="mb-2 text-xl font-bold text-center bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
                      pnpm
                    </h3>
                    <p class="text-sm text-center text-muted-foreground leading-relaxed">
                      {t().home.techStack.pnpm}
                    </p>
                    <div class="mt-4 flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div class="w-2 h-2 rounded-full bg-orange-500 animate-pulse">
                      </div>
                      <div
                        class="w-2 h-2 rounded-full bg-amber-500 animate-pulse"
                        style={{ "animation-delay": "0.2s" }}
                      >
                      </div>
                      <div
                        class="w-2 h-2 rounded-full bg-orange-500 animate-pulse"
                        style={{ "animation-delay": "0.4s" }}
                      >
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 技术栈底部装饰 */}
            <div
              class="mt-16 animate-fade-in-up"
              style={{ "animation-delay": "0.6s" }}
            >
              <div class="flex flex-wrap items-center justify-center gap-6 sm:gap-8">
                <div class="group flex items-center gap-2.5 px-4 py-2 rounded-full bg-background/50 backdrop-blur-sm border border-border/50 transition-all duration-300 hover:border-blue-500/50 hover:shadow-lg">
                  <div class="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-transform duration-300 group-hover:scale-125">
                  </div>
                  <span class="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                    现代化
                  </span>
                </div>
                <div class="group flex items-center gap-2.5 px-4 py-2 rounded-full bg-background/50 backdrop-blur-sm border border-border/50 transition-all duration-300 hover:border-purple-500/50 hover:shadow-lg">
                  <div class="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-yellow-500 transition-transform duration-300 group-hover:scale-125">
                  </div>
                  <span class="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                    高性能
                  </span>
                </div>
                <div class="group flex items-center gap-2.5 px-4 py-2 rounded-full bg-background/50 backdrop-blur-sm border border-border/50 transition-all duration-300 hover:border-orange-500/50 hover:shadow-lg">
                  <div class="w-3 h-3 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 transition-transform duration-300 group-hover:scale-125">
                  </div>
                  <span class="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                    可扩展
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA 区域 - 增强版 */}
      <section class="relative border-t border-border/40 bg-gradient-to-b from-background via-primary/5 to-background py-24 sm:py-32 overflow-hidden">
        {/* 背景装饰 */}
        <div class="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl opacity-30">
        </div>

        <div class="container relative mx-auto px-4 lg:px-8">
          <div class="mx-auto max-w-4xl">
            {/* 装饰性卡片容器 */}
            <div class="relative rounded-3xl bg-gradient-to-br from-background/80 to-muted/30 backdrop-blur-xl border-2 border-border/50 p-12 sm:p-16 shadow-2xl overflow-hidden">
              {/* 内部光晕 */}
              <div class="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-primary/20 to-blue-500/20 rounded-full blur-3xl">
              </div>
              <div class="absolute -bottom-24 -left-24 w-48 h-48 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl">
              </div>

              <div class="relative text-center">
                {/* 图标 */}
                <div class="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-blue-500/20 border-2 border-primary/30">
                  <svg
                    class="w-8 h-8 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>

                {/* 标题 */}
                <h2 class="mb-6 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
                  {t().home.cta.title}
                </h2>

                {/* 副标题 */}
                <p class="mb-10 text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                  {t().home.cta.subtitle}
                </p>

                {/* 按钮组 */}
                <div class="flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <A href="/components">
                    <Button
                      size="lg"
                      class="group relative h-14 px-10 text-base font-semibold overflow-hidden shadow-xl shadow-primary/25 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-1"
                    >
                      <span class="relative z-10 flex items-center gap-2">
                        <svg
                          class="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                          />
                        </svg>
                        <span>{t().home.cta.browseComponents}</span>
                        <svg
                          class="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                          />
                        </svg>
                      </span>
                      <div class="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      </div>
                    </Button>
                  </A>
                  <A href="/docs">
                    <Button
                      size="lg"
                      variant="outline"
                      class="group h-14 px-10 text-base font-semibold border-2 transition-all duration-300 hover:bg-accent/50 hover:border-primary/40 hover:-translate-y-1 hover:shadow-xl"
                    >
                      <span class="flex items-center gap-2">
                        <svg
                          class="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                          />
                        </svg>
                        <span>{t().home.cta.viewDocs}</span>
                        <svg
                          class="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </span>
                    </Button>
                  </A>
                </div>

                {/* 底部提示 */}
                <div class="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
                  <div class="flex items-center gap-2">
                    <svg
                      class="w-4 h-4 text-green-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <span>免费开源</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <svg
                      class="w-4 h-4 text-blue-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <span>持续更新</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <svg
                      class="w-4 h-4 text-purple-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <span>社区支持</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 底部装饰线 */}
        <div class="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-border to-transparent">
        </div>
      </section>
    </div>
  );
};
