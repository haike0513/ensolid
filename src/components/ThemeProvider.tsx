/**
 * 主题上下文 - 提供暗色/亮色模式切换功能
 */

import {
  createContext,
  useContext,
  createSignal,
  createEffect,
  onMount,
  type Component,
  type JSX,
} from "solid-js";

export type Theme = "light" | "dark" | "system";

interface ThemeContextValue {
  theme: () => Theme;
  resolvedTheme: () => "light" | "dark";
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>();

const STORAGE_KEY = "ensolid-theme";

export const ThemeProvider: Component<{ children: JSX.Element }> = (props) => {
  const [theme, setThemeState] = createSignal<Theme>("system");
  const [resolvedTheme, setResolvedTheme] = createSignal<"light" | "dark">("light");

  // 获取系统主题偏好
  const getSystemTheme = (): "light" | "dark" => {
    if (typeof window === "undefined") return "light";
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  };

  // 应用主题到 DOM
  const applyTheme = (resolvedTheme: "light" | "dark") => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(resolvedTheme);
    setResolvedTheme(resolvedTheme);
  };

  // 设置主题
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem(STORAGE_KEY, newTheme);
    
    const resolved = newTheme === "system" ? getSystemTheme() : newTheme;
    applyTheme(resolved);
  };

  // 切换主题
  const toggleTheme = () => {
    const current = resolvedTheme();
    setTheme(current === "light" ? "dark" : "light");
  };

  // 初始化
  onMount(() => {
    // 读取存储的主题设置
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    const initialTheme = stored || "system";
    setThemeState(initialTheme);
    
    // 应用初始主题
    const resolved = initialTheme === "system" ? getSystemTheme() : initialTheme;
    applyTheme(resolved);

    // 监听系统主题变化
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      if (theme() === "system") {
        applyTheme(e.matches ? "dark" : "light");
      }
    };
    
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  });

  // 监听主题变化
  createEffect(() => {
    const currentTheme = theme();
    if (typeof window !== "undefined") {
      const resolved = currentTheme === "system" ? getSystemTheme() : currentTheme;
      applyTheme(resolved);
    }
  });

  const value: ThemeContextValue = {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {props.children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
