/**
 * SolidFlow 页面 - Flow 流程图示例
 */

import type { Component } from "solid-js";
import { createSignal, For, createMemo } from "solid-js";
import {
  FlowExample,
  FlowCustomNodeExample,
  FlowInteractiveExample,
  FlowEditorExample,
  FlowUndoRedoExample,
  FlowCopyPasteExample,
  FlowAlignmentExample,
  FlowNodeGroupExample,
  FlowImportExportExample,
  FlowWaypointExample,
} from "../examples";

type FlowExampleType = "basic" | "custom-node" | "interactive" | "editor" | "undo-redo" | "copy-paste" | "alignment" | "node-group" | "import-export" | "waypoint";

interface FlowExampleItem {
  id: FlowExampleType;
  name: string;
  component: Component;
  icon: string;
  description: string;
  difficulty: string;
  features: string[];
}

const getFlowExamples = (t: any): FlowExampleItem[] => [
  { 
    id: "basic", 
    name: t().solidFlowPage.examples.basic.name, 
    component: FlowExample,
    icon: "🎯",
    description: t().solidFlowPage.examples.basic.description,
    difficulty: t().solidFlowPage.difficulties.easy,
    features: t().solidFlowPage.examples.basic.features
  },
  {
    id: "custom-node",
    name: t().solidFlowPage.examples.customNode.name,
    component: FlowCustomNodeExample,
    icon: "🎨",
    description: t().solidFlowPage.examples.customNode.description,
    difficulty: t().solidFlowPage.difficulties.medium,
    features: t().solidFlowPage.examples.customNode.features
  },
  {
    id: "interactive",
    name: t().solidFlowPage.examples.interactive.name,
    component: FlowInteractiveExample,
    icon: "🎮",
    description: t().solidFlowPage.examples.interactive.description,
    difficulty: t().solidFlowPage.difficulties.medium,
    features: t().solidFlowPage.examples.interactive.features
  },
  {
    id: "editor",
    name: t().solidFlowPage.examples.editor.name,
    component: FlowEditorExample,
    icon: "✨",
    description: t().solidFlowPage.examples.editor.description,
    difficulty: t().solidFlowPage.difficulties.advanced,
    features: t().solidFlowPage.examples.editor.features
  },
  {
    id: "undo-redo",
    name: t().solidFlowPage.examples.undoRedo.name,
    component: FlowUndoRedoExample,
    icon: "↶",
    description: t().solidFlowPage.examples.undoRedo.description,
    difficulty: t().solidFlowPage.difficulties.medium,
    features: t().solidFlowPage.examples.undoRedo.features
  },
  {
    id: "copy-paste",
    name: t().solidFlowPage.examples.copyPaste.name,
    component: FlowCopyPasteExample,
    icon: "📋",
    description: t().solidFlowPage.examples.copyPaste.description,
    difficulty: t().solidFlowPage.difficulties.easy,
    features: t().solidFlowPage.examples.copyPaste.features
  },
  {
    id: "alignment",
    name: t().solidFlowPage.examples.alignment.name,
    component: FlowAlignmentExample,
    icon: "📐",
    description: t().solidFlowPage.examples.alignment.description,
    difficulty: t().solidFlowPage.difficulties.medium,
    features: t().solidFlowPage.examples.alignment.features
  },
  {
    id: "node-group",
    name: t().solidFlowPage.examples.nodeGroup.name,
    component: FlowNodeGroupExample,
    icon: "📦",
    description: t().solidFlowPage.examples.nodeGroup.description,
    difficulty: t().solidFlowPage.difficulties.medium,
    features: t().solidFlowPage.examples.nodeGroup.features
  },
  {
    id: "import-export",
    name: t().solidFlowPage.examples.importExport.name,
    component: FlowImportExportExample,
    icon: "💾",
    description: t().solidFlowPage.examples.importExport.description,
    difficulty: t().solidFlowPage.difficulties.easy,
    features: t().solidFlowPage.examples.importExport.features
  },
  {
    id: "waypoint",
    name: t().solidFlowPage.examples.waypoint.name,
    component: FlowWaypointExample,
    icon: "📍",
    description: t().solidFlowPage.examples.waypoint.description,
    difficulty: t().solidFlowPage.difficulties.medium,
    features: t().solidFlowPage.examples.waypoint.features
  },
];

import { useI18n } from "../i18n";

export const SolidFlowPage: Component = () => {
  const { t } = useI18n();
  const flowExamples = getFlowExamples(t);
  const [currentExample, setCurrentExample] = createSignal<FlowExampleType>("basic");

  const currentExampleDetail = createMemo(() => {
    return flowExamples.find((e: FlowExampleItem) => e.id === currentExample());
  });

  const getDifficultyColor = (difficulty: string) => {
    if (difficulty === t().solidFlowPage.difficulties.easy) return "from-green-500 to-emerald-500";
    if (difficulty === t().solidFlowPage.difficulties.medium) return "from-yellow-500 to-orange-500";
    if (difficulty === t().solidFlowPage.difficulties.advanced) return "from-red-500 to-pink-500";
    return "from-blue-500 to-cyan-500";
  };

  return (
    <div class="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* 顶部标题区域 */}
      <div class="border-b bg-background/50 backdrop-blur-sm sticky top-0 z-10">
        <div class="container mx-auto px-4 py-6">
          <div class="flex items-center justify-between">
            <div>
              <div class="inline-flex items-center gap-2 mb-2 px-3 py-1 rounded-full bg-gradient-to-r from-blue-500/10 to-cyan-500/10 backdrop-blur-sm border border-blue-500/20">
                <span class="text-xl">🌊</span>
                <span class="text-xs font-medium bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  SolidFlow
                </span>
              </div>
              <h1 class="text-3xl font-bold tracking-tight mb-2 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent">
                {t().solidFlowPage.title}
              </h1>
              <p class="text-muted-foreground">
                {t().solidFlowPage.subtitle}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="container mx-auto px-4 py-6">
        <div class="flex gap-6">
          {/* 左侧导航栏 */}
          <aside class="w-80 shrink-0">
            <div class="sticky top-32 space-y-4">
              {/* 功能特性卡片 */}
              <div class="relative group">
                <div class="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
                <div class="relative bg-card border-2 border-muted rounded-xl p-4">
                  <div class="flex items-center gap-2 mb-3">
                    <span class="text-lg">⚡</span>
                    <span class="text-sm font-semibold">{t().solidFlowPage.features.title}</span>
                  </div>
                  <div class="space-y-2 text-xs text-muted-foreground">
                    <For each={t().solidFlowPage.features.items}>
                      {(feature) => (
                        <div class="flex items-center gap-2">
                          <span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                          <span>{feature}</span>
                        </div>
                      )}
                    </For>
                  </div>
                </div>
              </div>

              {/* 示例列表 */}
              <nav class="bg-card border-2 border-muted rounded-xl p-4">
                <div class="flex items-center gap-2 mb-3">
                  <span class="text-lg">📚</span>
                  <span class="text-sm font-semibold">{t().solidFlowPage.exampleList}</span>
                </div>
                <div class="space-y-2">
                  <For each={flowExamples}>
                    {(example) => (
                      <button
                        type="button"
                        onClick={() => setCurrentExample(example.id)}
                        class={`group w-full text-left px-4 py-3 rounded-xl text-sm transition-all duration-300 relative overflow-hidden ${
                          currentExample() === example.id
                            ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-medium shadow-lg shadow-blue-500/25"
                            : "bg-muted/50 hover:bg-muted hover:translate-x-1"
                        }`}
                      >
                        <div class="flex items-start gap-3">
                          <span class="text-2xl mt-0.5">{example.icon}</span>
                          <div class="flex-1 min-w-0">
                            <div class="font-medium mb-1">{example.name}</div>
                            <div class={`text-xs mb-2 line-clamp-2 ${
                              currentExample() === example.id 
                                ? "text-white/80" 
                                : "text-muted-foreground"
                            }`}>
                              {example.description}
                            </div>
                            <div class="flex items-center gap-2">
                              <span class={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                currentExample() === example.id
                                  ? "bg-white/20 text-white"
                                  : `bg-gradient-to-r ${getDifficultyColor(example.difficulty)} bg-clip-text text-transparent`
                              }`}>
                                {example.difficulty}
                              </span>
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
              <div class="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-blue-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div class="relative bg-card border-2 border-muted rounded-2xl shadow-xl overflow-hidden">
                {/* 示例信息头部 */}
                {currentExampleDetail() && (
                  <div class="bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-blue-500/10 border-b border-border p-6 backdrop-blur-sm">
                    <div class="flex items-start gap-4">
                      <div class="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 text-3xl">
                        {currentExampleDetail()!.icon}
                      </div>
                      <div class="flex-1">
                        <div class="flex items-center gap-3 mb-2">
                          <h2 class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                            {currentExampleDetail()!.name}
                          </h2>
                          <span class={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getDifficultyColor(currentExampleDetail()!.difficulty)} text-white shadow-lg`}>
                            {currentExampleDetail()!.difficulty}
                          </span>
                        </div>
                        <p class="text-sm text-muted-foreground mb-3">
                          {currentExampleDetail()!.description}
                        </p>
                        <div class="flex flex-wrap gap-2">
                          <For each={currentExampleDetail()!.features}>
                            {(feature) => (
                              <span class="px-2 py-1 rounded-md bg-blue-500/10 text-blue-600 text-xs font-medium border border-blue-500/20">
                                {feature}
                              </span>
                            )}
                          </For>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 示例内容 */}
                <div class="p-0">
                  {(() => {
                    const selectedId = currentExample();
                    const example = flowExamples.find((e: FlowExampleItem) => e.id === selectedId);
                    const Component = example ? example.component : FlowExample;
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

