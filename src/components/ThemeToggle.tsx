/**
 * 主题切换组件 - 专业级设计
 * 支持亮色、暗色、跟随系统三种模式
 */

import type { Component } from "solid-js";
import { Show } from "solid-js";
import { useTheme, type Theme } from "./ThemeProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";

// 太阳图标
const SunIcon: Component<{ class?: string }> = (props) => (
  <svg
    class={props.class}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
    />
  </svg>
);

// 月亮图标
const MoonIcon: Component<{ class?: string }> = (props) => (
  <svg
    class={props.class}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
    />
  </svg>
);

// 系统图标
const SystemIcon: Component<{ class?: string }> = (props) => (
  <svg
    class={props.class}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);

export const ThemeToggle: Component = () => {
  const { theme, resolvedTheme, setTheme } = useTheme();

  const themeOptions: { value: Theme; label: string; icon: Component<{ class?: string }> }[] = [
    { value: "light", label: "亮色模式", icon: SunIcon },
    { value: "dark", label: "暗色模式", icon: MoonIcon },
    { value: "system", label: "跟随系统", icon: SystemIcon },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          class="relative h-9 w-9 group overflow-hidden"
          aria-label="切换主题"
        >
          {/* 背景光效 */}
          <div class="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-transparent to-blue-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          
          {/* 太阳图标 - 亮色模式显示 */}
          <div
            class={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
              resolvedTheme() === "light"
                ? "rotate-0 scale-100 opacity-100"
                : "rotate-90 scale-0 opacity-0"
            }`}
          >
            <SunIcon class="h-4 w-4 text-yellow-500" />
          </div>
          
          {/* 月亮图标 - 暗色模式显示 */}
          <div
            class={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
              resolvedTheme() === "dark"
                ? "rotate-0 scale-100 opacity-100"
                : "-rotate-90 scale-0 opacity-0"
            }`}
          >
            <MoonIcon class="h-4 w-4 text-blue-400" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent class="w-40 bg-background/95 backdrop-blur-xl border-border/50">
        {themeOptions.map((option) => (
          <DropdownMenuItem
            class={`flex items-center gap-3 cursor-pointer transition-colors ${
              theme() === option.value
                ? "bg-primary/10 text-foreground font-medium"
                : "hover:bg-accent"
            }`}
            onClick={() => setTheme(option.value)}
          >
            <option.icon class="h-4 w-4" />
            <span>{option.label}</span>
            <Show when={theme() === option.value}>
              <svg
                class="ml-auto h-4 w-4 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </Show>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// 简单的切换按钮（不带下拉菜单）
export const ThemeToggleSimple: Component = () => {
  const { resolvedTheme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      class="relative h-9 w-9 group overflow-hidden"
      aria-label="切换主题"
      onClick={toggleTheme}
    >
      {/* 背景光效 */}
      <div class="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-transparent to-blue-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      
      {/* 太阳图标 */}
      <div
        class={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
          resolvedTheme() === "light"
            ? "rotate-0 scale-100 opacity-100"
            : "rotate-90 scale-0 opacity-0"
        }`}
      >
        <SunIcon class="h-4 w-4 text-yellow-500" />
      </div>
      
      {/* 月亮图标 */}
      <div
        class={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
          resolvedTheme() === "dark"
            ? "rotate-0 scale-100 opacity-100"
            : "-rotate-90 scale-0 opacity-0"
        }`}
      >
        <MoonIcon class="h-4 w-4 text-blue-400" />
      </div>
    </Button>
  );
};
