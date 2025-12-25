import type { Component, JSX } from "solid-js";
import { splitProps } from "solid-js";
import * as DialogPrimitive from "@resolid/radix";
import { cn } from "./utils";

export interface DialogProps extends DialogPrimitive.DialogProps {
    children?: JSX.Element;
}

const DialogBase: Component<DialogProps> = (props) => {
    return <DialogPrimitive.Dialog {...props} />;
};

export const Dialog = Object.assign(DialogBase, {
    Trigger: null as any,
    Content: null as any,
    Header: null as any,
    Title: null as any,
    Description: null as any,
    Close: null as any,
});

export interface DialogTriggerProps extends DialogPrimitive.DialogTriggerProps {
    children?: JSX.Element;
}

export const DialogTrigger: Component<DialogTriggerProps> = (props) => {
    const [local, others] = splitProps(props, [
        "class",
        "children",
        "asChild",
        "onClick",
    ]);

    return (
        <DialogPrimitive.DialogTrigger
            class={cn("", local.class)}
            {...others}
        >
            {local.children}
        </DialogPrimitive.DialogTrigger>
    );
};

export interface DialogContentProps extends DialogPrimitive.DialogContentProps {
    children?: JSX.Element;
}

export const DialogContent: Component<DialogContentProps> = (props) => {
    const [local, others] = splitProps(props, ["class", "children"] as const);

    return (
        <DialogPrimitive.DialogContent
            class={cn(
                "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
                local.class,
            )}
            {...others}
        >
            {local.children}
        </DialogPrimitive.DialogContent>
    );
};

export interface DialogHeaderProps extends JSX.HTMLAttributes<HTMLDivElement> {
    children?: JSX.Element;
}

export const DialogHeader: Component<DialogHeaderProps> = (props) => {
    const [local, others] = splitProps(props, ["class", "children"]);

    return (
        <div
            class={cn(
                "flex flex-col space-y-1.5 text-center sm:text-left",
                local.class,
            )}
            {...others}
        >
            {local.children}
        </div>
    );
};

export interface DialogTitleProps extends DialogPrimitive.DialogTitleProps {
    children?: JSX.Element;
}

export const DialogTitle: Component<DialogTitleProps> = (props) => {
    const [local, others] = splitProps(props, ["class", "children"] as const);

    return (
        <DialogPrimitive.DialogTitle
            class={cn(
                "text-lg font-semibold leading-none tracking-tight",
                local.class,
            )}
            {...others}
        >
            {local.children}
        </DialogPrimitive.DialogTitle>
    );
};

export interface DialogDescriptionProps
    extends DialogPrimitive.DialogDescriptionProps {
    children?: JSX.Element;
}

export const DialogDescription: Component<DialogDescriptionProps> = (props) => {
    const [local, others] = splitProps(props, ["class", "children"] as const);

    return (
        <DialogPrimitive.DialogDescription
            class={cn("text-sm text-muted-foreground", local.class)}
            {...others}
        >
            {local.children}
        </DialogPrimitive.DialogDescription>
    );
};

export interface DialogCloseProps extends DialogPrimitive.DialogCloseProps {
    children?: JSX.Element;
}

export const DialogClose: Component<DialogCloseProps> = (props) => {
    const [local, others] = splitProps(
        props,
        ["class", "children", "onClick"] as const,
    );

    return (
        <DialogPrimitive.DialogClose
            class={cn(
                "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",
                local.class,
            )}
            {...others}
        >
            {local.children}
        </DialogPrimitive.DialogClose>
    );
};

// 导出子组件
Dialog.Trigger = DialogTrigger;
Dialog.Content = DialogContent;
Dialog.Header = DialogHeader;
Dialog.Title = DialogTitle;
Dialog.Description = DialogDescription;
Dialog.Close = DialogClose;
