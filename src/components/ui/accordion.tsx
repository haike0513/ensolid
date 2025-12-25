import type { Component, JSX } from "solid-js";
import { splitProps } from "solid-js";
import * as AccordionPrimitive from "@resolid/radix";
import { cn } from "./utils";

export interface AccordionProps extends AccordionPrimitive.AccordionProps {
    children?: JSX.Element;
}

const AccordionBase: Component<AccordionProps> = (props) => {
    return <AccordionPrimitive.Accordion {...props} />;
};

export const Accordion = Object.assign(AccordionBase, {
    Item: null as any,
    Trigger: null as any,
    Content: null as any,
});

export interface AccordionItemProps
    extends AccordionPrimitive.AccordionItemProps {
    children?: JSX.Element;
}

export const AccordionItem: Component<AccordionItemProps> = (props) => {
    const [local, others] = splitProps(props, ["class", "children"]);

    return (
        <AccordionPrimitive.AccordionItem
            class={cn("border-b", local.class)}
            {...others}
        >
            {local.children}
        </AccordionPrimitive.AccordionItem>
    );
};

export interface AccordionTriggerProps
    extends AccordionPrimitive.AccordionTriggerProps {
    children?: JSX.Element;
}

export const AccordionTrigger: Component<AccordionTriggerProps> = (props) => {
    const [local, others] = splitProps(props, ["class", "children"]);

    return (
        <AccordionPrimitive.AccordionTrigger
            class={cn(
                "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
                local.class,
            )}
            {...others}
        >
            {local.children}
        </AccordionPrimitive.AccordionTrigger>
    );
};

export interface AccordionContentProps
    extends AccordionPrimitive.AccordionContentProps {
    children?: JSX.Element;
}

export const AccordionContent: Component<AccordionContentProps> = (props) => {
    const [local, others] = splitProps(props, ["class", "children"]);

    return (
        <AccordionPrimitive.AccordionContent
            class={cn(
                "overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
                local.class,
            )}
            {...others}
        >
            <div class="pb-4 pt-0">{local.children}</div>
        </AccordionPrimitive.AccordionContent>
    );
};

// 导出子组件
Accordion.Item = AccordionItem;
Accordion.Trigger = AccordionTrigger;
Accordion.Content = AccordionContent;
