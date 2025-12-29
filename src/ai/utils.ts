/**
 * AI 工具函数
 */

/**
 * 规范化模型 ID
 * 如果 modelId 不包含 providerId，则添加默认的 providerId
 *
 * @param modelId - 模型 ID，支持格式:
 *   - 'providerId:modelId' (完整格式)
 *   - 'modelId' (简化格式，将使用默认 provider)
 * @param defaultProvider - 默认的 provider ID
 * @returns 规范化后的模型 ID (providerId:modelId 格式)
 *
 * @example
 * normalizeModelId('gpt-4', 'openai') // 返回 'openai:gpt-4'
 * normalizeModelId('openai:gpt-4', 'openai') // 返回 'openai:gpt-4'
 * normalizeModelId('gateway:gpt-4', 'gateway') // 返回 'gateway:gpt-4'
 */
export function normalizeModelId(
    modelId: string,
    defaultProvider: string = "gateway",
): string {
    // 如果已经包含 providerId，直接返回
    if (modelId.includes(":")) {
        return modelId;
    }

    // 否则添加默认的 providerId
    return `${defaultProvider}:${modelId}`;
}
