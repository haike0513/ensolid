# Resolid

一个用于完善 SolidJS 生态相关 UI 与工具库的项目。

## 📖 项目简介

Resolid 致力于将 React 生态系统中优秀的库和 UI 组件移植到 SolidJS 生态中，以丰富 SolidJS 的生态系统，为开发者提供更多可用的工具和组件。

## 🎯 项目目的

本项目的主要目的是：
- 将 React 生态中成熟的库和 UI 组件移植到 SolidJS
- 为 SolidJS 开发者提供更多可用的工具和组件选择
- 通过 AI 辅助加速移植过程

## ⚠️ 重要提示

**本项目使用 AI 完成移植工作，存在以下情况：**
- 代码可能不够完善，存在潜在问题
- 功能可能未完全测试
- API 可能与原库存在差异
- 性能优化可能不足

**请谨慎使用，建议在生产环境使用前进行充分测试。**

## 🛠️ 技术栈

- [SolidJS](https://www.solidjs.com/) - 响应式 UI 框架
- [TypeScript](https://www.typescriptlang.org/) - 类型安全
- [Vite](https://vite.dev/) - 构建工具
- [pnpm](https://pnpm.io/) - 包管理器

## 📦 安装

本项目使用 [pnpm](https://pnpm.io/) 作为包管理器。

首先确保已安装 pnpm：

```bash
npm install -g pnpm
```

然后安装项目依赖：

```bash
pnpm install
```

## 🚀 开发

### 开发模式

启动开发服务器：

```bash
pnpm dev
```

开发服务器将在 [http://localhost:5173](http://localhost:5173) 启动。

### 构建

构建生产版本：

```bash
pnpm build
```

构建产物将输出到 `dist` 目录，已进行生产优化和代码压缩。

### 预览

预览生产构建：

```bash
pnpm preview
```

## 📁 项目结构

```
resolid/
├── packages/                    # Monorepo 包目录
│   ├── radix/                  # Radix UI Primitives 移植
│   │   ├── src/
│   │   │   ├── components/    # 所有 Radix 组件
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── baseui/                 # BaseUI 组件库
│   └── solidflow/              # SolidFlow 组件库
├── components/
│   └── ui/                     # shadcn/ui 风格组件
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       └── ...                 # 更多组件
├── src/                        # 源代码目录
│   ├── examples/               # 组件示例
│   │   ├── ButtonExample.tsx
│   │   └── ...
│   ├── App.tsx                 # 主应用组件
│   └── index.tsx
├── public/                     # 静态资源
├── package.json                # 项目配置
└── vite.config.ts              # Vite 配置
```

## 📦 已移植的组件库

### @resolid/radix

基于 [Radix UI Primitives](https://www.radix-ui.com/primitives) 移植的 SolidJS 版本，提供无样式、可访问的基础组件。

#### 已移植组件（25个）

**基础组件**
- ✅ Separator - 分隔线
- ✅ Label - 标签
- ✅ AspectRatio - 宽高比
- ✅ VisuallyHidden - 视觉隐藏（辅助功能）

**表单组件**
- ✅ Checkbox - 复选框
- ✅ Switch - 开关
- ✅ RadioGroup - 单选组
- ✅ Select - 选择器
- ✅ Slider - 滑块
- ✅ Toggle - 切换按钮
- ✅ ToggleGroup - 切换组

**布局组件**
- ✅ Tabs - 标签页
- ✅ Accordion - 手风琴
- ✅ Collapsible - 可折叠
- ✅ ScrollArea - 滚动区域

**弹出层组件**
- ✅ Dialog - 对话框
- ✅ AlertDialog - 警告对话框
- ✅ Popover - 弹出框
- ✅ DropdownMenu - 下拉菜单
- ✅ Tooltip - 工具提示
- ✅ HoverCard - 悬停卡片
- ✅ ContextMenu - 上下文菜单
- ✅ Menubar - 菜单栏

**其他组件**
- ✅ Progress - 进度条
- ✅ Avatar - 头像

### components/ui

基于 `@resolid/radix` 实现的 shadcn/ui 风格组件库，提供开箱即用的样式化组件。

#### 可用组件（26个）

所有 Radix 组件都有对应的 shadcn/ui 风格包装，包括：
- **基础组件**: Button, Card, Label, Separator, AspectRatio
- **表单组件**: Checkbox, Switch, RadioGroup, Select, Slider, Toggle, ToggleGroup
- **布局组件**: Tabs, Accordion, Collapsible, ScrollArea
- **弹出层组件**: Dialog, AlertDialog, Popover, DropdownMenu, Tooltip, HoverCard, ContextMenu, Menubar
- **其他组件**: Progress, Avatar

## 🎯 使用示例

### 使用 Radix 基础组件

```tsx
import { Button, Dialog } from "@resolid/radix";

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
}
```

### 使用 shadcn/ui 风格组件

```tsx
import { Button, Dialog } from "@/components/ui";

function App() {
  return (
    <Dialog>
      <Dialog.Trigger asChild>
        <Button>打开对话框</Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>标题</Dialog.Title>
          <Dialog.Description>描述</Dialog.Description>
        </Dialog.Header>
      </Dialog.Content>
    </Dialog>
  );
}
```

## 🔄 移植工作流程

本项目使用标准化的移植流程，详见 [agents.md](./agents.md)。

### 快速开始移植新组件

1. **在 `packages/radix/src/components/` 创建组件**
   - 参考现有组件实现
   - 遵循 SolidJS 响应式模式
   - 确保 SSR 兼容
   - 使用 `splitProps` 分离 Props
   - 使用 `createSignal` 管理状态
   - 使用 `createContext` 和 `useContext` 实现组件通信

2. **在 `components/ui/` 创建 shadcn/ui 包装**
   - 基于 Radix 组件
   - 添加 Tailwind CSS 样式
   - 使用 `cn()` 合并类名
   - 保持 API 一致性

3. **在 `src/examples/` 创建示例**
   - 展示基本用法
   - 展示不同配置和变体
   - 展示交互功能

4. **更新相关文件**
   - 在 `packages/radix/src/components/index.ts` 中导出
   - 在 `src/components/ui/index.ts` 中导出
   - 在 `src/examples/index.ts` 中导出示例
   - 在 `src/App.tsx` 中添加示例到导航
   - 在 `src/i18n/locales/` 中添加翻译

5. **测试和验证**
   - 运行 `pnpm build:radix` 检查编译
   - 运行 `pnpm build` 检查完整构建
   - 运行 `pnpm dev` 查看示例
   - 修复所有错误和警告

详细移植指南、规则和最佳实践请参考 [agents.md](./agents.md) 中的"实际移植案例：Radix UI Primitives"章节。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

由于项目使用 AI 辅助移植，如果您发现任何问题或有改进建议，请随时反馈。

## 📚 相关资源

- [SolidJS 官网](https://www.solidjs.com/)
- [SolidJS Discord](https://discord.com/invite/solidjs)
- [Vite 文档](https://vite.dev/)

## 📄 许可证

待定
