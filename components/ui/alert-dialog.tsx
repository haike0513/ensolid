import type { Component, JSX } from "solid-js";
import { splitProps } from "solid-js";
import * as AlertDialogPrimitive from "@resolid/radix";
import { cn } from "./utils";

export interface AlertDialogProps
    extends AlertDialogPrimitive.AlertDialogProps {
    children?: JSX.Element;
}

const AlertDialogBase: Component<AlertDialogProps> = (props) => {
    return <AlertDialogPrimitive.AlertDialog {...props} />;
};

export interface AlertDialogComponent extends Component<AlertDialogProps> {
    Trigger: Component<AlertDialogTriggerProps>;
    Content: Component<AlertDialogContentProps>;
    Header: Component<AlertDialogHeaderProps>;
    Title: Component<AlertDialogTitleProps>;
    Description: Component<AlertDialogDescriptionProps>;
    Action: Component<AlertDialogActionProps>;
    Cancel: Component<AlertDialogCancelProps>;
}

export const AlertDialog = Object.assign(AlertDialogBase, {
    Trigger: null as unknown as Component<AlertDialogTriggerProps>,
    Content: null as unknown as Component<AlertDialogContentProps>,
    Header: null as unknown as Component<AlertDialogHeaderProps>,
    Title: null as unknown as Component<AlertDialogTitleProps>,
    Description: null as unknown as Component<AlertDialogDescriptionProps>,
    Action: null as unknown as Component<AlertDialogActionProps>,
    Cancel: null as unknown as Component<AlertDialogCancelProps>,
}) as AlertDialogComponent;

export interface AlertDialogTriggerProps
    extends AlertDialogPrimitive.AlertDialogTriggerProps {
    children?: JSX.Element;
}

export const AlertDialogTrigger: Component<AlertDialogTriggerProps> = (
    props,
) => {
    const [local, others] = splitProps(props, [
        "class",
        "children",
        "asChild",
        "onClick",
    ]);

    return (
        <AlertDialogPrimitive.AlertDialogTrigger
            class={cn("", local.class)}
            {...others}
        >
            {local.children}
        </AlertDialogPrimitive.AlertDialogTrigger>
    );
};

export interface AlertDialogContentProps
    extends AlertDialogPrimitive.AlertDialogContentProps {
    children?: JSX.Element;
}

export const AlertDialogContent: Component<AlertDialogContentProps> = (
    props,
) => {
    const [local, others] = splitProps(props, ["class", "children"] as const);

    return (
        <AlertDialogPrimitive.AlertDialogContent
            class={cn(
                "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
                local.class,
            )}
            {...others}
        >
            {local.children}
        </AlertDialogPrimitive.AlertDialogContent>
    );
};

export interface AlertDialogHeaderProps
    extends JSX.HTMLAttributes<HTMLDivElement> {
    children?: JSX.Element;
}

export const AlertDialogHeader: Component<AlertDialogHeaderProps> = (
    props,
) => {
    const [local, others] = splitProps(props, ["class", "children"]);

    return (
        <div
            class={cn(
                "flex flex-col space-y-2 text-center sm:text-left",
                local.class,
            )}
            {...others}
        >
            {local.children}
        </div>
    );
};

export interface AlertDialogTitleProps
    extends AlertDialogPrimitive.AlertDialogTitleProps {
    children?: JSX.Element;
}

export const AlertDialogTitle: Component<AlertDialogTitleProps> = (props) => {
    const [local, others] = splitProps(props, ["class", "children"] as const);

    return (
        <AlertDialogPrimitive.AlertDialogTitle
            class={cn(
                "text-lg font-semibold",
                local.class,
            )}
            {...others}
        >
            {local.children}
        </AlertDialogPrimitive.AlertDialogTitle>
    );
};

export interface AlertDialogDescriptionProps
    extends AlertDialogPrimitive.AlertDialogDescriptionProps {
    children?: JSX.Element;
}

export const AlertDialogDescription: Component<AlertDialogDescriptionProps> = (
    props,
) => {
    const [local, others] = splitProps(props, ["class", "children"] as const);

    return (
        <AlertDialogPrimitive.AlertDialogDescription
            class={cn("text-sm text-muted-foreground", local.class)}
            {...others}
        >
            {local.children}
        </AlertDialogPrimitive.AlertDialogDescription>
    );
};

export interface AlertDialogActionProps
    extends AlertDialogPrimitive.AlertDialogActionProps {
    children?: JSX.Element;
}

export const AlertDialogAction: Component<AlertDialogActionProps> = (
    props,
) => {
    const [local, others] = splitProps(
        props,
        ["class", "children", "onClick"] as const,
    );

    return (
        <AlertDialogPrimitive.AlertDialogAction
            class={cn("", local.class)}
            {...others}
        >
            {local.children}
        </AlertDialogPrimitive.AlertDialogAction>
    );
};

export interface AlertDialogCancelProps
    extends AlertDialogPrimitive.AlertDialogCancelProps {
    children?: JSX.Element;
}

export const AlertDialogCancel: Component<AlertDialogCancelProps> = (
    props,
) => {
    const [local, others] = splitProps(
        props,
        ["class", "children", "onClick"] as const,
    );

    return (
        <AlertDialogPrimitive.AlertDialogCancel
            class={cn("", local.class)}
            {...others}
        >
            {local.children}
        </AlertDialogPrimitive.AlertDialogCancel>
    );
};

AlertDialog.Trigger = AlertDialogTrigger;
AlertDialog.Content = AlertDialogContent;
AlertDialog.Header = AlertDialogHeader;
AlertDialog.Title = AlertDialogTitle;
AlertDialog.Description = AlertDialogDescription;
AlertDialog.Action = AlertDialogAction;
AlertDialog.Cancel = AlertDialogCancel;
