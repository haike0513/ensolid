/**
 * 首页
 */

import type { Component } from "solid-js";
import { A } from "@solidjs/router";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
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
    { label: t().home.stats.libraries, value: "3", desc: t().home.stats.librariesDesc },
    { label: t().home.stats.components, value: "100+", desc: t().home.stats.componentsDesc },
    { label: t().home.stats.typescript, value: "100%", desc: t().home.stats.typescriptDesc },
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
      {/* Hero 区域 */}
      <section class="relative overflow-hidden bg-gradient-to-b from-background via-background to-muted/20 py-20 sm:py-32">
        <div class="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div class="container relative mx-auto px-4">
          <div class="mx-auto max-w-4xl text-center">
            <div class="mb-6 inline-flex items-center rounded-full border bg-muted/50 px-4 py-1.5 text-sm backdrop-blur-sm animate-fade-in-down">
              <span class="mr-2">✨</span>
              <span class="text-muted-foreground">
                {t().home.badge}
              </span>
            </div>
            <h1 class="mb-6 text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl animate-fade-in-up" style={{ "animation-delay": "0.1s" }}>
              <span class="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                {t().home.title}
              </span>
            </h1>
            <p class="mb-4 text-xl text-muted-foreground sm:text-2xl animate-fade-in-up" style={{ "animation-delay": "0.2s" }}>
              {t().home.subtitle}
            </p>
            <p class="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground animate-fade-in-up" style={{ "animation-delay": "0.3s" }}>
              {t().home.description}
            </p>
            <div class="flex flex-col items-center justify-center gap-4 sm:flex-row animate-fade-in-up" style={{ "animation-delay": "0.4s" }}>
              <Button asChild size="lg" class="h-12 px-8 text-base transition-transform hover:scale-105">
                <A href="/components">{t().home.viewComponents}</A>
              </Button>
              <Button asChild size="lg" variant="outline" class="h-12 px-8 text-base transition-transform hover:scale-105">
                <A href="/solidflow">{t().home.viewFlow}</A>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 统计数据 */}
      <section class="border-y bg-muted/30 py-12">
        <div class="container mx-auto px-4">
          <div class="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {stats.map((stat) => (
              <div class="text-center">
                <div class="mb-2 text-3xl font-bold text-primary sm:text-4xl">
                  {stat.value}
                </div>
                <div class="text-sm font-medium text-foreground">{stat.label}</div>
                <div class="text-xs text-muted-foreground">{stat.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 项目优势 */}
      <section class="py-20 sm:py-32">
        <div class="container mx-auto px-4">
          <div class="mb-16 text-center">
            <h2 class="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              {t().home.advantages.title}
            </h2>
            <p class="mx-auto max-w-2xl text-lg text-muted-foreground">
              {t().home.advantages.subtitle}
            </p>
          </div>
          <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Card
                class="group relative overflow-hidden border-2 transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:-translate-y-1 animate-scale-in"
                style={{
                  "animation-delay": `${index * 100}ms`,
                }}
              >
                <div
                  class={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 transition-opacity duration-300 group-hover:opacity-5`}
                ></div>
                <CardHeader>
                  <div class="mb-2 flex items-center gap-3">
                    <span class="text-3xl">{feature.icon}</span>
                    <CardTitle class="text-xl">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription class="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 组件库展示 */}
      <section class="bg-muted/30 py-20 sm:py-32">
        <div class="container mx-auto px-4">
          <div class="mb-16 text-center">
            <h2 class="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              {t().home.libraries.title}
            </h2>
            <p class="mx-auto max-w-2xl text-lg text-muted-foreground">
              {t().home.libraries.subtitle}
            </p>
          </div>
          <div class="grid gap-6 lg:grid-cols-3">
            {libraries.map((lib, index) => (
              <Card
                class="group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 animate-scale-in"
                style={{
                  "animation-delay": `${index * 150}ms`,
                }}
              >
                <div class="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                <CardHeader>
                  <div class="mb-2 flex items-center justify-between">
                    <CardTitle class="text-xl">{lib.title}</CardTitle>
                    <span class="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                      {lib.count}
                    </span>
                  </div>
                  <CardDescription class="text-sm text-muted-foreground">
                    {lib.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p class="mb-4 text-muted-foreground">{lib.description}</p>
                  <Button asChild variant="outline" class="w-full">
                    <A href={lib.link}>{t().home.libraries.viewDetails}</A>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 技术栈 */}
      <section class="py-20 sm:py-32">
        <div class="container mx-auto px-4">
          <div class="mb-16 text-center">
            <h2 class="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              {t().home.techStack.title}
            </h2>
            <p class="mx-auto max-w-2xl text-lg text-muted-foreground">
              {t().home.techStack.subtitle}
            </p>
          </div>
          <div class="mx-auto max-w-4xl">
            <Card>
              <CardContent class="p-8">
                <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  <div class="text-center">
                    <div class="mb-3 text-4xl">⚛️</div>
                    <div class="font-semibold">SolidJS</div>
                    <div class="text-sm text-muted-foreground">{t().home.techStack.solidjs}</div>
                  </div>
                  <div class="text-center">
                    <div class="mb-3 text-4xl">📘</div>
                    <div class="font-semibold">TypeScript</div>
                    <div class="text-sm text-muted-foreground">{t().home.techStack.typescript}</div>
                  </div>
                  <div class="text-center">
                    <div class="mb-3 text-4xl">⚡</div>
                    <div class="font-semibold">Vite</div>
                    <div class="text-sm text-muted-foreground">{t().home.techStack.vite}</div>
                  </div>
                  <div class="text-center">
                    <div class="mb-3 text-4xl">📦</div>
                    <div class="font-semibold">pnpm</div>
                    <div class="text-sm text-muted-foreground">{t().home.techStack.pnpm}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA 区域 */}
      <section class="border-t bg-gradient-to-b from-background to-muted/20 py-20 sm:py-32">
        <div class="container mx-auto px-4">
          <div class="mx-auto max-w-2xl text-center">
            <h2 class="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              {t().home.cta.title}
            </h2>
            <p class="mb-8 text-lg text-muted-foreground">
              {t().home.cta.subtitle}
            </p>
            <div class="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" class="h-12 px-8 text-base">
                <A href="/components">{t().home.cta.browseComponents}</A>
              </Button>
              <Button asChild size="lg" variant="outline" class="h-12 px-8 text-base">
                <A href="/docs">{t().home.cta.viewDocs}</A>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

