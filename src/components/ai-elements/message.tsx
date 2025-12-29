/**
 * Message 组件 - 移植自 Vercel AI Elements
 * 
 * 用于显示单条聊天消息的组件
 */

import type { Component, JSX } from "solid-js";
import { Show } from "solid-js";
import type { Message } from "@ensolid/aisolid";
import { cn } from "@/components/ui/utils";

export interface MessageProps {
  /**
   * 消息对象
   */
  message: Message;
  /**
   * 自定义类名
   */
  class?: string;
  /**
   * 是否显示时间戳
   */
  showTimestamp?: boolean;
  /**
   * 是否显示角色标签
   */
  showRole?: boolean;
  /**
   * 自定义角色标签映射
   */
  roleLabels?: {
    user?: string;
    assistant?: string;
    system?: string;
  };
}

export const MessageComponent: Component<MessageProps> = (props) => {
  const roleLabels = {
    user: "你",
    assistant: "AI",
    system: "系统",
    ...props.roleLabels,
  };

  const roleLabel = () => {
    const role = props.message.role;
    return roleLabels[role as keyof typeof roleLabels] || role;
  };

  return (
    <div
      class={cn(
        "flex gap-3",
        props.message.role === "user" ? "justify-end" : "justify-start",
        props.class
      )}
    >
      <div
        class={cn(
          "max-w-[80%] rounded-lg px-4 py-2",
          props.message.role === "user"
            ? "bg-primary text-primary-foreground"
            : "bg-muted"
        )}
      >
        <Show when={props.showRole !== false}>
          <div class="text-xs font-medium mb-1 opacity-70">
            {roleLabel()}
          </div>
        </Show>
        <div class="text-sm whitespace-pre-wrap">
          {props.message.content}
        </div>
        <Show when={props.showTimestamp !== false && props.message.createdAt}>
          <div class="text-xs opacity-50 mt-1">
            {new Date(props.message.createdAt!).toLocaleTimeString()}
          </div>
        </Show>
      </div>
    </div>
  );
};
