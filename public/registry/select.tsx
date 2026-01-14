import type { Component, JSX } from "solid-js";
import { splitProps } from "solid-js";
import * as SelectPrimitive from "@ensolid/radix";
import { cn } from "./utils";

// Select Root
export interface SelectProps extends SelectPrimitive.SelectProps {
  children?: JSX.Element;
}

const SelectBase: Component<SelectProps> = (props) => {
  return <SelectPrimitive.Select {...props} />;
};

export const Select = Object.assign(SelectBase, {
  Group: null as any,
  Value: null as any,
  Trigger: null as any,
  Content: null as any,
  Label: null as any,
  Item: null as any,
  Separator: null as any,
  ScrollUpButton: null as any,
  ScrollDownButton: null as any,
});

// Select Group
export const SelectGroup = SelectPrimitive.SelectGroup;

// Select Value
export const SelectValue = SelectPrimitive.SelectValue;

// Select Trigger
export interface SelectTriggerProps extends SelectPrimitive.SelectTriggerProps {
  children?: JSX.Element;
}

export const SelectTrigger: Component<SelectTriggerProps> = (props) => {
  const [local, others] = splitProps(props, ["class", "children"]);

  return (
    <SelectPrimitive.SelectTrigger
      class={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
        local.class
      )}
      {...others}
    >
      {local.children}
      <SelectPrimitive.SelectIcon>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="h-4 w-4 opacity-50"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </SelectPrimitive.SelectIcon>
    </SelectPrimitive.SelectTrigger>
  );
};

// Select Content
export interface SelectContentProps extends SelectPrimitive.SelectContentProps {
  children?: JSX.Element;
  position?: "popper" | "item-aligned";
}

export const SelectContent: Component<SelectContentProps> = (props) => {
  const [local, others] = splitProps(props, ["class", "children", "position"]);

  return (
    <SelectPrimitive.SelectContent
      class={cn(
        "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        local.position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        local.class
      )}
      position={local.position}
      {...others}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.SelectViewport
        class={cn(
          "p-1",
          local.position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
        )}
      >
        {local.children}
      </SelectPrimitive.SelectViewport>
      <SelectScrollDownButton />
    </SelectPrimitive.SelectContent>
  );
};

// Select Label
export interface SelectLabelProps extends SelectPrimitive.SelectLabelProps {
  children?: JSX.Element;
}

export const SelectLabel: Component<SelectLabelProps> = (props) => {
  const [local, others] = splitProps(props, ["class", "children"]);

  return (
    <SelectPrimitive.SelectLabel
      class={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", local.class)}
      {...others}
    >
      {local.children}
    </SelectPrimitive.SelectLabel>
  );
};

// Select Item
export interface SelectItemProps extends SelectPrimitive.SelectItemProps {
  children?: JSX.Element;
}

export const SelectItem: Component<SelectItemProps> = (props) => {
  const [local, others] = splitProps(props, ["class", "children"]);

  return (
    <SelectPrimitive.SelectItem
      class={cn(
        "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        local.class
      )}
      {...others}
    >
      <span class="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <SelectPrimitive.SelectItemIndicator>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="h-4 w-4"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </SelectPrimitive.SelectItemIndicator>
      </span>
      <SelectPrimitive.SelectItemText>{local.children}</SelectPrimitive.SelectItemText>
    </SelectPrimitive.SelectItem>
  );
};

// Select Separator
export interface SelectSeparatorProps extends SelectPrimitive.SelectSeparatorProps {}

export const SelectSeparator: Component<SelectSeparatorProps> = (props) => {
  const [local, others] = splitProps(props, ["class"]);

  return (
    <SelectPrimitive.SelectSeparator
      class={cn("-mx-1 my-1 h-px bg-muted", local.class)}
      {...others}
    />
  );
};

// Select ScrollUpButton
export const SelectScrollUpButton: Component = () => (
  <SelectPrimitive.SelectScrollUpButton class="flex cursor-default items-center justify-center py-1">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="h-4 w-4"
    >
      <path d="m18 15-6-6-6 6" />
    </svg>
  </SelectPrimitive.SelectScrollUpButton>
);

// Select ScrollDownButton
export const SelectScrollDownButton: Component = () => (
  <SelectPrimitive.SelectScrollDownButton class="flex cursor-default items-center justify-center py-1">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="h-4 w-4"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  </SelectPrimitive.SelectScrollDownButton>
);

// Assign sub-components
Select.Group = SelectGroup;
Select.Value = SelectValue;
Select.Trigger = SelectTrigger;
Select.Content = SelectContent;
Select.Label = SelectLabel;
Select.Item = SelectItem;
Select.Separator = SelectSeparator;
Select.ScrollUpButton = SelectScrollUpButton;
Select.ScrollDownButton = SelectScrollDownButton;
