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
                        {t().docs.content.radix.description}
                      </p>
                    </header>

                    <section class="space-y-8">
                      <div class="p-6 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
                        <p class="text-base leading-relaxed">
                          <code class="px-2 py-1 rounded bg-background/80 text-primary font-mono text-sm">@ensolid/radix</code> {t().docs.content.radix.intro.split('{radixLink}')[0]}
                          <a
                            href="https://www.radix-ui.com/primitives"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="text-primary hover:underline font-medium"
                          >
                            Radix UI Primitives
                          </a>
                          {t().docs.content.radix.intro.split('{radixLink}')[1]}
                        </p>
                      </div>

                      <div>
                        <h3 class="text-2xl font-bold mb-4">{t().docs.content.radix.installation}</h3>
                        <CodeBlock code="pnpm add @ensolid/radix" language="bash" />
                      </div>

                      <div>
                        <h3 class="text-2xl font-bold mb-4">{t().docs.content.radix.usage}</h3>
                        <p class="mb-4 text-muted-foreground">{t().docs.content.radix.importTitle}</p>
                        <CodeBlock code={`import { Dialog, Button } from "@ensolid/radix";`} language="typescript" />
                        <p class="mb-4 mt-6 text-muted-foreground">{t().docs.content.radix.exampleTitle}</p>
                        <CodeBlock code={`import { Dialog } from "@ensolid/radix";

function App() {
  return (
    <Dialog>
      <Dialog.Trigger>{t().docs.content.radix.dialogTrigger}</Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Title>{t().docs.content.radix.dialogTitle}</Dialog.Title>
        <Dialog.Description>{t().docs.content.radix.dialogDescription}</Dialog.Description>
      </Dialog.Content>
    </Dialog>
  );
}`} language="typescript" />
                      </div>

                      <div>
                        <h3 class="text-2xl font-bold mb-4">{t().docs.content.radix.featuresTitle}</h3>
                        <div class="grid gap-4 sm:grid-cols-2">
                          <FeatureCard
                            icon="♿"
                            title={t().docs.content.radix.features.accessibility.title}
                            desc={t().docs.content.radix.features.accessibility.desc}
                          />
                          <FeatureCard
                            icon="🎨"
                            title={t().docs.content.radix.features.unstyled.title}
                            desc={t().docs.content.radix.features.unstyled.desc}
                          />
                          <FeatureCard
                            icon="🎯"
                            title={t().docs.content.radix.features.dualMode.title}
                            desc={t().docs.content.radix.features.dualMode.desc}
                          />
                          <FeatureCard
                            icon="📘"
                            title={t().docs.content.radix.features.typeSafe.title}
                            desc={t().docs.content.radix.features.typeSafe.desc}
                          />
                        </div>
                      </div>

                      <div>
                        <h3 class="text-2xl font-bold mb-6">{t().docs.content.radix.componentsTitle}</h3>
                        <div class="grid gap-3 sm:grid-cols-2">
                          <div class="p-4 rounded-lg bg-muted/30 border border-border/50">
                            <div class="font-semibold text-sm mb-2 text-primary">{t().docs.content.radix.categories.base}</div>
                            <div class="text-sm text-muted-foreground">Separator, Label, AspectRatio</div>
                          </div>
                          <div class="p-4 rounded-lg bg-muted/30 border border-border/50">
                            <div class="font-semibold text-sm mb-2 text-primary">{t().docs.content.radix.categories.form}</div>
                            <div class="text-sm text-muted-foreground">Checkbox, Switch, RadioGroup, Select, Slider, Toggle</div>
                          </div>
                          <div class="p-4 rounded-lg bg-muted/30 border border-border/50">
                            <div class="font-semibold text-sm mb-2 text-primary">{t().docs.content.radix.categories.layout}</div>
                            <div class="text-sm text-muted-foreground">Tabs, Accordion, Collapsible, ScrollArea</div>
                          </div>
                          <div class="p-4 rounded-lg bg-muted/30 border border-border/50">
                            <div class="font-semibold text-sm mb-2 text-primary">{t().docs.content.radix.categories.overlay}</div>
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
                        {t().docs.content.baseui.description}
                      </p>
                    </header>

                    <section class="space-y-8">
                      <div class="p-6 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                        <p class="text-base leading-relaxed">
                          <code class="px-2 py-1 rounded bg-background/80 text-primary font-mono text-sm">@ensolid/baseui</code> {t().docs.content.baseui.intro.split('{baseuiLink}')[0]}
                          <a
                            href="https://baseui.org/"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="text-primary hover:underline font-medium"
                          >
                            BaseUI
                          </a>
                          {t().docs.content.baseui.intro.split('{baseuiLink}')[1]}
                        </p>
                      </div>

                      <div>
                        <h3 class="text-2xl font-bold mb-4">{t().docs.content.baseui.installation}</h3>
                        <CodeBlock code="pnpm add @ensolid/baseui" language="bash" />
                      </div>

                      <div>
                        <h3 class="text-2xl font-bold mb-4">{t().docs.content.baseui.usage}</h3>
                        <CodeBlock code={`import { Button, Card, CardContent } from "@ensolid/baseui";

function App() {
  return (
    <Card>
      <CardContent>
        <Button variant="contained">${t().docs.content.baseui.clickMe}</Button>
      </CardContent>
    </Card>
  );
}`} language="typescript" />
                      </div>

                      <div>
                        <h3 class="text-2xl font-bold mb-4">{t().docs.content.baseui.featuresTitle}</h3>
                        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                          <FeatureCard
                            icon="🎁"
                            title={t().docs.content.baseui.features.rich.title}
                            desc={t().docs.content.baseui.features.rich.desc}
                          />
                          <FeatureCard
                            icon="🎨"
                            title={t().docs.content.baseui.features.material.title}
                            desc={t().docs.content.baseui.features.material.desc}
                          />
                          <FeatureCard
                            icon="🎯"
                            title={t().docs.content.baseui.features.theme.title}
                            desc={t().docs.content.baseui.features.theme.desc}
                          />
                          <FeatureCard
                            icon="📊"
                            title={t().docs.content.baseui.features.enterprise.title}
                            desc={t().docs.content.baseui.features.enterprise.desc}
                          />
                          <FeatureCard
                            icon="📘"
                            title={t().docs.content.baseui.features.typeSafe.title}
                            desc={t().docs.content.baseui.features.typeSafe.desc}
                          />
                          <FeatureCard
                            icon="⚡"
                            title={t().docs.content.baseui.features.performance.title}
                            desc={t().docs.content.baseui.features.performance.desc}
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
                        {t().docs.content.solidflow.description}
                      </p>
                    </header>

                    <section class="space-y-8">
                      <div class="p-6 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20">
                        <p class="text-base leading-relaxed">
                          <code class="px-2 py-1 rounded bg-background/80 text-primary font-mono text-sm">@ensolid/solidflow</code> {t().docs.content.solidflow.intro.split('{reactflowLink}')[0]}
                          <a
                            href="https://reactflow.dev/"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="text-primary hover:underline font-medium"
                          >
                            React Flow
                          </a>
                          {t().docs.content.solidflow.intro.split('{reactflowLink}')[1]}
                        </p>
                      </div>

                      <div>
                        <h3 class="text-2xl font-bold mb-4">{t().docs.content.solidflow.installation}</h3>
                        <CodeBlock code="pnpm add @ensolid/solidflow" language="bash" />
                      </div>

                      <div>
                        <h3 class="text-2xl font-bold mb-4">{t().docs.content.solidflow.usage}</h3>
                        <CodeBlock code={`import { createSignal } from "solid-js";
import { Flow, Node, Edge } from "@ensolid/solidflow";

function App() {
  const [nodes, setNodes] = createSignal([
    { id: "1", position: { x: 0, y: 0 }, data: { label: "${t().docs.content.solidflow.nodeLabel} 1" } },
    { id: "2", position: { x: 200, y: 100 }, data: { label: "${t().docs.content.solidflow.nodeLabel} 2" } },
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
                        <h3 class="text-2xl font-bold mb-4">{t().docs.content.solidflow.featuresTitle}</h3>
                        <div class="grid gap-4 sm:grid-cols-2">
                          <FeatureCard
                            icon="⚡"
                            title={t().docs.content.solidflow.features.performance.title}
                            desc={t().docs.content.solidflow.features.performance.desc}
                          />
                          <FeatureCard
                            icon="🎨"
                            title={t().docs.content.solidflow.features.custom.title}
                            desc={t().docs.content.solidflow.features.custom.desc}
                          />
                          <FeatureCard
                            icon="🖱️"
                            title={t().docs.content.solidflow.features.interactive.title}
                            desc={t().docs.content.solidflow.features.interactive.desc}
                          />
                          <FeatureCard
                            icon="🔧"
                            title={t().docs.content.solidflow.features.workflow.title}
                            desc={t().docs.content.solidflow.features.workflow.desc}
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
                        {t().docs.content.cli.description}
                      </p>
                    </header>

                    <section class="space-y-8">
                      <div class="p-6 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20">
                        <p class="text-base leading-relaxed">
                          <code class="px-2 py-1 rounded bg-background/80 text-primary font-mono text-sm">@ensolid/cli</code> {t().docs.content.cli.intro.split('{shadcnLink}')[0]}
                          <a
                            href="https://ui.shadcn.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="text-primary hover:underline font-medium"
                          >
                            shadcn/ui
                          </a>
                          {t().docs.content.cli.intro.split('{shadcnLink}')[1]}
                        </p>
                      </div>

                      <div>
                        <h3 class="text-2xl font-bold mb-4">{t().docs.content.cli.featuresTitle}</h3>
                        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                          <FeatureCard
                            icon="🚀"
                            title={t().docs.content.cli.features.init.title}
                            desc={t().docs.content.cli.features.init.desc}
                          />
                          <FeatureCard
                            icon="📦"
                            title={t().docs.content.cli.features.add.title}
                            desc={t().docs.content.cli.features.add.desc}
                          />
                          <FeatureCard
                            icon="🔄"
                            title={t().docs.content.cli.features.deps.title}
                            desc={t().docs.content.cli.features.deps.desc}
                          />
                          <FeatureCard
                            icon="📝"
                            title={t().docs.content.cli.features.control.title}
                            desc={t().docs.content.cli.features.control.desc}
                          />
                          <FeatureCard
                            icon="🔍"
                            title={t().docs.content.cli.features.diff.title}
                            desc={t().docs.content.cli.features.diff.desc}
                          />
                          <FeatureCard
                            icon="📋"
                            title={t().docs.content.cli.features.list.title}
                            desc={t().docs.content.cli.features.list.desc}
                          />
                        </div>
                      </div>

                      <div>
                        <h3 class="text-2xl font-bold mb-4 flex items-center gap-2">
                          <span>🚀</span>
                          <span>{t().docs.content.cli.quickStart}</span>
                        </h3>
                        
                        <div class="space-y-6">
                          <div>
                            <h4 class="text-lg font-semibold mb-3">{t().docs.content.cli.initTitle}</h4>
                            <p class="mb-3 text-muted-foreground">{t().docs.content.cli.initDesc}</p>
                            <CodeBlock code="npx @ensolid/cli init" language="bash" />
                            <p class="mt-3 text-sm text-muted-foreground">
                              {t().docs.content.cli.initTip.replace('{config}', '')} <code class="px-1.5 py-0.5 rounded bg-muted text-primary text-xs">ensolid.json</code> {t().docs.content.cli.initTip.includes('配置文件') ? '配置文件。' : ''}
                            </p>
                          </div>

                          <div>
                            <h4 class="text-lg font-semibold mb-3">{t().docs.content.cli.addTitle}</h4>
                            <p class="mb-3 text-muted-foreground">{t().docs.content.cli.addDesc}</p>
                            <CodeBlock code="npx @ensolid/cli add button" language="bash" />
                            <p class="mt-3 text-sm text-muted-foreground">{t().docs.content.cli.addTip}</p>
                          </div>

                          <div>
                            <h4 class="text-lg font-semibold mb-3">{t().docs.content.cli.useTitle}</h4>
                            <CodeBlock code={`import { Button } from "@/components/ui/button";

function App() {
  return (
    <Button variant="default">
      ${t().docs.content.baseui.clickMe}
    </Button>
  );
}`} language="typescript" />
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 class="text-2xl font-bold mb-4 flex items-center gap-2">
                          <span>📖</span>
                          <span>{t().docs.content.cli.commandDetail}</span>
                        </h3>

                        <div class="space-y-6">
                          {/* init 命令 */}
                          <div class="p-5 rounded-xl bg-muted/30 border border-border/50">
                            <div class="flex items-center gap-2 mb-3">
                              <code class="px-3 py-1.5 rounded bg-primary/10 text-primary font-mono text-sm font-bold">init</code>
                              <span class="text-sm text-muted-foreground">{t().docs.content.cli.initCommand.desc}</span>
                            </div>
                            <CodeBlock code={`npx @ensolid/cli init [options]

# ${t().docs.content.cli.initCommand.options}
-y, --yes        ${t().docs.content.cli.initCommand.yes}
-d, --defaults   ${t().docs.content.cli.initCommand.defaults}
-f, --force      ${t().docs.content.cli.initCommand.force}
-c, --cwd <cwd>  ${t().docs.content.cli.initCommand.cwd}`} language="bash" />
                            <p class="mt-3 text-sm text-muted-foreground">
                              {t().docs.content.cli.initCommand.tip}
                            </p>
                          </div>

                          {/* add 命令 */}
                          <div class="p-5 rounded-xl bg-muted/30 border border-border/50">
                            <div class="flex items-center gap-2 mb-3">
                              <code class="px-3 py-1.5 rounded bg-primary/10 text-primary font-mono text-sm font-bold">add</code>
                              <span class="text-sm text-muted-foreground">{t().docs.content.cli.addCommand.desc}</span>
                            </div>
                            <CodeBlock code={`npx @ensolid/cli add [components...] [options]

# ${t().docs.content.cli.addCommand.single}
npx @ensolid/cli add button

# ${t().docs.content.cli.addCommand.multiple}
npx @ensolid/cli add button card dialog

# ${t().docs.content.cli.addCommand.all}
npx @ensolid/cli add --all

# ${t().docs.content.cli.addCommand.options}
-y, --yes          ${t().docs.content.cli.addCommand.yes}
-o, --overwrite    ${t().docs.content.cli.addCommand.overwrite}
-a, --all          ${t().docs.content.cli.addCommand.allOpt}
-p, --path <path>  ${t().docs.content.cli.addCommand.path}`} language="bash" />
                            <div class="mt-4 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-start gap-2">
                              <div class="text-lg">💡</div>
                              <p class="text-sm text-muted-foreground">
                                {t().docs.content.cli.addCommand.tip}
                              </p>
                            </div>
                          </div>

                          {/* list 命令 */}
                          <div class="p-5 rounded-xl bg-muted/30 border border-border/50">
                            <div class="flex items-center gap-2 mb-3">
                              <code class="px-3 py-1.5 rounded bg-primary/10 text-primary font-mono text-sm font-bold">list</code>
                              <span class="text-sm text-muted-foreground">{t().docs.content.cli.listCommand.desc}</span>
                            </div>
                            <CodeBlock code={`npx @ensolid/cli list [options]

# ${t().docs.content.cli.listCommand.all}
npx @ensolid/cli list

# ${t().docs.content.cli.listCommand.installed}
npx @ensolid/cli list --installed

# ${t().docs.content.cli.listCommand.available}
npx @ensolid/cli list --available`} language="bash" />
                          </div>

                          {/* diff 命令 */}
                          <div class="p-5 rounded-xl bg-muted/30 border border-border/50">
                            <div class="flex items-center gap-2 mb-3">
                              <code class="px-3 py-1.5 rounded bg-primary/10 text-primary font-mono text-sm font-bold">diff</code>
                              <span class="text-sm text-muted-foreground">{t().docs.content.cli.diffCommand.desc}</span>
                            </div>
                            <CodeBlock code={`npx @ensolid/cli diff [component]

# ${t().docs.content.cli.diffCommand.all}
npx @ensolid/cli diff

# ${t().docs.content.cli.diffCommand.single}
npx @ensolid/cli diff button`} language="bash" />
                            <p class="mt-3 text-sm text-muted-foreground">
                              {t().docs.content.cli.diffCommand.tip}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 class="text-2xl font-bold mb-4 flex items-center gap-2">
                          <span>⚙️</span>
                          <span>{t().docs.content.cli.configFile}</span>
                        </h3>
                        <p class="mb-4 text-muted-foreground">
                          {t().docs.content.cli.configDesc.replace('{config}', '')} <code class="px-1.5 py-0.5 rounded bg-muted text-primary text-xs">ensolid.json</code> {t().docs.content.cli.configDesc.includes('配置文件') ? '配置文件：' : ':'}
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
                            <div class="text-xs text-muted-foreground">{t().docs.content.cli.configFields.tailwind}</div>
                          </div>
                          <div class="p-4 rounded-lg bg-muted/30 border border-border/50">
                            <div class="font-semibold text-sm mb-2 text-primary">aliases</div>
                            <div class="text-xs text-muted-foreground">{t().docs.content.cli.configFields.aliases}</div>
                          </div>
                          <div class="p-4 rounded-lg bg-muted/30 border border-border/50">
                            <div class="font-semibold text-sm mb-2 text-primary">registry</div>
                            <div class="text-xs text-muted-foreground">{t().docs.content.cli.configFields.registry}</div>
                          </div>
                          <div class="p-4 rounded-lg bg-muted/30 border border-border/50">
                            <div class="font-semibold text-sm mb-2 text-primary">tsx</div>
                            <div class="text-xs text-muted-foreground">{t().docs.content.cli.configFields.tsx}</div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 class="text-2xl font-bold mb-4 flex items-center gap-2">
                          <span>📦</span>
                          <span>{t().docs.content.cli.availableComponents}</span>
                        </h3>
                        <p class="mb-4 text-muted-foreground">
                          {t().docs.content.cli.availableDesc}
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
                            <span class="text-sm font-medium">{t().docs.content.cli.more}</span>
                          </div>
                        </div>
                        <p class="mt-4 text-sm text-muted-foreground">
                          {t().docs.content.cli.listTip.replace('{listCmd}', '')} <code class="px-1.5 py-0.5 rounded bg-muted text-primary text-xs">npx @ensolid/cli list</code> {t().docs.content.cli.listTip.includes('查看完整列表') ? '查看完整列表。' : ''}
                        </p>
                      </div>

                      <div class="p-6 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20">
                        <div class="flex items-start gap-3">
                          <div class="text-2xl">🎉</div>
                          <div>
                            <h4 class="font-semibold text-base mb-2">{t().docs.content.cli.ready}</h4>
                            <p class="text-sm text-muted-foreground mb-3">
                              {t().docs.content.cli.readyDesc}
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
                          {t().docs.sections.uiComponents.title}
                        </h2>
                      </div>
                      <p class="text-lg text-muted-foreground">
                        {t().docs.content.uiComponents.description}
                      </p>
                    </header>

                    <section class="space-y-8">
                      <div class="p-6 rounded-xl bg-gradient-to-br from-primary/10 to-blue-500/10 border border-primary/20">
                        <p class="text-base leading-relaxed">
                          {t().docs.content.uiComponents.intro.split('{radixPkg}')[0]}
                          <code class="px-2 py-1 rounded bg-background/80 text-primary font-mono text-sm">@ensolid/radix</code>
                          {t().docs.content.uiComponents.intro.split('{radixPkg}')[1]}
                        </p>
                      </div>

                      <div>
                        <h3 class="text-2xl font-bold mb-4">{t().docs.content.uiComponents.featuresTitle}</h3>
                        <div class="grid gap-4 sm:grid-cols-2">
                          <FeatureCard
                            icon="🎨"
                            title={t().docs.content.uiComponents.features.modern.title}
                            desc={t().docs.content.uiComponents.features.modern.desc}
                          />
                          <FeatureCard
                            icon="🎯"
                            title={t().docs.content.uiComponents.features.custom.title}
                            desc={t().docs.content.uiComponents.features.custom.desc}
                          />
                          <FeatureCard
                            icon="✨"
                            title={t().docs.content.uiComponents.features.spec.title}
                            desc={t().docs.content.uiComponents.features.spec.desc}
                          />
                          <FeatureCard
                            icon="🚀"
                            title={t().docs.content.uiComponents.features.ready.title}
                            desc={t().docs.content.uiComponents.features.ready.desc}
                          />
                        </div>
                      </div>

                      <div>
                        <h3 class="text-2xl font-bold mb-4">{t().docs.content.uiComponents.usage}</h3>
                        <p class="mb-4 text-muted-foreground">
                          {t().docs.content.uiComponents.usageDesc.replace('{dir}', '')} <code class="px-2 py-1 rounded bg-muted text-primary text-sm">src/components/ui/</code> {t().docs.content.uiComponents.usageDesc.includes('目录下') ? '目录下，可以直接复制到你的项目中使用。' : ''}
                        </p>
                        <CodeBlock code={`import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";

function App() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>{t().docs.content.radix.dialogTrigger}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>${t().docs.content.radix.dialogTitle}</DialogTitle>
          <DialogDescription>${t().docs.content.radix.dialogDescription}</DialogDescription>
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
                          {t().docs.sections.development.title}
                        </h2>
                      </div>
                      <p class="text-lg text-muted-foreground">
                        {t().docs.content.development.description}
                      </p>
                    </header>

                    <section class="space-y-8">
                      <div>
                        <h3 class="text-2xl font-bold mb-4">{t().docs.content.development.structure}</h3>
                        <CodeBlock code={t().docs.content.development.structureCode} language="text" />
                      </div>

                      <div>
                        <h3 class="text-2xl font-bold mb-4">{t().docs.content.development.commands}</h3>
                        <div class="space-y-3">
                          <div class="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/50">
                            <code class="px-3 py-1.5 rounded bg-background text-primary font-mono text-sm">pnpm dev</code>
                            <span class="text-sm text-muted-foreground">{t().docs.content.development.dev}</span>
                          </div>
                          <div class="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/50">
                            <code class="px-3 py-1.5 rounded bg-background text-primary font-mono text-sm">pnpm build</code>
                            <span class="text-sm text-muted-foreground">{t().docs.content.development.build}</span>
                          </div>
                          <div class="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/50">
                            <code class="px-3 py-1.5 rounded bg-background text-primary font-mono text-sm">pnpm build:radix</code>
                            <span class="text-sm text-muted-foreground">{t().docs.content.development.buildRadix}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 class="text-2xl font-bold mb-4">{t().docs.content.development.addComponent}</h3>
                        <div class="space-y-3">
                          <div class="flex gap-3 p-4 rounded-lg bg-muted/30 border border-border/50">
                            <div class="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">1</div>
                            <div>
                              <div class="font-medium mb-1">{t().docs.content.development.steps.step1.title}</div>
                              <div class="text-sm text-muted-foreground">{t().docs.content.development.steps.step1.desc}</div>
                            </div>
                          </div>
                          <div class="flex gap-3 p-4 rounded-lg bg-muted/30 border border-border/50">
                            <div class="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">2</div>
                            <div>
                              <div class="font-medium mb-1">{t().docs.content.development.steps.step2.title}</div>
                              <div class="text-sm text-muted-foreground">{t().docs.content.development.steps.step2.desc}</div>
                            </div>
                          </div>
                          <div class="flex gap-3 p-4 rounded-lg bg-muted/30 border border-border/50">
                            <div class="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">3</div>
                            <div>
                              <div class="font-medium mb-1">{t().docs.content.development.steps.step3.title}</div>
                              <div class="text-sm text-muted-foreground">{t().docs.content.development.steps.step3.desc}</div>
                            </div>
                          </div>
                          <div class="flex gap-3 p-4 rounded-lg bg-muted/30 border border-border/50">
                            <div class="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">4</div>
                            <div>
                              <div class="font-medium mb-1">{t().docs.content.development.steps.step4.title}</div>
                              <div class="text-sm text-muted-foreground">{t().docs.content.development.steps.step4.desc}</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div class="p-6 rounded-xl bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20">
                        <div class="flex items-start gap-3">
                          <div class="text-2xl">⚠️</div>
                          <div>
                            <h4 class="font-semibold text-base mb-2">{t().docs.content.development.important}</h4>
                            <p class="text-sm text-muted-foreground mb-3">
                              {t().docs.content.development.aiNote}
                            </p>
                            <ul class="space-y-2 text-sm">
                              <li class="flex items-start gap-2">
                                <span class="text-yellow-500">•</span>
                                <span class="text-muted-foreground">{t().docs.content.development.aiIssues.incomplete}</span>
                              </li>
                              <li class="flex items-start gap-2">
                                <span class="text-yellow-500">•</span>
                                <span class="text-muted-foreground">{t().docs.content.development.aiIssues.untested}</span>
                              </li>
                              <li class="flex items-start gap-2">
                                <span class="text-yellow-500">•</span>
                                <span class="text-muted-foreground">{t().docs.content.development.aiIssues.apiDiff}</span>
                              </li>
                              <li class="flex items-start gap-2">
                                <span class="text-yellow-500">•</span>
                                <span class="text-muted-foreground">{t().docs.content.development.aiIssues.perf}</span>
                              </li>
                            </ul>
                            <p class="text-sm text-muted-foreground mt-3">
                              {t().docs.content.development.caution}
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
