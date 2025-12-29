/**
 * AI Chat API 路由示例
 *
 * 这个文件展示了如何使用 AI SDK Core 的 streamText 函数
 * 在实际项目中，这应该是一个服务器端 API 路由
 *
 * 参考文档: https://ai-sdk.dev/docs/ai-sdk-core/overview
 */

/**
 * Next.js App Router 示例
 *
 * 文件位置: app/api/chat/route.ts
 *
 * import { streamText } from 'ai';
 * import { openai } from '@ai-sdk/openai';
 *
 * export async function POST(req: Request) {
 *   const { messages } = await req.json();
 *
 *   const result = await streamText({
 *     model: openai('gpt-4'),
 *     messages,
 *   });
 *
 *   return result.toDataStreamResponse();
 * }
 */

/**
 * Next.js App Router - 使用 Anthropic Claude
 *
 * import { streamText } from 'ai';
 * import { anthropic } from '@ai-sdk/anthropic';
 *
 * export async function POST(req: Request) {
 *   const { messages } = await req.json();
 *
 *   const result = await streamText({
 *     model: anthropic('claude-3-5-sonnet-20241022'),
 *     messages,
 *   });
 *
 *   return result.toDataStreamResponse();
 * }
 */

/**
 * Express.js 示例
 *
 * import express from 'express';
 * import { streamText } from 'ai';
 * import { openai } from '@ai-sdk/openai';
 *
 * const app = express();
 * app.use(express.json());
 *
 * app.post('/api/chat', async (req, res) => {
 *   const { messages } = req.body;
 *
 *   const result = await streamText({
 *     model: openai('gpt-4'),
 *     messages,
 *   });
 *
 *   result.pipeDataStreamToResponse(res);
 * });
 */

/**
 * 环境变量配置
 *
 * 需要在 .env 文件中配置 API 密钥:
 *
 * # OpenAI
 * OPENAI_API_KEY=your-openai-api-key
 *
 * # Anthropic
 * ANTHROPIC_API_KEY=your-anthropic-api-key
 *
 * # Google Gemini
 * GOOGLE_GENERATIVE_AI_API_KEY=your-google-api-key
 */

/**
 * 安装依赖
 *
 * npm install ai @ai-sdk/openai
 * # 或
 * npm install ai @ai-sdk/anthropic
 * # 或
 * npm install ai @ai-sdk/google
 */

export const apiExamples = {
    nextjs: `
// app/api/chat/route.ts
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
`,
    express: `
// server.js
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
`,
    anthropic: `
// app/api/chat/route.ts
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
`,
};
