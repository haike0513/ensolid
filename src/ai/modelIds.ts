/**
 * 模型 ID 常量
 * 
 * 预定义的常用模型 ID 映射（registry 格式）
 * 这些常量可以在前端代码中使用
 * 
 * 注意：这是前端的模型 ID 字符串常量，与后端 registry 中的 MODEL_IDS 对应
 * 后端会使用 registry.languageModel() 来处理这些 ID
 */

/**
 * 常用模型 ID 映射
 * 
 * 格式: providerId:modelId
 * 例如: "openai:gpt-4", "anthropic:claude-3-5-sonnet-20241022"
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
 * 使用示例
 * 
 * ```typescript
 * import { generateText, getModelId } from '@/ai';
 * 
 * const { text } = await generateText({
 *   model: getModelId('gpt-4'), // 返回 "openai:gpt-4"
 *   prompt: 'Hello, world!',
 * });
 * 
 * // 或者直接使用 registry 格式的模型 ID
 * const { text: text2 } = await generateText({
 *   model: 'openai:gpt-4',
 *   prompt: 'Hello, world!',
 * });
 * ```
 */