/**
 * 首页 - 大师级专业UI设计
 * 包含：3D视差效果、极光动画、玻璃态卡片、交互式粒子、Bento Grid布局
 */

import type { Component } from "solid-js";
import { A } from "@solidjs/router";
import { For, createSignal, onMount } from "solid-js";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n";

// 粒子组件
const Particle: Component<{ delay: number; size: number; left: string; top: string }> = (props) => (
  <div
    class="absolute rounded-full bg-gradient-to-r from-primary/30 to-blue-500/30 blur-sm animate-particle-float"
    style={{
      width: `${props.size}px`,
      height: `${props.size}px`,
      left: props.left,
      top: props.top,
      "animation-delay": `${props.delay}s`,
    }}
  />
);

// 浮动装饰球
const FloatingOrb: Component<{ 
  color: string; 
  size: string; 
  position: { top?: string; bottom?: string; left?: string; right?: string };
  delay?: number;
}> = (props) => (
  <div
    class={`absolute ${props.size} ${props.color} rounded-full blur-3xl animate-morph opacity-40`}
    style={{
      ...props.position,
      "animation-delay": `${props.delay || 0}s`,
    }}
  />
);

// 特性卡片
const FeatureCard: Component<{
  icon: string;
  title: string;
  description: string;
  gradient: string;
  index: number;
}> = (props) => (
  <div
    class="group relative perspective-1000 animate-reveal-up"
    style={{ "animation-delay": `${props.index * 0.1}s` }}
  >
    <div class="relative h-full glass-card rounded-3xl p-8 transition-all duration-500 hover:scale-[1.02] hover:-translate-y-2 overflow-hidden">
      {/* 背景光效 */}
      <div class={`absolute inset-0 bg-gradient-to-br ${props.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
      
      {/* 扫光效果 */}
      <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 overflow-hidden">
        <div class="absolute w-[200%] h-[200%] -top-1/2 -left-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent rotate-45 animate-beam" />
      </div>
      
      {/* 图标 */}
      <div class="relative mb-6">
        <div class={`w-16 h-16 rounded-2xl bg-gradient-to-br ${props.gradient} p-0.5 shadow-lg`}>
          <div class="w-full h-full rounded-2xl bg-background/90 flex items-center justify-center">
            <span class="text-3xl transition-transform duration-500 group-hover:scale-125 group-hover:rotate-12">{props.icon}</span>
          </div>
        </div>
      </div>
      
      {/* 内容 */}
      <h3 class="text-xl font-bold mb-3 text-foreground transition-colors duration-300 group-hover:text-primary">{props.title}</h3>
      <p class="text-foreground/70 dark:text-foreground/80 leading-relaxed">{props.description}</p>
      
      {/* 底部渐变线 */}
      <div class={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${props.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
    </div>
  </div>
);

// 技术栈卡片
const TechCard: Component<{
  icon: string;
  name: string;
  description: string;
  gradient: string;
  index: number;
}> = (props) => (
  <div
    class="group relative animate-reveal-up"
    style={{ "animation-delay": `${0.2 + props.index * 0.1}s` }}
  >
    {/* 悬浮光晕 */}
    <div class={`absolute -inset-1 bg-gradient-to-r ${props.gradient} rounded-3xl blur-xl opacity-0 group-hover:opacity-60 transition-all duration-500`} />
    
    <div class="relative h-full glass-card rounded-3xl p-8 transition-all duration-500 hover:-translate-y-3">
      <div class="text-center">
        {/* 图标容器 */}
        <div class="mb-5 flex justify-center">
          <div class={`w-20 h-20 rounded-2xl bg-gradient-to-br ${props.gradient} p-0.5 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6`}>
            <div class="w-full h-full rounded-2xl bg-background/95 flex items-center justify-center">
              <span class="text-4xl">{props.icon}</span>
            </div>
          </div>
        </div>
        
        <h3 class={`text-xl font-bold mb-2 text-foreground`}>{props.name}</h3>
        <p class="text-sm text-foreground/70 dark:text-foreground/80">{props.description}</p>
        
        {/* 动态指示器 */}
        <div class="mt-5 flex justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div class="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <div class="w-2 h-2 rounded-full bg-blue-500 animate-pulse" style={{ "animation-delay": "0.2s" }} />
          <div class="w-2 h-2 rounded-full bg-primary animate-pulse" style={{ "animation-delay": "0.4s" }} />
        </div>
      </div>
    </div>
  </div>
);

// 统计卡片
const StatCard: Component<{
  value: string;
  label: string;
  desc: string;
  index: number;
}> = (props) => (
  <div
    class="group relative glass-card rounded-2xl p-6 text-center transition-all duration-500 hover:scale-105 hover:-translate-y-2 animate-reveal-up overflow-hidden"
    style={{ "animation-delay": `${props.index * 0.1}s` }}
  >
    <div class="absolute inset-0 bg-gradient-to-br from-primary/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
    <div class="relative">
      <div class="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-primary via-blue-500 to-purple-500 bg-clip-text text-transparent mb-2 transition-transform duration-300 group-hover:scale-110">
        {props.value}
      </div>
      <div class="font-bold text-foreground mb-1">{props.label}</div>
      <div class="text-xs text-foreground/60 dark:text-foreground/70">{props.desc}</div>
    </div>
  </div>
);

// 库卡片
const LibraryCard: Component<{
  name: string;
  title: string;
  description: string;
  count: string;
  link: string;
  index: number;
  buttonText: string;
}> = (props) => (
  <div
    class="group relative animate-reveal-up"
    style={{ "animation-delay": `${props.index * 0.15}s` }}
  >
    <div class="relative h-full glass-card rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl">
      {/* 顶部渐变条 */}
      <div class="h-1.5 bg-gradient-to-r from-primary via-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div class="p-8">
        {/* 头部 */}
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-2xl font-bold group-hover:text-primary transition-colors duration-300">{props.title}</h3>
          <span class="px-4 py-1.5 rounded-full bg-gradient-to-r from-primary/20 to-blue-500/20 border border-primary/30 text-sm font-bold text-primary">
            {props.count}
          </span>
        </div>
        
        <p class="text-sm text-foreground/60 dark:text-foreground/70 mb-2">{props.name}</p>
        <p class="text-foreground/70 dark:text-foreground/80 mb-6 leading-relaxed">{props.description}</p>
        
        <A href={props.link}>
          <Button variant="outline" class="w-full group/btn border-2 transition-all duration-300 hover:border-primary/50 hover:bg-primary/5">
            <span class="flex items-center justify-center gap-2">
              <span>{props.buttonText}</span>
              <svg class="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </Button>
        </A>
      </div>
    </div>
  </div>
);

export const HomePage: Component = () => {
  const { t } = useI18n();
  const [mousePosition, setMousePosition] = createSignal({ x: 0, y: 0 });

  onMount(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  });

  const features = [
    { title: t().home.advantages.completeEcosystem.title, description: t().home.advantages.completeEcosystem.description, icon: "🎨", gradient: "from-blue-500 to-cyan-500" },
    { title: t().home.advantages.typescript.title, description: t().home.advantages.typescript.description, icon: "🔒", gradient: "from-purple-500 to-pink-500" },
    { title: t().home.advantages.ssr.title, description: t().home.advantages.ssr.description, icon: "⚡", gradient: "from-green-500 to-emerald-500" },
    { title: t().home.advantages.accessibility.title, description: t().home.advantages.accessibility.description, icon: "♿", gradient: "from-orange-500 to-red-500" },
    { title: t().home.advantages.customizable.title, description: t().home.advantages.customizable.description, icon: "🎯", gradient: "from-indigo-500 to-blue-500" },
    { title: t().home.advantages.performance.title, description: t().home.advantages.performance.description, icon: "🚀", gradient: "from-teal-500 to-cyan-500" },
  ];

  const stats = [
    { label: t().home.stats.libraries, value: "3", desc: t().home.stats.librariesDesc },
    { label: t().home.stats.components, value: "100+", desc: t().home.stats.componentsDesc },
    { label: t().home.stats.typescript, value: "100%", desc: t().home.stats.typescriptDesc },
    { label: t().home.stats.ssr, value: "✅", desc: t().home.stats.ssrDesc },
  ];

  const libraries = [
    { name: t().home.libraries.radix.name, title: t().home.libraries.radix.title, description: t().home.libraries.radix.description, count: "25+", link: "/components" },
    { name: t().home.libraries.baseui.name, title: t().home.libraries.baseui.title, description: t().home.libraries.baseui.description, count: "59+", link: "/components" },
    { name: t().home.libraries.solidflow.name, title: t().home.libraries.solidflow.title, description: t().home.libraries.solidflow.description, count: "5+", link: "/solidflow" },
  ];

  const techStack = [
    { icon: "⚛️", name: "SolidJS", description: t().home.techStack.solidjs, gradient: "from-blue-500 to-cyan-500" },
    { icon: "📘", name: "TypeScript", description: t().home.techStack.typescript, gradient: "from-blue-600 to-blue-400" },
    { icon: "⚡", name: "Vite", description: t().home.techStack.vite, gradient: "from-purple-500 to-yellow-500" },
    { icon: "📦", name: "pnpm", description: t().home.techStack.pnpm, gradient: "from-orange-500 to-amber-500" },
  ];

  const particles = Array.from({ length: 20 }, (_, i) => ({
    delay: Math.random() * 5,
    size: Math.random() * 8 + 4,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
  }));

  return (
    <div class="min-h-screen overflow-hidden">
      {/* ========== Hero 区域 ========== */}
      <section class="relative min-h-screen flex items-center justify-center py-20 overflow-hidden">
        {/* 极光背景 */}
        <div class="absolute inset-0 aurora-bg" />
        <div class="absolute inset-0 mesh-gradient" />
        
        {/* 浮动装饰球 */}
        <FloatingOrb color="bg-primary/20" size="w-[600px] h-[600px]" position={{ top: "10%", left: "10%" }} delay={0} />
        <FloatingOrb color="bg-blue-500/15" size="w-[500px] h-[500px]" position={{ top: "20%", right: "15%" }} delay={2} />
        <FloatingOrb color="bg-purple-500/15" size="w-[400px] h-[400px]" position={{ bottom: "20%", left: "30%" }} delay={4} />
        <FloatingOrb color="bg-cyan-500/10" size="w-[350px] h-[350px]" position={{ bottom: "10%", right: "20%" }} delay={6} />
        
        {/* 粒子效果 */}
        <div class="absolute inset-0 pointer-events-none">
          <For each={particles}>{(p) => <Particle {...p} />}</For>
        </div>
        
        {/* 网格背景 */}
        <div class="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
        
        {/* 顶部装饰线 */}
        <div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

        <div class="container relative mx-auto px-4 lg:px-8 z-10">
          <div class="mx-auto max-w-5xl text-center">
            {/* 徽章 */}
            <div class="mb-10 inline-flex items-center gap-3 rounded-full glass-card px-6 py-3 animate-reveal-up shadow-lg">
              <span class="text-2xl animate-float">✨</span>
              <span class="font-semibold text-primary">{t().home.badge}</span>
            </div>

            {/* 主标题 */}
            <h1 class="mb-8 text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-extrabold tracking-tight animate-reveal-up" style={{ "animation-delay": "0.1s" }}>
              <span class="block bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent leading-tight py-2 drop-shadow-sm">{t().home.title}</span>
            </h1>

            {/* 副标题 */}
            <p class="mb-6 text-xl sm:text-2xl lg:text-3xl font-semibold text-foreground animate-reveal-up" style={{ "animation-delay": "0.2s" }}>
              {t().home.subtitle}
            </p>

            {/* 描述 */}
            <p class="mx-auto mb-12 max-w-3xl text-base sm:text-lg text-foreground/70 dark:text-foreground/80 leading-relaxed animate-reveal-up" style={{ "animation-delay": "0.3s" }}>
              {t().home.description}
            </p>

            {/* CTA按钮 */}
            <div class="flex flex-col sm:flex-row items-center justify-center gap-4 animate-reveal-up" style={{ "animation-delay": "0.4s" }}>
              <A href="/components">
                <Button size="lg" class="group relative h-14 px-10 text-base font-semibold overflow-hidden shadow-xl shadow-primary/25 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                  <span class="relative z-10 flex items-center gap-2">
                    <span>{t().home.viewComponents}</span>
                    <svg class="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </Button>
              </A>
              <A href="/solidflow">
                <Button size="lg" variant="outline" class="group h-14 px-10 text-base font-semibold border-2 glass-card transition-all duration-300 hover:border-primary/50 hover:-translate-y-1">
                  <span class="flex items-center gap-2">
                    <span>{t().home.viewFlow}</span>
                    <svg class="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </Button>
              </A>
            </div>

            {/* 信任指标 */}
            <div class="mt-16 flex flex-wrap items-center justify-center gap-8 animate-reveal-up" style={{ "animation-delay": "0.5s" }}>
              {[
                { icon: "⭐", text: t().home.trustIndicators.openSource, color: "text-yellow-500" },
                { icon: "✓", text: t().home.trustIndicators.typescript, color: "text-green-500" },
                { icon: "⚡", text: t().home.trustIndicators.highPerformance, color: "text-blue-500" },
              ].map((item) => (
                <div class="flex items-center gap-2 text-sm text-muted-foreground">
                  <span class={item.color}>{item.icon}</span>
                  <span class="font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 底部渐变 */}
        <div class="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* ========== 统计区域 ========== */}
      <section class="relative py-20 border-y border-border/30">
        <div class="absolute inset-0 bg-gradient-to-b from-muted/20 via-muted/30 to-muted/20" />
        <div class="container relative mx-auto px-4 lg:px-8">
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <For each={stats}>{(stat, i) => <StatCard {...stat} index={i()} />}</For>
          </div>
        </div>
      </section>

      {/* ========== 特性展示 ========== */}
      <section class="relative py-24 sm:py-32 overflow-hidden">
        <FloatingOrb color="bg-blue-500/10" size="w-96 h-96" position={{ top: "10%", left: "5%" }} />
        <FloatingOrb color="bg-purple-500/10" size="w-96 h-96" position={{ bottom: "10%", right: "5%" }} />
        
        <div class="container relative mx-auto px-4 lg:px-8">
          <div class="text-center mb-16">
            <div class="inline-flex items-center gap-2 mb-4 px-5 py-2.5 rounded-full glass-card animate-reveal-up">
              <span class="text-xl">✨</span>
              <span class="text-sm font-semibold text-primary">{t().home.labels.features}</span>
            </div>
            <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent animate-reveal-up" style={{ "animation-delay": "0.1s" }}>
              {t().home.advantages.title}
            </h2>
            <p class="mx-auto max-w-3xl text-lg text-foreground/70 dark:text-foreground/80 animate-reveal-up" style={{ "animation-delay": "0.2s" }}>
              {t().home.advantages.subtitle}
            </p>
          </div>

          <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <For each={features}>{(feature, i) => <FeatureCard {...feature} index={i()} />}</For>
          </div>
        </div>
      </section>

      {/* ========== 组件库展示 ========== */}
      <section class="relative py-24 sm:py-32 border-y border-border/30">
        <div class="absolute inset-0 bg-gradient-to-b from-muted/20 via-muted/30 to-muted/20" />
        
        <div class="container relative mx-auto px-4 lg:px-8">
          <div class="text-center mb-16">
            <div class="inline-flex items-center gap-2 mb-4 px-5 py-2.5 rounded-full glass-card animate-reveal-up">
              <span class="text-xl">📦</span>
              <span class="text-sm font-semibold text-blue-500">{t().home.labels.libraries}</span>
            </div>
            <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground via-blue-500 to-foreground bg-clip-text text-transparent animate-reveal-up" style={{ "animation-delay": "0.1s" }}>
              {t().home.libraries.title}
            </h2>
            <p class="mx-auto max-w-3xl text-lg text-foreground/70 dark:text-foreground/80 animate-reveal-up" style={{ "animation-delay": "0.2s" }}>
              {t().home.libraries.subtitle}
            </p>
          </div>

          <div class="grid gap-8 lg:grid-cols-3">
            <For each={libraries}>{(lib, i) => <LibraryCard {...lib} index={i()} buttonText={t().home.libraries.viewDetails} />}</For>
          </div>

          <div class="mt-16 text-center animate-reveal-up" style={{ "animation-delay": "0.5s" }}>
            <div class="inline-flex items-center gap-2 px-6 py-3 rounded-full glass-card">
              <span class="text-primary">⚡</span>
              <span class="text-sm font-medium text-foreground/70 dark:text-foreground/80">{t().home.labels.updates}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========== 技术栈 ========== */}
      <section class="relative py-24 sm:py-32 overflow-hidden">
        <div class="absolute inset-0 aurora-bg opacity-50" />
        <FloatingOrb color="bg-primary/15" size="w-[500px] h-[500px]" position={{ top: "20%", left: "20%" }} delay={0} />
        <FloatingOrb color="bg-blue-500/15" size="w-[400px] h-[400px]" position={{ bottom: "20%", right: "20%" }} delay={3} />
        
        <div class="container relative mx-auto px-4 lg:px-8">
          <div class="text-center mb-16">
            <div class="inline-flex items-center gap-2 mb-4 px-5 py-2.5 rounded-full glass-card animate-reveal-up">
              <span class="text-xl">🛠️</span>
              <span class="text-sm font-semibold text-primary">{t().home.labels.techStack}</span>
            </div>
            <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent animate-reveal-up" style={{ "animation-delay": "0.1s" }}>
              {t().home.techStack.title}
            </h2>
            <p class="mx-auto max-w-3xl text-lg text-foreground/70 dark:text-foreground/80 animate-reveal-up" style={{ "animation-delay": "0.2s" }}>
              {t().home.techStack.subtitle}
            </p>
          </div>

          <div class="mx-auto max-w-5xl grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <For each={techStack}>{(tech, i) => <TechCard {...tech} index={i()} />}</For>
          </div>

          <div class="mt-16 flex flex-wrap items-center justify-center gap-4 animate-reveal-up" style={{ "animation-delay": "0.6s" }}>
            {[t().home.tags.modern, t().home.tags.performance, t().home.tags.extensible].map((tag, i) => (
              <div class="group flex items-center gap-2.5 px-5 py-2.5 rounded-full glass-card transition-all duration-300 hover:scale-105">
                <div class={`w-3 h-3 rounded-full bg-gradient-to-r ${i === 0 ? 'from-blue-500 to-cyan-500' : i === 1 ? 'from-purple-500 to-pink-500' : 'from-orange-500 to-amber-500'} transition-transform duration-300 group-hover:scale-125`} />
                <span class="text-sm font-medium text-foreground/70 dark:text-foreground/80 group-hover:text-foreground transition-colors">{tag}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== CTA区域 ========== */}
      <section class="relative py-24 sm:py-32 border-t border-border/30 overflow-hidden">
        <div class="absolute inset-0 aurora-bg" />
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl animate-morph" />
        
        <div class="container relative mx-auto px-4 lg:px-8">
          <div class="mx-auto max-w-4xl">
            <div class="relative glass-card rounded-3xl p-12 sm:p-16 overflow-hidden">
              {/* 装饰光效 */}
              <div class="absolute -top-32 -right-32 w-64 h-64 bg-gradient-to-br from-primary/20 to-blue-500/20 rounded-full blur-3xl" />
              <div class="absolute -bottom-32 -left-32 w-64 h-64 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl" />
              
              <div class="relative text-center">
                {/* 图标 */}
                <div class="mb-8 inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-blue-500/20 border border-primary/30 animate-float">
                  <span class="text-4xl">⚡</span>
                </div>

                <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
                  {t().home.cta.title}
                </h2>
                
                <p class="mb-10 text-lg sm:text-xl text-foreground/70 dark:text-foreground/80 max-w-2xl mx-auto">
                  {t().home.cta.subtitle}
                </p>

                <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <A href="/components">
                    <Button size="lg" class="group h-14 px-10 text-base font-semibold shadow-xl shadow-primary/25 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                      <span class="flex items-center gap-2">
                        <span>📦</span>
                        <span>{t().home.cta.browseComponents}</span>
                        <svg class="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </span>
                    </Button>
                  </A>
                  <A href="/docs">
                    <Button size="lg" variant="outline" class="group h-14 px-10 text-base font-semibold border-2 glass-card transition-all duration-300 hover:border-primary/50 hover:-translate-y-1">
                      <span class="flex items-center gap-2">
                        <span>📖</span>
                        <span>{t().home.cta.viewDocs}</span>
                        <svg class="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </Button>
                  </A>
                </div>

                <div class="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-foreground/70 dark:text-foreground/80">
                  {[
                    { color: "text-green-500", text: t().home.footerCTA.free },
                    { color: "text-blue-500", text: t().home.footerCTA.updated },
                    { color: "text-purple-500", text: t().home.footerCTA.community },
                  ].map((item) => (
                    <div class="flex items-center gap-2">
                      <span class={item.color}>✓</span>
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
