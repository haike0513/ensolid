import type { Accessor, ParentComponent } from "solid-js";
import { createContext, useContext, createSignal, createMemo } from "solid-js";
import { zh } from "./locales/zh";
import { en } from "./locales/en";

export type Locale = "zh" | "en";

export type Translations = typeof zh;

const translations: Record<Locale, Translations> = {
  zh,
  en,
};

interface I18nContextValue {
  locale: Accessor<Locale>;
  setLocale: (locale: Locale) => void;
  t: Accessor<Translations>;
}

const I18nContext = createContext<I18nContextValue>();

// 从 localStorage 获取初始语言，如果没有则使用浏览器语言或默认中文
function getInitialLocale(): Locale {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("locale") as Locale | null;
    if (saved && (saved === "zh" || saved === "en")) {
      return saved;
    }
    // 检查浏览器语言
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith("en")) {
      return "en";
    }
  }
  return "zh";
}

export const I18nProvider: ParentComponent = (props) => {
  const [locale, setLocaleSignal] = createSignal<Locale>(getInitialLocale());

  const setLocale = (newLocale: Locale) => {
    setLocaleSignal(newLocale);
    if (typeof window !== "undefined") {
      localStorage.setItem("locale", newLocale);
    }
  };

  const t = createMemo(() => translations[locale()]);

  const contextValue: I18nContextValue = {
    locale,
    setLocale,
    t,
  };

  return (
    <I18nContext.Provider value={contextValue}>
      {props.children}
    </I18nContext.Provider>
  );
};

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return context;
}

