/**
 * AIChat 组件 - AI 聊天界面
 *
 * 一个独立的 AI 聊天组件，可以在多个地方复用
 */

import type { Component } from "solid-js";
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Chatbot } from "@/components/ai-elements/chatbot";
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
    onFinish?: (message: any) => void | Promise<void>;
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
}

export const AIChat: Component<AIChatProps> = (props) => {
    const { t } = useI18n();

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
                <Chatbot
                    api={props.api || "/api/chat"}
                    id={props.id || "ai-chat"}
                    title={t().aiPlayground.aichat.title}
                    placeholder={t().aiPlayground.input.placeholder}
                    showTitle={true}
                    showClearButton={true}
                    onResponse={props.onResponse}
                    onFinish={props.onFinish}
                    onError={props.onError}
                    headers={props.headers}
                    body={props.body}
                />
            </div>
        </div>
    );
};
