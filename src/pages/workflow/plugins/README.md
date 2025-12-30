# Workflow 插件系统

工作流插件系统允许外部开发者创建自定义节点类型，扩展工作流编辑器的功能。

## 快速开始

### 1. 创建节点组件

首先，创建一个 SolidJS 组件作为你的节点：

```tsx
import type { Component } from "solid-js";
import { Handle, type NodeComponentProps } from "@ensolid/solidflow";

export const MyCustomNode: Component<NodeComponentProps> = (props) => {
  return (
    <div class="rounded-lg bg-white shadow-lg p-4 border border-blue-500">
      <div class="text-sm font-bold">
        {props.node.data?.label || "My Node"}
      </div>
      {/* 添加连接点 */}
      <Handle
        nodeId={props.node.id}
        type="target"
        position="left"
        style={{ background: "#3b82f6" }}
      />
      <Handle
        nodeId={props.node.id}
        type="source"
        position="right"
        style={{ background: "#3b82f6" }}
      />
    </div>
  );
};
```

### 2. 创建属性面板（可选）

如果你想提供自定义的属性编辑界面：

```tsx
import type { Component } from "solid-js";
import type { Node } from "@ensolid/solidflow";
import { Label } from "@/components/ui/label";

export const MyNodePropertyPanel: Component<{
  node: Node;
  onUpdate: (data: Record<string, any>) => void;
}> = (props) => {
  return (
    <div class="space-y-4">
      <div class="space-y-2">
        <Label>Name</Label>
        <input
          type="text"
          value={props.node.data?.label || ""}
          onInput={(e) =>
            props.onUpdate({ label: e.currentTarget.value })
          }
        />
      </div>
    </div>
  );
};
```

### 3. 注册插件

使用 `registerPlugin` 函数注册你的插件：

```tsx
import { registerPlugin } from "@/pages/workflow/plugins";
import { MyCustomNode } from "./MyCustomNode";
import { MyNodePropertyPanel } from "./MyNodePropertyPanel";

registerPlugin({
  id: "my-plugin",
  name: "My Plugin",
  version: "1.0.0",
  description: "A custom plugin for my workflow",
  nodes: [
    {
      type: "my-custom-node",
      label: "My Custom Node",
      icon: "🎨", // emoji 或 JSX.Element
      component: MyCustomNode,
      defaultData: { label: "My Node" },
      createNodeData: (type) => ({ label: `New ${type}` }),
      propertyPanel: MyNodePropertyPanel, // 可选
      toolbar: {
        title: "My Custom Node",
        icon: <MyIcon />, // 可选，用于工具栏按钮
      },
    },
  ],
  onRegister: () => {
    console.log("Plugin registered!");
  },
  onUnregister: () => {
    console.log("Plugin unregistered!");
  },
});
```

## API 参考

### WorkflowPlugin

插件定义接口：

```typescript
interface WorkflowPlugin {
  id: string;                    // 插件唯一标识符
  name: string;                  // 插件名称
  version: string;               // 插件版本
  description?: string;          // 插件描述
  author?: string;               // 插件作者
  nodes: NodeDefinition[];       // 节点定义列表
  onRegister?: () => void;       // 注册时回调
  onUnregister?: () => void;     // 注销时回调
}
```

### NodeDefinition

节点定义接口：

```typescript
interface NodeDefinition {
  type: string;                  // 节点类型唯一标识符
  label: string;                 // 节点显示名称
  description?: string;          // 节点描述
  icon?: string | JSX.Element;   // 节点图标
  component: Component<NodeComponentProps>;  // 节点组件
  defaultData?: Record<string, any>;         // 默认节点数据
  createNodeData?: (type: string) => Record<string, any>;  // 创建节点时的数据初始化函数
  propertyPanel?: Component<{    // 属性面板组件（可选）
    node: Node;
    onUpdate: (data: Record<string, any>) => void;
  }>;
  toolbar?: {                    // 工具栏按钮配置（可选）
    icon?: JSX.Element;
    title?: string;
  };
}
```

### 注册函数

```typescript
// 注册插件
registerPlugin(plugin: WorkflowPlugin, options?: PluginRegisterOptions): void;

// 注销插件
unregisterPlugin(pluginId: string): void;

// 获取插件注册表实例
import { pluginRegistry } from "@/pages/workflow/plugins";
```

## 使用示例

查看 `src/pages/workflow/plugins/examples/example-plugin.tsx` 了解完整的示例实现。

## 注意事项

1. **节点类型唯一性**：确保你的节点类型标识符是唯一的，避免与现有节点冲突
2. **数据格式**：节点的 `data` 属性应该包含所有需要的数据字段
3. **连接点**：使用 `Handle` 组件定义节点的输入/输出连接点
4. **响应式**：节点组件应该正确响应 `props.node.data` 的变化
5. **属性面板**：如果不提供 `propertyPanel`，系统会使用默认的属性面板

## 最佳实践

1. **命名空间**：使用命名空间前缀避免节点类型冲突，如 `my-plugin-node-type`
2. **版本管理**：保持插件版本号，便于用户了解插件更新
3. **错误处理**：在 `onRegister` 和 `onUnregister` 中添加适当的错误处理
4. **文档**：为你的插件和节点提供清晰的文档说明
5. **类型安全**：使用 TypeScript 确保类型安全

## 插件生命周期

1. **注册**：调用 `registerPlugin` 注册插件
2. **初始化**：系统调用 `onRegister` 回调（如果提供）
3. **使用**：节点出现在工具栏中，可以拖拽使用
4. **注销**：调用 `unregisterPlugin` 或 `pluginRegistry.unregister` 注销插件
5. **清理**：系统调用 `onUnregister` 回调（如果提供）

