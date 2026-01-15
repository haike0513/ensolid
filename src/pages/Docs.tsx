/**
 * Docs 页面 - 专业级重构版本
 */

import type { Component } from "solid-js";
import { createSignal, For, Show } from "solid-js";
import { useI18n } from "@/i18n";
export const DocsPage: Component = () => {
  const { t } = useI18n();
  const [activeSection, setActiveSection] = createSignal("overview");
  const [sidebarOpen, setSidebarOpen] = createSignal(false);

  const sections = [
    { 
      id: "overview", 
      title: t().docs.sections.overview.title,
      icon: "📖",
      category: t().docs.categories.start
    },
    { 
      id: "installation", 
      title: t().docs.sections.installation.title,
      icon: "⚙️",
      category: t().docs.categories.start
    },
    { 
      id: "radix", 
      title: t().docs.sections.radix.title,
      icon: "🎨",
      category: t().docs.categories.components
    },
    { 
      id: "baseui", 
      title: t().docs.sections.baseui.title,
      icon: "🧱",
      category: t().docs.categories.components
    },
    { 
      id: "solidflow", 
      title: t().docs.sections.solidflow.title,
      icon: "🌊",
      category: t().docs.categories.components
    },
    { 
      id: "cli", 
      title: t().docs.sections.cli.title,
      icon: "⌨️",
      category: t().docs.categories.tools
    },
    { 
      id: "ui-components", 
      title: t().docs.sections.uiComponents.title,
      icon: "🎯",
      category: t().docs.categories.guides
    },
    { 
      id: "development", 
      title: t().docs.sections.development.title,
      icon: "💻",
      category: t().docs.categories.guides
    },
  ];

  // 按类别分组
  const groupedSections = () => {
    const groups: Record<string, typeof sections> = {};
    sections.forEach(section => {
      if (!groups[section.category]) {
        groups[section.category] = [];
      }
      groups[section.category].push(section);
    });
    return Object.entries(groups);
  };

  // 代码块组件
  const CodeBlock: Component<{ code: string; language?: string }> = (props) => (
    <div class="group relative my-6">
      <div class="absolute inset-0 bg-gradient-to-r from-primary/5 to-blue-500/5 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <pre class="relative bg-muted/50 backdrop-blur-sm border border-border/50 p-5 rounded-xl overflow-x-auto text-sm group-hover:border-primary/30 transition-colors duration-300">
        <code class="text-foreground/90">{props.code}</code>
      </pre>
      <button class="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-background/80 backdrop-blur-sm border border-border/50 text-xs font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:border-primary">
        复制
      </button>
    </div>
  );

  // 特性卡片组件
  const FeatureCard: Component<{ title: string; desc: string; icon?: string }> = (props) => (
    <div class="group relative p-5 rounded-xl bg-gradient-to-br from-background to-muted/30 border border-border/50 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:-translate-y-1">
      <div class="absolute inset-0 bg-gradient-to-br from-primary/5 to-blue-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div class="relative">
        <Show when={props.icon}>
          <div class="text-3xl mb-3 transition-transform duration-300 group-hover:scale-110">
            {props.icon}
          </div>
        </Show>
        <h4 class="font-semibold text-base mb-2 text-foreground">{props.title}</h4>
        <p class="text-sm text-muted-foreground leading-relaxed">{props.desc}</p>
      </div>
    </div>
  );

  return (
    <div class="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* Hero区域 */}
      <div class="relative border-b bg-gradient-to-br from-background via-primary/5 to-background overflow-hidden">
        <div class="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
        <div class="absolute top-1/2 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-30" />
        <div class="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl opacity-20" />
        
        <div class="container relative mx-auto px-4 lg:px-8 py-16">
          <div class="max-w-3xl">
            <div class="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-primary/10 backdrop-blur-sm border border-primary/20">
              <span class="text-2xl">📚</span>
              <span class="text-sm font-medium text-primary">Documentation</span>
            </div>
            <h1 class="text-5xl lg:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-br from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
              {t().docs.title}
            </h1>
            <p class="text-xl text-muted-foreground leading-relaxed mb-8">
              {t().docs.subtitle}
            </p>
            
            {/* 快速链接 */}
            <div class="flex flex-wrap gap-3">
              <button
                onClick={() => setActiveSection("installation")}
                class="group relative px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 overflow-hidden"
              >
                <div class="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <span class="relative flex items-center gap-2">
                  <span>{t().docs.quickStart}</span>
                  <svg class="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>
              <button
                onClick={() => setActiveSection("overview")}
                class="group px-6 py-2.5 rounded-lg border border-border/50 bg-background/50 backdrop-blur-sm font-medium transition-all duration-300 hover:bg-accent hover:border-primary/30 hover:-translate-y-0.5"
              >
                <span class="flex items-center gap-2">
                  <span>{t().docs.projectOverview}</span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="container mx-auto px-4 lg:px-8 py-12">
        <div class="max-w-7xl mx-auto">
          <div class="flex gap-8 lg:gap-12">
            {/* 侧边栏导航 - 重新设计 */}
            <aside class="w-72 flex-shrink-0 hidden lg:block">
              <div class="sticky top-24 space-y-6">
                {/* 进度指示器 */}
                <div class="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                  <div class="flex items-center gap-2 mb-2">
                    <div class="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span class="text-sm font-medium text-foreground">{t().docs.currentReading}</span>
                  </div>
                  <p class="text-xs text-muted-foreground">
                    {sections.find(s => s.id === activeSection())?.title}
                  </p>
                </div>

                {/* 导航菜单 */}
                <nav class="space-y-6">
                  <For each={groupedSections()}>
                    {([category, items]) => (
                      <div>
                        <h3 class="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3">
                          {category}
                        </h3>
                        <div class="space-y-1">
                          <For each={items}>
                            {(section) => (
                              <button
                                onClick={() => setActiveSection(section.id)}
                                class={`group w-full text-left px-3 py-2.5 rounded-lg transition-all duration-300 relative ${
                                  activeSection() === section.id
                                    ? "bg-primary/10 text-foreground font-medium border border-primary/20 shadow-sm"
                                    : "hover:bg-accent text-muted-foreground hover:text-foreground"
                                }`}
                              >
                                {/* 活动指示器 */}
                                <Show when={activeSection() === section.id}>
                                  <div class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-primary to-primary/50 rounded-r-full" />
                                </Show>
                                
                                <span class="flex items-center gap-3">
                                  <span class="text-lg transition-transform duration-300 group-hover:scale-110">
                                    {section.icon}
                                  </span>
                                  <span class="text-sm">{section.title}</span>
                                </span>

                                {/* 悬停箭头 */}
                                <div class="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1">
                                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                                  </svg>
                                </div>
                              </button>
                            )}
                          </For>
                        </div>
                      </div>
                    )}
                  </For>
                </nav>

                {/* 帮助卡片 */}
                <div class="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20">
                  <div class="flex items-start gap-3">
                    <div class="text-2xl">💡</div>
                    <div>
                      <h4 class="text-sm font-semibold mb-1">{t().docs.needHelp}</h4>
                      <p class="text-xs text-muted-foreground mb-2">
                        {t().docs.helpDesc}
                      </p>
                      <a 
                        href="https://github.com/haike0513/ensolid"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                      >
                        <span>{t().docs.visitGithub}</span>
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            {/* 移动端侧边栏按钮 */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen())}
              class="lg:hidden fixed bottom-6 right-6 z-40 p-4 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl transition-all duration-300 hover:scale-110"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* 内容区域 - 重新设计 */}
            <div class="flex-1 min-w-0">
              <div class="prose-custom max-w-none">
                {/* 项目概述 */}
                {activeSection() === "overview" && (
                  <article class="space-y-8 animate-fade-in">
                    <header class="pb-6 border-b border-border/50">
                      <div class="flex items-center gap-3 mb-4">
                        <div class="text-4xl">📖</div>
                        <h2 class="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                          {t().docs.sections.overview.title}
                        </h2>
                      </div>
                      <p class="text-lg text-muted-foreground">
                        {t().docs.sections.overview.description}
                      </p>
                    </header>

                    <section class="space-y-6">
                      <div class="p-6 rounded-xl bg-gradient-to-br from-primary/10 via-blue-500/5 to-purple-500/10 border border-primary/20">
                        <p class="text-base leading-relaxed text-foreground/90">
                          <strong class="text-primary">Ensolid</strong> {t().docs.content.overview.intro1}
                          <br />
                          {t().docs.content.overview.intro2}
                        </p>
                        <p class="text-base leading-relaxed text-foreground/90 mt-4">
                          {t().docs.content.overview.intro3}
                        </p>
                      </div>

                      <div>
                        <h3 class="text-2xl font-bold mb-6 flex items-center gap-2">
                          <span class="text-2xl">✨</span>
                          <span>{t().docs.content.overview.featuresTitle}</span>
                        </h3>
                        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                          <FeatureCard
                            icon="📘"
                            title={t().docs.content.overview.features.typescript.title}
                            desc={t().docs.content.overview.features.typescript.desc}
                          />
                          <FeatureCard
                            icon="🚀"
                            title={t().docs.content.overview.features.ssr.title}
                            desc={t().docs.content.overview.features.ssr.desc}
                          />
                          <FeatureCard
                            icon="🌳"
                            title={t().docs.content.overview.features.treeShaking.title}
                            desc={t().docs.content.overview.features.treeShaking.desc}
                          />
                          <FeatureCard
                            icon="📦"
                            title={t().docs.content.overview.features.monorepo.title}
                            desc={t().docs.content.overview.features.monorepo.desc}
                          />
                          <FeatureCard
                            icon="🎯"
                            title={t().docs.content.overview.features.customizable.title}
                            desc={t().docs.content.overview.features.customizable.desc}
                          />
                          <FeatureCard
                            icon="⚡"
                            title={t().docs.content.overview.features.performance.title}
                            desc={t().docs.content.overview.features.performance.desc}
                          />
                        </div>
                      </div>

                      <div>
                        <h3 class="text-2xl font-bold mb-6 flex items-center gap-2">
                          <span class="text-2xl">📚</span>
                          <span>{t().docs.content.overview.librariesTitle}</span>
                        </h3>
                        <div class="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                          <div class="group relative overflow-hidden rounded-xl bg-gradient-to-br from-background to-muted/30 border border-border/50 p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:-translate-y-1">
                            <div class="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <div class="relative">
                              <div class="text-3xl mb-3">🎨</div>
                              <h4 class="text-lg font-semibold mb-2">@ensolid/radix</h4>
                              <p class="text-sm text-muted-foreground leading-relaxed">
                                {t().docs.content.overview.radixDesc}
                              </p>
                              <div class="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary group-hover:gap-2 transition-all duration-300">
                                <span>{t().docs.content.overview.learnMore}</span>
                                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                                </svg>
                              </div>
                            </div>
                          </div>
                          
                          <div class="group relative overflow-hidden rounded-xl bg-gradient-to-br from-background to-muted/30 border border-border/50 p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:-translate-y-1">
                            <div class="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <div class="relative">
                              <div class="text-3xl mb-3">🧱</div>
                              <h4 class="text-lg font-semibold mb-2">@ensolid/baseui</h4>
                              <p class="text-sm text-muted-foreground leading-relaxed">
                                {t().docs.content.overview.baseuiDesc}
                              </p>
                              <div class="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary group-hover:gap-2 transition-all duration-300">
                                <span>{t().docs.content.overview.learnMore}</span>
                                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                                </svg>
                              </div>
                            </div>
                          </div>
                          
                          <div class="group relative overflow-hidden rounded-xl bg-gradient-to-br from-background to-muted/30 border border-border/50 p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:-translate-y-1">
                            <div class="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <div class="relative">
                              <div class="text-3xl mb-3">🌊</div>
                              <h4 class="text-lg font-semibold mb-2">@ensolid/solidflow</h4>
                              <p class="text-sm text-muted-foreground leading-relaxed">
                                {t().docs.content.overview.solidflowDesc}
                              </p>
                              <div class="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary group-hover:gap-2 transition-all duration-300">
                                <span>{t().docs.content.overview.learnMore}</span>
                                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                                </svg>
                              </div>
                            </div>
                          </div>
                          
                          <div onClick={() => setActiveSection("cli")} class="cursor-pointer group relative overflow-hidden rounded-xl bg-gradient-to-br from-background to-muted/30 border border-border/50 p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:-translate-y-1">
                            <div class="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <div class="relative">
                              <div class="text-3xl mb-3">⌨️</div>
                              <h4 class="text-lg font-semibold mb-2">@ensolid/cli</h4>
                              <p class="text-sm text-muted-foreground leading-relaxed">
                                {t().docs.content.overview.cliDesc}
                              </p>
                              <div class="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary group-hover:gap-2 transition-all duration-300">
                                <span>{t().docs.content.overview.learnMore}</span>
                                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>
                  </article>
                )}

                {/* 安装指南 */}
                {activeSection() === "installation" && (
                  <article class="space-y-8 animate-fade-in">
                    <header class="pb-6 border-b border-border/50">
                      <div class="flex items-center gap-3 mb-4">
                        <div class="text-4xl">⚙️</div>
                        <h2 class="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                          {t().docs.sections.installation.title}
                        </h2>
                      </div>
                      <p class="text-lg text-muted-foreground">
                        {t().docs.sections.installation.description}
                      </p>
                    </header>

                    <section class="space-y-8">
                      <div>
                        <h3 class="text-2xl font-bold mb-4 flex items-center gap-2">
                          <span>📋</span>
                          <span>{t().docs.content.installation.requirementsTitle}</span>
                        </h3>
                        <div class="grid gap-3 sm:grid-cols-3">
                          <div class="p-4 rounded-lg bg-muted/50 border border-border/50">
                            <div class="text-2xl mb-2">📗</div>
                            <div class="font-semibold text-sm mb-1">Node.js</div>
                            <div class="text-xs text-muted-foreground">{t().docs.content.installation.requirements.node}</div>
                          </div>
                          <div class="p-4 rounded-lg bg-muted/50 border border-border/50">
                            <div class="text-2xl mb-2">📦</div>
                            <div class="font-semibold text-sm mb-1">pnpm</div>
                            <div class="text-xs text-muted-foreground">{t().docs.content.installation.requirements.pnpm}</div>
                          </div>
                          <div class="p-4 rounded-lg bg-muted/50 border border-border/50">
                            <div class="text-2xl mb-2">⚛️</div>
                            <div class="font-semibold text-sm mb-1">SolidJS</div>
                            <div class="text-xs text-muted-foreground">{t().docs.content.installation.requirements.solid}</div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 class="text-2xl font-bold mb-4">{t().docs.content.installation.installPnpm}</h3>
                        <p class="mb-4 text-muted-foreground">{t().docs.content.installation.installPnpmDesc}</p>
                        <CodeBlock code="npm install -g pnpm" language="bash" />
                      </div>

                      <div>
                        <h3 class="text-2xl font-bold mb-4">{t().docs.content.installation.cloneProject}</h3>
                        <CodeBlock code={`git clone https://github.com/your-org/ensolid.git
cd ensolid`} language="bash" />
                      </div>

                      <div>
                        <h3 class="text-2xl font-bold mb-4">{t().docs.content.installation.installDeps}</h3>
                        <CodeBlock code="pnpm install" language="bash" />
                      </div>

                      <div>
                        <h3 class="text-2xl font-bold mb-4">{t().docs.content.installation.devMode}</h3>
                        <p class="mb-4 text-muted-foreground">{t().docs.content.installation.startDevDesc}</p>
                        <CodeBlock code="pnpm dev" language="bash" />
                        <div class="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-start gap-3">
                          <div class="text-xl">💡</div>
                          <div>
                            <p class="text-sm font-medium mb-1">{t().docs.content.installation.tip}</p>
                            <p class="text-xs text-muted-foreground">
                              {t().docs.content.installation.devServerTip} <code class="px-2 py-0.5 rounded bg-muted text-primary text-xs">http://localhost:5173</code>
                            </p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 class="text-2xl font-bold mb-4">{t().docs.content.installation.buildProject}</h3>
                        <p class="mb-4 text-muted-foreground">{t().docs.content.installation.buildAll}</p>
                        <CodeBlock code="pnpm build" language="bash" />
                        <p class="mb-4 mt-6 text-muted-foreground">{t().docs.content.installation.buildSingle}</p>
                        <CodeBlock code={`pnpm build:radix
pnpm build:baseui
pnpm build:solidflow`} language="bash" />
                      </div>
                    </section>
                  </article>
                )}

                {/* @ensolid/radix */}
                {activeSection() === "radix" && (
                  <article class="space-y-8 animate-fade-in">
                    <header class="pb-6 border-b border-border/50">
                      <div class="flex items-center gap-3 mb-4">
                        <div class="text-4xl">🎨</div>
                        <h2 class="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                          @ensolid/radix
                        </h2>
                      </div>
                      <p class="text-lg text-muted-foreground">
                        无样式、可访问的基础组件库
                      </p>
                    </header>

                    <section class="space-y-8">
                      <div class="p-6 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
                        <p class="text-base leading-relaxed">
                          <code class="px-2 py-1 rounded bg-background/80 text-primary font-mono text-sm">@ensolid/radix</code> 是基于{" "}
                          <a
                            href="https://www.radix-ui.com/primitives"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="text-primary hover:underline font-medium"
                          >
                            Radix UI Primitives
                          </a>{" "}
                          移植的 SolidJS 版本，提供无样式、可访问的基础组件。
                        </p>
                      </div>

                      <div>
                        <h3 class="text-2xl font-bold mb-4">安装</h3>
                        <CodeBlock code="pnpm add @ensolid/radix" language="bash" />
                      </div>

                      <div>
                        <h3 class="text-2xl font-bold mb-4">基本使用</h3>
                        <p class="mb-4 text-muted-foreground">导入组件：</p>
                        <CodeBlock code={`import { Dialog, Button } from "@ensolid/radix";`} language="typescript" />
                        <p class="mb-4 mt-6 text-muted-foreground">使用示例：</p>
                        <CodeBlock code={`import { Dialog } from "@ensolid/radix";

function App() {
  return (
    <Dialog>
      <Dialog.Trigger>打开对话框</Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Title>标题</Dialog.Title>
        <Dialog.Description>描述</Dialog.Description>
      </Dialog.Content>
    </Dialog>
  );
}`} language="typescript" />
                      </div>

                      <div>
                        <h3 class="text-2xl font-bold mb-4">核心特点</h3>
                        <div class="grid gap-4 sm:grid-cols-2">
                          <FeatureCard
                            icon="♿"
                            title="可访问性"
                            desc="完整的 ARIA 属性支持，符合 WAI-ARIA 规范"
                          />
                          <FeatureCard
                            icon="🎨"
                            title="无样式设计"
                            desc="完全可定制，不包含任何默认样式"
                          />
                          <FeatureCard
                            icon="🎯"
                            title="双模式支持"
                            desc="同时支持受控和非受控模式"
                          />
                          <FeatureCard
                            icon="📘"
                            title="类型安全"
                            desc="完整的 TypeScript 类型定义"
                          />
                        </div>
                      </div>

                      <div>
                        <h3 class="text-2xl font-bold mb-6">可用组件</h3>
                        <div class="grid gap-3 sm:grid-cols-2">
                          <div class="p-4 rounded-lg bg-muted/30 border border-border/50">
                            <div class="font-semibold text-sm mb-2 text-primary">基础组件</div>
                            <div class="text-sm text-muted-foreground">Separator, Label, AspectRatio</div>
                          </div>
                          <div class="p-4 rounded-lg bg-muted/30 border border-border/50">
                            <div class="font-semibold text-sm mb-2 text-primary">表单组件</div>
                            <div class="text-sm text-muted-foreground">Checkbox, Switch, RadioGroup, Select, Slider, Toggle</div>
                          </div>
                          <div class="p-4 rounded-lg bg-muted/30 border border-border/50">
                            <div class="font-semibold text-sm mb-2 text-primary">布局组件</div>
                            <div class="text-sm text-muted-foreground">Tabs, Accordion, Collapsible, ScrollArea</div>
                          </div>
                          <div class="p-4 rounded-lg bg-muted/30 border border-border/50">
                            <div class="font-semibold text-sm mb-2 text-primary">弹出层组件</div>
                            <div class="text-sm text-muted-foreground">Dialog, AlertDialog, Popover, DropdownMenu, Tooltip</div>
                          </div>
                        </div>
                      </div>
                    </section>
                  </article>
                )}

                {/* @ensolid/baseui */}
                {activeSection() === "baseui" && (
                  <article class="space-y-8 animate-fade-in">
                    <header class="pb-6 border-b border-border/50">
                      <div class="flex items-center gap-3 mb-4">
                        <div class="text-4xl">🧱</div>
                        <h2 class="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                          @ensolid/baseui
                        </h2>
                      </div>
                      <p class="text-lg text-muted-foreground">
                        企业级 UI 组件库
                      </p>
                    </header>

                    <section class="space-y-8">
                      <div class="p-6 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                        <p class="text-base leading-relaxed">
                          <code class="px-2 py-1 rounded bg-background/80 text-primary font-mono text-sm">@ensolid/baseui</code> 是基于{" "}
                          <a
                            href="https://baseui.org/"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="text-primary hover:underline font-medium"
                          >
                            BaseUI
                          </a>{" "}
                          移植的 SolidJS 版本，提供企业级 UI 组件库。
                        </p>
                      </div>

                      <div>
                        <h3 class="text-2xl font-bold mb-4">安装</h3>
                        <CodeBlock code="pnpm add @ensolid/baseui" language="bash" />
                      </div>

                      <div>
                        <h3 class="text-2xl font-bold mb-4">基本使用</h3>
                        <CodeBlock code={`import { Button, Card, CardContent } from "@ensolid/baseui";

function App() {
  return (
    <Card>
      <CardContent>
        <Button variant="contained">点击我</Button>
      </CardContent>
    </Card>
  );
}`} language="typescript" />
                      </div>

                      <div>
                        <h3 class="text-2xl font-bold mb-4">核心特点</h3>
                        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                          <FeatureCard
                            icon="🎁"
                            title="丰富组件"
                            desc="提供 59+ 个企业级组件"
                          />
                          <FeatureCard
                            icon="🎨"
                            title="Material Design"
                            desc="遵循 Material Design 设计规范"
                          />
                          <FeatureCard
                            icon="🎯"
                            title="主题系统"
                            desc="完整的主题定制支持"
                          />
                          <FeatureCard
                            icon="📊"
                            title="企业组件"
                            desc="表格、分页、步进器等"
                          />
                          <FeatureCard
                            icon="📘"
                            title="类型支持"
                            desc="完整的 TypeScript 定义"
                          />
                          <FeatureCard
                            icon="⚡"
                            title="高性能"
                            desc="优化的渲染性能"
                          />
                        </div>
                      </div>
                    </section>
                  </article>
                )}

                {/* @ensolid/solidflow */}
                {activeSection() === "solidflow" && (
                  <article class="space-y-8 animate-fade-in">
                    <header class="pb-6 border-b border-border/50">
                      <div class="flex items-center gap-3 mb-4">
                        <div class="text-4xl">🌊</div>
                        <h2 class="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                          @ensolid/solidflow
                        </h2>
                      </div>
                      <p class="text-lg text-muted-foreground">
                        强大的流程图和节点编辑器
                      </p>
                    </header>

                    <section class="space-y-8">
                      <div class="p-6 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20">
                        <p class="text-base leading-relaxed">
                          <code class="px-2 py-1 rounded bg-background/80 text-primary font-mono text-sm">@ensolid/solidflow</code> 是基于{" "}
                          <a
                            href="https://reactflow.dev/"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="text-primary hover:underline font-medium"
                          >
                            React Flow
                          </a>{" "}
                          移植的 SolidJS 版本，提供流程图和节点编辑器功能。
                        </p>
                      </div>

                      <div>
                        <h3 class="text-2xl font-bold mb-4">安装</h3>
                        <CodeBlock code="pnpm add @ensolid/solidflow" language="bash" />
                      </div>

                      <div>
                        <h3 class="text-2xl font-bold mb-4">基本使用</h3>
                        <CodeBlock code={`import { createSignal } from "solid-js";
import { Flow, Node, Edge } from "@ensolid/solidflow";

function App() {
  const [nodes, setNodes] = createSignal([
    { id: "1", position: { x: 0, y: 0 }, data: { label: "节点 1" } },
    { id: "2", position: { x: 200, y: 100 }, data: { label: "节点 2" } },
  ]);
  
  const [edges, setEdges] = createSignal([
    { id: "e1-2", source: "1", target: "2" },
  ]);

  return (
    <Flow nodes={nodes()} edges={edges()}>
      <For each={nodes()}>{(node) => <Node {...node} />}</For>
      <For each={edges()}>{(edge) => <Edge {...edge} />}</For>
    </Flow>
  );
}`} language="typescript" />
                      </div>

                      <div>
                        <h3 class="text-2xl font-bold mb-4">核心特点</h3>
                        <div class="grid gap-4 sm:grid-cols-2">
                          <FeatureCard
                            icon="⚡"
                            title="高性能渲染"
                            desc="优化的节点图渲染引擎"
                          />
                          <FeatureCard
                            icon="🎨"
                            title="自定义节点"
                            desc="支持完全自定义节点和边"
                          />
                          <FeatureCard
                            icon="🖱️"
                            title="交互式操作"
                            desc="支持拖拽、缩放等交互"
                          />
                          <FeatureCard
                            icon="🔧"
                            title="工作流编辑"
                            desc="适合构建复杂的工作流编辑器"
                          />
                        </div>
                      </div>
                    </section>
                  </article>
                )}

                {/* @ensolid/cli */}
                {activeSection() === "cli" && (
                  <article class="space-y-8 animate-fade-in">
                    <header class="pb-6 border-b border-border/50">
                      <div class="flex items-center gap-3 mb-4">
                        <div class="text-4xl">⌨️</div>
                        <h2 class="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                          @ensolid/cli
                        </h2>
                      </div>
                      <p class="text-lg text-muted-foreground">
                        命令行工具，快速添加组件到你的项目
                      </p>
                    </header>

                    <section class="space-y-8">
                      <div class="p-6 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20">
                        <p class="text-base leading-relaxed">
                          <code class="px-2 py-1 rounded bg-background/80 text-primary font-mono text-sm">@ensolid/cli</code> 是一个命令行工具，
                          灵感来自{" "}
                          <a
                            href="https://ui.shadcn.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="text-primary hover:underline font-medium"
                          >
                            shadcn/ui
                          </a>
                          ，让你可以轻松地将美观、可访问的 SolidJS 组件添加到你的项目中。
                        </p>
                      </div>

                      <div>
                        <h3 class="text-2xl font-bold mb-4">核心特点</h3>
                        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                          <FeatureCard
                            icon="🚀"
                            title="快速初始化"
                            desc="一键初始化项目配置，自动检测框架"
                          />
                          <FeatureCard
                            icon="📦"
                            title="按需添加"
                            desc="只添加你需要的组件，而不是整个库"
                          />
                          <FeatureCard
                            icon="🔄"
                            title="依赖解析"
                            desc="自动解析和安装组件依赖"
                          />
                          <FeatureCard
                            icon="📝"
                            title="完全控制"
                            desc="组件代码直接复制到项目中，可自由修改"
                          />
                          <FeatureCard
                            icon="🔍"
                            title="差异检查"
                            desc="检查本地组件与注册表的更新差异"
                          />
                          <FeatureCard
                            icon="📋"
                            title="组件列表"
                            desc="查看所有可用组件及安装状态"
                          />
                        </div>
                      </div>

                      <div>
                        <h3 class="text-2xl font-bold mb-4 flex items-center gap-2">
                          <span>🚀</span>
                          <span>快速开始</span>
                        </h3>
                        
                        <div class="space-y-6">
                          <div>
                            <h4 class="text-lg font-semibold mb-3">1. 初始化项目</h4>
                            <p class="mb-3 text-muted-foreground">在你的 SolidJS 项目中运行：</p>
                            <CodeBlock code="npx @ensolid/cli init" language="bash" />
                            <p class="mt-3 text-sm text-muted-foreground">
                              这将自动检测你的项目配置，并创建 <code class="px-1.5 py-0.5 rounded bg-muted text-primary text-xs">ensolid.json</code> 配置文件。
                            </p>
                          </div>

                          <div>
                            <h4 class="text-lg font-semibold mb-3">2. 添加组件</h4>
                            <p class="mb-3 text-muted-foreground">添加你需要的组件：</p>
                            <CodeBlock code="npx @ensolid/cli add button" language="bash" />
                            <p class="mt-3 text-sm text-muted-foreground">组件将被添加到你配置的目录中。</p>
                          </div>

                          <div>
                            <h4 class="text-lg font-semibold mb-3">3. 使用组件</h4>
                            <CodeBlock code={`import { Button } from "@/components/ui/button";

function App() {
  return (
    <Button variant="default">
      点击我
    </Button>
  );
}`} language="typescript" />
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 class="text-2xl font-bold mb-4 flex items-center gap-2">
                          <span>📖</span>
                          <span>命令详解</span>
                        </h3>

                        <div class="space-y-6">
                          {/* init 命令 */}
                          <div class="p-5 rounded-xl bg-muted/30 border border-border/50">
                            <div class="flex items-center gap-2 mb-3">
                              <code class="px-3 py-1.5 rounded bg-primary/10 text-primary font-mono text-sm font-bold">init</code>
                              <span class="text-sm text-muted-foreground">初始化项目配置</span>
                            </div>
                            <CodeBlock code={`npx @ensolid/cli init [options]

# 选项
-y, --yes        跳过确认提示
-d, --defaults   使用默认配置
-f, --force      强制覆盖现有配置
-c, --cwd <cwd>  指定工作目录`} language="bash" />
                            <p class="mt-3 text-sm text-muted-foreground">
                              初始化时会自动检测项目类型、TypeScript 配置、路径别名等，并创建必要的目录和文件。
                            </p>
                          </div>

                          {/* add 命令 */}
                          <div class="p-5 rounded-xl bg-muted/30 border border-border/50">
                            <div class="flex items-center gap-2 mb-3">
                              <code class="px-3 py-1.5 rounded bg-primary/10 text-primary font-mono text-sm font-bold">add</code>
                              <span class="text-sm text-muted-foreground">添加组件到项目</span>
                            </div>
                            <CodeBlock code={`npx @ensolid/cli add [components...] [options]

# 添加单个组件
npx @ensolid/cli add button

# 添加多个组件
npx @ensolid/cli add button card dialog

# 添加所有组件
npx @ensolid/cli add --all

# 选项
-y, --yes          跳过确认提示
-o, --overwrite    覆盖已存在的文件
-a, --all          添加所有可用组件
-p, --path <path>  指定组件安装路径`} language="bash" />
                            <div class="mt-4 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-start gap-2">
                              <div class="text-lg">💡</div>
                              <p class="text-sm text-muted-foreground">
                                添加组件时会自动解析依赖关系，安装必要的 npm 包，并转换导入路径以匹配你的项目配置。
                              </p>
                            </div>
                          </div>

                          {/* list 命令 */}
                          <div class="p-5 rounded-xl bg-muted/30 border border-border/50">
                            <div class="flex items-center gap-2 mb-3">
                              <code class="px-3 py-1.5 rounded bg-primary/10 text-primary font-mono text-sm font-bold">list</code>
                              <span class="text-sm text-muted-foreground">列出可用组件</span>
                            </div>
                            <CodeBlock code={`npx @ensolid/cli list [options]

# 查看所有组件
npx @ensolid/cli list

# 只显示已安装的组件
npx @ensolid/cli list --installed

# 只显示未安装的组件
npx @ensolid/cli list --available`} language="bash" />
                          </div>

                          {/* diff 命令 */}
                          <div class="p-5 rounded-xl bg-muted/30 border border-border/50">
                            <div class="flex items-center gap-2 mb-3">
                              <code class="px-3 py-1.5 rounded bg-primary/10 text-primary font-mono text-sm font-bold">diff</code>
                              <span class="text-sm text-muted-foreground">检查组件更新</span>
                            </div>
                            <CodeBlock code={`npx @ensolid/cli diff [component]

# 检查所有组件的更新
npx @ensolid/cli diff

# 检查特定组件的更新
npx @ensolid/cli diff button`} language="bash" />
                            <p class="mt-3 text-sm text-muted-foreground">
                              差异检查会比较本地组件与注册表版本，帮助你了解哪些组件有更新可用。
                            </p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 class="text-2xl font-bold mb-4 flex items-center gap-2">
                          <span>⚙️</span>
                          <span>配置文件</span>
                        </h3>
                        <p class="mb-4 text-muted-foreground">
                          初始化后会在项目根目录创建 <code class="px-1.5 py-0.5 rounded bg-muted text-primary text-xs">ensolid.json</code> 配置文件：
                        </p>
                        <CodeBlock code={`{
  "$schema": "https://ensolid.dev/schema.json",
  "style": "default",
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "src/index.css",
    "baseColor": "slate",
    "cssVariables": true
  },
  "registry": "https://raw.githubusercontent.com/haike0513/ensolid/main/public/registry",
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}`} language="json" />
                        
                        <div class="mt-6 grid gap-3 sm:grid-cols-2">
                          <div class="p-4 rounded-lg bg-muted/30 border border-border/50">
                            <div class="font-semibold text-sm mb-2 text-primary">tailwind</div>
                            <div class="text-xs text-muted-foreground">Tailwind CSS 相关配置，包括配置文件路径、CSS 文件、基础颜色等</div>
                          </div>
                          <div class="p-4 rounded-lg bg-muted/30 border border-border/50">
                            <div class="font-semibold text-sm mb-2 text-primary">aliases</div>
                            <div class="text-xs text-muted-foreground">路径别名配置，用于转换组件中的导入路径</div>
                          </div>
                          <div class="p-4 rounded-lg bg-muted/30 border border-border/50">
                            <div class="font-semibold text-sm mb-2 text-primary">registry</div>
                            <div class="text-xs text-muted-foreground">组件注册表 URL，可以使用自定义注册表</div>
                          </div>
                          <div class="p-4 rounded-lg bg-muted/30 border border-border/50">
                            <div class="font-semibold text-sm mb-2 text-primary">tsx</div>
                            <div class="text-xs text-muted-foreground">是否使用 TypeScript，影响组件文件扩展名</div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 class="text-2xl font-bold mb-4 flex items-center gap-2">
                          <span>📦</span>
                          <span>可用组件</span>
                        </h3>
                        <p class="mb-4 text-muted-foreground">
                          当前注册表包含 30+ 个组件，涵盖常见的 UI 需求：
                        </p>
                        <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                          <div class="p-3 rounded-lg bg-muted/30 border border-border/50 text-center">
                            <span class="text-sm font-medium">Button</span>
                          </div>
                          <div class="p-3 rounded-lg bg-muted/30 border border-border/50 text-center">
                            <span class="text-sm font-medium">Dialog</span>
                          </div>
                          <div class="p-3 rounded-lg bg-muted/30 border border-border/50 text-center">
                            <span class="text-sm font-medium">Card</span>
                          </div>
                          <div class="p-3 rounded-lg bg-muted/30 border border-border/50 text-center">
                            <span class="text-sm font-medium">Dropdown Menu</span>
                          </div>
                          <div class="p-3 rounded-lg bg-muted/30 border border-border/50 text-center">
                            <span class="text-sm font-medium">Tabs</span>
                          </div>
                          <div class="p-3 rounded-lg bg-muted/30 border border-border/50 text-center">
                            <span class="text-sm font-medium">Accordion</span>
                          </div>
                          <div class="p-3 rounded-lg bg-muted/30 border border-border/50 text-center">
                            <span class="text-sm font-medium">Tooltip</span>
                          </div>
                          <div class="p-3 rounded-lg bg-muted/30 border border-border/50 text-center">
                            <span class="text-sm font-medium">更多...</span>
                          </div>
                        </div>
                        <p class="mt-4 text-sm text-muted-foreground">
                          运行 <code class="px-1.5 py-0.5 rounded bg-muted text-primary text-xs">npx @ensolid/cli list</code> 查看完整列表。
                        </p>
                      </div>

                      <div class="p-6 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20">
                        <div class="flex items-start gap-3">
                          <div class="text-2xl">🎉</div>
                          <div>
                            <h4 class="font-semibold text-base mb-2">立即开始</h4>
                            <p class="text-sm text-muted-foreground mb-3">
                              在你的 SolidJS 项目中运行以下命令开始使用：
                            </p>
                            <CodeBlock code="npx @ensolid/cli init && npx @ensolid/cli add button" language="bash" />
                          </div>
                        </div>
                      </div>
                    </section>
                  </article>
                )}

                {/* UI 组件 */}
                {activeSection() === "ui-components" && (
                  <article class="space-y-8 animate-fade-in">
                    <header class="pb-6 border-b border-border/50">
                      <div class="flex items-center gap-3 mb-4">
                        <div class="text-4xl">🎯</div>
                        <h2 class="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                          UI 组件
                        </h2>
                      </div>
                      <p class="text-lg text-muted-foreground">
                        shadcn/ui 风格的样式化组件
                      </p>
                    </header>

                    <section class="space-y-8">
                      <div class="p-6 rounded-xl bg-gradient-to-br from-primary/10 to-blue-500/10 border border-primary/20">
                        <p class="text-base leading-relaxed">
                          本项目还提供了基于 <code class="px-2 py-1 rounded bg-background/80 text-primary font-mono text-sm">@ensolid/radix</code> 实现的
                          shadcn/ui 风格组件库，提供开箱即用的样式化组件。
                        </p>
                      </div>

                      <div>
                        <h3 class="text-2xl font-bold mb-4">核心特点</h3>
                        <div class="grid gap-4 sm:grid-cols-2">
                          <FeatureCard
                            icon="🎨"
                            title="现代设计"
                            desc="基于 Tailwind CSS 的现代设计系统"
                          />
                          <FeatureCard
                            icon="🎯"
                            title="完全可定制"
                            desc="支持完全自定义样式和主题"
                          />
                          <FeatureCard
                            icon="✨"
                            title="设计规范"
                            desc="与 shadcn/ui 设计规范保持一致"
                          />
                          <FeatureCard
                            icon="🚀"
                            title="开箱即用"
                            desc="无需配置，直接使用美观界面"
                          />
                        </div>
                      </div>

                      <div>
                        <h3 class="text-2xl font-bold mb-4">使用方式</h3>
                        <p class="mb-4 text-muted-foreground">
                          这些组件位于 <code class="px-2 py-1 rounded bg-muted text-primary text-sm">src/components/ui/</code> 目录下，
                          可以直接复制到你的项目中使用。
                        </p>
                        <CodeBlock code={`import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";

function App() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>打开对话框</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>标题</DialogTitle>
          <DialogDescription>描述</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}`} language="typescript" />
                      </div>
                    </section>
                  </article>
                )}

                {/* 开发指南 */}
                {activeSection() === "development" && (
                  <article class="space-y-8 animate-fade-in">
                    <header class="pb-6 border-b border-border/50">
                      <div class="flex items-center gap-3 mb-4">
                        <div class="text-4xl">💻</div>
                        <h2 class="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                          开发指南
                        </h2>
                      </div>
                      <p class="text-lg text-muted-foreground">
                        贡献代码和添加新组件
                      </p>
                    </header>

                    <section class="space-y-8">
                      <div>
                        <h3 class="text-2xl font-bold mb-4">项目结构</h3>
                        <CodeBlock code={`ensolid/
├── packages/                    # Monorepo 包目录
│   ├── radix/                  # Radix UI Primitives 移植
│   ├── baseui/                 # BaseUI 组件库
│   ├── solidflow/              # SolidFlow 组件库
│   └── cli/                    # CLI 命令行工具
├── public/
│   └── registry/               # 组件注册表
├── src/                        # 源代码目录
│   ├── components/
│   │   └── ui/                 # shadcn/ui 风格组件
│   ├── examples/               # 组件示例
│   └── pages/                  # 页面组件
├── package.json
└── vite.config.ts`} language="text" />
                      </div>

                      <div>
                        <h3 class="text-2xl font-bold mb-4">开发命令</h3>
                        <div class="space-y-3">
                          <div class="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/50">
                            <code class="px-3 py-1.5 rounded bg-background text-primary font-mono text-sm">pnpm dev</code>
                            <span class="text-sm text-muted-foreground">启动开发服务器</span>
                          </div>
                          <div class="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/50">
                            <code class="px-3 py-1.5 rounded bg-background text-primary font-mono text-sm">pnpm build</code>
                            <span class="text-sm text-muted-foreground">构建所有包</span>
                          </div>
                          <div class="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/50">
                            <code class="px-3 py-1.5 rounded bg-background text-primary font-mono text-sm">pnpm build:radix</code>
                            <span class="text-sm text-muted-foreground">构建 @ensolid/radix</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 class="text-2xl font-bold mb-4">添加新组件</h3>
                        <div class="space-y-3">
                          <div class="flex gap-3 p-4 rounded-lg bg-muted/30 border border-border/50">
                            <div class="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">1</div>
                            <div>
                              <div class="font-medium mb-1">在对应的包目录下创建组件文件</div>
                              <div class="text-sm text-muted-foreground">选择合适的包目录创建新组件</div>
                            </div>
                          </div>
                          <div class="flex gap-3 p-4 rounded-lg bg-muted/30 border border-border/50">
                            <div class="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">2</div>
                            <div>
                              <div class="font-medium mb-1">在 src/index.ts 中导出组件</div>
                              <div class="text-sm text-muted-foreground">确保组件可以被外部使用</div>
                            </div>
                          </div>
                          <div class="flex gap-3 p-4 rounded-lg bg-muted/30 border border-border/50">
                            <div class="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">3</div>
                            <div>
                              <div class="font-medium mb-1">创建样式化包装（如需要）</div>
                              <div class="text-sm text-muted-foreground">在 src/components/ui/ 添加样式</div>
                            </div>
                          </div>
                          <div class="flex gap-3 p-4 rounded-lg bg-muted/30 border border-border/50">
                            <div class="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">4</div>
                            <div>
                              <div class="font-medium mb-1">在 src/examples/ 创建示例</div>
                              <div class="text-sm text-muted-foreground">提供使用示例和文档</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div class="p-6 rounded-xl bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20">
                        <div class="flex items-start gap-3">
                          <div class="text-2xl">⚠️</div>
                          <div>
                            <h4 class="font-semibold text-base mb-2">重要提示</h4>
                            <p class="text-sm text-muted-foreground mb-3">
                              本项目使用 AI 完成移植工作，存在以下情况：
                            </p>
                            <ul class="space-y-2 text-sm">
                              <li class="flex items-start gap-2">
                                <span class="text-yellow-500">•</span>
                                <span class="text-muted-foreground">代码可能不够完善，存在潜在问题</span>
                              </li>
                              <li class="flex items-start gap-2">
                                <span class="text-yellow-500">•</span>
                                <span class="text-muted-foreground">功能可能未完全测试</span>
                              </li>
                              <li class="flex items-start gap-2">
                                <span class="text-yellow-500">•</span>
                                <span class="text-muted-foreground">API 可能与原库存在差异</span>
                              </li>
                              <li class="flex items-start gap-2">
                                <span class="text-yellow-500">•</span>
                                <span class="text-muted-foreground">性能优化可能不足</span>
                              </li>
                            </ul>
                            <p class="text-sm text-muted-foreground mt-3">
                              请谨慎使用，建议在生产环境使用前进行充分测试。
                            </p>
                          </div>
                        </div>
                      </div>
                    </section>
                  </article>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
