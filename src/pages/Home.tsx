/**
 * 首页
 */

import type { Component } from "solid-js";
import { A } from "@solidjs/router";

export const HomePage: Component = () => {
  return (
    <div class="container mx-auto px-4 py-12">
      <div class="max-w-4xl mx-auto text-center">
        <h1 class="text-4xl font-bold tracking-tight mb-4">Resolid</h1>
        <p class="text-xl text-muted-foreground mb-8">
          一个用于完善 SolidJS 生态相关 UI 与工具库的项目
        </p>
        <div class="flex gap-4 justify-center">
          <A
            href="/components"
            class="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
          >
            查看组件
          </A>
          <A
            href="/solidflow"
            class="inline-flex items-center justify-center rounded-md border border-input bg-background px-6 py-3 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground"
          >
            Flow 流程图
          </A>
        </div>
      </div>
    </div>
  );
};

