/**
 * AI 配置管理模块
 * 
 * 用于管理前端存储的 AI 相关配置，如 API Keys
 */

const STORAGE_KEY = "ai-gateway-api-key";

/**
 * 获取 AI Gateway API Key
 * 优先从 localStorage 读取，如果没有则从环境变量读取
 */
export function getAIGatewayApiKey(): string {
  if (typeof window === "undefined") {
    return import.meta.env.AI_GATEWAY_API_KEY ?? "";
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return stored;
    }
  } catch (e) {
    console.warn("无法从 localStorage 读取 API Key:", e);
  }

  // 回退到环境变量
  return import.meta.env.AI_GATEWAY_API_KEY ?? "";
}

/**
 * 设置 AI Gateway API Key
 * @param apiKey API Key 值
 */
export function setAIGatewayApiKey(apiKey: string): void {
  if (typeof window === "undefined") {
    console.warn("无法在服务端设置 API Key");
    return;
  }

  try {
    if (apiKey.trim()) {
      localStorage.setItem(STORAGE_KEY, apiKey.trim());
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch (e) {
    console.error("无法保存 API Key 到 localStorage:", e);
    throw new Error("保存 API Key 失败");
  }
}

/**
 * 清除 AI Gateway API Key
 */
export function clearAIGatewayApiKey(): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error("无法清除 API Key:", e);
  }
}

/**
 * 检查是否已配置 API Key
 */
export function hasAIGatewayApiKey(): boolean {
  const apiKey = getAIGatewayApiKey();
  return apiKey.trim().length > 0;
}
