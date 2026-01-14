import type { Component, JSX } from "solid-js";
import { splitProps } from "solid-js";
import * as AlertDialogPrimitive from "@ensolid/radix";
import { cn } from "./utils";
import { buttonVariantClasses } from "./button";

// AlertDialog Root
export interface AlertDialogProps extends AlertDialogPrimitive.AlertDialogProps {
  children?: JSX.Element;
}

const AlertDialogBase: Component<AlertDialogProps> = (props) => {
  return <AlertDialogPrimitive.AlertDialog {...props} />;
};

export const AlertDialog = Object.assign(AlertDialogBase, {
  Trigger: null as any,
  Content: null as any,
  Header: null as any,
  Title: null as any,
  Description: null as any,
  Footer: null as any,
  Action: null as any,
  Cancel: null as any,
});

// AlertDialog Trigger
export interface AlertDialogTriggerProps extends AlertDialogPrimitive.AlertDialogTriggerProps {
  children?: JSX.Element;
}

export const AlertDialogTrigger: Component<AlertDialogTriggerProps> = (props) => {
  return <AlertDialogPrimitive.AlertDialogTrigger {...props} />;
};

// AlertDialog Content
export interface AlertDialogContentProps extends AlertDialogPrimitive.AlertDialogContentProps {
  children?: JSX.Element;
}

export const AlertDialogContent: Component<AlertDialogContentProps> = (props) => {
  const [local, others] = splitProps(props, ["class", "children"]);

  return (
    <AlertDialogPrimitive.AlertDialogContent
      class={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        local.class
      )}
      {...others}
    >
      {local.children}
    </AlertDialogPrimitive.AlertDialogContent>
  );
};

// AlertDialog Header
export interface AlertDialogHeaderProps extends JSX.HTMLAttributes<HTMLDivElement> {
  children?: JSX.Element;
}

export const AlertDialogHeader: Component<AlertDialogHeaderProps> = (props) => {
  const [local, others] = splitProps(props, ["class", "children"]);

  return (
    <div
      class={cn("flex flex-col space-y-2 text-center sm:text-left", local.class)}
      {...others}
    >
      {local.children}
    </div>
  );
};

// AlertDialog Title
export interface AlertDialogTitleProps extends AlertDialogPrimitive.AlertDialogTitleProps {
  children?: JSX.Element;
}

export const AlertDialogTitle: Component<AlertDialogTitleProps> = (props) => {
  const [local, others] = splitProps(props, ["class", "children"]);

  return (
    <AlertDialogPrimitive.AlertDialogTitle
      class={cn("text-lg font-semibold", local.class)}
      {...others}
    >
      {local.children}
    </AlertDialogPrimitive.AlertDialogTitle>
  );
};

// AlertDialog Description
export interface AlertDialogDescriptionProps extends AlertDialogPrimitive.AlertDialogDescriptionProps {
  children?: JSX.Element;
}

export const AlertDialogDescription: Component<AlertDialogDescriptionProps> = (props) => {
  const [local, others] = splitProps(props, ["class", "children"]);

  return (
    <AlertDialogPrimitive.AlertDialogDescription
      class={cn("text-sm text-muted-foreground", local.class)}
      {...others}
    >
      {local.children}
    </AlertDialogPrimitive.AlertDialogDescription>
  );
};

// AlertDialog Footer
export interface AlertDialogFooterProps extends JSX.HTMLAttributes<HTMLDivElement> {
  children?: JSX.Element;
}

export const AlertDialogFooter: Component<AlertDialogFooterProps> = (props) => {
  const [local, others] = splitProps(props, ["class", "children"]);

  return (
    <div
      class={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", local.class)}
      {...others}
    >
      {local.children}
    </div>
  );
};

// AlertDialog Action
export interface AlertDialogActionProps extends AlertDialogPrimitive.AlertDialogActionProps {
  children?: JSX.Element;
}

export const AlertDialogAction: Component<AlertDialogActionProps> = (props) => {
  const [local, others] = splitProps(props, ["class", "children"]);

  return (
    <AlertDialogPrimitive.AlertDialogAction
      class={cn(buttonVariantClasses("default"), local.class)}
      {...others}
    >
      {local.children}
    </AlertDialogPrimitive.AlertDialogAction>
  );
};

// AlertDialog Cancel
export interface AlertDialogCancelProps extends AlertDialogPrimitive.AlertDialogCancelProps {
  children?: JSX.Element;
}

export const AlertDialogCancel: Component<AlertDialogCancelProps> = (props) => {
  const [local, others] = splitProps(props, ["class", "children"]);

  return (
    <AlertDialogPrimitive.AlertDialogCancel
      class={cn(buttonVariantClasses("outline"), "mt-2 sm:mt-0", local.class)}
      {...others}
    >
      {local.children}
    </AlertDialogPrimitive.AlertDialogCancel>
  );
};

// Assign sub-components
AlertDialog.Trigger = AlertDialogTrigger;
AlertDialog.Content = AlertDialogContent;
AlertDialog.Header = AlertDialogHeader;
AlertDialog.Title = AlertDialogTitle;
AlertDialog.Description = AlertDialogDescription;
AlertDialog.Footer = AlertDialogFooter;
AlertDialog.Action = AlertDialogAction;
AlertDialog.Cancel = AlertDialogCancel;
