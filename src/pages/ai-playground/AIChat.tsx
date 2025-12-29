/**
 * AIChat 组件 - AI 聊天界面
 *
 * 集成 ai-elements 组件的示例实现
 * 展示如何使用 Message, Conversation, PromptInput 等组件构建完整的聊天界面
 */

import type { Component } from "solid-js";
import { createMemo, createSignal, For, Show } from "solid-js";
import { useChat } from "@ensolid/aisolid";
import type { UIMessage } from "ai";
import { GatewayChatTransport } from "@/ai";
import { registry } from "@/ai/registry";
import {
    MessageBranch,
    MessageBranchContent,
    MessageBranchNext,
    MessageBranchPage,
    MessageBranchPrevious,
    MessageBranchSelector,
} from "@/components/ai-elements/message";
import {
    Conversation,
    ConversationContent,
    ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import {
    PromptInput,
    PromptInputActionAddAttachments,
    PromptInputActionMenu,
    PromptInputActionMenuContent,
    PromptInputActionMenuTrigger,
    PromptInputAttachment,
    PromptInputAttachments,
    PromptInputBody,
    PromptInputButton,
    PromptInputFooter,
    PromptInputHeader,
    type PromptInputMessage,
    PromptInputProvider,
    PromptInputSubmit,
    PromptInputTextarea,
    PromptInputTools,
    usePromptInputController,
} from "@/components/ai-elements/prompt-input";
import {
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
    ModelSelectorTrigger,
} from "@/components/ai-elements/model-selector";
import {
    Reasoning,
    ReasoningContent,
    ReasoningTrigger,
} from "@/components/ai-elements/reasoning";
import { MessageResponse } from "@/components/ai-elements/message";
import {
    Source,
    Sources,
    SourcesContent,
    SourcesTrigger,
} from "@/components/ai-elements/sources";
import { Suggestion, Suggestions } from "@/components/ai-elements/suggestion";

// 简单的 ID 生成函数
function generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

type MessageType = {
    key: string;
    from: "user" | "assistant";
    sources?: { href: string; title: string }[];
    versions: {
        id: string;
        content: string;
    }[];
    reasoning?: {
        content: string;
        duration: number;
    };
    tools?: {
        name: string;
        description: string;
        status: "input-available" | "partial-call" | "result";
        parameters: Record<string, unknown>;
        result: string | undefined;
        error: string | undefined;
    }[];
};

// 将 UIMessage 转换为 MessageType 格式
function convertUIMessageToMessageType(uiMessage: UIMessage): MessageType {
    // 从 UIMessage 中提取文本内容
    const textContent = (uiMessage.parts ?? [])
        .filter((part) => part && part.type === "text")
        .map((part) =>
            part && part.type === "text" && typeof part.text === "string"
                ? part.text
                : ""
        )
        .join("") || "";

    return {
        key: uiMessage.id || generateId(),
        from: uiMessage.role === "user" ? "user" : "assistant",
        versions: [
            {
                id: uiMessage.id || generateId(),
                content: textContent,
            },
        ],
        // 可以在这里添加 sources、reasoning 等扩展信息
        // 如果 UIMessage 中有这些信息的话
    };
}

// 图标组件
const CheckIcon = (props: { size?: number; class?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={props.size || 16}
        height={props.size || 16}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class={props.class}
    >
        <path d="M20 6 9 17l-5-5" />
    </svg>
);

const GlobeIcon = (props: { size?: number; class?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={props.size || 16}
        height={props.size || 16}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class={props.class}
    >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
        <path d="M2 12h20" />
    </svg>
);

const MicIcon = (props: { size?: number; class?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={props.size || 16}
        height={props.size || 16}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class={props.class}
    >
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3Z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" x2="12" y1="19" y2="23" />
        <line x1="8" x2="16" y1="23" y2="23" />
    </svg>
);

const models = [
    {
        id: "gpt-4o",
        name: "GPT-4o",
        chef: "OpenAI",
        chefSlug: "openai",
        providers: ["openai", "azure"],
    },
    {
        id: "gpt-4o-mini",
        name: "GPT-4o Mini",
        chef: "OpenAI",
        chefSlug: "openai",
        providers: ["openai", "azure"],
    },
    {
        id: "claude-opus-4-20250514",
        name: "Claude 4 Opus",
        chef: "Anthropic",
        chefSlug: "anthropic",
        providers: ["anthropic", "azure", "google", "amazon-bedrock"],
    },
    {
        id: "claude-sonnet-4-20250514",
        name: "Claude 4 Sonnet",
        chef: "Anthropic",
        chefSlug: "anthropic",
        providers: ["anthropic", "azure", "google", "amazon-bedrock"],
    },
    {
        id: "gemini-2.0-flash-exp",
        name: "Gemini 2.0 Flash",
        chef: "Google",
        chefSlug: "google",
        providers: ["google"],
    },
];

const suggestions = [
    "AI 的最新趋势是什么？",
    "机器学习是如何工作的？",
    "解释一下量子计算",
    "React 开发的最佳实践",
    "告诉我 TypeScript 的好处",
    "如何优化数据库查询？",
    "SQL 和 NoSQL 有什么区别？",
    "解释一下云计算基础知识",
];

export interface AIChatProps {
    /**
     * API 端点 URL
     */
    api?: string;
    /**
     * 用于持久化的唯一 ID
     */
    id?: string;
    /**
     * 是否显示标题卡片
     */
    showTitleCard?: boolean;
    /**
     * 自定义类名
     */
    class?: string;
    /**
     * 聊天框高度
     */
    height?: string;
    /**
     * 响应回调
     */
    onResponse?: (response: Response) => void | Promise<void>;
    /**
     * 完成回调
     */
    onFinish?: (message: UIMessage) => void | Promise<void>;
    /**
     * 初始消息列表
     */
    initialMessages?: UIMessage[];
    /**
     * 错误回调
     */
    onError?: (error: Error) => void;
    /**
     * 自定义请求头
     */
    headers?: Record<string, string> | Headers;
    /**
     * 自定义请求体
     */
    body?: Record<string, any>;
    /**
     * 使用 GatewayChatTransport 的模型 ID
     * 如果提供此选项，将使用 GatewayChatTransport 而不是 HTTP API
     */
    modelId?: string;
}

// 内部组件：用于访问 PromptInputController
const PromptInputSubmitWithController: Component<{
    isLoading: () => boolean;
    submitStatus: () => "submitted" | "streaming" | "ready" | "error";
}> = (props) => {
    const controller = usePromptInputController();
    const isDisabled = () =>
        !controller.textInput.value().trim() || props.isLoading();

    return (
        <PromptInputSubmit
            disabled={isDisabled()}
            status={props.submitStatus()}
        />
    );
};

export const AIChat: Component<AIChatProps> = (props) => {
    // 创建 GatewayChatTransport
    // 如果提供了 modelId 则使用它，否则使用默认的模型 ID
    console.log("registry", registry);
    console.log("props.modelId", props.modelId);
    const transport = props.modelId
        ? new GatewayChatTransport(registry, props.modelId)
        : undefined;

    // 使用 useChat hook 获取聊天相关的列表与交互
    const {
        messages: uiMessages,
        status,
        error,
        stop,
        setMessages,
        sendMessage,
    } = useChat<UIMessage>({
        ...(transport ? { transport } : { api: props.api || "/api/chat" }),
        id: props.id || "ai-chat",
        initialMessages: props.initialMessages as UIMessage[],
        headers: props.headers,
        body: props.body,
    });

    // 将 UIMessage[] 转换为 MessageType[] 用于 ai-elements 组件
    const messages = createMemo(() =>
        uiMessages().map(convertUIMessageToMessageType)
    );

    const [model, setModel] = createSignal<string>(models[0].id);
    const [modelSelectorOpen, setModelSelectorOpen] = createSignal(false);
    const [text, setText] = createSignal<string>("");
    const [useWebSearch, setUseWebSearch] = createSignal<boolean>(false);
    const [useMicrophone, setUseMicrophone] = createSignal<boolean>(false);

    const isLoading = createMemo(() =>
        status() === "streaming" || status() === "submitted"
    );

    const selectedModelData = createMemo(() =>
        models.find((m) => m.id === model())
    );

    // 将 status 转换为 PromptInputSubmit 需要的格式
    const submitStatus = createMemo<
        "submitted" | "streaming" | "ready" | "error"
    >(() => {
        const currentStatus = status();
        if (currentStatus === "streaming" || currentStatus === "submitted") {
            return currentStatus;
        }
        if (error()) {
            return "error";
        }
        return "ready";
    });

    const handleSubmit = (message: PromptInputMessage) => {
        const hasText = Boolean(message.text);
        const hasAttachments = Boolean(message.files?.length);

        if (!(hasText || hasAttachments) || isLoading()) {
            return;
        }

        if (message.files?.length) {
            console.log("Files attached", {
                description:
                    `${message.files.length} file(s) attached to message`,
            });
        }

        // 使用 sendMessage 发送消息
        sendMessage({
            role: "user",
            parts: [{ type: "text", text: message.text || "" }],
        });
        setText("");
    };

    const handleSuggestionClick = (suggestion: string) => {
        if (isLoading()) return;

        // 使用 sendMessage 发送建议消息
        sendMessage({
            role: "user",
            parts: [{ type: "text", text: suggestion }],
        });
    };

    return (
        <div class="relative flex size-full flex-col divide-y overflow-hidden">
            <Conversation>
                <ConversationContent>
                    <For each={messages()}>
                        {(message) => (
                            <MessageBranch defaultBranch={0}>
                                <MessageBranchContent>
                                    <For each={message.versions}>
                                        {(version) => (
                                            <Message from={message.from}>
                                                <div>
                                                    <Show
                                                        when={message.sources
                                                            ?.length}
                                                    >
                                                        <Sources>
                                                            <SourcesTrigger
                                                                count={message
                                                                    .sources!
                                                                    .length}
                                                            />
                                                            <SourcesContent>
                                                                <For
                                                                    each={message
                                                                        .sources}
                                                                >
                                                                    {(
                                                                        source,
                                                                    ) => (
                                                                        <Source
                                                                            href={source
                                                                                .href}
                                                                            title={source
                                                                                .title}
                                                                        />
                                                                    )}
                                                                </For>
                                                            </SourcesContent>
                                                        </Sources>
                                                    </Show>
                                                    <Show
                                                        when={message.reasoning}
                                                    >
                                                        <Reasoning
                                                            duration={message
                                                                .reasoning!
                                                                .duration}
                                                        >
                                                            <ReasoningTrigger />
                                                            <ReasoningContent>
                                                                {message
                                                                    .reasoning!
                                                                    .content}
                                                            </ReasoningContent>
                                                        </Reasoning>
                                                    </Show>
                                                    <MessageContent>
                                                        <MessageResponse>
                                                            {version.content}
                                                        </MessageResponse>
                                                    </MessageContent>
                                                </div>
                                            </Message>
                                        )}
                                    </For>
                                </MessageBranchContent>
                                <Show
                                    when={message.versions.length > 1}
                                >
                                    <MessageBranchSelector from={message.from}>
                                        <MessageBranchPrevious />
                                        <MessageBranchPage />
                                        <MessageBranchNext />
                                    </MessageBranchSelector>
                                </Show>
                            </MessageBranch>
                        )}
                    </For>
                </ConversationContent>
                <ConversationScrollButton />
            </Conversation>
            <div class="grid shrink-0 gap-4 pt-4">
                <Suggestions class="px-4">
                    <For each={suggestions}>
                        {(suggestion) => (
                            <Suggestion
                                suggestion={suggestion}
                                onClick={() =>
                                    handleSuggestionClick(suggestion)}
                            />
                        )}
                    </For>
                </Suggestions>
                <div class="w-full px-4 pb-4">
                    <PromptInputProvider initialInput={text()}>
                        <PromptInput
                            globalDrop
                            multiple
                            onSubmit={handleSubmit}
                        >
                            <PromptInputHeader>
                                <PromptInputAttachments>
                                    {(attachment) => (
                                        <PromptInputAttachment
                                            data={attachment}
                                        />
                                    )}
                                </PromptInputAttachments>
                            </PromptInputHeader>
                            <PromptInputBody>
                                <PromptInputTextarea
                                    onChange={(event) =>
                                        setText(
                                            (event
                                                .target as HTMLTextAreaElement)
                                                .value,
                                        )}
                                />
                            </PromptInputBody>
                            <PromptInputFooter>
                                <PromptInputTools>
                                    <PromptInputActionMenu>
                                        <PromptInputActionMenuTrigger />
                                        <PromptInputActionMenuContent>
                                            <PromptInputActionAddAttachments />
                                        </PromptInputActionMenuContent>
                                    </PromptInputActionMenu>
                                    <PromptInputButton
                                        onClick={() =>
                                            setUseMicrophone(!useMicrophone())}
                                        variant={useMicrophone()
                                            ? "default"
                                            : "ghost"}
                                    >
                                        <MicIcon size={16} />
                                        <span class="sr-only">麦克风</span>
                                    </PromptInputButton>
                                    <PromptInputButton
                                        onClick={() =>
                                            setUseWebSearch(!useWebSearch())}
                                        variant={useWebSearch()
                                            ? "default"
                                            : "ghost"}
                                    >
                                        <GlobeIcon size={16} />
                                        <span>搜索</span>
                                    </PromptInputButton>
                                    <ModelSelector
                                        onOpenChange={setModelSelectorOpen}
                                        open={modelSelectorOpen()}
                                    >
                                        <ModelSelectorTrigger class="h-auto px-2 py-1.5 text-sm font-medium">
                                            <Show
                                                when={selectedModelData()
                                                    ?.chefSlug}
                                            >
                                                <ModelSelectorLogo
                                                    provider={selectedModelData()!
                                                        .chefSlug}
                                                />
                                            </Show>
                                            <Show
                                                when={selectedModelData()?.name}
                                            >
                                                <ModelSelectorName>
                                                    {selectedModelData()!.name}
                                                </ModelSelectorName>
                                            </Show>
                                        </ModelSelectorTrigger>
                                        <ModelSelectorContent>
                                            <ModelSelectorInput placeholder="搜索模型..." />
                                            <ModelSelectorList>
                                                <ModelSelectorEmpty>
                                                    未找到模型。
                                                </ModelSelectorEmpty>
                                                <For
                                                    each={[
                                                        "OpenAI",
                                                        "Anthropic",
                                                        "Google",
                                                    ]}
                                                >
                                                    {(chef) => (
                                                        <div>
                                                            <div class="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                                                                {chef}
                                                            </div>
                                                            <ModelSelectorGroup>
                                                                <For
                                                                    each={models
                                                                        .filter(
                                                                            (
                                                                                m,
                                                                            ) => m
                                                                                .chef ===
                                                                                chef,
                                                                        )}
                                                                >
                                                                    {(m) => (
                                                                        <ModelSelectorItem
                                                                            value={m
                                                                                .id}
                                                                            onSelect={() => {
                                                                                setModel(
                                                                                    m.id,
                                                                                );
                                                                                setModelSelectorOpen(
                                                                                    false,
                                                                                );
                                                                            }}
                                                                        >
                                                                            <ModelSelectorLogo
                                                                                provider={m
                                                                                    .chefSlug}
                                                                            />
                                                                            <ModelSelectorName>
                                                                                {m.name}
                                                                            </ModelSelectorName>
                                                                            <ModelSelectorLogoGroup>
                                                                                <For
                                                                                    each={m
                                                                                        .providers}
                                                                                >
                                                                                    {(
                                                                                        provider,
                                                                                    ) => (
                                                                                        <ModelSelectorLogo
                                                                                            provider={provider}
                                                                                        />
                                                                                    )}
                                                                                </For>
                                                                            </ModelSelectorLogoGroup>
                                                                            <Show
                                                                                when={model() ===
                                                                                    m.id}
                                                                                fallback={
                                                                                    <div class="ml-auto size-4" />
                                                                                }
                                                                            >
                                                                                <CheckIcon class="ml-auto size-4" />
                                                                            </Show>
                                                                        </ModelSelectorItem>
                                                                    )}
                                                                </For>
                                                            </ModelSelectorGroup>
                                                        </div>
                                                    )}
                                                </For>
                                            </ModelSelectorList>
                                        </ModelSelectorContent>
                                    </ModelSelector>
                                </PromptInputTools>
                                <PromptInputSubmitWithController
                                    isLoading={isLoading}
                                    submitStatus={submitStatus}
                                />
                            </PromptInputFooter>
                        </PromptInput>
                    </PromptInputProvider>
                </div>
            </div>
        </div>
    );
};
