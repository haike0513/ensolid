import type { Component, JSX } from "solid-js";
import { splitProps } from "solid-js";
import * as CollapsiblePrimitive from "@ensolid/radix";
import { cn } from "./utils";

// Collapsible Root
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

// Collapsible Trigger
export interface CollapsibleTriggerProps extends CollapsiblePrimitive.CollapsibleTriggerProps {
  children?: JSX.Element;
}

export const CollapsibleTrigger: Component<CollapsibleTriggerProps> = (props) => {
  return <CollapsiblePrimitive.CollapsibleTrigger {...props} />;
};

// Collapsible Content
export interface CollapsibleContentProps extends CollapsiblePrimitive.CollapsibleContentProps {
  children?: JSX.Element;
}

export const CollapsibleContent: Component<CollapsibleContentProps> = (props) => {
  const [local, others] = splitProps(props, ["class", "children"]);

  return (
    <CollapsiblePrimitive.CollapsibleContent
      class={cn(
        "overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down",
        local.class
      )}
      {...others}
    >
      {local.children}
    </CollapsiblePrimitive.CollapsibleContent>
  );
};

// Assign sub-components
Collapsible.Trigger = CollapsibleTrigger;
Collapsible.Content = CollapsibleContent;
