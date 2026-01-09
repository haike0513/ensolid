# Ensolid Workflow 插件架构设计

本文档定义了 Ensolid Workflow 的插件架构。目标是创建一个模块化、可扩展的系统，允许第三方开发者轻松创建自定义节点和功能扩展。

## 核心设计理念

一个完整的插件节点设计应包含 **MVC** 模式的变体：
*   **Model (逻辑与数据)**: 定义节点的输入/输出 (IO)、数据结构 (Schema) 和执行逻辑 (Execution)。
*   **View (渲染)**: 定义节点在画布上的外观 (Canvas Component) 和图标 (Icon)。
*   **Controller (交互与编辑)**: 定义属性编辑面板 (Property Inspector) 和工具栏操作。

## 插件结构 (Plugin Structure)

一个插件是一个包含以下元数据的对象/模块：

```typescript
interface WorkflowPlugin {
  id: string;          // 唯一标识符 (e.g., "ensolid.ai-nodes")
  name: string;        // 显示名称
  version: string;     // 版本号 (SemVer)
  description?: string;
  author?: string;
  nodes: NodeDefinition[]; // 包含的节点列表
  onRegister?: () => void; // 注册时的钩子
  onUnregister?: () => void; // 卸载时的钩子
}
```

## 节点定义 (Node Definition)

节点是插件的核心单元。为了便于第三方开发，我们将节点的定义拆分为以下几个部分：

### 1. 元数据 (Metadata)
定义节点的基本身份信息。

```typescript
interface NodeMetadata {
  type: string;        // 唯一类型标识 (e.g., "ai.llm.chat")
  label: string;       // 默认显示名称
  category?: string;   // 分类 (e.g., "AI", "Logic", "IO")
  tags?: string[];     // 搜索标签
  description?: string;// 简短描述
  version?: string;    // 节点版本
}
```

### 2. 连接与数据 (Connectivity & Schema)
定义节点的输入输出端口及其数据类型。这是执行引擎进行数据编排的基础。

```typescript
type DataType = 'string' | 'number' | 'boolean' | 'object' | 'array' | 'any' | 'image' | 'audio';

interface PortDefinition {
  id: string;          // 端口 ID
  label?: string;      // 端口显示名称
  type: DataType;      // 数据类型
  required?: boolean;  // 是否必须连接
  defaultValue?: any;  // 默认值
  description?: string;
  schema?: any;        // JSON Schema 验证规则 (可选)
}

interface NodeIO {
  inputs: Record<string, PortDefinition>;
  outputs: Record<string, PortDefinition>;
}
```

### 3. 执行逻辑 (Execution)
定义节点在后端或执行器中运行时的行为。

```typescript
// 上下文包含当前节点数据、输入值、全局变量等
interface TaskContext {
  node: NodeData;
  inputs: Record<string, any>; // 上游传入的值
  signal: AbortSignal;         // 用于处理停止信号
  logger: Logger;              // 日志记录器
}

type ExecuteFunction = (ctx: TaskContext) => Promise<Record<string, any>>;
```

### 4. 渲染与交互 (Rendering & Interaction)
定义节点在前端的视觉表现。

```typescript
import { Component, JSX } from "solid-js";

interface NodeVisuals {
  // 画布上的节点组件 (可选，默认使用通用节点外壳)
  component?: Component<NodeProps>; 
  
  // 图标 (Emoji 或 SVG 组件)
  icon?: string | Component;
  
  // 节点的主题色
  color?: string;
}
```

### 5. 编辑体验 (Editing Experience)
定义用户如何配置节点的属性。

```typescript
interface NodeEditor {
  // 初始数据
  defaultData?: Record<string, any>; 
  
  // 属性面板配置
  // 方式 A: 使用组件自定义渲染 (灵活性高)
  propertyPanel?: Component<{ node: Node; onUpdate: (data: any) => void }>;
  
  // 方式 B: 使用 JSON Schema 自动生成表单 (开发效率高)
  propertySchema?: FormSchema; 
  
  // 工具栏扩展操作
  toolbar?: {
    actions: Array<{
      label: string;
      icon?: JSX.Element;
      onClick: (node: Node) => void;
    }>;
  };
}
```

## 完整的 NodeDefinition 接口

将上述部分组合：

```typescript
export interface NodeDefinition extends NodeMetadata, NodeIO, NodeVisuals, NodeEditor {
  execute: ExecuteFunction;
}
```

## 插件开发示例

```typescript
const MyLLMPlugin: WorkflowPlugin = {
  id: "my-llm-plugin",
  name: "My LLM Extended",
  version: "1.0.0",
  nodes: [
    {
      type: "chat-gpt",
      label: "OpenAI Chat",
      category: "AI",
      
      // IO 定义
      inputs: {
        prompt: { type: "string", label: "User Prompt", required: true },
        history: { type: "array", label: "Chat History" }
      },
      outputs: {
        text: { type: "string", label: "Response" }
      },
      
      // 执行逻辑
      execute: async (ctx) => {
        const { prompt } = ctx.inputs;
        // Call OpenAI API...
        return { text: "AI Response..." };
      },
      
      // 编辑配置
      defaultData: { model: "gpt-4" },
      // 自动生成表单
      propertySchema: [
        { name: "model", type: "select", options: ["gpt-4", "gpt-3.5"], label: "Model" },
        { name: "temperature", type: "slider", min: 0, max: 2, label: "Temperature" }
      ]
    }
  ]
};
```

## 下一步实施计划

1.  **重构 Registry**: 更新 `pluginRegistry` 以支持上述细化的接口。
2.  **通用 Node Shell**: 创建一个能够根据 `inputs`/`outputs` 定义自动渲染端口的通用节点组件，减少开发者编写 UI 的负担。
3.  **Schema-based Form**: 在 `PropertyPanel` 中实现基于 `propertySchema` 的自动表单生成器。
