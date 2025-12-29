/**
 * Provider Registry
 *
 * 使用 createProviderRegistry 统一管理多个模型提供者
 * 参考: https://ai-sdk.dev/docs/reference/ai-sdk-core/provider-registry
 *
 * 注意：此文件包含后端代码，需要在实际的后端环境（Node.js）中运行
 * 如果在前端项目中，需要将其复制到后端代码目录使用
 *
 * 依赖安装：
 * npm install ai @ai-sdk/anthropic @ai-sdk/openai @ai-sdk/openai-compatible
 * npm install --save-dev @types/node (用于 TypeScript 类型支持)
 */

// @ts-ignore - 这些模块需要在后端环境中安装
import { createProviderRegistry } from "ai";
// @ts-ignore
import { anthropic } from "@ai-sdk/anthropic";
// @ts-ignore
import { createOpenAI } from "@ai-sdk/openai";
// @ts-ignore
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { gateway } from "./gateway";
import { lmstudioProvider } from "./provider/lmstudioProvider";
/**
 * 创建提供者注册表
 *
 * 通过 registry，你可以使用简单的字符串 ID 来访问不同的模型
 * 格式: providerId:modelId
 *
 * 例如:
 * - openai:gpt-4
 * - anthropic:claude-3-5-sonnet-20241022
 * - openrouter:meituan/longcat-flash-thinking
 * - lmstudio:qwen/qwen3-vl-8b
 */
export const registry = createProviderRegistry({
  gateway,
  // 注册 Anthropic provider（使用默认配置）
  anthropic,

  // 注册 OpenAI provider（使用自定义配置）
  openai: createOpenAI({
    // @ts-ignore - process.env 在后端环境中可用
    // apiKey: process.env.OPENAI_API_KEY,
  }),

  // 注册 OpenRouter provider（用于访问自定义模型，如 meituan/longcat-flash-thinking）
  openrouter: createOpenAI({
    // @ts-ignore - process.env 在后端环境中可用
    // apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: "https://openrouter.ai/api/v1",
  }),

  // 注册 LMStudio provider（本地运行的模型服务）
  lmstudio: lmstudioProvider,
});

/**
 * 使用示例 - 在 API 路由中使用 registry
 *
 * ```typescript
 * import { generateText } from 'ai';
 * import { registry } from '@/ai/registry';
 *
 * export async function POST(req: Request) {
 *   const { prompt, model } = await req.json();
 *
 *   // 使用 registry 访问模型
 *   // model 可以是 "openai:gpt-4"、"anthropic:claude-3-5-sonnet-20241022" 或 "lmstudio:qwen/qwen3-vl-8b"
 *   const result = await generateText({
 *     model: registry.languageModel(model),
 *     prompt,
 *   });
 *
 *   return Response.json({ text: result.text });
 * }
 * ```
 */

/**
 * 自定义分隔符示例
 *
 * 如果你不想使用默认的 ":" 分隔符，可以自定义:
 *
 * ```typescript
 * export const registry = createProviderRegistry(
 *   {
 *     anthropic,
 *     openai: createOpenAI({ apiKey: process.env.OPENAI_API_KEY }),
 *   },
 *   { separator: ' > ' }
 * );
 *
 * // 使用自定义分隔符
 * const model = registry.languageModel('openai > gpt-4');
 * ```
 */

/**
 * 常用模型 ID 映射
 *
 * 为了方便使用，可以预定义常用模型的完整 ID:
 */
export const MODEL_IDS = {
  // OpenAI 模型
  "gpt-4": "openai:gpt-4",
  "gpt-4-turbo": "openai:gpt-4-turbo",
  "gpt-3.5-turbo": "openai:gpt-3.5-turbo",

  // Anthropic 模型
  "claude-3-5-sonnet": "anthropic:claude-3-5-sonnet-20241022",
  "claude-3-opus": "anthropic:claude-3-opus-20240229",
  "claude-3-haiku": "anthropic:claude-3-haiku-20240307",

  // OpenRouter 自定义模型
  "longcat-flash-thinking": "openrouter:meituan/longcat-flash-thinking",
} as const;

/**
 * 类型辅助函数 - 获取模型 ID
 */
export function getModelId(modelKey: keyof typeof MODEL_IDS): string {
  return MODEL_IDS[modelKey];
}

/**
 * 示例: 使用预定义的模型 ID
 *
 * ```typescript
 * import { generateText } from 'ai';
 * import { registry, getModelId } from '@/ai/registry';
 *
 * const result = await generateText({
 *   model: registry.languageModel(getModelId('longcat-flash-thinking')),
 *   prompt: 'Write a vegetarian lasagna recipe for 4 people.',
 * });
 * ```
 */
