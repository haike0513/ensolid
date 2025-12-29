# @ensolid/aisolid

AI SDK for SolidJS - 移植自 [Vercel AI SDK](https://github.com/vercel/ai) React 包

## 安装

```bash
pnpm add @ensolid/aisolid ai
```

## 功能特性

- ✅ `useChat` - 用于聊天对话
- ✅ `useCompletion` - 用于文本补全
- ✅ `useAssistant` - 用于助手对话
- ✅ 完整的 TypeScript 类型支持
- ✅ 流式响应支持
- ✅ 自动状态持久化（localStorage）
- ✅ 错误处理
- ✅ 可取消的请求

## 使用方法

### useChat

用于实现聊天对话功能：

```tsx
import { useChat } from '@ensolid/aisolid';

function ChatComponent() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
  });

  return (
    <div>
      <div>
        {messages().map((message) => (
          <div key={message.id}>
            <strong>{message.role}:</strong> {message.content}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          value={input()}
          onInput={handleInputChange}
          placeholder="输入消息..."
        />
        <button type="submit" disabled={isLoading()}>
          发送
        </button>
      </form>
    </div>
  );
}
```

### useCompletion

用于文本补全功能：

```tsx
import { useCompletion } from '@ensolid/aisolid';

function CompletionComponent() {
  const { completion, input, handleInputChange, handleSubmit, isLoading } = useCompletion({
    api: '/api/completion',
  });

  return (
    <div>
      <div>{completion()}</div>
      <form onSubmit={handleSubmit}>
        <input
          value={input()}
          onInput={handleInputChange}
          placeholder="输入提示..."
        />
        <button type="submit" disabled={isLoading()}>
          生成
        </button>
      </form>
    </div>
  );
}
```

### useAssistant

用于助手对话功能：

```tsx
import { useAssistant } from '@ensolid/aisolid';

function AssistantComponent() {
  const { messages, input, handleInputChange, handleSubmit, status } = useAssistant({
    api: '/api/assistant',
  });

  return (
    <div>
      <div>
        {messages().map((message) => (
          <div key={message.id}>
            <strong>{message.role}:</strong> {message.content}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          value={input()}
          onInput={handleInputChange}
          placeholder="输入消息..."
          disabled={status() === 'in_progress'}
        />
        <button type="submit" disabled={status() === 'in_progress'}>
          {status() === 'in_progress' ? '处理中...' : '发送'}
        </button>
      </form>
    </div>
  );
}
```

## API 参考

### useChat

#### 选项

- `api` (string): API 端点 URL，默认为 `/api/chat`
- `id` (string): 用于持久化消息的唯一 ID
- `initialMessages` (Message[]): 初始消息列表
- `initialInput` (string): 初始输入值
- `onResponse` (function): 响应回调
- `onFinish` (function): 完成回调
- `onError` (function): 错误回调
- `headers` (object): 自定义请求头
- `body` (object): 自定义请求体
- `credentials` (string): 请求凭证
- `fetch` (function): 自定义 fetch 函数

#### 返回值

- `messages` (Accessor<Message[]>): 消息列表
- `input` (Accessor<string>): 当前输入值
- `setInput` (function): 设置输入值
- `handleInputChange` (function): 输入变化处理函数
- `handleSubmit` (function): 提交处理函数
- `append` (function): 追加消息
- `reload` (function): 重新加载最后一条消息
- `stop` (function): 停止当前请求
- `isLoading` (Accessor<boolean>): 加载状态
- `error` (Accessor<Error | undefined>): 错误信息

### useCompletion

#### 选项

- `api` (string): API 端点 URL，默认为 `/api/completion`
- `id` (string): 用于持久化状态的唯一 ID
- `initialCompletion` (string): 初始补全内容
- `initialInput` (string): 初始输入值
- `onResponse` (function): 响应回调
- `onFinish` (function): 完成回调
- `onError` (function): 错误回调
- `headers` (object): 自定义请求头
- `body` (object): 自定义请求体
- `credentials` (string): 请求凭证
- `fetch` (function): 自定义 fetch 函数

#### 返回值

- `completion` (Accessor<string>): 补全内容
- `input` (Accessor<string>): 当前输入值
- `setInput` (function): 设置输入值
- `handleInputChange` (function): 输入变化处理函数
- `handleSubmit` (function): 提交处理函数
- `complete` (function): 执行补全
- `stop` (function): 停止当前请求
- `isLoading` (Accessor<boolean>): 加载状态
- `error` (Accessor<Error | undefined>): 错误信息

### useAssistant

#### 选项

- `api` (string): API 端点 URL，默认为 `/api/assistant`
- `id` (string): 用于持久化消息的唯一 ID
- `threadId` (string): 线程 ID
- `initialMessages` (Message[]): 初始消息列表
- `initialInput` (string): 初始输入值
- `onResponse` (function): 响应回调
- `onFinish` (function): 完成回调
- `onError` (function): 错误回调
- `headers` (object): 自定义请求头
- `body` (object): 自定义请求体
- `credentials` (string): 请求凭证
- `fetch` (function): 自定义 fetch 函数

#### 返回值

- `messages` (Accessor<Message[]>): 消息列表
- `input` (Accessor<string>): 当前输入值
- `setInput` (function): 设置输入值
- `handleInputChange` (function): 输入变化处理函数
- `handleSubmit` (function): 提交处理函数
- `append` (function): 追加消息
- `stop` (function): 停止当前请求
- `status` (Accessor<'awaiting_message' | 'in_progress' | 'error'>): 状态
- `error` (Accessor<Error | undefined>): 错误信息

## 与 Vercel AI SDK 的兼容性

本包旨在提供与 Vercel AI SDK React 包相似的 API，但使用 SolidJS 的响应式系统。主要区别：

1. 使用 SolidJS 的 `createSignal` 和 `Accessor` 而不是 React 的 `useState`
2. 使用 `Accessor` 函数来访问响应式值（如 `messages()` 而不是 `messages`）
3. 完全兼容 Vercel AI SDK 的服务器端 API

## 许可证

MIT
