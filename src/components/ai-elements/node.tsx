/**
 * Node 组件 - 移植自 Vercel AI Elements
 * 
 * 用于显示流程节点的组件
 */

import type { Component, JSX } from "solid-js";
import { splitProps } from "solid-js";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Handle, type Position } from "@ensolid/solidflow";
import { cn } from "@/components/ui/utils";

export type NodeProps = JSX.HTMLAttributes<HTMLDivElement> & {
  handles: {
    target: boolean;
    source: boolean;
  };
};

export const Node: Component<NodeProps> = (props) => {
  const [local, others] = splitProps(props, [
    "class",
    "handles",
    "children",
  ]);

  return (
    <Card
      class={cn(
        "node-container relative size-full h-auto w-sm gap-0 rounded-md p-0",
        local.class
      )}
      {...others}
    >
      {local.handles.target && <Handle position="left" type="target" />}
      {local.handles.source && <Handle position="right" type="source" />}
      {local.children}
    </Card>
  );
};

export type NodeHeaderProps = JSX.HTMLAttributes<HTMLDivElement>;

export const NodeHeader: Component<NodeHeaderProps> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <CardHeader
      class={cn("gap-0.5 rounded-t-md border-b bg-secondary p-3!", local.class)}
      {...others}
    />
  );
};

export type NodeTitleProps = JSX.HTMLAttributes<HTMLHeadingElement>;

export const NodeTitle: Component<NodeTitleProps> = (props) => (
  <CardTitle {...props} />
);

export type NodeDescriptionProps = JSX.HTMLAttributes<HTMLParagraphElement>;

export const NodeDescription: Component<NodeDescriptionProps> = (props) => (
  <CardDescription {...props} />
);

export type NodeContentProps = JSX.HTMLAttributes<HTMLDivElement>;

export const NodeContent: Component<NodeContentProps> = (props) => (
  <CardContent {...props} />
);

export type NodeFooterProps = JSX.HTMLAttributes<HTMLDivElement>;

export const NodeFooter: Component<NodeFooterProps> = (props) => (
  <CardFooter {...props} />
);

export type NodeActionProps = JSX.ButtonHTMLAttributes<HTMLButtonElement>;

export const NodeAction: Component<NodeActionProps> = (props) => (
  <button {...props} />
);
