/**
 * AIChat 组件 - AI 聊天界面
 *
 * 集成 ai-elements 组件的示例实现
 * 展示如何使用 Message, Conversation, PromptInput 等组件构建完整的聊天界面
 */

import type { Component } from "solid-js";
import { createEffect, createMemo, createSignal, For, Show } from "solid-js";
import { useChat } from "@ensolid/aisolid";
import type { UIMessage } from "ai";
import { GatewayChatTransport } from "@/ai";
import { registry } from "@/ai/registry";
import {
  Message,
  MessageAction,
  MessageActions,
  MessageContent,
} from "@/components/ai-elements/message";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
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
import { MessageResponse } from "@/components/ai-elements/message";
import { Suggestion, Suggestions } from "@/components/ai-elements/suggestion";

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

const RefreshCcwIcon = (props: { size?: number; class?: string }) => (
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
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
    <path d="M21 3v5h-5" />
    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
    <path d="M8 16H3v5" />
  </svg>
);

const CopyIcon = (props: { size?: number; class?: string }) => (
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
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
    <path d="M4 16c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2h8c1.1 0 2 .9 2 2" />
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
    <PromptInputSubmit disabled={isDisabled()} status={props.submitStatus()} />
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
    regenerate,
  } = useChat<UIMessage>({
    ...(transport ? { transport } : { api: props.api || "/api/chat" }),
    id: props.id || "ai-chat",
    initialMessages: props.initialMessages as UIMessage[],
    headers: props.headers,
    body: props.body,
  });

  // 检查是否有消息
  const hasMessages = createMemo(() => uiMessages().length > 0);

  const [model, setModel] = createSignal<string>(models[0].id);
  const [modelSelectorOpen, setModelSelectorOpen] = createSignal(false);
  const [text, setText] = createSignal<string>("");
  const [useWebSearch, setUseWebSearch] = createSignal<boolean>(false);
  const [useMicrophone, setUseMicrophone] = createSignal<boolean>(false);

  const isLoading = createMemo(
    () => status() === "streaming" || status() === "submitted"
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
        description: `${message.files.length} file(s) attached to message`,
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

  // 欢迎图标
  const WelcomeIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="48"
      height="48"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="text-muted-foreground"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      <path d="M13 8H7" />
      <path d="M17 12H7" />
    </svg>
  );

  createEffect(() => {
    console.log("uiMessages", uiMessages());
  });

  return (
    <div class="relative flex size-full flex-col overflow-hidden bg-background">
      {/* 对话区域 */}
      <Conversation class="flex-1 bg-background">
        <ConversationContent class="mx-auto max-w-3xl">
          <Show
            when={hasMessages()}
            fallback={
              <ConversationEmptyState
                title="欢迎使用 AI 助手"
                description="我可以帮助您解答问题、提供建议或进行对话。请在下方输入您的问题，或选择一个建议开始。"
                icon={<WelcomeIcon />}
              />
            }
          >
            <For each={uiMessages()}>
              {(message, messageIndex) => (
                <For each={message.parts ?? []}>
                  {(part) => {
                    if (part.type !== "text") {
                      return null;
                    }

                    const textContent =
                      typeof part.text === "string" ? part.text : "";
                    const isLastMessage =
                      messageIndex() === uiMessages().length - 1;
                    const isAssistant = message.role === "assistant";

                    return (
                      <Message from={message.role}>
                        <MessageContent>
                          <MessageResponse mode="static">
                            {textContent}
                          </MessageResponse>
                        </MessageContent>
                        <Show when={isAssistant && isLastMessage}>
                          <MessageActions>
                            <MessageAction
                              onClick={() => regenerate()}
                              label="重试"
                              size="icon-sm"
                            >
                              <RefreshCcwIcon size={12} />
                            </MessageAction>
                            <MessageAction
                              onClick={() =>
                                navigator.clipboard.writeText(textContent)
                              }
                              label="复制"
                              size="icon-sm"
                            >
                              <CopyIcon size={12} />
                            </MessageAction>
                          </MessageActions>
                        </Show>
                      </Message>
                    );
                  }}
                </For>
              )}
            </For>
          </Show>
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      {/* 输入区域 */}
      <div class="shrink-0 border-t bg-background/95 backdrop-blur">
        {/* 建议提示 - 只在没有消息时显示 */}
        <Show when={!hasMessages()}>
          <div class="mx-auto max-w-3xl px-4 pt-4">
            <div class="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              建议问题
            </div>
            <Suggestions>
              <For each={suggestions}>
                {(suggestion) => (
                  <Suggestion
                    suggestion={suggestion}
                    onClick={() => handleSuggestionClick(suggestion)}
                    variant="outline"
                    class="hover:bg-accent hover:text-accent-foreground transition-colors"
                  />
                )}
              </For>
            </Suggestions>
          </div>
        </Show>

        {/* 输入框容器 */}
        <div class="w-full px-4 pb-4 pt-4">
          <div class="mx-auto max-w-3xl">
            <PromptInputProvider initialInput={text()}>
              <PromptInput
                globalDrop
                multiple
                onSubmit={handleSubmit}
                class="rounded-xl border bg-card shadow-sm transition-shadow hover:shadow-md focus-within:shadow-md"
              >
                <PromptInputHeader>
                  <PromptInputAttachments>
                    {(attachment) => (
                      <PromptInputAttachment data={attachment} />
                    )}
                  </PromptInputAttachments>
                </PromptInputHeader>
                <PromptInputBody>
                  <PromptInputTextarea
                    placeholder={
                      hasMessages() ? "继续对话..." : "输入您的问题或想法..."
                    }
                    onChange={(event) =>
                      setText((event.target as HTMLTextAreaElement).value)
                    }
                    class="min-h-[60px] border-0 bg-transparent px-4 py-3 text-sm focus-visible:ring-0"
                  />
                </PromptInputBody>
                <PromptInputFooter class="border-t bg-muted/30 px-3 py-2">
                  <PromptInputTools>
                    <PromptInputActionMenu>
                      <PromptInputActionMenuTrigger />
                      <PromptInputActionMenuContent>
                        <PromptInputActionAddAttachments />
                      </PromptInputActionMenuContent>
                    </PromptInputActionMenu>
                    <PromptInputButton
                      onClick={() => setUseMicrophone(!useMicrophone())}
                      variant={useMicrophone() ? "default" : "ghost"}
                      size="icon"
                      title="语音输入"
                    >
                      <MicIcon size={16} />
                      <span class="sr-only">麦克风</span>
                    </PromptInputButton>
                    <PromptInputButton
                      onClick={() => setUseWebSearch(!useWebSearch())}
                      variant={useWebSearch() ? "default" : "ghost"}
                      size="icon"
                      title="网络搜索"
                    >
                      <GlobeIcon size={16} />
                      <span class="sr-only">搜索</span>
                    </PromptInputButton>
                    <ModelSelector
                      onOpenChange={setModelSelectorOpen}
                      open={modelSelectorOpen()}
                    >
                      <ModelSelectorTrigger class="h-8 px-2.5 text-sm font-medium">
                        <Show when={selectedModelData()?.chefSlug}>
                          <ModelSelectorLogo
                            provider={selectedModelData()!.chefSlug}
                          />
                        </Show>
                        <Show when={selectedModelData()?.name}>
                          <ModelSelectorName>
                            {selectedModelData()!.name}
                          </ModelSelectorName>
                        </Show>
                      </ModelSelectorTrigger>
                      <ModelSelectorContent>
                        <ModelSelectorInput placeholder="搜索模型..." />
                        <ModelSelectorList>
                          <ModelSelectorEmpty>未找到模型。</ModelSelectorEmpty>
                          <For each={["OpenAI", "Anthropic", "Google"]}>
                            {(chef) => (
                              <div>
                                <div class="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                                  {chef}
                                </div>
                                <ModelSelectorGroup>
                                  <For
                                    each={models.filter((m) => m.chef === chef)}
                                  >
                                    {(m) => (
                                      <ModelSelectorItem
                                        value={m.id}
                                        onSelect={() => {
                                          setModel(m.id);
                                          setModelSelectorOpen(false);
                                        }}
                                      >
                                        <ModelSelectorLogo
                                          provider={m.chefSlug}
                                        />
                                        <ModelSelectorName>
                                          {m.name}
                                        </ModelSelectorName>
                                        <ModelSelectorLogoGroup>
                                          <For each={m.providers}>
                                            {(provider) => (
                                              <ModelSelectorLogo
                                                provider={provider}
                                              />
                                            )}
                                          </For>
                                        </ModelSelectorLogoGroup>
                                        <Show
                                          when={model() === m.id}
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
    </div>
  );
};
