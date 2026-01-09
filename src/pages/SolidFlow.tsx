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
} from "../examples";

type FlowExampleType = "basic" | "custom-node" | "interactive" | "editor" | "undo-redo" | "copy-paste" | "alignment" | "node-group" | "import-export";

interface FlowExampleItem {
  id: FlowExampleType;
  name: string;
  component: Component;
  icon: string;
  description: string;
  difficulty: "简单" | "中等" | "高级";
  features: string[];
}

const flowExamples: FlowExampleItem[] = [
  { 
    id: "basic", 
    name: "基础示例", 
    component: FlowExample,
    icon: "🎯",
    description: "展示 SolidFlow 的基础用法和核心功能",
    difficulty: "简单",
    features: ["节点渲染", "边连接", "基础交互"]
  },
  {
    id: "custom-node",
    name: "自定义节点",
    component: FlowCustomNodeExample,
    icon: "🎨",
    description: "创建和使用自定义样式的节点组件",
    difficulty: "中等",
    features: ["自定义样式", "节点类型", "动态渲染"]
  },
  {
    id: "interactive",
    name: "交互式示例",
    component: FlowInteractiveExample,
    icon: "🎮",
    description: "支持拖拽、缩放、选择等丰富交互功能",
    difficulty: "中等",
    features: ["拖拽节点", "画布缩放", "节点选择", "连线交互"]
  },
  {
    id: "editor",
    name: "完整编辑器",
    component: FlowEditorExample,
    icon: "✨",
    description: "功能完整的流程图编辑器，支持所有高级特性",
    difficulty: "高级",
    features: ["完整编辑", "撤销重做", "导入导出", "快捷键", "工具栏"]
  },
  {
    id: "undo-redo",
    name: "撤销/重做",
    component: FlowUndoRedoExample,
    icon: "↶",
    description: "展示历史记录管理和撤销/重做功能",
    difficulty: "中等",
    features: ["历史记录", "撤销重做", "键盘快捷键", "状态管理"]
  },
  {
    id: "copy-paste",
    name: "复制粘贴",
    component: FlowCopyPasteExample,
    icon: "📋",
    description: "展示节点和边的复制粘贴功能",
    difficulty: "简单",
    features: ["复制节点", "粘贴节点", "自动生成ID", "相关边复制"]
  },
  {
    id: "alignment",
    name: "节点对齐",
    component: FlowAlignmentExample,
    icon: "📐",
    description: "展示节点对齐辅助线和网格对齐功能",
    difficulty: "中等",
    features: ["对齐辅助线", "网格对齐", "智能吸附", "视觉反馈"]
  },
  {
    id: "node-group",
    name: "节点分组",
    component: FlowNodeGroupExample,
    icon: "📦",
    description: "展示节点分组和嵌套节点功能",
    difficulty: "中等",
    features: ["父节点", "子节点", "边界限制", "嵌套结构"]
  },
  {
    id: "import-export",
    name: "导入导出",
    component: FlowImportExportExample,
    icon: "💾",
    description: "展示流程图的导入导出功能",
    difficulty: "简单",
    features: ["JSON导出", "JSON导入", "版本兼容", "文件操作"]
  },
];

export const SolidFlowPage: Component = () => {
  const [currentExample, setCurrentExample] = createSignal<FlowExampleType>("basic");

  const currentExampleDetail = createMemo(() => {
    return flowExamples.find((e) => e.id === currentExample());
  });

  const difficultyColors = {
    "简单": "from-green-500 to-emerald-500",
    "中等": "from-yellow-500 to-orange-500",
    "高级": "from-red-500 to-pink-500",
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
                流程图编辑器
              </h1>
              <p class="text-muted-foreground">
                高性能的 SolidJS 流程图组件库，支持复杂的工作流编辑
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
                    <span class="text-sm font-semibold">核心特性</span>
                  </div>
                  <div class="space-y-2 text-xs text-muted-foreground">
                    <div class="flex items-center gap-2">
                      <span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                      <span>高性能渲染引擎</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <span class="w-1.5 h-1.5 rounded-full bg-cyan-500"></span>
                      <span>丰富的交互功能</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                      <span>完全可定制化</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <span class="w-1.5 h-1.5 rounded-full bg-cyan-500"></span>
                      <span>TypeScript 支持</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 示例列表 */}
              <nav class="bg-card border-2 border-muted rounded-xl p-4">
                <div class="flex items-center gap-2 mb-3">
                  <span class="text-lg">📚</span>
                  <span class="text-sm font-semibold">示例列表</span>
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
                                  : `bg-gradient-to-r ${difficultyColors[example.difficulty]} bg-clip-text text-transparent`
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
                          <span class={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${difficultyColors[currentExampleDetail()!.difficulty]} text-white shadow-lg`}>
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
                    const example = flowExamples.find((e) => e.id === selectedId);
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

