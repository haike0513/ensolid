# AI Elements 组件

移植自 [Vercel AI Elements](https://github.com/vercel/ai-elements)，用于在 SolidJS 项目中快速构建 AI 原生应用。

## 组件列表

### Chatbot

一个完整的聊天机器人 UI 组件，集成了 `useChat` hook。

```tsx
import { Chatbot } from "@/components/ai-elements";

function App() {
  return (
    <div class="h-[600px]">
      <Chatbot
        api="/api/chat"
        id="my-chat"
        title="AI 助手"
        placeholder="输入消息..."
      />
    </div>
  );
}
```

#### Props

- `api` - API 端点 URL（默认: `/api/chat`）
- `id` - 用于持久化的唯一 ID
- `initialMessages` - 初始消息列表
- `title` - 标题文本（默认: "AI Chat"）
- `placeholder` - 输入框占位符（默认: "输入消息..."）
- `showTitle` - 是否显示标题（默认: `true`）
- `showClearButton` - 是否显示清空按钮（默认: `true`）
- `onResponse` - 响应回调
- `onFinish` - 完成回调
- `onError` - 错误回调
- `headers` - 自定义请求头
- `body` - 自定义请求体

### Completion

一个文本补全 UI 组件，集成了 `useCompletion` hook。

```tsx
import { Completion } from "@/components/ai-elements";

function App() {
  return (
    <Completion
      api="/api/completion"
      id="my-completion"
      title="文本补全"
      description="输入提示文本，AI 将为您补全内容"
      placeholder="输入提示..."
    />
  );
}
```

#### Props

- `api` - API 端点 URL（默认: `/api/completion`）
- `id` - 用于持久化的唯一 ID
- `initialCompletion` - 初始补全内容
- `initialInput` - 初始输入值
- `title` - 标题（默认: "文本补全"）
- `description` - 描述
- `placeholder` - 输入框占位符（默认: "输入提示..."）
- `onResponse` - 响应回调
- `onFinish` - 完成回调
- `onError` - 错误回调
- `headers` - 自定义请求头
- `body` - 自定义请求体
- `maxTokens` - 最大 token 数

### Message

用于显示单条聊天消息的组件。

```tsx
import { Message } from "@/components/ai-elements";
import type { Message as MessageType } from "@ensolid/aisolid";

function App() {
  const message: MessageType = {
    id: "1",
    role: "user",
    content: "Hello!",
    createdAt: new Date(),
  };

  return (
    <Message
      message={message}
      showTimestamp={true}
      showRole={true}
    />
  );
}
```

#### Props

- `message` - 消息对象（必需）
- `showTimestamp` - 是否显示时间戳（默认: `true`）
- `showRole` - 是否显示角色标签（默认: `true`）
- `roleLabels` - 自定义角色标签映射
- `class` - 自定义类名

### Assistant

一个助手对话 UI 组件，集成了 `useAssistant` hook。

```tsx
import { Assistant } from "@/components/ai-elements";

function App() {
  return (
    <div class="h-[600px]">
      <Assistant
        api="/api/assistant"
        id="my-assistant"
        title="AI 助手"
        description="与 AI 助手进行对话"
      />
    </div>
  );
}
```

#### Props

- `api` - API 端点 URL（默认: `/api/assistant`）
- `id` - 用于持久化的唯一 ID
- `threadId` - 线程 ID
- `initialMessages` - 初始消息列表
- `initialInput` - 初始输入值
- `title` - 标题文本（默认: "AI Assistant"）
- `description` - 描述文本
- `placeholder` - 输入框占位符（默认: "输入消息..."）
- `showTitle` - 是否显示标题（默认: `true`）
- `showClearButton` - 是否显示清空按钮（默认: `true`）
- `onResponse` - 响应回调
- `onFinish` - 完成回调
- `onError` - 错误回调
- `headers` - 自定义请求头
- `body` - 自定义请求体

### ObjectGeneration

用于生成结构化对象的 UI 组件。

```tsx
import { ObjectGeneration } from "@/components/ai-elements";

function App() {
  return (
    <ObjectGeneration
      api="/api/object-generation"
      id="my-object-gen"
      title="对象生成"
      description="生成结构化对象"
      schema={{ type: "object", properties: { name: { type: "string" } } }}
    />
  );
}
```

#### Props

- `api` - API 端点 URL（默认: `/api/object-generation`）
- `id` - 用于持久化的唯一 ID
- `initialInput` - 初始输入值
- `title` - 标题（默认: "对象生成"）
- `description` - 描述
- `placeholder` - 输入框占位符（默认: "输入提示..."）
- `schema` - Schema 定义（Zod schema 字符串或对象）
- `onResponse` - 响应回调
- `onFinish` - 完成回调
- `onError` - 错误回调
- `headers` - 自定义请求头
- `body` - 自定义请求体

### StreamableValue

用于显示流式值的组件。

```tsx
import { StreamableValue } from "@/components/ai-elements";
import { createSignal } from "solid-js";

function App() {
  const [value, setValue] = createSignal<string>("");
  const [isLoading, setIsLoading] = createSignal(false);

  return (
    <StreamableValue
      value={value}
      isLoading={isLoading}
      placeholder="等待数据..."
    />
  );
}
```

#### Props

- `value` - 流式值（Accessor）
- `isLoading` - 加载状态（Accessor，可选）
- `placeholder` - 空值时的占位文本（默认: "等待数据..."）
- `format` - 格式化函数
- `class` - 自定义类名

## 使用示例

### 基础聊天机器人

```tsx
import { Chatbot } from "@/components/ai-elements";

export default function ChatPage() {
  return (
    <div class="container mx-auto p-4">
      <div class="h-[600px]">
        <Chatbot
          api="/api/chat"
          id="main-chat"
          title="AI 助手"
        />
      </div>
    </div>
  );
}
```

### 文本补全

```tsx
import { Completion } from "@/components/ai-elements";

export default function CompletionPage() {
  return (
    <div class="container mx-auto p-4">
      <Completion
        api="/api/completion"
        id="main-completion"
        title="代码补全"
        description="输入代码片段，AI 将为您补全"
      />
    </div>
  );
}
```

### 助手对话

```tsx
import { Assistant } from "@/components/ai-elements";

export default function AssistantPage() {
  return (
    <div class="container mx-auto p-4">
      <div class="h-[600px]">
        <Assistant
          api="/api/assistant"
          id="main-assistant"
          title="AI 助手"
          description="与 AI 助手进行对话"
        />
      </div>
    </div>
  );
}
```

### 对象生成

```tsx
import { ObjectGeneration } from "@/components/ai-elements";

export default function ObjectGenPage() {
  return (
    <div class="container mx-auto p-4">
      <ObjectGeneration
        api="/api/object-generation"
        id="main-object-gen"
        title="生成用户信息"
        schema={{
          type: "object",
          properties: {
            name: { type: "string" },
            age: { type: "number" },
            email: { type: "string" },
          },
        }}
      />
    </div>
  );
}
```

### 自定义消息显示

```tsx
import { Message } from "@/components/ai-elements";
import type { Message as MessageType } from "@ensolid/aisolid";

export default function MessagesList() {
  const messages: MessageType[] = [
    {
      id: "1",
      role: "user",
      content: "Hello!",
      createdAt: new Date(),
    },
    {
      id: "2",
      role: "assistant",
      content: "Hi there! How can I help you?",
      createdAt: new Date(),
    },
  ];

  return (
    <div class="space-y-4">
      {messages.map((msg) => (
        <Message
          message={msg}
          roleLabels={{
            user: "你",
            assistant: "助手",
          }}
        />
      ))}
    </div>
  );
}
```

## 依赖

这些组件依赖于：

- `@ensolid/aisolid` - AI SDK hooks
- `@/components/ui/*` - UI 基础组件（Button, Card, Textarea 等）

## 样式

组件使用 Tailwind CSS 类名，确保项目已正确配置 Tailwind CSS。

## 更多信息

- [Vercel AI Elements](https://github.com/vercel/ai-elements)
- [AI SDK 文档](https://ai-sdk.dev)
