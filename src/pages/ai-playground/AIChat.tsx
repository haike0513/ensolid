/**
 * AIChat 组件 - AI 聊天界面
 *
 * 一个独立的 AI 聊天组件，可以在多个地方复用
 * 使用 useChat hook 来获取渲染聊天相关的列表与交互
 */

import type { Component } from "solid-js";
import { createMemo, createSignal, For, Show } from "solid-js";
import { useChat } from "@ensolid/aisolid";
import type { UIMessage } from "ai";
import { GatewayChatTransport } from "@/ai";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/components/ui/utils";
import { useI18n } from "@/i18n";

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

export const AIChat: Component<AIChatProps> = (props) => {
    const { t } = useI18n();

    // 创建 GatewayChatTransport
    // 如果提供了 modelId 则使用它，否则使用默认的模型 ID
    const transport = new GatewayChatTransport(
        props.modelId || "gateway:gpt-4",
    );

    // 输入状态管理
    const [input, setInput] = createSignal("");

    // 使用 useChat hook 获取聊天相关的列表与交互
    // 使用 GatewayChatTransport 而不是 HTTP API
    const {
        messages,
        status,
        error,
        stop,
        setMessages,
        sendMessage,
    } = useChat<UIMessage>({
        transport,
        id: props.id || "ai-chat",
        initialMessages: props.initialMessages as UIMessage[],
        headers: props.headers,
        body: props.body,
    });

    const isLoading = createMemo(() =>
        status() === "streaming" || status() === "submitted"
    );
    const hasMessages = createMemo(() => messages().length > 0);

    const handleInputChange = (e: Event | { target: { value: string } }) => {
        let value = "";
        if ("target" in e && e.target) {
            const target = e.target as HTMLInputElement | HTMLTextAreaElement;
            value = target.value || "";
        } else if ("currentTarget" in e && e.currentTarget) {
            const target = e.currentTarget as
                | HTMLInputElement
                | HTMLTextAreaElement;
            value = target.value || "";
        } else if (
            "target" in e && typeof e.target === "object" &&
            e.target !== null && "value" in e.target
        ) {
            value = (e.target as { value: string }).value || "";
        }
        setInput(value);
    };

    const handleSubmit = (e: Event) => {
        e.preventDefault();
        const inputValue = input().trim();
        if (!inputValue || isLoading()) return;

        // 使用 sendMessage 发送消息
        sendMessage({
            role: "user",
            parts: [{ type: "text", text: inputValue }],
        });
        setInput("");
    };

    const clearChat = () => {
        setMessages([]);
    };

    return (
        <div class={props.class}>
            {/* 标题卡片 */}
            {props.showTitleCard !== false && (
                <Card class="mb-4">
                    <CardHeader>
                        <CardTitle>{t().aiPlayground.aichat.title}</CardTitle>
                        <CardDescription>
                            {t().aiPlayground.aichat.description}
                        </CardDescription>
                    </CardHeader>
                </Card>
            )}

            {/* 聊天机器人 */}
            <div style={{ height: props.height || "600px" }}>
                <Card class="flex flex-col h-full">
                    <CardContent class="flex flex-col h-full p-0">
                        {/* 标题栏 */}
                        <CardHeader class="border-b">
                            <div class="flex items-center justify-between">
                                <div>
                                    <CardTitle>
                                        {t().aiPlayground.aichat.title}
                                    </CardTitle>
                                    <CardDescription>
                                        {t().aiPlayground.aichat.description}
                                    </CardDescription>
                                </div>
                                <Show when={hasMessages()}>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={clearChat}
                                    >
                                        {t().aiPlayground.chat.clear}
                                    </Button>
                                </Show>
                            </div>
                        </CardHeader>

                        {/* 消息区域 */}
                        <ScrollArea class="flex-1 p-4">
                            <div class="space-y-4">
                                <Show
                                    when={hasMessages()}
                                    fallback={
                                        <div class="flex items-center justify-center h-full text-center text-muted-foreground py-8">
                                            <div>
                                                <p class="text-lg mb-2">👋</p>
                                                <p>
                                                    {t().aiPlayground.chat
                                                        .empty}
                                                </p>
                                            </div>
                                        </div>
                                    }
                                >
                                    <For each={messages()}>
                                        {(message) => {
                                            // 从 UIMessage 中提取文本内容
                                            const textContent =
                                                (message.parts ?? [])
                                                    .filter((part) =>
                                                        part &&
                                                        part.type === "text"
                                                    )
                                                    .map((part) =>
                                                        part &&
                                                            part.type ===
                                                                "text" &&
                                                            typeof part.text ===
                                                                "string"
                                                            ? part.text
                                                            : ""
                                                    )
                                                    .join("") || "";

                                            return (
                                                <div
                                                    class={cn(
                                                        "flex gap-3",
                                                        message.role === "user"
                                                            ? "justify-end"
                                                            : "justify-start",
                                                    )}
                                                >
                                                    <div
                                                        class={cn(
                                                            "max-w-[80%] rounded-lg px-4 py-2",
                                                            message.role ===
                                                                    "user"
                                                                ? "bg-primary text-primary-foreground"
                                                                : "bg-muted",
                                                        )}
                                                    >
                                                        <div class="text-xs font-medium mb-1 opacity-70">
                                                            {message.role ===
                                                                    "user"
                                                                ? "你"
                                                                : "AI"}
                                                        </div>
                                                        <div class="text-sm whitespace-pre-wrap">
                                                            {textContent}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        }}
                                    </For>
                                    <Show when={isLoading()}>
                                        <div class="flex justify-start">
                                            <div class="bg-muted rounded-lg px-4 py-2">
                                                <div class="flex items-center gap-2">
                                                    <div class="w-2 h-2 bg-current rounded-full animate-pulse">
                                                    </div>
                                                    <span class="text-sm text-muted-foreground">
                                                        {t().aiPlayground.input
                                                            .processing}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </Show>
                                </Show>
                            </div>
                        </ScrollArea>

                        {/* 错误提示 */}
                        <Show when={error()}>
                            <div class="px-4 py-2 bg-destructive/10 text-destructive text-sm border-t">
                                <strong>错误：</strong> {error()?.message}
                            </div>
                        </Show>

                        {/* 输入区域 */}
                        <form
                            onSubmit={handleSubmit}
                            class="p-4 border-t space-y-2"
                        >
                            <Textarea
                                value={input()}
                                onInput={handleInputChange}
                                placeholder={t().aiPlayground.input.placeholder}
                                class="resize-none"
                                disabled={isLoading()}
                                rows={3}
                            />
                            <div class="flex gap-2">
                                <Button
                                    type="submit"
                                    disabled={isLoading() || !input().trim()}
                                    class="flex-1"
                                >
                                    {isLoading()
                                        ? t().aiPlayground.input.processing
                                        : t().aiPlayground.input.submit}
                                </Button>
                                <Show when={isLoading()}>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={stop}
                                    >
                                        {t().aiPlayground.input.stop}
                                    </Button>
                                </Show>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
