# AI 功能模块

本目录包含 AI 相关的客户端函数。

## Provider Registry（提供者注册表）

为了更方便地管理多个模型提供者，推荐使用 `createProviderRegistry` 来统一管理。

参考: [AI SDK Provider Registry 文档](https://ai-sdk.dev/docs/reference/ai-sdk-core/provider-registry)

### 创建 Registry

查看 `registry.ts` 文件了解如何创建和使用 registry：

```typescript
import { createProviderRegistry } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { createOpenAI } from '@ai-sdk/openai';

export const registry = createProviderRegistry({
  anthropic,
  openai: createOpenAI({ apiKey: process.env.OPENAI_API_KEY }),
  openrouter: createOpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: 'https://openrouter.ai/api/v1',
  }),
});
```

### 使用 Registry

在 API 路由中使用 registry 访问模型（格式: `providerId:modelId`）：

```typescript
import { generateText } from 'ai';
import { registry } from '@/ai/registry';

const result = await generateText({
  model: registry.languageModel('openai:gpt-4'),
  prompt: 'Write a vegetarian lasagna recipe for 4 people.',
});

// 或者使用 OpenRouter 的自定义模型
const result2 = await generateText({
  model: registry.languageModel('openrouter:meituan/longcat-flash-thinking'),
  prompt: 'Write a vegetarian lasagna recipe for 4 people.',
});
```

## generateText

`generateText` 函数用于调用后端 API 生成文本。

### 使用方法

```typescript
import { generateText } from '@/ai';

const { text } = await generateText({
  model: "meituan/longcat-flash-thinking",
  prompt: 'Write a vegetarian lasagna recipe for 4 people.',
});
```

### 后端 API 实现

后端需要实现 `/api/generate-text` 端点来使用 AI SDK 的 `generateText` 函数。

#### Next.js App Router 示例（使用 Registry）

创建 `app/api/generate-text/route.ts`:

```typescript
import { generateText } from 'ai';
import { registry } from '@/ai/registry';

export async function POST(req: Request) {
  const { prompt, model, maxTokens, temperature } = await req.json();

  // 使用 registry 访问模型（格式: providerId:modelId）
  // 例如: "openai:gpt-4", "anthropic:claude-3-5-sonnet-20241022", "openrouter:meituan/longcat-flash-thinking"
  const modelId = model || 'openrouter:meituan/longcat-flash-thinking';

  const result = await generateText({
    model: registry.languageModel(modelId),
    prompt,
    maxTokens,
    temperature,
  });

  return Response.json({
    text: result.text,
    usage: result.usage,
    finishReason: result.finishReason,
  });
}
```

#### Next.js App Router 示例（不使用 Registry）

如果你不使用 registry，可以直接使用 provider：

```typescript
import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const { prompt, model, maxTokens, temperature } = await req.json();

  const result = await generateText({
    model: openai(model || 'gpt-4'),
    prompt,
    maxTokens,
    temperature,
  });

  return Response.json({
    text: result.text,
    usage: result.usage,
    finishReason: result.finishReason,
  });
}
```

#### 使用 Registry 管理多个提供者（推荐）

使用 registry 可以统一管理多个提供者，包括自定义模型：

```typescript
import { generateText } from 'ai';
import { registry } from '@/ai/registry';

export async function POST(req: Request) {
  const { prompt, model, maxTokens, temperature } = await req.json();

  // 可以轻松切换不同的模型
  // - openai:gpt-4
  // - anthropic:claude-3-5-sonnet-20241022
  // - openrouter:meituan/longcat-flash-thinking
  const modelId = model || 'openrouter:meituan/longcat-flash-thinking';

  const result = await generateText({
    model: registry.languageModel(modelId),
    prompt,
    maxTokens,
    temperature,
  });

  return Response.json({
    text: result.text,
    usage: result.usage,
    finishReason: result.finishReason,
  });
}
```

#### Express.js 示例（使用 Registry）

```typescript
import express from 'express';
import { generateText } from 'ai';
import { registry } from '@/ai/registry';

const app = express();
app.use(express.json());

app.post('/api/generate-text', async (req, res) => {
  const { prompt, model, maxTokens, temperature } = req.body;

  try {
    const modelId = model || 'openrouter:meituan/longcat-flash-thinking';
    
    const result = await generateText({
      model: registry.languageModel(modelId),
      prompt,
      maxTokens,
      temperature,
    });

    res.json({
      text: result.text,
      usage: result.usage,
      finishReason: result.finishReason,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000);
```

### 环境变量配置

在 `.env.local` 或 `.env` 文件中配置 API 密钥:

```env
# OpenAI
OPENAI_API_KEY=your-openai-api-key-here

# Anthropic
ANTHROPIC_API_KEY=your-anthropic-api-key-here

# OpenRouter (用于访问自定义模型，如 meituan/longcat-flash-thinking)
OPENROUTER_API_KEY=your-openrouter-api-key-here
```

### 安装依赖

```bash
npm install ai @ai-sdk/openai
# 或使用其他提供者
npm install ai @ai-sdk/anthropic
npm install ai @ai-sdk/google
```

### 更多信息

- [AI SDK Core 文档](https://ai-sdk.dev/docs/ai-sdk-core/overview)
- [generateText API 文档](https://ai-sdk.dev/docs/reference/ai-sdk-core/generate-text)
- [Provider Registry 文档](https://ai-sdk.dev/docs/reference/ai-sdk-core/provider-registry)
- 查看 `registry.ts` 了解完整的 registry 使用示例