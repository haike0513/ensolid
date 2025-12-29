/**
 * Header 组件
 */

import type { Component } from "solid-js";
import { createSignal, onMount } from "solid-js";
import { A, useLocation } from "@solidjs/router";
import { LanguageSwitcher } from "./LanguageSwitcher";

export const Header: Component = () => {
  const location = useLocation();
  const [stars, setStars] = createSignal<number | null>(null);

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
  });

  // 格式化 star 数量显示
  const formatStars = (count: number | null): string => {
    if (count === null) return "...";
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  return (
    <header class="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div class="container mx-auto px-4">
        <div class="flex h-16 items-center justify-between">
          {/* Logo 和导航链接 */}
          <div class="flex items-center gap-8">
            <A href="/" class="flex items-center gap-2">
              <img src="/ensolid-logo.svg" alt="Ensolid Logo" class="w-8 h-8" />
            </A>
            <nav class="hidden md:flex items-center gap-6">
              <A
                href="/docs"
                class={`text-sm font-medium transition-colors hover:text-foreground/80 ${
                  isActive("/docs") ? "text-foreground" : "text-foreground/60"
                }`}
              >
                Docs
              </A>
              <A
                href="/components"
                class={`text-sm font-medium transition-colors hover:text-foreground/80 ${
                  isActive("/components")
                    ? "text-foreground"
                    : "text-foreground/60"
                }`}
              >
                Components
              </A>
              <A
                href="/blocks"
                class={`text-sm font-medium transition-colors hover:text-foreground/80 ${
                  isActive("/blocks") ? "text-foreground" : "text-foreground/60"
                }`}
              >
                Blocks
              </A>
              <A
                href="/charts"
                class={`text-sm font-medium transition-colors hover:text-foreground/80 ${
                  isActive("/charts") ? "text-foreground" : "text-foreground/60"
                }`}
              >
                Charts
              </A>
              <A
                href="/solidflow"
                class={`text-sm font-medium transition-colors hover:text-foreground/80 ${
                  isActive("/solidflow")
                    ? "text-foreground"
                    : "text-foreground/60"
                }`}
              >
                SolidFlow
              </A>
              <A
                href="/workflow"
                class={`text-sm font-medium transition-colors hover:text-foreground/80 ${
                  isActive("/workflow")
                    ? "text-foreground"
                    : "text-foreground/60"
                }`}
              >
                Workflow
              </A>
              <A
                href="/ai-playground"
                class={`text-sm font-medium transition-colors hover:text-foreground/80 ${
                  isActive("/ai-playground")
                    ? "text-foreground"
                    : "text-foreground/60"
                }`}
              >
                AI Playground
              </A>
            </nav>
          </div>

          {/* 右侧操作 */}
          <div class="flex items-center gap-3">
            {/* 搜索框 */}
            <div class="relative hidden lg:block">
              <input
                type="text"
                placeholder="Search documentation..."
                class="w-64 rounded-md border border-input bg-background px-3 py-2 pr-20 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              />
              <kbd class="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
                <span class="text-xs">⌘</span>K
              </kbd>
            </div>

            {/* GitHub */}
            <a
              href="https://github.com/haike0513/ensolid"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-1.5 text-sm text-foreground/60 hover:text-foreground/80 transition-colors"
            >
              <svg
                class="h-5 w-5"
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
              <span class="hidden sm:inline text-sm">
                {formatStars(stars())}
              </span>
            </a>

            <div class="h-4 w-px bg-border" />

            {/* 语言切换 */}
            <LanguageSwitcher />

            <div class="h-4 w-px bg-border" />

            {/* 显示图标（占位） */}
            <button
              type="button"
              class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9"
              aria-label="显示设置"
            >
              <svg
                class="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </button>

            <div class="h-4 w-px bg-border" />

            {/* 主题切换按钮 */}
            <button
              type="button"
              class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9"
              aria-label="切换主题"
            >
              <svg
                class="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </button>

            <div class="h-4 w-px bg-border" />

            {/* New Project 按钮 */}
            <button
              type="button"
              class="inline-flex items-center justify-center rounded-md bg-gray-900 text-white px-4 py-2 text-sm font-medium hover:bg-gray-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <svg
                class="mr-2 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              New Project
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
