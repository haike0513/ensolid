# AI Elements 组件

移植自 [Vercel AI Elements](https://github.com/vercel/ai-elements)，用于在 SolidJS 项目中快速构建 AI 原生应用。

## 组件列表

### AIChat

一个独立的 AI 聊天组件，封装了完整的聊天界面和功能。

```tsx
import { AIChat } from "@/components/ai-elements";

function App() {
  return (
    <AIChat
      api="/api/chat"
      id="my-aichat"
      showTitleCard={true}
      height="600px"
    />
  );
}
```

#### Props

- `api` - API 端点 URL（默认: `/api/chat`）
- `id` - 用于持久化的唯一 ID（默认: `"ai-chat"`）
- `showTitleCard` - 是否显示标题卡片（默认: `true`）
- `height` - 聊天框高度（默认: `"600px"`）
- `class` - 自定义类名
- `onResponse` - 响应回调
- `onFinish` - 完成回调
- `onError` - 错误回调
- `headers` - 自定义请求头
- `body` - 自定义请求体

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

## 使用示例

### AI Chat 组件

最简单的使用方式，一个组件搞定所有功能：

```tsx
import { AIChat } from "@/components/ai-elements";

export default function ChatPage() {
  return (
    <div class="container mx-auto p-4">
      <AIChat
        api="/api/chat"
        id="main-aichat"
        showTitleCard={true}
        height="600px"
      />
    </div>
  );
}
```

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
