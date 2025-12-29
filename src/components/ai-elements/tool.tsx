/**
 * Tool 组件 - 移植自 Vercel AI Elements
 * 
 * 用于显示工具调用信息的组件
 */

import type { Component, JSX } from "solid-js";
import { splitProps, Show } from "solid-js";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/components/ui/utils";
import type { ToolUIPart } from "ai";
import { CodeBlock } from "./code-block";

// 简单的图标组件
const CheckCircleIcon = (props: { size?: number; class?: string }) => (
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
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <path d="m9 11 3 3L22 4" />
  </svg>
);

const CircleIcon = (props: { size?: number; class?: string }) => (
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
  </svg>
);

const ClockIcon = (props: { size?: number; class?: string }) => (
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
    <path d="M12 6v6l4 2" />
  </svg>
);

const WrenchIcon = (props: { size?: number; class?: string }) => (
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
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </svg>
);

const XCircleIcon = (props: { size?: number; class?: string }) => (
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
    <path d="m15 9-6 6" />
    <path d="m9 9 6 6" />
  </svg>
);

const ChevronDownIcon = (props: { size?: number; class?: string }) => (
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
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export type ToolProps = JSX.HTMLAttributes<HTMLDivElement>;

export const Tool: Component<ToolProps> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  
  return (
    <Collapsible
      class={cn("not-prose mb-4 w-full rounded-md border", local.class)}
      {...others}
    >
      {props.children}
    </Collapsible>
  );
};

export type ToolHeaderProps = {
  title?: string;
  type: ToolUIPart["type"];
  state: ToolUIPart["state"];
  class?: string;
};

const getStatusBadge = (status: ToolUIPart["state"]) => {
  const labels: Record<ToolUIPart["state"], string> = {
    "input-streaming": "Pending",
    "input-available": "Running",
    "approval-requested": "Awaiting Approval",
    "approval-responded": "Responded",
    "output-available": "Completed",
    "output-error": "Error",
    "output-denied": "Denied",
  };

  const icons: Record<ToolUIPart["state"], JSX.Element> = {
    "input-streaming": <CircleIcon size={16} />,
    "input-available": <ClockIcon size={16} class="animate-pulse" />,
    "approval-requested": <ClockIcon size={16} class="text-yellow-600" />,
    "approval-responded": <CheckCircleIcon size={16} class="text-blue-600" />,
    "output-available": <CheckCircleIcon size={16} class="text-green-600" />,
    "output-error": <XCircleIcon size={16} class="text-red-600" />,
    "output-denied": <XCircleIcon size={16} class="text-orange-600" />,
  };

  return (
    <Badge class="gap-1.5 rounded-full text-xs" variant="secondary">
      {icons[status]}
      {labels[status]}
    </Badge>
  );
};

export const ToolHeader: Component<ToolHeaderProps> = (props) => {
  return (
    <CollapsibleTrigger
      class={cn(
        "flex w-full items-center justify-between gap-4 p-3",
        props.class
      )}
    >
      <div class="flex items-center gap-2">
        <WrenchIcon size={16} class="text-muted-foreground" />
        <span class="font-medium text-sm">
          {props.title ?? props.type.split("-").slice(1).join("-")}
        </span>
        {getStatusBadge(props.state)}
      </div>
      <ChevronDownIcon size={16} class="text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
    </CollapsibleTrigger>
  );
};

export type ToolContentProps = JSX.HTMLAttributes<HTMLDivElement>;

export const ToolContent: Component<ToolContentProps> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  
  return (
    <CollapsibleContent
      class={cn(
        "data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-2 data-[state=open]:slide-in-from-top-2 text-popover-foreground outline-none data-[state=closed]:animate-out data-[state=open]:animate-in",
        local.class
      )}
      {...others}
    >
      {props.children}
    </CollapsibleContent>
  );
};

export type ToolInputProps = JSX.HTMLAttributes<HTMLDivElement> & {
  input: ToolUIPart["input"];
};

export const ToolInput: Component<ToolInputProps> = (props) => {
  const [local, others] = splitProps(props, ["class", "input"]);
  
  return (
    <div class={cn("space-y-2 overflow-hidden p-4", local.class)} {...others}>
      <h4 class="font-medium text-muted-foreground text-xs uppercase tracking-wide">
        Parameters
      </h4>
      <div class="rounded-md bg-muted/50">
        <CodeBlock code={JSON.stringify(local.input, null, 2)} language="json" />
      </div>
    </div>
  );
};

export type ToolOutputProps = JSX.HTMLAttributes<HTMLDivElement> & {
  output: ToolUIPart["output"];
  errorText: ToolUIPart["errorText"];
};

export const ToolOutput: Component<ToolOutputProps> = (props) => {
  const [local, others] = splitProps(props, ["class", "output", "errorText"]);
  
  if (!(local.output || local.errorText)) {
    return null;
  }

  let Output: JSX.Element = <div>{local.output as JSX.Element}</div>;

  if (typeof local.output === "object" && local.output !== null && !Array.isArray(local.output)) {
    Output = (
      <CodeBlock code={JSON.stringify(local.output, null, 2)} language="json" />
    );
  } else if (typeof local.output === "string") {
    Output = <CodeBlock code={local.output} language="json" />;
  }

  return (
    <div class={cn("space-y-2 p-4", local.class)} {...others}>
      <h4 class="font-medium text-muted-foreground text-xs uppercase tracking-wide">
        {local.errorText ? "Error" : "Result"}
      </h4>
      <div
        class={cn(
          "overflow-x-auto rounded-md text-xs [&_table]:w-full",
          local.errorText
            ? "bg-destructive/10 text-destructive"
            : "bg-muted/50 text-foreground"
        )}
      >
        <Show when={local.errorText}>
          <div>{local.errorText}</div>
        </Show>
        {Output}
      </div>
    </div>
  );
};
