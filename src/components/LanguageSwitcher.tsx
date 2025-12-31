/**
 * 语言切换组件 - 专业级设计
 * 支持中文和英文切换
 */

import type { Component } from "solid-js";
import { Show } from "solid-js";
import { useI18n, type Locale } from "@/i18n";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

// 地球图标
const GlobeIcon: Component<{ class?: string }> = (props) => (
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
      d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
    />
  </svg>
);

interface LanguageOption {
  value: Locale;
  label: string;
  flag: string;
  nativeLabel: string;
}

const languages: LanguageOption[] = [
  { value: "zh", label: "中文", flag: "🇨🇳", nativeLabel: "简体中文" },
  { value: "en", label: "English", flag: "🇺🇸", nativeLabel: "English" },
];

export const LanguageSwitcher: Component = () => {
  const { locale, setLocale, t } = useI18n();

  const currentLanguage = () => languages.find((l) => l.value === locale()) || languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          class="relative h-9 w-9 group overflow-hidden"
          aria-label={t().common.switchLanguage || "切换语言"}
        >
          {/* 背景光效 */}
          <div class="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-green-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          
          {/* 地球图标 */}
          <div class="relative flex items-center justify-center">
            <GlobeIcon class="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
          </div>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent class="w-44 bg-background/95 backdrop-blur-xl border-border/50">
        {languages.map((lang) => (
          <DropdownMenuItem
            class={`flex items-center gap-3 cursor-pointer transition-colors ${
              locale() === lang.value
                ? "bg-primary/10 text-foreground font-medium"
                : "hover:bg-accent"
            }`}
            onClick={() => setLocale(lang.value)}
          >
            <span class="text-lg">{lang.flag}</span>
            <div class="flex flex-col">
              <span class="text-sm">{lang.nativeLabel}</span>
            </div>
            <Show when={locale() === lang.value}>
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

// 带文字标签的语言切换器（适用于需要显示当前语言的场景）
export const LanguageSwitcherWithLabel: Component = () => {
  const { locale, setLocale, t } = useI18n();

  const currentLanguage = () => languages.find((l) => l.value === locale()) || languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          class="relative group gap-2 px-3 overflow-hidden"
          aria-label={t().common.switchLanguage || "切换语言"}
        >
          {/* 背景光效 */}
          <div class="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-green-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          
          <span class="relative text-lg">{currentLanguage().flag}</span>
          <span class="relative text-sm font-medium hidden sm:inline">{currentLanguage().label}</span>
          
          {/* 下拉箭头 */}
          <svg
            class="relative h-3 w-3 opacity-50 transition-transform duration-200 group-data-[state=open]:rotate-180"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent class="w-44 bg-background/95 backdrop-blur-xl border-border/50">
        {languages.map((lang) => (
          <DropdownMenuItem
            class={`flex items-center gap-3 cursor-pointer transition-colors ${
              locale() === lang.value
                ? "bg-primary/10 text-foreground font-medium"
                : "hover:bg-accent"
            }`}
            onClick={() => setLocale(lang.value)}
          >
            <span class="text-lg">{lang.flag}</span>
            <div class="flex flex-col">
              <span class="text-sm">{lang.nativeLabel}</span>
            </div>
            <Show when={locale() === lang.value}>
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
