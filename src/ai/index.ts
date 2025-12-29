/**
 * AI 功能模块
 * 
 * 导出所有 AI 相关的客户端函数和工具
 */

export { generateText } from "./generateText";
export type { GenerateTextOptions, GenerateTextResult } from "./generateText";

// 导出模型 ID 常量（前端可用）
export { MODEL_IDS, getModelId } from "./modelIds";

// 注意：registry 是后端代码，在前端项目中无法直接导入使用
// 如果需要使用，请在后端代码中导入
// export { registry } from "./registry";