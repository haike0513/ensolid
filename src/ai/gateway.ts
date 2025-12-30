import { createGateway } from "ai";
import { getAIGatewayApiKey } from "./config";

/**
 * 获取 Gateway 实例
 * 每次调用都会从 localStorage 读取最新的 API Key
 */
export function getGateway() {
    const apiKey = getAIGatewayApiKey();
    console.log("apiKey", apiKey);
    return createGateway({
        apiKey,
    });
}

/**
 * 默认导出的 gateway 实例（向后兼容）
 * 注意：此实例的 API Key 在创建时确定，不会自动更新
 * 如果需要动态更新，请使用 getGateway() 函数
 */
export const gateway = getGateway();
