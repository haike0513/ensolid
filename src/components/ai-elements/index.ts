/**
 * AI Elements 组件导出
 * 移植自 Vercel AI Elements
 */

// Message 组件
export {
    Message,
    MessageAction,
    MessageActions,
    MessageAttachment,
    MessageAttachments,
    MessageBranch,
    MessageBranchContent,
    MessageBranchNext,
    MessageBranchPage,
    MessageBranchPrevious,
    MessageBranchSelector,
    MessageContent,
    MessageResponse,
    MessageToolbar,
} from "./message";
export type {
    MessageActionProps,
    MessageActionsProps,
    MessageAttachmentProps,
    MessageAttachmentsProps,
    MessageBranchContentProps,
    MessageBranchNextProps,
    MessageBranchPageProps,
    MessageBranchPreviousProps,
    MessageBranchProps,
    MessageBranchSelectorProps,
    MessageContentProps,
    MessageProps,
    MessageResponseProps,
    MessageToolbarProps,
} from "./message";

// Conversation 组件
export {
    Conversation,
    ConversationContent,
    ConversationEmptyState,
    ConversationScrollButton,
} from "./conversation";
export type {
    ConversationContentProps,
    ConversationEmptyStateProps,
    ConversationProps,
    ConversationScrollButtonProps,
} from "./conversation";

// Suggestion 组件
export { Suggestion, Suggestions } from "./suggestion";
export type { SuggestionProps, SuggestionsProps } from "./suggestion";

// Sources 组件
export { Source, Sources, SourcesContent, SourcesTrigger } from "./sources";
export type {
    SourceProps,
    SourcesContentProps,
    SourcesProps,
    SourcesTriggerProps,
} from "./sources";

// Tool 组件
export { Tool, ToolContent, ToolHeader, ToolInput, ToolOutput } from "./tool";
export type {
    ToolContentProps,
    ToolHeaderProps,
    ToolInputProps,
    ToolOutputProps,
    ToolProps,
} from "./tool";

// CodeBlock 组件
export { CodeBlock, CodeBlockCopyButton } from "./code-block";
export type { CodeBlockCopyButtonProps } from "./code-block";

// 原有的组件（保持向后兼容）
export { Chatbot } from "./chatbot";
export type { ChatbotProps } from "./chatbot";

export { Completion } from "./completion";
export type { CompletionProps } from "./completion";

export { MessageComponent as MessageOld } from "./message";
export type { MessageProps as MessagePropsOld } from "./message";

export { Assistant } from "./assistant";
export type { AssistantProps } from "./assistant";

export { ObjectGeneration } from "./object-generation";
export type { ObjectGenerationProps } from "./object-generation";

export { StreamableValue } from "./streamable-value";
export type { StreamableValueProps } from "./streamable-value";

export { TextGeneration } from "./text-generation";
export type { TextGenerationProps } from "./text-generation";
