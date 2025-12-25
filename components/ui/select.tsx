import type { Component, JSX } from "solid-js";
import { splitProps } from "solid-js";
import * as SelectPrimitive from "@resolid/radix";
import { cn } from "./utils";

export interface SelectProps extends SelectPrimitive.SelectProps {
    children?: JSX.Element;
}

const SelectBase: Component<SelectProps> = (props) => {
    return <SelectPrimitive.Select {...props} />;
};

export const Select = Object.assign(SelectBase, {
    Trigger: null as any,
    Value: null as any,
    Content: null as any,
    Item: null as any,
});

export interface SelectTriggerProps extends SelectPrimitive.SelectTriggerProps {
    children?: JSX.Element;
}

export const SelectTrigger: Component<SelectTriggerProps> = (props) => {
    const [local, others] = splitProps(props, [
        "class",
        "children",
        "onClick",
    ]);

    return (
        <SelectPrimitive.SelectTrigger
            class={cn(
                "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
                local.class,
            )}
            {...others}
        >
            {local.children}
        </SelectPrimitive.SelectTrigger>
    );
};

export interface SelectValueProps extends SelectPrimitive.SelectValueProps {}

export const SelectValue = SelectPrimitive.SelectValue;

export interface SelectContentProps extends SelectPrimitive.SelectContentProps {
    children?: JSX.Element;
}

export const SelectContent: Component<SelectContentProps> = (props) => {
    const [local, others] = splitProps(props, ["class", "children"] as const);

    return (
        <SelectPrimitive.SelectContent
            class={cn(
                "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
                local.class,
            )}
            {...others}
        >
            {local.children}
        </SelectPrimitive.SelectContent>
    );
};

export interface SelectItemProps extends SelectPrimitive.SelectItemProps {
    children?: JSX.Element;
}

export const SelectItem: Component<SelectItemProps> = (props) => {
    const [local, others] = splitProps(props, [
        "value",
        "disabled",
        "children",
        "class",
        "onClick",
    ]);

    return (
        <SelectPrimitive.SelectItem
            class={cn(
                "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                local.class,
            )}
            {...others}
        >
            {local.children}
        </SelectPrimitive.SelectItem>
    );
};

Select.Trigger = SelectTrigger;
Select.Value = SelectValue;
Select.Content = SelectContent;
Select.Item = SelectItem;

