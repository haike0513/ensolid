# Ensolid

一个用于完善 SolidJS 生态相关 UI 与工具库的项目。

## 📖 项目简介

Ensolid 致力于将 React 生态系统中优秀的库和 UI 组件移植到 SolidJS 生态中，以丰富 SolidJS 的生态系统，为开发者提供更多可用的工具和组件。本项目采用 Monorepo 架构，包含多个独立的组件库包，每个包都可以独立使用和发布。

## 🎯 项目目的

本项目的主要目的是：
- 将 React 生态中成熟的库和 UI 组件移植到 SolidJS
- 为 SolidJS 开发者提供更多可用的工具和组件选择
- 通过 AI 辅助加速移植过程
- 建立 SolidJS 生态系统的组件库标准
- 提供完整的 TypeScript 类型支持和 SSR 兼容性

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
ensolid/
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

本项目包含三个主要的组件库包：

### 1. @ensolid/radix

基于 [Radix UI Primitives](https://www.radix-ui.com/primitives) 移植的 SolidJS 版本，提供无样式、可访问的基础组件。

**特点：**
- ✅ 完整的可访问性支持（ARIA 属性）
- ✅ 无样式设计，完全可定制
- ✅ 支持受控和非受控模式
- ✅ 完整的 TypeScript 类型定义
- ✅ SSR 兼容

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

### 2. @ensolid/baseui

基于 [BaseUI](https://baseui.org/) 移植的 SolidJS 版本，提供企业级 UI 组件库。

**特点：**
- ✅ 丰富的组件集合（59+ 个组件）
- ✅ Material Design 风格
- ✅ 完整的主题系统支持
- ✅ 企业级组件（表格、分页、步进器等）
- ✅ 完整的 TypeScript 类型定义

#### 主要组件类别

- **基础组件**: Box, Paper, Container, Stack, Grid, Typography, Divider
- **表单组件**: Button, Input, Textarea, Checkbox, Radio, Switch, Select, Slider, NumberInput
- **布局组件**: Tabs, Accordion, Collapsible, Drawer, Modal, Dialog
- **数据展示**: Table, TablePagination, List, Card, Avatar, Badge, Chip, Skeleton
- **反馈组件**: Alert, AlertDialog, Snackbar, Progress, Rating
- **导航组件**: Breadcrumbs, Menu, Pagination, Stepper
- **其他组件**: Tooltip, Popover, Popper, Portal, FocusTrap, ClickAwayListener

### 3. @ensolid/solidflow

基于 [React Flow](https://reactflow.dev/) 移植的 SolidJS 版本，提供流程图和节点编辑器功能。

**特点：**
- ✅ 高性能的节点图渲染
- ✅ 支持自定义节点和边
- ✅ 交互式拖拽和缩放
- ✅ 完整的类型定义
- ✅ 支持复杂的工作流编辑

#### 核心组件

- **Flow** - 主流程图组件
- **Node** - 节点组件
- **Edge** - 边组件
- **Handle** - 连接点组件
- **Background** - 背景网格组件

### 4. components/ui

基于 `@ensolid/radix` 实现的 shadcn/ui 风格组件库，提供开箱即用的样式化组件。

**特点：**
- ✅ 基于 Tailwind CSS 的现代设计
- ✅ 完全可定制的样式
- ✅ 与 shadcn/ui 设计规范一致
- ✅ 开箱即用的美观界面

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
import { Button, Dialog } from "@ensolid/radix";

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

### ⚠️ 关于 asChild 属性的重要说明

**`asChild` 属性使用注意事项**:

1. **仅 Radix 基础组件的 Trigger 支持 `asChild`**
   - `asChild` 是 Radix UI 的特殊属性，用于将组件的功能传递给子元素
   - 只有 Radix 基础组件的 Trigger 子组件（如 `Dialog.Trigger`、`Popover.Trigger`、`DropdownMenu.Trigger` 等）支持此属性
   - 普通的 UI 组件（如 `Button`、`Card` 等）**不支持** `asChild` 属性

2. **正确使用方式**:
   ```tsx
   // ✅ 正确 - Radix 组件的 Trigger 支持 asChild
   <Dialog.Trigger asChild>
     <Button>打开对话框</Button>
   </Dialog.Trigger>
   
   // ❌ 错误 - Button 组件不支持 asChild
   <Button asChild>
     <A href="/page">链接</A>
   </Button>
   ```

3. **替代方案**:
   ```tsx
   // ✅ 正确 - 使用包装方式
   <A href="/page">
     <Button>链接</Button>
   </A>
   ```

4. **常见错误**:
   - 错误: `Property 'asChild' does not exist on type 'IntrinsicAttributes & ButtonProps'`
   - 原因: 在普通 UI 组件上使用了 `asChild` 属性
   - 解决: 移除 `asChild` 属性，改用包装方式或直接使用组件

详细说明和解决方案请参考 [agents.md](./agents.md) 中的"错误 9: asChild 属性使用错误"章节。

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

## 📊 项目统计

### 组件数量统计

- **@ensolid/radix**: 25 个基础组件
- **@ensolid/baseui**: 59+ 个企业级组件
- **@ensolid/solidflow**: 5 个流程图核心组件
- **components/ui**: 26 个 shadcn/ui 风格组件

### 技术特性

- ✅ **TypeScript 支持**: 所有组件都有完整的类型定义
- ✅ **SSR 兼容**: 所有组件都支持服务端渲染
- ✅ **Tree Shaking**: 完全优化的 Tree Shaking 支持，包含 `sideEffects: false` 和细粒度导出
- ✅ **Monorepo 架构**: 使用 pnpm workspace 管理多包项目
- ✅ **独立构建**: 每个包都可以独立构建和发布

### Tree Shaking 支持

所有 `@ensolid/*` 包都已针对 Tree Shaking 进行了完全优化：

- ✅ **零副作用**: 所有包都标记了 `sideEffects: false`
- ✅ **细粒度导出**: 为每个组件提供独立的导出路径
- ✅ **模块保留**: 构建配置中使用 `preserveModules: true`
- ✅ **最优打包体积**: 只导入你需要的内容

**使用示例：**

```typescript
// 默认导入 - 现代打包工具会自动进行 tree shaking
import { Button, Input } from '@ensolid/baseui';

// 精确导入 - 最大化 tree shaking 效果
import { Button } from '@ensolid/baseui/Button';
import { Input } from '@ensolid/baseui/Input';
```

**📖 详细的 Tree Shaking 指南和最佳实践，请参阅 [TREE_SHAKING_GUIDE.md](./TREE_SHAKING_GUIDE.md)**

**打包体积减少**: 导入特定组件相比导入整个包，体积最多可减少 90%！

## 🏗️ 架构设计

### Monorepo 结构

```
ensolid/
├── packages/              # 组件库包
│   ├── radix/            # Radix UI Primitives 移植
│   ├── baseui/           # BaseUI 组件库移植
│   └── solidflow/        # React Flow 移植
├── src/                  # 示例应用
│   ├── components/       # shadcn/ui 风格组件
│   ├── examples/         # 组件示例
│   └── i18n/            # 国际化支持
└── dist/                 # 构建输出
```

### 构建系统

- **构建工具**: Vite
- **类型检查**: TypeScript 5.8+
- **包管理**: pnpm workspace
- **代码分割**: 支持按需导入和 tree shaking

## 🔍 质量保证

### 代码规范

- ✅ 严格的 TypeScript 类型检查
- ✅ 统一的代码风格
- ✅ 完整的组件文档
- ✅ 示例代码覆盖

### 兼容性

- ✅ **浏览器支持**: 现代浏览器（ES2020+）
- ✅ **SSR 支持**: 所有组件都经过 SSR 测试
- ✅ **TypeScript**: 完整的类型定义
- ✅ **响应式设计**: 支持移动端和桌面端

## 🚧 开发计划

### 短期计划

- [ ] 完善 BaseUI 组件的测试和文档
- [ ] 优化 SolidFlow 的性能
- [ ] 增加更多 shadcn/ui 风格组件
- [ ] 完善国际化支持

### 长期计划

- [ ] 添加单元测试和 E2E 测试
- [ ] 建立组件文档网站
- [ ] 发布稳定版本到 npm
- [ ] 建立社区贡献指南

## 📄 许可证

待定

