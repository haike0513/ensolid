# API 路由设置指南

本目录包含 AI Chat API 路由的示例代码。要使用 AI Playground 的聊天功能，你需要设置一个后端 API 端点。

## 快速开始

### 1. Next.js App Router

创建 `app/api/chat/route.ts`:

```typescript
import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: openai('gpt-4'),
    messages,
  });

  return result.toDataStreamResponse();
}
```

### 2. 安装依赖

```bash
npm install ai @ai-sdk/openai
```

### 3. 配置环境变量

在 `.env.local` 文件中添加:

```
OPENAI_API_KEY=your-api-key-here
```

### 4. 使用其他提供商

#### Anthropic Claude

```bash
npm install ai @ai-sdk/anthropic
```

```typescript
import { streamText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: anthropic('claude-3-5-sonnet-20241022'),
    messages,
  });

  return result.toDataStreamResponse();
}
```

环境变量:
```
ANTHROPIC_API_KEY=your-api-key-here
```

#### Google Gemini

```bash
npm install ai @ai-sdk/google
```

```typescript
import { streamText } from 'ai';
import { google } from '@ai-sdk/google';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: google('gemini-pro'),
    messages,
  });

  return result.toDataStreamResponse();
}
```

环境变量:
```
GOOGLE_GENERATIVE_AI_API_KEY=your-api-key-here
```

## Express.js 示例

如果你使用 Express.js:

```typescript
import express from 'express';
import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

const app = express();
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  const { messages } = req.body;

  const result = await streamText({
    model: openai('gpt-4'),
    messages,
  });

  result.pipeDataStreamToResponse(res);
});

app.listen(3000);
```

## 更多信息

- [AI SDK Core 文档](https://ai-sdk.dev/docs/ai-sdk-core/overview)
- [Vercel AI SDK GitHub](https://github.com/vercel/ai)
