import type { Component, JSX } from "solid-js";
import { splitProps } from "solid-js";
import * as DropdownMenuPrimitive from "@resolid/radix";
import { useDropdownMenuContext } from "@resolid/radix";
import { cn } from "./utils";

export interface DropdownMenuProps extends DropdownMenuPrimitive.DropdownMenuProps {
    children?: JSX.Element;
}

const DropdownMenuBase: Component<DropdownMenuProps> = (props) => {
    return <DropdownMenuPrimitive.DropdownMenu {...props} />;
};

export const DropdownMenu = Object.assign(DropdownMenuBase, {
    Trigger: null as any,
    Content: null as any,
    Item: null as any,
    Label: null as any,
    Separator: null as any,
});

export interface DropdownMenuTriggerProps
    extends DropdownMenuPrimitive.DropdownMenuTriggerProps {
    children?: JSX.Element;
}

export const DropdownMenuTrigger: Component<DropdownMenuTriggerProps> = (
    props,
) => {
    const [local, others] = splitProps(props, [
        "class",
        "children",
        "asChild",
        "onClick",
    ]);

    return (
        <DropdownMenuPrimitive.DropdownMenuTrigger
            class={cn("", local.class)}
            {...others}
        >
            {local.children}
        </DropdownMenuPrimitive.DropdownMenuTrigger>
    );
};

export interface DropdownMenuContentProps
    extends DropdownMenuPrimitive.DropdownMenuContentProps {
    children?: JSX.Element;
}

export const DropdownMenuContent: Component<DropdownMenuContentProps> = (
    props,
) => {
    const [local, others] = splitProps(props, ["class", "children"] as const);

    return (
        <DropdownMenuPrimitive.DropdownMenuContent
            class={cn(
                "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
                local.class,
            )}
            {...others}
        >
            {local.children}
        </DropdownMenuPrimitive.DropdownMenuContent>
    );
};

export interface DropdownMenuItemProps
    extends DropdownMenuPrimitive.DropdownMenuItemProps {
    children?: JSX.Element;
}

export const DropdownMenuItem: Component<DropdownMenuItemProps> = (props) => {
    const [local, others] = splitProps(props, [
        "children",
        "disabled",
        "class",
        "onClick",
    ]);
    const context = useDropdownMenuContext();

    const handleClick: JSX.EventHandler<HTMLDivElement, MouseEvent> = (e) => {
        if (local.disabled) {
            e.preventDefault();
            return;
        }
        if (typeof local.onClick === "function") {
            local.onClick(e);
        }
        // 点击后自动关闭菜单
        context.setOpen(false);
    };

    return (
        <DropdownMenuPrimitive.DropdownMenuItem
            class={cn(
                "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                local.class,
            )}
            onClick={handleClick}
            {...others}
        >
            {local.children}
        </DropdownMenuPrimitive.DropdownMenuItem>
    );
};

export interface DropdownMenuLabelProps
    extends DropdownMenuPrimitive.DropdownMenuLabelProps {
    children?: JSX.Element;
}

export const DropdownMenuLabel: Component<DropdownMenuLabelProps> = (
    props,
) => {
    const [local, others] = splitProps(props, ["children", "class"] as const);

    return (
        <DropdownMenuPrimitive.DropdownMenuLabel
            class={cn("px-2 py-1.5 text-sm font-semibold", local.class)}
            {...others}
        >
            {local.children}
        </DropdownMenuPrimitive.DropdownMenuLabel>
    );
};

export interface DropdownMenuSeparatorProps
    extends DropdownMenuPrimitive.DropdownMenuSeparatorProps {
    children?: JSX.Element;
}

export const DropdownMenuSeparator: Component<DropdownMenuSeparatorProps> = (
    props,
) => {
    const [local, others] = splitProps(props, ["class"] as const);

    return (
        <DropdownMenuPrimitive.DropdownMenuSeparator
            class={cn("-mx-1 my-1 h-px bg-muted", local.class)}
            {...others}
        />
    );
};

DropdownMenu.Trigger = DropdownMenuTrigger;
DropdownMenu.Content = DropdownMenuContent;
DropdownMenu.Item = DropdownMenuItem;
DropdownMenu.Label = DropdownMenuLabel;
DropdownMenu.Separator = DropdownMenuSeparator;

