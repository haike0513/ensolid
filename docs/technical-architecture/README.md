# Ensolid 技术架构文档

## 📋 目录

- [架构概述](#架构概述)
- [系统架构](#系统架构)
- [技术栈](#技术栈)
- [项目结构](#项目结构)
- [构建系统](#构建系统)
- [模块设计](#模块设计)
- [数据流](#数据流)
- [性能优化](#性能优化)
- [安全设计](#安全设计)
- [扩展性设计](#扩展性设计)

## 架构概述

### 架构原则

1. **模块化**：采用 Monorepo 架构，每个包独立开发和发布
2. **可扩展性**：支持轻松添加新组件和功能
3. **性能优先**：优化打包体积和运行时性能
4. **类型安全**：完整的 TypeScript 支持
5. **兼容性**：支持 SSR、现代浏览器、Tree Shaking

### 架构模式

- **Monorepo 架构**：使用 pnpm workspace 管理多个包
- **组件化设计**：每个组件独立，可单独使用
- **分层架构**：
  - 基础层：Radix UI Primitives（无样式组件）
  - 样式层：shadcn/ui 风格组件（开箱即用）
  - 应用层：示例应用和文档

## 系统架构

### 整体架构图

```
┌─────────────────────────────────────────────────────────┐
│                    应用层 (Application)                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   示例应用    │  │   文档系统    │  │   Playground │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                        │
┌─────────────────────────────────────────────────────────┐
│                   组件层 (Components)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  shadcn/ui   │  │    BaseUI    │  │  SolidFlow   │  │
│  │   风格组件    │  │   企业组件    │  │   流程图     │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                        │
┌─────────────────────────────────────────────────────────┐
│                   基础层 (Primitives)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  @ensolid/   │  │  @ensolid/  │  │  @ensolid/   │  │
│  │    radix     │  │   baseui    │  │  solidflow   │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                        │
┌─────────────────────────────────────────────────────────┐
│                   框架层 (Framework)                     │
│              SolidJS + TypeScript + Vite                 │
└─────────────────────────────────────────────────────────┘
```

### 包依赖关系

```
@ensolid/radix (基础组件库)
    │
    ├──> components/ui (样式化组件，依赖 radix)
    │
@ensolid/baseui (企业级组件库)
    │
@ensolid/solidflow (流程图组件)
    │
@ensolid/visx (数据可视化)
    │
@ensolid/aisolid (AI 工具)
    │
@ensolid/remend (推荐系统)
    │
@ensolid/streamdown (流式数据)
```

## 技术栈

### 核心框架

#### SolidJS
- **版本**：1.9.9+
- **用途**：响应式 UI 框架
- **选择理由**：
  - 高性能的响应式系统
  - 细粒度的响应式更新
  - 接近原生的性能
  - 支持 SSR

#### TypeScript
- **版本**：5.8.3+
- **用途**：类型安全和开发体验
- **配置**：
  - 严格模式启用
  - 完整的类型检查
  - 类型推断优化

### 构建工具

#### Vite
- **版本**：7.1.7+
- **用途**：开发服务器和构建工具
- **特性**：
  - 快速的 HMR
  - 优化的生产构建
  - 插件系统

#### tsup
- **版本**：8.5.1+
- **用途**：包构建工具
- **特性**：
  - 基于 esbuild
  - 支持 TypeScript
  - 自动生成类型定义

### 样式方案

#### Tailwind CSS
- **版本**：4.1.18+
- **用途**：工具类 CSS 框架
- **配置**：
  - 自定义主题
  - JIT 模式
  - 优化配置

### 包管理

#### pnpm
- **版本**：最新版本
- **用途**：包管理和 Monorepo 管理
- **特性**：
  - 高效的依赖管理
  - Workspace 支持
  - 磁盘空间优化

### 开发工具

#### ESLint
- **用途**：代码质量检查
- **配置**：SolidJS 专用规则

#### Prettier
- **用途**：代码格式化
- **配置**：统一代码风格

## 项目结构

### Monorepo 结构

```
ensolid/
├── packages/                    # 组件库包
│   ├── radix/                  # Radix UI Primitives 移植
│   │   ├── src/
│   │   │   ├── components/     # 组件实现
│   │   │   ├── index.ts        # 导出入口
│   │   │   └── types.ts        # 类型定义
│   │   ├── dist/               # 构建输出
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── vite.config.ts
│   ├── baseui/                 # BaseUI 组件库
│   ├── solidflow/              # SolidFlow 流程图
│   ├── visx/                   # 数据可视化
│   ├── aisolid/                # AI 工具
│   ├── remend/                 # 推荐系统
│   ├── streamdown/             # 流式数据
│   └── fiber/                  # Fiber 渲染器
├── src/                        # 示例应用
│   ├── components/             # 应用组件
│   │   ├── ui/                # shadcn/ui 风格组件
│   │   └── ...                 # 其他组件
│   ├── pages/                  # 页面组件
│   ├── examples/               # 组件示例
│   ├── i18n/                   # 国际化
│   └── App.tsx                 # 应用入口
├── docs/                       # 文档
│   ├── product-design/         # 产品设计文档
│   ├── technical-architecture/ # 技术架构文档
│   └── ui-ux-design/           # UI/UX 设计文档
├── public/                     # 静态资源
├── dist/                       # 构建输出
├── package.json                # 根配置
├── pnpm-workspace.yaml         # Workspace 配置
├── vite.config.ts              # Vite 配置
└── tsconfig.json               # TypeScript 配置
```

### 包结构规范

每个包遵循统一的结构：

```
package-name/
├── src/
│   ├── components/            # 组件实现
│   │   ├── ComponentName/
│   │   │   ├── index.tsx      # 组件实现
│   │   │   └── types.ts       # 类型定义
│   ├── index.ts               # 主导出
│   └── types.ts               # 公共类型
├── dist/                      # 构建输出
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 构建系统

### 构建流程

```
源代码 (TypeScript/TSX)
    │
    ├──> TypeScript 编译检查
    │
    ├──> Vite/tsup 构建
    │   ├──> 代码转换 (TS -> JS)
    │   ├──> 类型定义生成 (.d.ts)
    │   ├──> 代码压缩
    │   └──> Tree Shaking
    │
    └──> 输出到 dist/
        ├── index.js           # ESM 格式
        ├── index.d.ts         # 类型定义
        └── components/        # 按组件分割
```

### 构建配置

#### Vite 配置要点

```typescript
{
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es'],
      fileName: 'index'
    },
    rollupOptions: {
      external: ['solid-js'],
      output: {
        preserveModules: true,  // 保留模块结构
        preserveModulesRoot: 'src'
      }
    }
  }
}
```

#### Tree Shaking 优化

- **sideEffects: false**：标记包无副作用
- **preserveModules: true**：保留模块结构
- **细粒度导出**：支持按组件导入

### 开发环境

#### 开发服务器
- **端口**：5173
- **HMR**：支持热模块替换
- **代理**：API 代理配置

#### 构建命令
- `pnpm dev`：启动开发服务器
- `pnpm build`：构建所有包
- `pnpm build:package-name`：构建指定包

## 模块设计

### 组件设计模式

#### 1. 基础组件模式（Radix）

```typescript
// 组件结构
Component/
├── index.tsx          # 主组件
├── types.ts          # 类型定义
└── utils.ts          # 工具函数

// 使用模式
<Component>
  <Component.Trigger>...</Component.Trigger>
  <Component.Content>...</Component.Content>
</Component>
```

#### 2. 样式组件模式（shadcn/ui）

```typescript
// 基于 Radix 组件包装
import { Component as RadixComponent } from '@ensolid/radix';
import { cn } from '@/lib/utils';

export const Component = (props) => {
  return (
    <RadixComponent
      class={cn('base-styles', props.class)}
      {...props}
    />
  );
};
```

### 状态管理

#### 组件内部状态
- 使用 `createSignal` 管理局部状态
- 使用 `createContext` 和 `useContext` 共享状态

#### 全局状态
- 使用 Context API 管理主题、语言等全局状态
- 避免全局状态库，保持轻量

### 类型系统

#### 组件 Props 类型

```typescript
export interface ComponentProps {
  // 基础属性
  class?: string;
  children?: JSX.Element;
  
  // 组件特定属性
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  
  // 事件处理
  onClick?: (event: MouseEvent) => void;
}
```

#### 类型导出

```typescript
// 导出组件类型
export type { ComponentProps } from './types';

// 导出组件实例类型
export type ComponentInstance = Component;
```

## 数据流

### 组件数据流

```
Props (外部输入)
    │
    ├──> splitProps (分离 props)
    │   ├──> 组件 props
    │   ├──> HTML props
    │   └──> 其他 props
    │
    ├──> createSignal (状态管理)
    │
    ├──> createContext (上下文)
    │
    └──> 渲染输出
```

### 响应式更新

```
Signal 变化
    │
    ├──> 触发响应式更新
    │
    ├──> 计算依赖组件
    │
    └──> 细粒度更新 DOM
```

## 性能优化

### 打包优化

#### Tree Shaking
- **配置**：`sideEffects: false`
- **导出**：细粒度导出，支持按需导入
- **效果**：减少 90% 的打包体积

#### 代码分割
- **策略**：按组件分割
- **实现**：`preserveModules: true`
- **效果**：只加载使用的组件

#### 压缩优化
- **工具**：esbuild/terser
- **配置**：生产环境自动压缩
- **效果**：减少 60-70% 文件大小

### 运行时优化

#### 响应式优化
- **细粒度更新**：只更新变化的部分
- **批量更新**：合并多个更新
- **计算缓存**：缓存计算结果

#### 渲染优化
- **条件渲染**：使用 `<Show>` 组件
- **列表渲染**：使用 `<For>` 组件
- **懒加载**：按需加载组件

### 加载优化

#### 代码分割
- **路由级别**：按路由分割
- **组件级别**：按需加载组件
- **库级别**：按库分割

#### 预加载
- **关键资源**：预加载关键组件
- **路由预取**：预取下一路由

## 安全设计

### 代码安全

#### XSS 防护
- **自动转义**：SolidJS 自动转义内容
- **危险内容**：使用 `innerHTML` 时手动转义

#### 依赖安全
- **依赖审计**：定期审计依赖
- **版本锁定**：锁定依赖版本
- **安全更新**：及时更新安全补丁

### 类型安全

#### TypeScript 严格模式
- **启用**：所有严格检查选项
- **类型推断**：充分利用类型推断
- **类型守卫**：使用类型守卫

## 扩展性设计

### 添加新组件

#### 步骤
1. 在 `packages/radix/src/components/` 创建组件
2. 在 `src/components/ui/` 创建样式包装
3. 在 `src/examples/` 创建示例
4. 更新导出文件
5. 更新文档

### 添加新包

#### 步骤
1. 在 `packages/` 创建新包目录
2. 配置 `package.json` 和 `tsconfig.json`
3. 配置构建脚本
4. 更新 workspace 配置
5. 添加文档

### 插件系统

#### 设计思路
- **插件接口**：定义标准插件接口
- **生命周期**：支持插件生命周期
- **扩展点**：提供扩展点

## 附录

### 技术决策记录

#### 为什么选择 Monorepo？
- **优势**：统一管理、代码共享、版本同步
- **工具**：pnpm workspace

#### 为什么选择 Vite？
- **优势**：快速开发、优化构建、插件生态
- **替代**：Webpack、Rollup

#### 为什么选择 Tailwind CSS？
- **优势**：快速开发、一致性、可定制
- **替代**：CSS Modules、Styled Components

### 性能基准

#### 打包体积
- Radix 基础包：~50KB (gzip)
- BaseUI 基础包：~200KB (gzip)
- SolidFlow 基础包：~100KB (gzip)

#### 运行时性能
- 组件渲染：< 16ms (60fps)
- 响应式更新：< 1ms
- 首屏加载：< 2s

### 参考资源

- [SolidJS 文档](https://www.solidjs.com/)
- [Vite 文档](https://vite.dev/)
- [TypeScript 文档](https://www.typescriptlang.org/)
- [pnpm 文档](https://pnpm.io/)
