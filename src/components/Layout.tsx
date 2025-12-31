/**
 * Layout 组件 - 提供页面布局结构
 */

import type { Component } from "solid-js";
import { Header } from "./Header";
import { ThemeProvider } from "./ThemeProvider";

export const Layout: Component<{ children?: any }> = (props) => {
  return (
    <ThemeProvider>
      <div class="min-h-screen bg-background text-foreground transition-colors duration-300">
        <Header />
        {props.children}
      </div>
    </ThemeProvider>
  );
};
