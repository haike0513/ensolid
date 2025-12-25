import type { Component, JSX } from "solid-js";
import { splitProps } from "solid-js";
import * as TabsPrimitive from "@resolid/radix";
import { cn } from "./utils";

export interface TabsProps extends TabsPrimitive.TabsProps {
  children?: JSX.Element;
}

const TabsBase: Component<TabsProps> = (props) => {
  return <TabsPrimitive.Tabs {...props} />;
};

export const Tabs = Object.assign(TabsBase, {
  List: null as any,
  Trigger: null as any,
  Content: null as any,
});

export interface TabsListProps extends TabsPrimitive.TabsListProps {
  children?: JSX.Element;
}

export const TabsList: Component<TabsListProps> = (props) => {
  const [local, others] = splitProps(props, ["class", "children"]);

  return (
    <TabsPrimitive.TabsList
      class={cn(
        "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
        local.class
      )}
      {...others}
    >
      {local.children}
    </TabsPrimitive.TabsList>
  );
};

export interface TabsTriggerProps extends TabsPrimitive.TabsTriggerProps {
  children?: JSX.Element;
}

export const TabsTrigger: Component<TabsTriggerProps> = (props) => {
  const [local, others] = splitProps(props, ["class", "children"]);

  return (
    <TabsPrimitive.TabsTrigger
      class={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
        local.class
      )}
      {...others}
    >
      {local.children}
    </TabsPrimitive.TabsTrigger>
  );
};

export interface TabsContentProps extends TabsPrimitive.TabsContentProps {
  children?: JSX.Element;
}

export const TabsContent: Component<TabsContentProps> = (props) => {
  const [local, others] = splitProps(props, ["class", "children"]);

  return (
    <TabsPrimitive.TabsContent
      class={cn(
        "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        local.class
      )}
      {...others}
    >
      {local.children}
    </TabsPrimitive.TabsContent>
  );
};

// 导出子组件
Tabs.List = TabsList;
Tabs.Trigger = TabsTrigger;
Tabs.Content = TabsContent;

