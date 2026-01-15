/**
 * Components 页面 - 展示所有组件示例
 */

import type { Component } from "solid-js";
import { createSignal, For, Show, createMemo } from "solid-js";
import {
  AccordionExample,
  AlertDialogExample,
  AvatarExample,
  ButtonExample,
  CardExample,
  CheckboxExample,
  CollapsibleExample,
  ContextMenuExample,
  DialogExample,
  DropdownMenuExample,
  HoverCardExample,
  PopoverExample,
  ProgressExample,
  ScrollAreaExample,
  SelectExample,
  SeparatorExample,
  SliderExample,
  SwitchExample,
  TabsExample,
  ToggleExample,
  ToggleGroupExample,
  TooltipExample,
  AspectRatioExample,
  MenubarExample,
  ToolbarExample,
  NavigationMenuExample,
} from "../examples";
import { useI18n } from "../i18n";

type ExampleType =
  | "button"
  | "card"
  | "dialog"
  | "checkbox"
  | "switch"
  | "tabs"
  | "accordion"
  | "separator"
  | "alert-dialog"
  | "popover"
  | "dropdown-menu"
  | "tooltip"
  | "select"
  | "slider"
  | "progress"
  | "toggle"
  | "avatar"
  | "collapsible"
  | "context-menu"
  | "hover-card"
  | "scroll-area"
  | "toggle-group"
  | "aspect-ratio"
  | "menubar"
  | "toolbar"
  | "navigation-menu";

type ComponentCategory = string;

interface ExampleItem {
  id: ExampleType;
  name: string;
  component: Component;
  category: ComponentCategory;
  icon: string;
  description: string;
}

const getExamples = (t: any): ExampleItem[] => [
  { 
    id: "button", 
    name: t().components.button, 
    component: ButtonExample,
    category: t().componentsPage.categories.base,
    icon: "🔘",
    description: t().componentsPage.descriptions.button
  },
  { 
    id: "card", 
    name: t().components.card, 
    component: CardExample,
    category: t().componentsPage.categories.data,
    icon: "🃏",
    description: t().componentsPage.descriptions.card
  },
  { 
    id: "dialog", 
    name: t().components.dialog, 
    component: DialogExample,
    category: t().componentsPage.categories.feedback,
    icon: "💬",
    description: t().componentsPage.descriptions.dialog
  },
  {
    id: "checkbox",
    name: t().components.checkbox,
    component: CheckboxExample,
    category: t().componentsPage.categories.form,
    icon: "☑️",
    description: t().componentsPage.descriptions.checkbox
  },
  { 
    id: "switch", 
    name: t().components.switch, 
    component: SwitchExample,
    category: t().componentsPage.categories.form,
    icon: "🎚️",
    description: t().componentsPage.descriptions.switch
  },
  { 
    id: "tabs", 
    name: t().components.tabs, 
    component: TabsExample,
    category: t().componentsPage.categories.navigation,
    icon: "📑",
    description: t().componentsPage.descriptions.tabs
  },
  {
    id: "accordion",
    name: t().components.accordion,
    component: AccordionExample,
    category: t().componentsPage.categories.data,
    icon: "📋",
    description: t().componentsPage.descriptions.accordion
  },
  {
    id: "separator",
    name: t().components.separator,
    component: SeparatorExample,
    category: t().componentsPage.categories.layout,
    icon: "➖",
    description: t().componentsPage.descriptions.separator
  },
  {
    id: "alert-dialog",
    name: t().components.alertDialog,
    component: AlertDialogExample,
    category: t().componentsPage.categories.feedback,
    icon: "⚠️",
    description: t().componentsPage.descriptions.alertDialog
  },
  { 
    id: "popover", 
    name: t().components.popover, 
    component: PopoverExample,
    category: t().componentsPage.categories.feedback,
    icon: "💭",
    description: t().componentsPage.descriptions.popover
  },
  {
    id: "dropdown-menu",
    name: t().components.dropdownMenu,
    component: DropdownMenuExample,
    category: t().componentsPage.categories.navigation,
    icon: "📝",
    description: t().componentsPage.descriptions.dropdownMenu
  },
  { 
    id: "tooltip", 
    name: t().components.tooltip, 
    component: TooltipExample,
    category: t().componentsPage.categories.feedback,
    icon: "💡",
    description: t().componentsPage.descriptions.tooltip
  },
  { 
    id: "select", 
    name: t().components.select, 
    component: SelectExample,
    category: t().componentsPage.categories.form,
    icon: "🔽",
    description: t().componentsPage.descriptions.select
  },
  { 
    id: "slider", 
    name: t().components.slider, 
    component: SliderExample,
    category: t().componentsPage.categories.form,
    icon: "🎚️",
    description: t().componentsPage.descriptions.slider
  },
  {
    id: "progress",
    name: t().components.progress,
    component: ProgressExample,
    category: t().componentsPage.categories.feedback,
    icon: "📊",
    description: t().componentsPage.descriptions.progress
  },
  { 
    id: "toggle", 
    name: t().components.toggle, 
    component: ToggleExample,
    category: t().componentsPage.categories.form,
    icon: "🔀",
    description: t().componentsPage.descriptions.toggle
  },
  { 
    id: "avatar", 
    name: t().components.avatar, 
    component: AvatarExample,
    category: t().componentsPage.categories.data,
    icon: "👤",
    description: t().componentsPage.descriptions.avatar
  },
  {
    id: "collapsible",
    name: t().components.collapsible,
    component: CollapsibleExample,
    category: t().componentsPage.categories.data,
    icon: "🔽",
    description: t().componentsPage.descriptions.collapsible
  },
  {
    id: "context-menu",
    name: t().components.contextMenu,
    component: ContextMenuExample,
    category: t().componentsPage.categories.navigation,
    icon: "🖱️",
    description: t().componentsPage.descriptions.contextMenu
  },
  {
    id: "hover-card",
    name: t().components.hoverCard,
    component: HoverCardExample,
    category: t().componentsPage.categories.data,
    icon: "🎴",
    description: t().componentsPage.descriptions.hoverCard
  },
  {
    id: "scroll-area",
    name: t().components.scrollArea,
    component: ScrollAreaExample,
    category: t().componentsPage.categories.layout,
    icon: "📜",
    description: t().componentsPage.descriptions.scrollArea
  },
  {
    id: "toggle-group",
    name: t().components.toggleGroup,
    component: ToggleGroupExample,
    category: t().componentsPage.categories.form,
    icon: "🔘",
    description: t().componentsPage.descriptions.toggleGroup
  },
  {
    id: "aspect-ratio",
    name: t().components.aspectRatio,
    component: AspectRatioExample,
    category: t().componentsPage.categories.layout,
    icon: "🖼️",
    description: t().componentsPage.descriptions.aspectRatio
  },
  {
    id: "menubar",
    name: t().components.menubar,
    component: MenubarExample,
    category: t().componentsPage.categories.navigation,
    icon: "📋",
    description: t().componentsPage.descriptions.menubar
  },
  {
    id: "toolbar",
    name: t().components.toolbar,
    component: ToolbarExample,
    category: t().componentsPage.categories.navigation,
    icon: "🛠️",
    description: t().componentsPage.descriptions.toolbar
  },
  {
    id: "navigation-menu",
    name: t().components.navigationMenu,
    component: NavigationMenuExample,
    category: t().componentsPage.categories.navigation,
    icon: "🧭",
    description: t().componentsPage.descriptions.navigationMenu
  },
];

export const ComponentsPage: Component = () => {
  const { t } = useI18n();
  const [currentExample, setCurrentExample] = createSignal<ExampleType>("button");
  const [searchQuery, setSearchQuery] = createSignal("");
  const [selectedCategory, setSelectedCategory] = createSignal<string>(t().componentsPage.allCategories);
  const examples = () => getExamples(t);

  const categories = () => [
    t().componentsPage.allCategories,
    t().componentsPage.categories.base,
    t().componentsPage.categories.form,
    t().componentsPage.categories.feedback,
    t().componentsPage.categories.navigation,
    t().componentsPage.categories.data,
    t().componentsPage.categories.layout,
  ];

  // 过滤后的组件列表
  const filteredExamples = createMemo(() => {
    let filtered = examples();
    
    // 分类过滤
    if (selectedCategory() !== t().componentsPage.allCategories) {
      filtered = filtered.filter((e) => e.category === selectedCategory());
    }
    
    // 搜索过滤
    if (searchQuery()) {
      const query = searchQuery().toLowerCase();
      filtered = filtered.filter((e) => 
        e.name.toLowerCase().includes(query) ||
        e.description.toLowerCase().includes(query) ||
        e.id.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  });

  // 获取当前选中的组件详情
  const currentExampleDetail = createMemo(() => {
    return examples().find((e) => e.id === currentExample());
  });

  // 统计信息
  const stats = createMemo(() => {
    const all = examples();
    return {
      total: all.length,
      categories: [...new Set(all.map(e => e.category))].length,
    };
  });

  return (
    <div class="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* 顶部标题区域 */}
      <div class="border-b bg-background/50 backdrop-blur-sm sticky top-0 z-10">
        <div class="container mx-auto px-4 py-6">
          <div class="flex items-center justify-between">
            <div>
              <div class="inline-flex items-center gap-2 mb-2 px-3 py-1 rounded-full bg-primary/10 backdrop-blur-sm border border-primary/20">
                <span class="text-xl">📦</span>
                <span class="text-xs font-medium text-primary">Component Library</span>
              </div>
              <h1 class="text-3xl font-bold tracking-tight mb-2 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
                {t().componentsPage.title}
              </h1>
              <p class="text-muted-foreground">
                {t().componentsPage.subtitle.replace("{total}", stats().total.toString()).replace("{categories}", stats().categories.toString())}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="container mx-auto px-4 py-6">
        <div class="flex gap-6">
          {/* 左侧导航栏 */}
          <aside class="w-72 shrink-0">
            <div class="sticky top-32 space-y-4">
              {/* 搜索框 */}
              <div class="relative group">
                <div class="absolute inset-0 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div class="relative bg-card border-2 border-muted rounded-xl p-4 transition-all duration-300 group-hover:border-primary/30">
                  <div class="flex items-center gap-2 mb-2">
                    <span class="text-lg">🔍</span>
                    <span class="text-sm font-semibold">{t().componentsPage.searchPlaceholder}</span>
                  </div>
                  <input
                    type="text"
                    placeholder={t().componentsPage.searchBoxPlaceholder}
                    value={searchQuery()}
                    onInput={(e) => setSearchQuery(e.currentTarget.value)}
                    class="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                  <Show when={searchQuery()}>
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      class="absolute right-6 top-[52px] text-muted-foreground hover:text-foreground transition-colors"
                    >
                      ✕
                    </button>
                  </Show>
                </div>
              </div>

              {/* 分类过滤 */}
              <div class="bg-card border-2 border-muted rounded-xl p-4">
                <div class="flex items-center gap-2 mb-3">
                  <span class="text-lg">📂</span>
                  <span class="text-sm font-semibold">{t().componentsPage.categoriesTitle}</span>
                </div>
                <div class="flex flex-wrap gap-2">
                  <For each={categories()}>
                    {(category) => (
                      <button
                        type="button"
                        onClick={() => setSelectedCategory(category)}
                        class={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 ${
                          selectedCategory() === category
                            ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/25 scale-105"
                            : "bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground hover:scale-105"
                        }`}
                      >
                        {category}
                      </button>
                    )}
                  </For>
                </div>
              </div>

              {/* 组件列表 */}
              <nav class="bg-card border-2 border-muted rounded-xl p-4">
                <div class="flex items-center justify-between mb-3">
                  <div class="flex items-center gap-2">
                    <span class="text-lg">📋</span>
                    <span class="text-sm font-semibold">组件列表</span>
                  </div>
                  <span class="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                    {filteredExamples().length}
                  </span>
                </div>
                <div class="space-y-1 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin">
                  <For each={filteredExamples()}>
                    {(example) => (
                      <button
                        type="button"
                        onClick={() => setCurrentExample(example.id)}
                        class={`group w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all duration-300 relative ${
                          currentExample() === example.id
                            ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-medium shadow-lg shadow-primary/25"
                            : "hover:bg-accent hover:text-accent-foreground hover:translate-x-1"
                        }`}
                      >
                        <div class="flex items-center gap-2">
                          <span class="text-base">{example.icon}</span>
                          <div class="flex-1">
                            <div class="font-medium">{example.name}</div>
                            <div class={`text-xs mt-0.5 ${
                              currentExample() === example.id 
                                ? "text-primary-foreground/80" 
                                : "text-muted-foreground"
                            }`}>
                              {example.description}
                            </div>
                          </div>
                        </div>
                      </button>
                    )}
                  </For>
                </div>
              </nav>
            </div>
          </aside>

          {/* 主内容区 */}
          <main class="flex-1 min-w-0">
            <div class="relative group">
              {/* 发光效果 */}
              <div class="absolute -inset-1 bg-gradient-to-r from-primary/20 via-blue-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div class="relative bg-card border-2 border-muted rounded-2xl shadow-xl overflow-hidden">
                {/* 组件信息头部 */}
                <Show when={currentExampleDetail()}>
                  {(detail) => (
                    <div class="bg-gradient-to-r from-primary/10 via-blue-500/10 to-purple-500/10 border-b border-border p-6 backdrop-blur-sm">
                      <div class="flex items-start gap-4">
                        <div class="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-blue-500/20 text-3xl">
                          {detail().icon}
                        </div>
                        <div class="flex-1">
                          <div class="flex items-center gap-3 mb-2">
                            <h2 class="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                              {detail().name}
                            </h2>
                            <span class="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                              {detail().category}
                            </span>
                          </div>
                          <p class="text-sm text-muted-foreground">
                            {detail().description}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </Show>

                {/* 组件示例内容 */}
                <div class="p-8">
                  {(() => {
                    const selectedId = currentExample();
                    const example = examples().find((e) => e.id === selectedId);
                    const Component = example ? example.component : ButtonExample;
                    return <Component />;
                  })()}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

