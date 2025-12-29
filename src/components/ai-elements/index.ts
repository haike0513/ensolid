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

// Reasoning 组件
export {
    Reasoning,
    ReasoningContent,
    ReasoningTrigger,
    useReasoning,
} from "./reasoning";
export type {
    ReasoningContentProps,
    ReasoningProps,
    ReasoningTriggerProps,
} from "./reasoning";

// ChainOfThought 组件
export {
    ChainOfThought,
    ChainOfThoughtContent,
    ChainOfThoughtHeader,
    ChainOfThoughtImage,
    ChainOfThoughtSearchResult,
    ChainOfThoughtSearchResults,
    ChainOfThoughtStep,
} from "./chain-of-thought";
export type {
    ChainOfThoughtContentProps,
    ChainOfThoughtHeaderProps,
    ChainOfThoughtImageProps,
    ChainOfThoughtProps,
    ChainOfThoughtSearchResultProps,
    ChainOfThoughtSearchResultsProps,
    ChainOfThoughtStepProps,
} from "./chain-of-thought";

// Loader 组件
export { Loader } from "./loader";
export type { LoaderProps } from "./loader";

// Shimmer 组件
export { Shimmer } from "./shimmer";
export type { TextShimmerProps } from "./shimmer";

// Plan 组件
export {
    Plan,
    PlanAction,
    PlanContent,
    PlanDescription,
    PlanFooter,
    PlanHeader,
    PlanTitle,
    PlanTrigger,
} from "./plan";
export type {
    PlanActionProps,
    PlanContentProps,
    PlanDescriptionProps,
    PlanFooterProps,
    PlanHeaderProps,
    PlanProps,
    PlanTitleProps,
    PlanTriggerProps,
} from "./plan";

// Task 组件
export { Task, TaskContent, TaskItem, TaskItemFile, TaskTrigger } from "./task";
export type {
    TaskContentProps,
    TaskItemFileProps,
    TaskItemProps,
    TaskProps,
    TaskTriggerProps,
} from "./task";

// Image 组件
export { Image } from "./image";
export type { ImageProps } from "./image";

// Artifact 组件
export {
    Artifact,
    ArtifactAction,
    ArtifactActions,
    ArtifactClose,
    ArtifactContent,
    ArtifactDescription,
    ArtifactHeader,
    ArtifactTitle,
} from "./artifact";
export type {
    ArtifactActionProps,
    ArtifactActionsProps,
    ArtifactCloseProps,
    ArtifactContentProps,
    ArtifactDescriptionProps,
    ArtifactHeaderProps,
    ArtifactProps,
    ArtifactTitleProps,
} from "./artifact";

// InlineCitation 组件
export {
    InlineCitation,
    InlineCitationCard,
    InlineCitationCardBody,
    InlineCitationCardTrigger,
    InlineCitationCarousel,
    InlineCitationCarouselContent,
    InlineCitationCarouselHeader,
    InlineCitationCarouselIndex,
    InlineCitationCarouselItem,
    InlineCitationCarouselNext,
    InlineCitationCarouselPrev,
    InlineCitationQuote,
    InlineCitationSource,
    InlineCitationText,
} from "./inline-citation";
export type {
    InlineCitationCardBodyProps,
    InlineCitationCardProps,
    InlineCitationCardTriggerProps,
    InlineCitationCarouselContentProps,
    InlineCitationCarouselHeaderProps,
    InlineCitationCarouselIndexProps,
    InlineCitationCarouselItemProps,
    InlineCitationCarouselNextProps,
    InlineCitationCarouselPrevProps,
    InlineCitationCarouselProps,
    InlineCitationProps,
    InlineCitationQuoteProps,
    InlineCitationSourceProps,
    InlineCitationTextProps,
} from "./inline-citation";

// Context 组件
export {
    Context,
    ContextCacheUsage,
    ContextContent,
    ContextContentBody,
    ContextContentFooter,
    ContextContentHeader,
    ContextInputUsage,
    ContextOutputUsage,
    ContextReasoningUsage,
    ContextTrigger,
} from "./context";
export type {
    ContextCacheUsageProps,
    ContextContentBodyProps,
    ContextContentFooterProps,
    ContextContentHeaderProps,
    ContextContentProps,
    ContextInputUsageProps,
    ContextOutputUsageProps,
    ContextProps,
    ContextReasoningUsageProps,
    ContextTriggerProps,
} from "./context";

// Queue 组件
export {
    Queue,
    QueueItem,
    QueueItemAction,
    QueueItemActions,
    QueueItemAttachment,
    QueueItemContent,
    QueueItemDescription,
    QueueItemFile,
    QueueItemImage,
    QueueItemIndicator,
    QueueList,
    QueueSection,
    QueueSectionContent,
    QueueSectionLabel,
    QueueSectionTrigger,
} from "./queue";
export type {
    QueueItemActionProps,
    QueueItemActionsProps,
    QueueItemAttachmentProps,
    QueueItemContentProps,
    QueueItemDescriptionProps,
    QueueItemFileProps,
    QueueItemImageProps,
    QueueItemIndicatorProps,
    QueueItemProps,
    QueueListProps,
    QueueMessage,
    QueueMessagePart,
    QueueProps,
    QueueSectionContentProps,
    QueueSectionLabelProps,
    QueueSectionProps,
    QueueSectionTriggerProps,
    QueueTodo,
} from "./queue";

// ModelSelector 组件
export {
    ModelSelector,
    ModelSelectorContent,
    ModelSelectorEmpty,
    ModelSelectorGroup,
    ModelSelectorInput,
    ModelSelectorItem,
    ModelSelectorList,
    ModelSelectorLogo,
    ModelSelectorLogoGroup,
    ModelSelectorName,
    ModelSelectorSeparator,
    ModelSelectorShortcut,
    ModelSelectorTrigger,
} from "./model-selector";
export type {
    ModelSelectorContentProps,
    ModelSelectorEmptyProps,
    ModelSelectorGroupProps,
    ModelSelectorInputProps,
    ModelSelectorItemProps,
    ModelSelectorListProps,
    ModelSelectorLogoGroupProps,
    ModelSelectorLogoProps,
    ModelSelectorNameProps,
    ModelSelectorProps,
    ModelSelectorSeparatorProps,
    ModelSelectorShortcutProps,
    ModelSelectorTriggerProps,
} from "./model-selector";

// OpenInChat 组件
export {
    OpenIn,
    OpenInChatGPT,
    OpenInClaude,
    OpenInContent,
    OpenInItem,
    OpenInLabel,
    OpenInSeparator,
    OpenInT3,
    OpenInTrigger,
} from "./open-in-chat";
export type {
    OpenInChatGPTProps,
    OpenInClaudeProps,
    OpenInContentProps,
    OpenInItemProps,
    OpenInLabelProps,
    OpenInProps,
    OpenInSeparatorProps,
    OpenInT3Props,
    OpenInTriggerProps,
} from "./open-in-chat";

// Confirmation 组件
export {
    Confirmation,
    ConfirmationAction,
    ConfirmationActions,
    ConfirmationAccepted,
    ConfirmationRejected,
    ConfirmationRequest,
    ConfirmationTitle,
} from "./confirmation";
export type {
    ConfirmationActionProps,
    ConfirmationActionsProps,
    ConfirmationAcceptedProps,
    ConfirmationProps,
    ConfirmationRejectedProps,
    ConfirmationRequestProps,
    ConfirmationTitleProps,
} from "./confirmation";

// Checkpoint 组件
export {
    Checkpoint,
    CheckpointIcon,
    CheckpointTrigger,
} from "./checkpoint";
export type {
    CheckpointIconProps,
    CheckpointProps,
    CheckpointTriggerProps,
} from "./checkpoint";

// WebPreview 组件
export {
    WebPreview,
    WebPreviewBody,
    WebPreviewConsole,
    WebPreviewNavigation,
    WebPreviewNavigationButton,
    WebPreviewUrl,
} from "./web-preview";
export type {
    WebPreviewBodyProps,
    WebPreviewConsoleProps,
    WebPreviewNavigationButtonProps,
    WebPreviewNavigationProps,
    WebPreviewProps,
    WebPreviewUrlProps,
} from "./web-preview";

// Canvas 组件（流程图相关）
export { Canvas } from "./canvas";
export type { CanvasProps } from "./canvas";

// Connection 组件
export { Connection } from "./connection";
export type { ConnectionProps } from "./connection";

// Node 组件
export {
    Node,
    NodeAction,
    NodeContent,
    NodeDescription,
    NodeFooter,
    NodeHeader,
    NodeTitle,
} from "./node";
export type {
    NodeActionProps,
    NodeContentProps,
    NodeDescriptionProps,
    NodeFooterProps,
    NodeHeaderProps,
    NodeProps,
    NodeTitleProps,
} from "./node";

// Edge 组件
export { Edge, TemporaryEdge } from "./edge";
export type { EdgeProps, TemporaryEdgeProps } from "./edge";

// Panel 组件
export { Panel } from "./panel";
export type { PanelProps } from "./panel";

// Controls 组件
export { Controls } from "./controls";
export type { ControlsProps } from "./controls";

// Toolbar 组件
export { Toolbar } from "./toolbar";
export type { ToolbarProps } from "./toolbar";

// PromptInput 组件
export {
    PromptInput,
    PromptInputActionAddAttachments,
    PromptInputActionMenu,
    PromptInputActionMenuContent,
    PromptInputActionMenuItem,
    PromptInputActionMenuTrigger,
    PromptInputAttachment,
    PromptInputAttachments,
    PromptInputBody,
    PromptInputButton,
    PromptInputFooter,
    PromptInputHeader,
    PromptInputHoverCard,
    PromptInputHoverCardContent,
    PromptInputHoverCardTrigger,
    PromptInputProvider,
    PromptInputSelect,
    PromptInputSelectContent,
    PromptInputSelectItem,
    PromptInputSelectTrigger,
    PromptInputSelectValue,
    PromptInputSpeechButton,
    PromptInputSubmit,
    PromptInputTab,
    PromptInputTabBody,
    PromptInputTabItem,
    PromptInputTabLabel,
    PromptInputTabsList,
    PromptInputTextarea,
    PromptInputTools,
    usePromptInputAttachments,
    usePromptInputController,
    useProviderAttachments,
} from "./prompt-input";
export type {
    AttachmentsContext,
    PromptInputActionAddAttachmentsProps,
    PromptInputActionMenuContentProps,
    PromptInputActionMenuItemProps,
    PromptInputActionMenuProps,
    PromptInputActionMenuTriggerProps,
    PromptInputAttachmentProps,
    PromptInputAttachmentsProps,
    PromptInputBodyProps,
    PromptInputButtonProps,
    PromptInputControllerProps,
    PromptInputFooterProps,
    PromptInputHeaderProps,
    PromptInputHoverCardContentProps,
    PromptInputHoverCardProps,
    PromptInputHoverCardTriggerProps,
    PromptInputMessage,
    PromptInputProps,
    PromptInputProviderProps,
    PromptInputSelectContentProps,
    PromptInputSelectItemProps,
    PromptInputSelectProps,
    PromptInputSelectTriggerProps,
    PromptInputSelectValueProps,
    PromptInputSpeechButtonProps,
    PromptInputSubmitProps,
    PromptInputTabBodyProps,
    PromptInputTabItemProps,
    PromptInputTabLabelProps,
    PromptInputTabProps,
    PromptInputTabsListProps,
    PromptInputTextareaProps,
    PromptInputToolsProps,
    TextInputContext,
} from "./prompt-input";

// 原有的组件（保持向后兼容）
export { Chatbot } from "./chatbot";
export type { ChatbotProps } from "./chatbot";

export { Completion } from "./completion";
export type { CompletionProps } from "./completion";

// MessageComponent 已移除，使用新的 Message 组件替代

export { Assistant } from "./assistant";
export type { AssistantProps } from "./assistant";

export { ObjectGeneration } from "./object-generation";
export type { ObjectGenerationProps } from "./object-generation";

export { StreamableValue } from "./streamable-value";
export type { StreamableValueProps } from "./streamable-value";

export { TextGeneration } from "./text-generation";
export type { TextGenerationProps } from "./text-generation";
