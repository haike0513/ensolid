# Tree Shaking 优化指南

## 概述

所有 `@ensolid/*` 包现已完全支持 Tree Shaking，可以显著减少打包体积。

## 已优化的包

- ✅ `@ensolid/visx` - 数据可视化组件
- ✅ `@ensolid/fiber` - 3D 渲染库
- ✅ `@ensolid/baseui` - 基础 UI 组件库
- ✅ `@ensolid/radix` - Radix UI 组件
- ✅ `@ensolid/aisolid` - AI SDK 集成
- ✅ `@ensolid/remend` - Markdown 解析
- ✅ `@ensolid/solidflow` - Flow 相关组件
- ✅ `@ensolid/streamdown` - 流式 Markdown

## 优化措施

### 1. Package.json 配置

所有包添加了以下配置：

```json
{
  "sideEffects": false,
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    },
    "./ComponentName": {
      "import": "./dist/components/ComponentName/index.js",
      "types": "./dist/components/ComponentName/index.d.ts"
    }
  }
}
```

- **`sideEffects: false`**: 告诉打包工具这个包没有副作用，可以安全地移除未使用的导出
- **`exports`**: 提供详细的导出路径映射，支持按需导入

### 2. Vite 构建配置

所有包的 `vite.config.ts` 配置了：

```typescript
{
  build: {
    rollupOptions: {
      output: {
        preserveModules: true,      // 保持模块结构
        preserveModulesRoot: 'src', // 模块根目录
      }
    },
    minify: false  // 不压缩，保持代码可读性以便 tree shaking
  }
}
```

## 使用方式

### 方式一：默认导入（推荐用于开发阶段）

```typescript
// 从主入口点导入所有内容
import { Button, Input, Modal } from '@ensolid/baseui';
import { Group, Bar, LinePath } from '@ensolid/visx';
import { Canvas, extend } from '@ensolid/fiber';
```

这种方式简单直观，现代打包工具（Vite、Webpack 5+）会自动进行 tree shaking。

### 方式二：精确导入（最优 Tree Shaking）

```typescript
// 只导入需要的组件，最大化 tree shaking 效果
import { Button } from '@ensolid/baseui/Button';
import { Modal } from '@ensolid/baseui/Modal';
import { Bar } from '@ensolid/visx/Bar';
import { LinePath } from '@ensolid/visx/LinePath';
```

这种方式可以确保只加载需要的模块，打包体积最小。

### 组件库可用的精确导入

#### @ensolid/baseui

```typescript
import { Button } from '@ensolid/baseui/Button';
import { Input } from '@ensolid/baseui/Input';
import { Select } from '@ensolid/baseui/Select';
import { Modal } from '@ensolid/baseui/Modal';
import { Table } from '@ensolid/baseui/Table';
import { Tabs } from '@ensolid/baseui/Tabs';
import { Tooltip } from '@ensolid/baseui/Tooltip';
import { Popover } from '@ensolid/baseui/Popover';
import { Menu } from '@ensolid/baseui/Menu';
import { Accordion } from '@ensolid/baseui/Accordion';
import { AlertDialog } from '@ensolid/baseui/AlertDialog';
import { Avatar } from '@ensolid/baseui/Avatar';
import { Badge } from '@ensolid/baseui/Badge';
import { Checkbox } from '@ensolid/baseui/Checkbox';
import { Switch } from '@ensolid/baseui/Switch';
import { Radio } from '@ensolid/baseui/Radio';
import { Slider } from '@ensolid/baseui/Slider';
import { Progress } from '@ensolid/baseui/Progress';
import { Card } from '@ensolid/baseui/Card';
```

#### @ensolid/radix

```typescript
import { Separator } from '@ensolid/radix/Separator';
import { Label } from '@ensolid/radix/Label';
import { Checkbox } from '@ensolid/radix/Checkbox';
import { Switch } from '@ensolid/radix/Switch';
import { RadioGroup } from '@ensolid/radix/RadioGroup';
import { Dialog } from '@ensolid/radix/Dialog';
import { Tabs } from '@ensolid/radix/Tabs';
import { Accordion } from '@ensolid/radix/Accordion';
import { AlertDialog } from '@ensolid/radix/AlertDialog';
import { Popover } from '@ensolid/radix/Popover';
import { DropdownMenu } from '@ensolid/radix/DropdownMenu';
import { Tooltip } from '@ensolid/radix/Tooltip';
import { Select } from '@ensolid/radix/Select';
import { Slider } from '@ensolid/radix/Slider';
import { Progress } from '@ensolid/radix/Progress';
import { Toggle } from '@ensolid/radix/Toggle';
import { Avatar } from '@ensolid/radix/Avatar';
import { Collapsible } from '@ensolid/radix/Collapsible';
import { ContextMenu } from '@ensolid/radix/ContextMenu';
import { HoverCard } from '@ensolid/radix/HoverCard';
import { ScrollArea } from '@ensolid/radix/ScrollArea';
import { ToggleGroup } from '@ensolid/radix/ToggleGroup';
import { AspectRatio } from '@ensolid/radix/AspectRatio';
import { VisuallyHidden } from '@ensolid/radix/VisuallyHidden';
import { Menubar } from '@ensolid/radix/Menubar';
import { Toolbar } from '@ensolid/radix/Toolbar';
import { NavigationMenu } from '@ensolid/radix/NavigationMenu';
```

#### @ensolid/visx

```typescript
import { Group } from '@ensolid/visx/Group';
import { Bar } from '@ensolid/visx/Bar';
import { LinePath } from '@ensolid/visx/LinePath';
import { Area } from '@ensolid/visx/Area';
import { Arc } from '@ensolid/visx/Arc';
import { Pie } from '@ensolid/visx/Pie';
import { AxisBottom } from '@ensolid/visx/AxisBottom';
import { AxisLeft } from '@ensolid/visx/AxisLeft';
import { GridRows } from '@ensolid/visx/GridRows';
import { GridColumns } from '@ensolid/visx/GridColumns';
import { Text } from '@ensolid/visx/Text';
```

#### @ensolid/fiber

```typescript
import { Canvas } from '@ensolid/fiber/Canvas';
import { extend } from '@ensolid/fiber/renderer';
import { useLoader } from '@ensolid/fiber/loader';
```

#### @ensolid/aisolid

```typescript
import { useChat } from '@ensolid/aisolid/useChat';
import { useCompletion } from '@ensolid/aisolid/useCompletion';
import { useAssistant } from '@ensolid/aisolid/useAssistant';
```

#### @ensolid/solidflow

```typescript
import { Flow } from '@ensolid/solidflow/Flow';
import { Node } from '@ensolid/solidflow/Node';
import { Edge } from '@ensolid/solidflow/Edge';
import { Handle } from '@ensolid/solidflow/Handle';
import { Background } from '@ensolid/solidflow/Background';
import { Controls } from '@ensolid/solidflow/Controls';
import { MiniMap } from '@ensolid/solidflow/MiniMap';
import { Panel } from '@ensolid/solidflow/Panel';
```

#### @ensolid/remend

```typescript
import remend from '@ensolid/remend';
import { utils } from '@ensolid/remend/utils';
```

#### @ensolid/streamdown

```typescript
import { Streamdown } from '@ensolid/streamdown/Streamdown';
import { parseMarkdownIntoBlocks } from '@ensolid/streamdown/parse-blocks';
```

## 效果对比

### 未优化前

```typescript
// 导入整个包，打包工具可能无法准确识别未使用的代码
import * as BaseUI from '@ensolid/baseui';
```

**预计打包体积**: ~500KB（包含所有组件）

### 优化后

```typescript
// 只导入需要的 Button 和 Input
import { Button } from '@ensolid/baseui/Button';
import { Input } from '@ensolid/baseui/Input';
```

**预计打包体积**: ~50KB（仅包含 Button 和 Input）

**体积减少**: ~90%

## 最佳实践

1. **开发时使用默认导入**：代码更简洁，开发体验更好
   ```typescript
   import { Button, Input } from '@ensolid/baseui';
   ```

2. **生产构建时自动 Tree Shaking**：现代打包工具会自动处理

3. **大型项目可使用精确导入**：如果对打包体积有极致要求
   ```typescript
   import { Button } from '@ensolid/baseui/Button';
   ```

4. **避免 `import *`**：这会阻止 tree shaking
   ```typescript
   // ❌ 不推荐
   import * as BaseUI from '@ensolid/baseui';
   
   // ✅ 推荐
   import { Button, Input } from '@ensolid/baseui';
   ```

## 验证 Tree Shaking 效果

### 使用 Vite 分析打包

```bash
# 构建并生成分析报告
pnpm build
npx vite-bundle-visualizer
```

### 查看打包体积

```bash
# 查看生产构建的体积
pnpm build
ls -lh dist/assets
```

## 技术细节

### sideEffects 说明

`"sideEffects": false` 表示这个包的所有模块都是纯的，没有副作用：

- ✅ 导出函数和组件
- ✅ 导出类型定义
- ❌ 不修改全局对象
- ❌ 不执行顶层代码（除了导出）
- ❌ 不导入 CSS（CSS 应该在使用时导入）

### preserveModules 说明

保持模块结构的好处：

1. **更好的 Tree Shaking**：打包工具可以精确追踪每个模块的使用情况
2. **更快的构建速度**：增量构建只需重新编译修改的模块
3. **更好的调试体验**：源码映射更准确
4. **更小的 chunk**：避免大的 bundle

## 常见问题

### Q: 为什么我的打包体积还是很大？

A: 检查以下几点：
1. 确保使用的是生产构建（`pnpm build`）
2. 确保打包工具支持 tree shaking（Vite、Webpack 5+、Rollup）
3. 避免使用 `import *` 语法
4. 检查依赖是否也支持 tree shaking

### Q: 精确导入和默认导入有什么区别？

A: 在现代打包工具中，两者的最终体积应该相同，因为都会进行 tree shaking。精确导入的优势是：
- 更明确的依赖关系
- 在某些老旧打包工具中效果更好
- 可以避免命名冲突

### Q: 所有包都需要重新构建吗？

A: 不需要。这些优化是包级别的配置，用户在使用时会自动受益。如果你是包的维护者，重新发布包即可。

## 总结

通过以上优化，@ensolid 生态系统的所有包都完美支持 tree shaking，可以显著减少生产环境的打包体积，提升应用性能。
