import type { Component, JSX } from "solid-js";
import { splitProps } from "solid-js";
import * as CollapsiblePrimitive from "@ensolid/radix";
import { cn } from "./utils";

export interface CollapsibleProps extends CollapsiblePrimitive.CollapsibleProps {
    children?: JSX.Element;
}

const CollapsibleBase: Component<CollapsibleProps> = (props) => {
    return <CollapsiblePrimitive.Collapsible {...props} />;
};

export const Collapsible = Object.assign(CollapsibleBase, {
    Trigger: null as any,
    Content: null as any,
});

export interface CollapsibleTriggerProps extends CollapsiblePrimitive.CollapsibleTriggerProps {
    children?: JSX.Element;
}

export const CollapsibleTrigger: Component<CollapsibleTriggerProps> = (props) => {
    const [local, others] = splitProps(props, ["class", "children", "asChild", "onClick"]);

    return (
        <CollapsiblePrimitive.CollapsibleTrigger
            class={cn("", local.class)}
            {...others}
        >
            {local.children}
        </CollapsiblePrimitive.CollapsibleTrigger>
    );
};

export interface CollapsibleContentProps extends CollapsiblePrimitive.CollapsibleContentProps {
    children?: JSX.Element;
}

export const CollapsibleContent: Component<CollapsibleContentProps> = (props) => {
    const [local, others] = splitProps(props, ["class", "children"] as const);

    return (
        <CollapsiblePrimitive.CollapsibleContent
            class={cn(
                "overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down",
                local.class,
            )}
            {...others}
        >
            {local.children}
        </CollapsiblePrimitive.CollapsibleContent>
    );
};

Collapsible.Trigger = CollapsibleTrigger;
Collapsible.Content = CollapsibleContent;

