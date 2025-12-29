/**
 * @ensolid/aisolid
 *
 * AI SDK for SolidJS - 移植自 Vercel AI SDK React 包
 *
 * 提供以下 hooks：
 * - useChat: 用于聊天对话
 * - useCompletion: 用于文本补全
 * - useAssistant: 用于助手对话
 */

// 导出类型（优先使用 hooks 中的新类型）
export * from "./hooks";
export * from "./utils";

// 导出旧类型（用于向后兼容，但不导出与新类型冲突的）
export type {
    Message,
    UseCompletionHelpers,
    UseCompletionOptions,
} from "./types";
