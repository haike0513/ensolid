/**
 * TextGeneration 组件 - 使用 generateText API
 *
 * 一个文本生成 UI 组件，集成了 generateText 函数
 */

import type { Component } from "solid-js";
import { createSignal, Show } from "solid-js";
import { generateText, type GenerateTextOptions } from "@/ai/generateText";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { cn } from "@/components/ui/utils";

export interface TextGenerationProps {
    /**
     * API 端点 URL
     * @default "/api/generate-text"
     */
    api?: string;
    /**
     * 模型名称（支持 registry 格式，如 "openai:gpt-4"）
     * @default "openrouter:meituan/longcat-flash-thinking"
     */
    model?: string;
    /**
     * 初始提示文本
     */
    initialPrompt?: string;
    /**
     * 自定义类名
     */
    class?: string;
    /**
     * 输入框占位符
     */
    placeholder?: string;
    /**
     * 标题
     */
    title?: string;
    /**
     * 描述
     */
    description?: string;
    /**
     * 完成回调
     */
    onFinish?: (prompt: string, text: string) => void | Promise<void>;
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
     * 最大 token 数
     */
    maxTokens?: number;
    /**
     * 温度参数
     */
    temperature?: number;
}

export const TextGeneration: Component<TextGenerationProps> = (props) => {
    const [prompt, setPrompt] = createSignal(props.initialPrompt || "");
    const [result, setResult] = createSignal("");
    const [isLoading, setIsLoading] = createSignal(false);
    const [error, setError] = createSignal<Error | undefined>(undefined);

    const handleSubmit = async (e: Event) => {
        e.preventDefault();
        const promptText = prompt().trim();
        if (!promptText || isLoading()) return;

        setIsLoading(true);
        setError(undefined);
        setResult("");

        try {
            const options: GenerateTextOptions = {
                prompt: promptText,
                model: props.model ||
                    "openrouter:meituan/longcat-flash-thinking",
                api: props.api || "/api/generate-text",
                headers: props.headers,
                body: props.body,
                ...(props.maxTokens !== undefined &&
                    { maxTokens: props.maxTokens }),
                ...(props.temperature !== undefined && {
                    temperature: props.temperature,
                }),
            };

            const response = await generateText(options);
            setResult(response.text);

            if (props.onFinish) {
                await props.onFinish(promptText, response.text);
            }
        } catch (err) {
            const error = err instanceof Error
                ? err
                : new Error("生成文本时发生未知错误");
            setError(error);
            if (props.onError) {
                props.onError(error);
            } else {
                console.error("Text generation error:", error);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div class={cn("space-y-6", props.class)}>
            {/* 输入区域 */}
            <Card>
                <CardHeader>
                    <CardTitle>{props.title || "文本生成"}</CardTitle>
                    <CardDescription>
                        {props.description ||
                            "输入提示文本，AI 将为您生成完整的文本内容"}
                    </CardDescription>
                </CardHeader>
                <CardContent class="space-y-4">
                    <form onSubmit={handleSubmit} class="space-y-4">
                        {/* 提示输入 */}
                        <div class="space-y-2">
                            <Textarea
                                value={prompt()}
                                onInput={(e) =>
                                    setPrompt(e.currentTarget.value)}
                                placeholder={props.placeholder || "输入提示..."}
                                class="min-h-[200px] resize-none"
                                disabled={isLoading()}
                            />
                        </div>

                        <div class="flex gap-2">
                            <Button
                                type="submit"
                                disabled={isLoading() || !prompt().trim()}
                                class="flex-1"
                            >
                                {isLoading() ? "生成中..." : "生成"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* 输出区域 */}
            <Card>
                <CardHeader>
                    <CardTitle>生成结果</CardTitle>
                    <CardDescription>
                        AI 生成的文本内容将显示在这里
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div class="min-h-[300px] rounded-md border bg-muted/50 p-4">
                        <Show
                            when={result()}
                            fallback={
                                <p class="text-sm text-muted-foreground">
                                    {isLoading()
                                        ? "正在生成..."
                                        : "等待输入..."}
                                </p>
                            }
                        >
                            <p class="text-sm whitespace-pre-wrap">
                                {result()}
                            </p>
                        </Show>
                    </div>
                </CardContent>
            </Card>

            {/* 错误提示 */}
            <Show when={error()}>
                <Card class="border-destructive">
                    <CardContent class="pt-6">
                        <div class="text-sm text-destructive">
                            <strong>错误：</strong> {error()?.message}
                        </div>
                    </CardContent>
                </Card>
            </Show>
        </div>
    );
};
