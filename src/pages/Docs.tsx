/**
 * Docs 页面
 */

import type { Component } from "solid-js";
import { createSignal } from "solid-js";

export const DocsPage: Component = () => {
  const [activeSection, setActiveSection] = createSignal("overview");

  const sections = [
    { id: "overview", title: "项目概述" },
    { id: "installation", title: "安装指南" },
    { id: "radix", title: "@ensolid/radix" },
    { id: "baseui", title: "@ensolid/baseui" },
    { id: "solidflow", title: "@ensolid/solidflow" },
    { id: "ui-components", title: "UI 组件" },
    { id: "development", title: "开发指南" },
  ];

  return (
    <div class="container mx-auto px-4 py-12">
      <div class="max-w-6xl mx-auto">
        <div class="mb-8">
          <h1 class="text-4xl font-bold tracking-tight mb-4">文档</h1>
          <p class="text-lg text-muted-foreground">
            完整的项目使用指南和库集成说明
          </p>
        </div>

        <div class="flex gap-8">
          {/* 侧边栏导航 */}
          <aside class="w-64 flex-shrink-0 hidden lg:block">
            <nav class="sticky top-4 space-y-1">
              {sections.map((section) => (
                <button
                  onClick={() => setActiveSection(section.id)}
                  class={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                    activeSection() === section.id
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {section.title}
                </button>
              ))}
            </nav>
          </aside>

          {/* 内容区域 */}
          <div class="flex-1 min-w-0">
            <div class="prose prose-slate dark:prose-invert max-w-none">
              {/* 项目概述 */}
              {activeSection() === "overview" && (
                <section class="space-y-6">
                  <h2 class="text-3xl font-bold">项目概述</h2>
                  <div class="space-y-4">
                    <p>
                      Resolid 是一个用于完善 SolidJS 生态相关 UI 与工具库的项目。
                      本项目致力于将 React 生态系统中优秀的库和 UI 组件移植到 SolidJS 生态中，
                      以丰富 SolidJS 的生态系统，为开发者提供更多可用的工具和组件。
                    </p>
                    <p>
                      本项目采用 Monorepo 架构，包含多个独立的组件库包，每个包都可以独立使用和发布。
                    </p>

                    <h3 class="text-2xl font-semibold mt-8">项目特点</h3>
                    <ul class="list-disc pl-6 space-y-2">
                      <li>✅ 完整的 TypeScript 类型支持</li>
                      <li>✅ SSR 兼容性</li>
                      <li>✅ Tree Shaking 支持</li>
                      <li>✅ Monorepo 架构</li>
                      <li>✅ 独立构建和发布</li>
                    </ul>

                    <h3 class="text-2xl font-semibold mt-8">包含的库</h3>
                    <div class="grid gap-4 md:grid-cols-3 mt-4">
                      <div class="p-4 border rounded-lg">
                        <h4 class="font-semibold mb-2">@ensolid/radix</h4>
                        <p class="text-sm text-muted-foreground">
                          基于 Radix UI Primitives 移植，提供无样式、可访问的基础组件
                        </p>
                      </div>
                      <div class="p-4 border rounded-lg">
                        <h4 class="font-semibold mb-2">@ensolid/baseui</h4>
                        <p class="text-sm text-muted-foreground">
                          基于 BaseUI 移植，提供企业级 UI 组件库
                        </p>
                      </div>
                      <div class="p-4 border rounded-lg">
                        <h4 class="font-semibold mb-2">@ensolid/solidflow</h4>
                        <p class="text-sm text-muted-foreground">
                          基于 React Flow 移植，提供流程图和节点编辑器功能
                        </p>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {/* 安装指南 */}
              {activeSection() === "installation" && (
                <section class="space-y-6">
                  <h2 class="text-3xl font-bold">安装指南</h2>
                  <div class="space-y-6">
                    <div>
                      <h3 class="text-2xl font-semibold mb-4">环境要求</h3>
                      <ul class="list-disc pl-6 space-y-2">
                        <li>Node.js 18+</li>
                        <li>pnpm 8+（推荐使用 pnpm 作为包管理器）</li>
                        <li>SolidJS 1.9+</li>
                      </ul>
                    </div>

                    <div>
                      <h3 class="text-2xl font-semibold mb-4">安装 pnpm</h3>
                      <p class="mb-2">如果还没有安装 pnpm，可以通过以下方式安装：</p>
                      <pre class="bg-muted p-4 rounded-lg overflow-x-auto">
                        <code>npm install -g pnpm</code>
                      </pre>
                    </div>

                    <div>
                      <h3 class="text-2xl font-semibold mb-4">克隆项目</h3>
                      <pre class="bg-muted p-4 rounded-lg overflow-x-auto">
                        <code>git clone https://github.com/your-org/resolid.git
cd resolid</code>
                      </pre>
                    </div>

                    <div>
                      <h3 class="text-2xl font-semibold mb-4">安装依赖</h3>
                      <pre class="bg-muted p-4 rounded-lg overflow-x-auto">
                        <code>pnpm install</code>
                      </pre>
                    </div>

                    <div>
                      <h3 class="text-2xl font-semibold mb-4">开发模式</h3>
                      <p class="mb-2">启动开发服务器：</p>
                      <pre class="bg-muted p-4 rounded-lg overflow-x-auto">
                        <code>pnpm dev</code>
                      </pre>
                      <p class="mt-2 text-sm text-muted-foreground">
                        开发服务器将在 http://localhost:5173 启动
                      </p>
                    </div>

                    <div>
                      <h3 class="text-2xl font-semibold mb-4">构建项目</h3>
                      <p class="mb-2">构建所有包：</p>
                      <pre class="bg-muted p-4 rounded-lg overflow-x-auto">
                        <code>pnpm build</code>
                      </pre>
                      <p class="mt-2 mb-2">构建单个包：</p>
                      <pre class="bg-muted p-4 rounded-lg overflow-x-auto">
                        <code>pnpm build:radix
pnpm build:baseui
pnpm build:solidflow</code>
                      </pre>
                    </div>
                  </div>
                </section>
              )}

              {/* @ensolid/radix */}
              {activeSection() === "radix" && (
                <section class="space-y-6">
                  <h2 class="text-3xl font-bold">@ensolid/radix</h2>
                  <div class="space-y-6">
                    <div>
                      <p>
                        <code class="bg-muted px-2 py-1 rounded">@ensolid/radix</code> 是基于{" "}
                        <a
                          href="https://www.radix-ui.com/primitives"
                          target="_blank"
                          rel="noopener noreferrer"
                          class="text-primary hover:underline"
                        >
                          Radix UI Primitives
                        </a>{" "}
                        移植的 SolidJS 版本，提供无样式、可访问的基础组件。
                      </p>
                    </div>

                    <div>
                      <h3 class="text-2xl font-semibold mb-4">安装</h3>
                      <pre class="bg-muted p-4 rounded-lg overflow-x-auto">
                        <code>pnpm add @ensolid/radix</code>
                      </pre>
                    </div>

                    <div>
                      <h3 class="text-2xl font-semibold mb-4">基本使用</h3>
                      <p class="mb-2">导入组件：</p>
                      <pre class="bg-muted p-4 rounded-lg overflow-x-auto">
                        <code>{`import { Dialog, Button } from "@ensolid/radix";`}</code>
                      </pre>
                      <p class="mt-4 mb-2">使用示例：</p>
                      <pre class="bg-muted p-4 rounded-lg overflow-x-auto">
                        <code>{`import { Dialog } from "@ensolid/radix";

function App() {
  return (
    <Dialog>
      <Dialog.Trigger>打开对话框</Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Title>标题</Dialog.Title>
        <Dialog.Description>描述</Dialog.Description>
      </Dialog.Content>
    </Dialog>
  );
}`}</code>
                      </pre>
                    </div>

                    <div>
                      <h3 class="text-2xl font-semibold mb-4">按需导入</h3>
                      <p class="mb-2">
                        支持按需导入，减少打包体积。可以使用子路径导入：
                      </p>
                      <pre class="bg-muted p-4 rounded-lg overflow-x-auto">
                        <code>{`import { Dialog } from "@ensolid/radix/Dialog";
import { Checkbox } from "@ensolid/radix/Checkbox";`}</code>
                      </pre>
                    </div>

                    <div>
                      <h3 class="text-2xl font-semibold mb-4">特点</h3>
                      <ul class="list-disc pl-6 space-y-2">
                        <li>✅ 完整的可访问性支持（ARIA 属性）</li>
                        <li>✅ 无样式设计，完全可定制</li>
                        <li>✅ 支持受控和非受控模式</li>
                        <li>✅ 完整的 TypeScript 类型定义</li>
                        <li>✅ SSR 兼容</li>
                      </ul>
                    </div>

                    <div>
                      <h3 class="text-2xl font-semibold mb-4">可用组件</h3>
                      <div class="grid gap-2 md:grid-cols-2">
                        <div class="p-3 border rounded text-sm">
                          <strong>基础组件：</strong> Separator, Label, AspectRatio
                        </div>
                        <div class="p-3 border rounded text-sm">
                          <strong>表单组件：</strong> Checkbox, Switch, RadioGroup, Select, Slider, Toggle
                        </div>
                        <div class="p-3 border rounded text-sm">
                          <strong>布局组件：</strong> Tabs, Accordion, Collapsible, ScrollArea
                        </div>
                        <div class="p-3 border rounded text-sm">
                          <strong>弹出层组件：</strong> Dialog, AlertDialog, Popover, DropdownMenu, Tooltip, HoverCard, ContextMenu, Menubar
                        </div>
                        <div class="p-3 border rounded text-sm">
                          <strong>其他组件：</strong> Progress, Avatar
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {/* @ensolid/baseui */}
              {activeSection() === "baseui" && (
                <section class="space-y-6">
                  <h2 class="text-3xl font-bold">@ensolid/baseui</h2>
                  <div class="space-y-6">
                    <div>
                      <p>
                        <code class="bg-muted px-2 py-1 rounded">@ensolid/baseui</code> 是基于{" "}
                        <a
                          href="https://baseui.org/"
                          target="_blank"
                          rel="noopener noreferrer"
                          class="text-primary hover:underline"
                        >
                          BaseUI
                        </a>{" "}
                        移植的 SolidJS 版本，提供企业级 UI 组件库。
                      </p>
                    </div>

                    <div>
                      <h3 class="text-2xl font-semibold mb-4">安装</h3>
                      <pre class="bg-muted p-4 rounded-lg overflow-x-auto">
                        <code>pnpm add @ensolid/baseui</code>
                      </pre>
                    </div>

                    <div>
                      <h3 class="text-2xl font-semibold mb-4">基本使用</h3>
                      <p class="mb-2">导入组件：</p>
                      <pre class="bg-muted p-4 rounded-lg overflow-x-auto">
                        <code>{`import { Button, Input, Card } from "@ensolid/baseui";`}</code>
                      </pre>
                      <p class="mt-4 mb-2">使用示例：</p>
                      <pre class="bg-muted p-4 rounded-lg overflow-x-auto">
                        <code>{`import { Button, Card, CardContent } from "@ensolid/baseui";

function App() {
  return (
    <Card>
      <CardContent>
        <Button variant="contained">点击我</Button>
      </CardContent>
    </Card>
  );
}`}</code>
                      </pre>
                    </div>

                    <div>
                      <h3 class="text-2xl font-semibold mb-4">特点</h3>
                      <ul class="list-disc pl-6 space-y-2">
                        <li>✅ 丰富的组件集合（59+ 个组件）</li>
                        <li>✅ Material Design 风格</li>
                        <li>✅ 完整的主题系统支持</li>
                        <li>✅ 企业级组件（表格、分页、步进器等）</li>
                        <li>✅ 完整的 TypeScript 类型定义</li>
                      </ul>
                    </div>

                    <div>
                      <h3 class="text-2xl font-semibold mb-4">主要组件类别</h3>
                      <div class="grid gap-2">
                        <div class="p-3 border rounded text-sm">
                          <strong>基础组件：</strong> Box, Paper, Container, Stack, Grid, Typography, Divider
                        </div>
                        <div class="p-3 border rounded text-sm">
                          <strong>表单组件：</strong> Button, Input, Textarea, Checkbox, Radio, Switch, Select, Slider, NumberInput
                        </div>
                        <div class="p-3 border rounded text-sm">
                          <strong>布局组件：</strong> Tabs, Accordion, Collapsible, Drawer, Modal, Dialog
                        </div>
                        <div class="p-3 border rounded text-sm">
                          <strong>数据展示：</strong> Table, TablePagination, List, Card, Avatar, Badge, Chip, Skeleton
                        </div>
                        <div class="p-3 border rounded text-sm">
                          <strong>反馈组件：</strong> Alert, AlertDialog, Snackbar, Progress, Rating
                        </div>
                        <div class="p-3 border rounded text-sm">
                          <strong>导航组件：</strong> Breadcrumbs, Menu, Pagination, Stepper
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {/* @ensolid/solidflow */}
              {activeSection() === "solidflow" && (
                <section class="space-y-6">
                  <h2 class="text-3xl font-bold">@ensolid/solidflow</h2>
                  <div class="space-y-6">
                    <div>
                      <p>
                        <code class="bg-muted px-2 py-1 rounded">@ensolid/solidflow</code> 是基于{" "}
                        <a
                          href="https://reactflow.dev/"
                          target="_blank"
                          rel="noopener noreferrer"
                          class="text-primary hover:underline"
                        >
                          React Flow
                        </a>{" "}
                        移植的 SolidJS 版本，提供流程图和节点编辑器功能。
                      </p>
                    </div>

                    <div>
                      <h3 class="text-2xl font-semibold mb-4">安装</h3>
                      <pre class="bg-muted p-4 rounded-lg overflow-x-auto">
                        <code>pnpm add @ensolid/solidflow</code>
                      </pre>
                    </div>

                    <div>
                      <h3 class="text-2xl font-semibold mb-4">基本使用</h3>
                      <p class="mb-2">导入组件：</p>
                      <pre class="bg-muted p-4 rounded-lg overflow-x-auto">
                        <code>{`import { Flow, Node, Edge } from "@ensolid/solidflow";`}</code>
                      </pre>
                      <p class="mt-4 mb-2">使用示例：</p>
                      <pre class="bg-muted p-4 rounded-lg overflow-x-auto">
                        <code>{`import { createSignal } from "solid-js";
import { Flow, Node, Edge } from "@ensolid/solidflow";

function App() {
  const [nodes, setNodes] = createSignal([
    { id: "1", position: { x: 0, y: 0 }, data: { label: "节点 1" } },
    { id: "2", position: { x: 200, y: 100 }, data: { label: "节点 2" } },
  ]);
  
  const [edges, setEdges] = createSignal([
    { id: "e1-2", source: "1", target: "2" },
  ]);

  return (
    <Flow nodes={nodes()} edges={edges()}>
      <For each={nodes()}>{(node) => <Node {...node} />}</For>
      <For each={edges()}>{(edge) => <Edge {...edge} />}</For>
    </Flow>
  );
}`}</code>
                      </pre>
                    </div>

                    <div>
                      <h3 class="text-2xl font-semibold mb-4">特点</h3>
                      <ul class="list-disc pl-6 space-y-2">
                        <li>✅ 高性能的节点图渲染</li>
                        <li>✅ 支持自定义节点和边</li>
                        <li>✅ 交互式拖拽和缩放</li>
                        <li>✅ 完整的类型定义</li>
                        <li>✅ 支持复杂的工作流编辑</li>
                      </ul>
                    </div>

                    <div>
                      <h3 class="text-2xl font-semibold mb-4">核心组件</h3>
                      <ul class="list-disc pl-6 space-y-2">
                        <li><strong>Flow</strong> - 主流程图组件</li>
                        <li><strong>Node</strong> - 节点组件</li>
                        <li><strong>Edge</strong> - 边组件</li>
                        <li><strong>Handle</strong> - 连接点组件</li>
                        <li><strong>Background</strong> - 背景网格组件</li>
                      </ul>
                    </div>
                  </div>
                </section>
              )}

              {/* UI 组件 */}
              {activeSection() === "ui-components" && (
                <section class="space-y-6">
                  <h2 class="text-3xl font-bold">UI 组件</h2>
                  <div class="space-y-6">
                    <div>
                      <p>
                        本项目还提供了基于 <code class="bg-muted px-2 py-1 rounded">@ensolid/radix</code> 实现的
                        shadcn/ui 风格组件库，提供开箱即用的样式化组件。
                      </p>
                    </div>

                    <div>
                      <h3 class="text-2xl font-semibold mb-4">特点</h3>
                      <ul class="list-disc pl-6 space-y-2">
                        <li>✅ 基于 Tailwind CSS 的现代设计</li>
                        <li>✅ 完全可定制的样式</li>
                        <li>✅ 与 shadcn/ui 设计规范一致</li>
                        <li>✅ 开箱即用的美观界面</li>
                      </ul>
                    </div>

                    <div>
                      <h3 class="text-2xl font-semibold mb-4">使用方式</h3>
                      <p class="mb-2">
                        这些组件位于 <code class="bg-muted px-2 py-1 rounded">src/components/ui/</code> 目录下，
                        可以直接复制到你的项目中使用。
                      </p>
                      <p class="mb-2">导入组件：</p>
                      <pre class="bg-muted p-4 rounded-lg overflow-x-auto">
                        <code>{`import { Button, Dialog, Card } from "@/components/ui";`}</code>
                      </pre>
                      <p class="mt-4 mb-2">使用示例：</p>
                      <pre class="bg-muted p-4 rounded-lg overflow-x-auto">
                        <code>{`import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";

function App() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>打开对话框</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>标题</DialogTitle>
          <DialogDescription>描述</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}`}</code>
                      </pre>
                    </div>

                    <div>
                      <h3 class="text-2xl font-semibold mb-4">可用组件</h3>
                      <p class="mb-2">所有 Radix 组件都有对应的 shadcn/ui 风格包装，包括：</p>
                      <div class="grid gap-2 md:grid-cols-2">
                        <div class="p-3 border rounded text-sm">
                          <strong>基础组件：</strong> Button, Card, Label, Separator, AspectRatio
                        </div>
                        <div class="p-3 border rounded text-sm">
                          <strong>表单组件：</strong> Checkbox, Switch, RadioGroup, Select, Slider, Toggle, ToggleGroup
                        </div>
                        <div class="p-3 border rounded text-sm">
                          <strong>布局组件：</strong> Tabs, Accordion, Collapsible, ScrollArea
                        </div>
                        <div class="p-3 border rounded text-sm">
                          <strong>弹出层组件：</strong> Dialog, AlertDialog, Popover, DropdownMenu, Tooltip, HoverCard, ContextMenu, Menubar
                        </div>
                        <div class="p-3 border rounded text-sm">
                          <strong>其他组件：</strong> Progress, Avatar
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {/* 开发指南 */}
              {activeSection() === "development" && (
                <section class="space-y-6">
                  <h2 class="text-3xl font-bold">开发指南</h2>
                  <div class="space-y-6">
                    <div>
                      <h3 class="text-2xl font-semibold mb-4">项目结构</h3>
                      <pre class="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                        <code>{`resolid/
├── packages/                    # Monorepo 包目录
│   ├── radix/                  # Radix UI Primitives 移植
│   ├── baseui/                 # BaseUI 组件库
│   └── solidflow/              # SolidFlow 组件库
├── src/                        # 源代码目录
│   ├── components/
│   │   └── ui/                 # shadcn/ui 风格组件
│   ├── examples/               # 组件示例
│   └── pages/                  # 页面组件
├── package.json
└── vite.config.ts`}</code>
                      </pre>
                    </div>

                    <div>
                      <h3 class="text-2xl font-semibold mb-4">开发命令</h3>
                      <div class="space-y-2">
                        <div>
                          <code class="bg-muted px-2 py-1 rounded">pnpm dev</code>
                          <span class="ml-2 text-muted-foreground">启动开发服务器</span>
                        </div>
                        <div>
                          <code class="bg-muted px-2 py-1 rounded">pnpm build</code>
                          <span class="ml-2 text-muted-foreground">构建所有包</span>
                        </div>
                        <div>
                          <code class="bg-muted px-2 py-1 rounded">pnpm build:radix</code>
                          <span class="ml-2 text-muted-foreground">构建 @ensolid/radix</span>
                        </div>
                        <div>
                          <code class="bg-muted px-2 py-1 rounded">pnpm build:baseui</code>
                          <span class="ml-2 text-muted-foreground">构建 @ensolid/baseui</span>
                        </div>
                        <div>
                          <code class="bg-muted px-2 py-1 rounded">pnpm build:solidflow</code>
                          <span class="ml-2 text-muted-foreground">构建 @ensolid/solidflow</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 class="text-2xl font-semibold mb-4">添加新组件</h3>
                      <ol class="list-decimal pl-6 space-y-2">
                        <li>在对应的包目录下创建组件文件</li>
                        <li>在 <code class="bg-muted px-2 py-1 rounded">src/index.ts</code> 中导出组件</li>
                        <li>在 <code class="bg-muted px-2 py-1 rounded">src/components/ui/</code> 创建样式化包装（如需要）</li>
                        <li>在 <code class="bg-muted px-2 py-1 rounded">src/examples/</code> 创建示例</li>
                        <li>运行构建命令验证</li>
                      </ol>
                    </div>

                    <div>
                      <h3 class="text-2xl font-semibold mb-4">注意事项</h3>
                      <div class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                        <p class="font-semibold mb-2">⚠️ 重要提示</p>
                        <p class="text-sm">
                          本项目使用 AI 完成移植工作，存在以下情况：
                        </p>
                        <ul class="list-disc pl-6 mt-2 text-sm space-y-1">
                          <li>代码可能不够完善，存在潜在问题</li>
                          <li>功能可能未完全测试</li>
                          <li>API 可能与原库存在差异</li>
                          <li>性能优化可能不足</li>
                        </ul>
                        <p class="text-sm mt-2">
                          请谨慎使用，建议在生产环境使用前进行充分测试。
                        </p>
                      </div>
                    </div>
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

