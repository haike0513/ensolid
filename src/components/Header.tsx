/**
 * Header 组件 - 专业级重构版本
 */

import type { Component } from "solid-js";
import { createSignal, onMount, Show } from "solid-js";
import { A, useLocation } from "@solidjs/router";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeToggle } from "./ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";

export const Header: Component = () => {
  const location = useLocation();
  const [stars, setStars] = createSignal<number | null>(null);
  const [scrolled, setScrolled] = createSignal(false);
  const [searchFocused, setSearchFocused] = createSignal(false);

  const isActive = (path: string) => {
    return location.pathname === path ||
      location.pathname.startsWith(path + "/");
  };

  // 获取 GitHub star 数量
  onMount(async () => {
    try {
      const response = await fetch(
        "https://api.github.com/repos/haike0513/ensolid",
      );
      if (response.ok) {
        const data = await response.json();
        setStars(data.stargazers_count);
      }
    } catch (error) {
      console.error("Failed to fetch GitHub stars:", error);
    }

    // 监听滚动事件以改变Header样式
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  });

  // 格式化 star 数量显示
  const formatStars = (count: number | null): string => {
    if (count === null) return "...";
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  const navItems = [
    { path: "/docs", label: "文档", icon: "📚" },
    { path: "/components", label: "组件", icon: "🧩" },
    { path: "/blocks", label: "区块", icon: "🔲" },
    { path: "/charts", label: "图表", icon: "📊" },
  ];

  const moreNavItems = [
    { path: "/solidflow", label: "流程图", icon: "🌊" },
    { path: "/workflow", label: "工作流", icon: "⚡" },
    { path: "/ai-playground", label: "AI", icon: "🤖" },
    { path: "/fiber", label: "Fiber 3D", icon: "🎨" },
    { path: "/examples", label: "示例", icon: "💡" },
    { path: "/templates", label: "模板", icon: "📋" },
    { path: "/blog", label: "博客", icon: "📝" },
    { path: "/community", label: "社区", icon: "👥" },
  ];

  return (
    <header
      class={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled()
          ? "border-b border-border/40 bg-background/80 backdrop-blur-xl shadow-sm"
          : "border-b border-transparent bg-background/60 backdrop-blur-md"
      }`}
    >
      {/* 顶部装饰线 */}
      <div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50" />
      
      <div class="container mx-auto px-4 lg:px-8">
        <div class="flex h-16 items-center justify-between">
          {/* Logo 和导航链接 */}
          <div class="flex items-center gap-8">
            {/* Logo区域 - 增强设计 */}
            <A 
              href="/" 
              class="group flex items-center gap-2.5 transition-all duration-300 hover:scale-105"
            >
              <div class="relative">
                <div class="absolute inset-0 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 blur-md opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <img 
                  src="/ensolid-logo.svg" 
                  alt="Ensolid Logo" 
                  class="relative w-8 h-8 transition-transform duration-300 group-hover:rotate-12" 
                />
              </div>
              <span class="hidden sm:block text-lg font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Ensolid
              </span>
            </A>
            
            {/* 桌面端导航菜单 - 增强版 */}
            <nav class="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <A
                  href={item.path}
                  class={`group relative px-3 py-2 text-sm font-medium transition-all duration-300 rounded-lg ${
                    isActive(item.path)
                      ? "text-foreground"
                      : "text-foreground/60 hover:text-foreground"
                  }`}
                >
                  {/* 活动指示器 */}
                  <Show when={isActive(item.path)}>
                    <div class="absolute inset-0 rounded-lg bg-primary/10 border border-primary/20" />
                    <div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full" />
                  </Show>
                  
                  {/* 悬停效果 */}
                  <div class="absolute inset-0 rounded-lg bg-accent/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  
                  <span class="relative flex items-center gap-1.5">
                    <span class="text-xs opacity-70">{item.icon}</span>
                    {item.label}
                  </span>
                </A>
              ))}

              {/* 更多菜单 Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger
                  asChild
                >
                  <Button 
                    variant="ghost" 
                    size="sm"
                    class="group relative px-3 py-2 h-auto text-sm font-medium text-foreground/60 hover:text-foreground transition-all duration-300 rounded-lg hover:bg-transparent data-[expanded]:text-foreground"
                  >
                     <div class="absolute inset-0 rounded-lg bg-accent/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                     <span class="relative flex items-center gap-1.5">
                       <span>更多</span>
                       <svg class="h-4 w-4 opacity-50 transition-transform duration-200 group-data-[expanded]:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                       </svg>
                     </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent class="w-48 bg-background/95 backdrop-blur-xl border-border/50 p-1">
                  {moreNavItems.map((item) => (
                    <DropdownMenuItem class="cursor-pointer rounded-md focus:bg-accent focus:text-accent-foreground">
                      <A href={item.path} class="w-full flex items-center gap-2 px-2 py-1.5">
                        <span class="text-sm opacity-70">{item.icon}</span>
                        <span class="text-sm font-medium">{item.label}</span>
                      </A>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </nav>

            {/* 移动端下拉菜单 - 改进版 */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  class="lg:hidden relative group"
                  aria-label="打开导航菜单"
                >
                  <div class="absolute inset-0 rounded-lg bg-primary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <svg
                    class="h-5 w-5 transition-transform duration-300 group-hover:scale-110"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent class="w-56 bg-background/95 backdrop-blur-xl border-border/50">
                {navItems.map((item) => (
                  <DropdownMenuItem
                    class={`transition-colors ${
                      isActive(item.path)
                        ? "bg-primary/10 text-foreground font-medium"
                        : "hover:bg-accent"
                    }`}
                  >
                    <A href={item.path} class="w-full flex items-center gap-2">
                      <span class="text-base">{item.icon}</span>
                      <span>{item.label}</span>
                    </A>
                  </DropdownMenuItem>
                ))}
                
                {/* 移动端菜单分隔线 */}
                <div class="h-px bg-border/50 my-1 mx-2" />
                
                {moreNavItems.map((item) => (
                  <DropdownMenuItem
                    class={`transition-colors ${
                      isActive(item.path)
                        ? "bg-primary/10 text-foreground font-medium"
                        : "hover:bg-accent"
                    }`}
                  >
                    <A href={item.path} class="w-full flex items-center gap-2">
                      <span class="text-base">{item.icon}</span>
                      <span>{item.label}</span>
                    </A>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* 右侧操作区域 - 重新设计 */}
          <div class="flex items-center gap-2">
            {/* 搜索框 - 增强版 */}
            <div class="relative hidden xl:block group">
              <div class={`absolute inset-0 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 transition-opacity duration-300 ${
                searchFocused() ? "opacity-100" : "opacity-0"
              }`} />
              <input
                type="text"
                placeholder="搜索文档..."
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                class="relative w-64 rounded-lg border border-input/50 bg-background/50 px-4 py-2 pr-20 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/50 focus:bg-background transition-all duration-300"
              />
              <kbd class="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 flex h-6 select-none items-center gap-1 rounded-md border border-border/50 bg-muted/50 px-2 font-mono text-[10px] font-medium backdrop-blur-sm">
                <span class="text-xs">⌘</span>K
              </kbd>
              {/* 搜索图标 */}
              <div class="absolute left-3 top-1/2 -translate-y-1/2 opacity-0 transition-opacity duration-300 group-hover:opacity-50">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* 搜索按钮（小屏幕） */}
            <button
              type="button"
              class="xl:hidden inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-300 hover:bg-accent/50 h-9 w-9 group"
              aria-label="搜索"
            >
              <svg class="h-4 w-4 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* GitHub - 增强版 */}
            <a
              href="https://github.com/haike0513/ensolid"
              target="_blank"
              rel="noopener noreferrer"
              class="group relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-foreground/70 hover:text-foreground transition-all duration-300 hover:bg-accent/50"
            >
              <div class="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <svg
                class="relative h-4 w-4 transition-transform duration-300 group-hover:scale-110"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clip-rule="evenodd"
                />
              </svg>
              <span class="relative hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold">
                <Show when={stars() !== null}>
                  <span class="flex items-center gap-1">
                    <svg class="h-3 w-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {formatStars(stars())}
                  </span>
                </Show>
              </span>
            </a>

            <div class="hidden sm:block h-5 w-px bg-border/50" />

            {/* 语言切换 */}
            <LanguageSwitcher />

            <div class="hidden sm:block h-5 w-px bg-border/50" />

            {/* 主题切换按钮 */}
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* 底部进度条（可选） */}
      <div class="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
    </header>
  );
};
