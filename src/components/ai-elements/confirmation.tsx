/**
 * Confirmation 组件 - 移植自 Vercel AI Elements
 * 
 * 用于显示工具调用确认的组件
 */

import type { Component, JSX } from "solid-js";
import { createContext, useContext, splitProps, Show } from "solid-js";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { cn } from "@/components/ui/utils";
import type { ToolUIPart } from "ai";

type ToolUIPartApproval =
  | {
      id: string;
      approved?: never;
      reason?: never;
    }
  | {
      id: string;
      approved: boolean;
      reason?: string;
    }
  | {
      id: string;
      approved: true;
      reason?: string;
    }
  | {
      id: string;
      approved: false;
      reason?: string;
    }
  | undefined;

type ConfirmationContextValue = {
  approval: () => ToolUIPartApproval;
  state: () => ToolUIPart["state"];
};

const ConfirmationContext = createContext<ConfirmationContextValue>();

const useConfirmation = () => {
  const context = useContext(ConfirmationContext);
  if (!context) {
    throw new Error("Confirmation components must be used within Confirmation");
  }
  return context;
};

export type ConfirmationProps = JSX.HTMLAttributes<HTMLDivElement> & {
  approval?: ToolUIPartApproval;
  state: ToolUIPart["state"];
};

export const Confirmation: Component<ConfirmationProps> = (props) => {
  const [local, others] = splitProps(props, [
    "class",
    "approval",
    "state",
    "children",
  ]);

  if (
    !local.approval ||
    local.state === "input-streaming" ||
    local.state === "input-available"
  ) {
    return null;
  }

  const contextValue: ConfirmationContextValue = {
    approval: () => local.approval!,
    state: () => local.state,
  };

  return (
    <ConfirmationContext.Provider value={contextValue}>
      <Alert class={cn("flex flex-col gap-2", local.class)} {...others}>
        {local.children}
      </Alert>
    </ConfirmationContext.Provider>
  );
};

export type ConfirmationTitleProps = JSX.HTMLAttributes<HTMLDivElement>;

export const ConfirmationTitle: Component<ConfirmationTitleProps> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <AlertDescription class={cn("inline", local.class)} {...others} />
  );
};

export type ConfirmationRequestProps = {
  children?: JSX.Element;
};

export const ConfirmationRequest: Component<ConfirmationRequestProps> = (
  props
) => {
  const { state } = useConfirmation();

  return (
    <Show when={state() === "approval-requested"}>
      {props.children}
    </Show>
  );
};

export type ConfirmationAcceptedProps = {
  children?: JSX.Element;
};

export const ConfirmationAccepted: Component<ConfirmationAcceptedProps> = (
  props
) => {
  const { approval, state } = useConfirmation();

  const isAccepted = () => {
    const approvalValue = approval();
    const stateValue = state();
    return (
      approvalValue?.approved === true &&
      (stateValue === "approval-responded" ||
        stateValue === "output-denied" ||
        stateValue === "output-available")
    );
  };

  return <Show when={isAccepted()}>{props.children}</Show>;
};

export type ConfirmationRejectedProps = {
  children?: JSX.Element;
};

export const ConfirmationRejected: Component<ConfirmationRejectedProps> = (
  props
) => {
  const { approval, state } = useConfirmation();

  const isRejected = () => {
    const approvalValue = approval();
    const stateValue = state();
    return (
      approvalValue?.approved === false &&
      (stateValue === "approval-responded" ||
        stateValue === "output-denied" ||
        stateValue === "output-available")
    );
  };

  return <Show when={isRejected()}>{props.children}</Show>;
};

export type ConfirmationActionsProps = JSX.HTMLAttributes<HTMLDivElement>;

export const ConfirmationActions: Component<ConfirmationActionsProps> = (
  props
) => {
  const { state } = useConfirmation();
  const [local, others] = splitProps(props, ["class"]);

  return (
    <Show when={state() === "approval-requested"}>
      <div
        class={cn("flex items-center justify-end gap-2 self-end", local.class)}
        {...others}
      />
    </Show>
  );
};

export type ConfirmationActionProps = JSX.ButtonHTMLAttributes<HTMLButtonElement>;

export const ConfirmationAction: Component<ConfirmationActionProps> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <Button class={cn("h-8 px-3 text-sm", local.class)} type="button" {...others} />
  );
};
