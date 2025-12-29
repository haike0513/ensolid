/**
 * Suggestion 组件 - 移植自 Vercel AI Elements
 * 
 * 用于显示建议按钮的组件
 */

import type { Component, JSX } from "solid-js";
import { splitProps } from "solid-js";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/components/ui/utils";

export type SuggestionsProps = JSX.HTMLAttributes<HTMLDivElement>;

export const Suggestions: Component<SuggestionsProps> = (props) => {
  const [local, others] = splitProps(props, ["class", "children"]);
  
  return (
    <ScrollArea class="w-full overflow-x-auto whitespace-nowrap" {...others}>
      <div class={cn("flex w-max flex-nowrap items-center gap-2", local.class)}>
        {local.children}
      </div>
    </ScrollArea>
  );
};

export type SuggestionProps = JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
  suggestion: string;
  onClick?: (suggestion: string) => void;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
};

export const Suggestion: Component<SuggestionProps> = (props) => {
  const [local, others] = splitProps(props, ["suggestion", "onClick", "class", "variant", "size", "children"]);
  
  const handleClick = () => {
    local.onClick?.(local.suggestion);
  };

  return (
    <Button
      class={cn("cursor-pointer rounded-full px-4", local.class)}
      onClick={handleClick}
      size={local.size || "sm"}
      type="button"
      variant={local.variant || "outline"}
      {...others}
    >
      {local.children || local.suggestion}
    </Button>
  );
};
