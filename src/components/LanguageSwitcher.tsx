import type { Component } from "solid-js";
import { useI18n } from "@/i18n";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export const LanguageSwitcher: Component = () => {
  const { locale, setLocale, t } = useI18n();

  const getLanguageName = (lang: "zh" | "en") => {
    return lang === "zh" ? t().common.chinese : t().common.english;
  };

  const getLanguageFlag = (lang: "zh" | "en") => {
    return lang === "zh" ? "🇨🇳" : "🇺🇸";
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" class="gap-2">
          <span>{getLanguageFlag(locale())}</span>
          <span>{getLanguageName(locale())}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={() => setLocale("zh")}
          class={locale() === "zh" ? "bg-accent" : ""}
        >
          <span class="mr-2">🇨🇳</span>
          {t().common.chinese}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setLocale("en")}
          class={locale() === "en" ? "bg-accent" : ""}
        >
          <span class="mr-2">🇺🇸</span>
          {t().common.english}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
