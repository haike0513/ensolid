/**
 * Plan 组件 - 移植自 Vercel AI Elements
 * 
 * 用于显示计划/规划的组件
 */

import type { Component, JSX } from "solid-js";
import { createContext, useContext, createMemo, splitProps } from "solid-js";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/components/ui/utils";
import { Shimmer } from "./shimmer";

// 图标组件
const ChevronsUpDownIcon = (props: { size?: number; class?: string }) => (
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
    <path d="m7 15 5 5 5-5" />
    <path d="m7 9 5-5 5 5" />
  </svg>
);

type PlanContextValue = {
  isStreaming: () => boolean;
};

const PlanContext = createContext<PlanContextValue>();

const usePlan = () => {
  const context = useContext(PlanContext);
  if (!context) {
    throw new Error("Plan components must be used within Plan");
  }
  return context;
};

export type PlanProps = JSX.HTMLAttributes<HTMLDivElement> & {
  isStreaming?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export const Plan: Component<PlanProps> = (props) => {
  const [local, others] = splitProps(props, [
    "class",
    "isStreaming",
    "open",
    "defaultOpen",
    "onOpenChange",
    "children",
  ]);

  const isStreaming = () => local.isStreaming ?? false;

  const contextValue: PlanContextValue = {
    isStreaming,
  };

  return (
    <PlanContext.Provider value={contextValue}>
      <Collapsible
        open={local.open}
        defaultOpen={local.defaultOpen}
        onOpenChange={local.onOpenChange}
        {...others}
      >
        <Card class={cn("shadow-none", local.class)} data-slot="plan">
          {local.children}
        </Card>
      </Collapsible>
    </PlanContext.Provider>
  );
};

export type PlanHeaderProps = JSX.HTMLAttributes<HTMLDivElement>;

export const PlanHeader: Component<PlanHeaderProps> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <CardHeader
      class={cn("flex items-start justify-between", local.class)}
      data-slot="plan-header"
      {...others}
    />
  );
};

export type PlanTitleProps = JSX.HTMLAttributes<HTMLHeadingElement> & {
  children: string;
};

export const PlanTitle: Component<PlanTitleProps> = (props) => {
  const { isStreaming } = usePlan();
  const [local, others] = splitProps(props, ["children"]);

  return (
    <CardTitle data-slot="plan-title" {...others}>
      {isStreaming() ? <Shimmer>{local.children}</Shimmer> : local.children}
    </CardTitle>
  );
};

export type PlanDescriptionProps = JSX.HTMLAttributes<HTMLParagraphElement> & {
  children: string;
};

export const PlanDescription: Component<PlanDescriptionProps> = (props) => {
  const { isStreaming } = usePlan();
  const [local, others] = splitProps(props, ["class", "children"]);

  return (
    <CardDescription
      class={cn("text-balance", local.class)}
      data-slot="plan-description"
      {...others}
    >
      {isStreaming() ? <Shimmer>{local.children}</Shimmer> : local.children}
    </CardDescription>
  );
};

export type PlanActionProps = JSX.ButtonHTMLAttributes<HTMLButtonElement>;

export const PlanAction: Component<PlanActionProps> = (props) => (
  <Button data-slot="plan-action" {...props} />
);

export type PlanContentProps = JSX.HTMLAttributes<HTMLDivElement>;

export const PlanContent: Component<PlanContentProps> = (props) => (
  <CollapsibleContent>
    <CardContent data-slot="plan-content" {...props} />
  </CollapsibleContent>
);

export type PlanFooterProps = JSX.HTMLAttributes<HTMLDivElement>;

export const PlanFooter: Component<PlanFooterProps> = (props) => (
  <CardFooter data-slot="plan-footer" {...props} />
);

export type PlanTriggerProps = JSX.ButtonHTMLAttributes<HTMLButtonElement>;

export const PlanTrigger: Component<PlanTriggerProps> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <CollapsibleTrigger asChild>
      <Button
        class={cn("size-8", local.class)}
        data-slot="plan-trigger"
        size="icon"
        variant="ghost"
        {...others}
      >
        <ChevronsUpDownIcon size={16} />
        <span class="sr-only">Toggle plan</span>
      </Button>
    </CollapsibleTrigger>
  );
};
