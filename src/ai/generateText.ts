/**
 * generateText 客户端函数
 *
 * 调用后端 API 端点来生成文本
 * 后端需要实现对应的 API 路由来使用 AI SDK 的 generateText
 *
 * 支持 registry 格式的模型 ID（如 "openai:gpt-4"），后端会使用 registry.languageModel() 处理
 */

export interface GenerateTextOptions {
  /**
   * 提示文本
   */
  prompt: string;
  /**
   * 模型名称（支持 registry 格式，如 "openai:gpt-4" 或 "anthropic:claude-3-5-sonnet-20241022"）
   * @default "openrouter:meituan/longcat-flash-thinking"
   */
  model?: string;
  /**
   * 最大 token 数
   */
  maxTokens?: number;
  /**
   * 温度参数 (0-1)
   */
  temperature?: number;
  /**
   * 自定义 API 端点
   * @default "/api/generate-text"
   */
  api?: string;
  /**
   * 自定义请求头
   */
  headers?: Record<string, string> | Headers;
  /**
   * 自定义请求体
   */
  body?: Record<string, any>;
}

export interface GenerateTextResult {
  /**
   * 生成的文本
   */
  text: string;
  /**
   * 使用的 token 数
   */
  usage?: {
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
  };
  /**
   * 完成原因
   */
  finishReason?: string;
}

/**
 * 调用后端 API 生成文本
 *
 * @example
 * 使用 registry 格式的模型 ID（推荐）：
 * ```typescript
 * import { generateText, getModelId } from '@/ai';
 *
 * const { text } = await generateText({
 *   model: getModelId('gpt-4'), // 返回 "openai:gpt-4"
 *   prompt: 'Invent a new holiday and describe its traditions.',
 * });
 *
 * // 或直接使用 registry 格式的模型 ID
 * const { text: text2 } = await generateText({
 *   model: 'openai:gpt-4',
 *   prompt: 'Invent a new holiday and describe its traditions.',
 * });
 * ```
 *
 * @example
 * 直接使用模型 ID 字符串：
 * ```typescript
 * const { text } = await generateText({
 *   model: "openrouter:meituan/longcat-flash-thinking",
 *   prompt: 'Write a vegetarian lasagna recipe for 4 people.',
 * });
 * ```
 */
export async function generateText(
  options: GenerateTextOptions,
): Promise<GenerateTextResult> {
  const {
    prompt,
    model = "openrouter:meituan/longcat-flash-thinking",
    maxTokens,
    temperature,
    api = "/api/generate-text",
    headers,
    body,
  } = options;

  const response = await fetch(api, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(headers instanceof Headers
        ? Object.fromEntries(headers.entries())
        : headers || {}),
    },
    body: JSON.stringify({
      prompt,
      model,
      ...(maxTokens !== undefined && { maxTokens }),
      ...(temperature !== undefined && { temperature }),
      ...body,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => response.statusText);
    throw new Error(
      `生成文本失败: ${response.status} ${response.statusText} - ${errorText}`,
    );
  }

  const data = await response.json();

  return {
    text: data.text || "",
    usage: data.usage,
    finishReason: data.finishReason,
  };
}
