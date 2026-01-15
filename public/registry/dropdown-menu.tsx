import type { Component, JSX } from "solid-js";
import { splitProps } from "solid-js";
import * as DropdownMenuPrimitive from "@ensolid/radix";
import { cn } from "./utils";

// DropdownMenu Props
export interface DropdownMenuProps extends DropdownMenuPrimitive.DropdownMenuProps {
  children?: JSX.Element;
}

const DropdownMenuBase: Component<DropdownMenuProps> = (props) => {
  return <DropdownMenuPrimitive.DropdownMenu {...props} />;
};

// DropdownMenu Trigger
export interface DropdownMenuTriggerProps extends DropdownMenuPrimitive.DropdownMenuTriggerProps {
  children?: JSX.Element;
}

export const DropdownMenuTrigger: Component<DropdownMenuTriggerProps> = (props) => {
  return <DropdownMenuPrimitive.DropdownMenuTrigger {...props} />;
};

// DropdownMenu Group
export const DropdownMenuGroup = DropdownMenuPrimitive.DropdownMenuGroup;

// DropdownMenu Sub
export const DropdownMenuSub = DropdownMenuPrimitive.DropdownMenuSub;

// DropdownMenu RadioGroup
export const DropdownMenuRadioGroup = DropdownMenuPrimitive.DropdownMenuRadioGroup;

// DropdownMenu SubTrigger
export interface DropdownMenuSubTriggerProps extends DropdownMenuPrimitive.DropdownMenuSubTriggerProps {
  children?: JSX.Element;
  inset?: boolean;
}

export const DropdownMenuSubTrigger: Component<DropdownMenuSubTriggerProps> = (props) => {
  const [local, others] = splitProps(props, ["class", "children", "inset"]);

  return (
    <DropdownMenuPrimitive.DropdownMenuSubTrigger
      class={cn(
        "flex cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
        local.inset && "pl-8",
        local.class
      )}
      {...others}
    >
      {local.children}
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
        class="ml-auto h-4 w-4"
      >
        <path d="m9 18 6-6-6-6" />
      </svg>
    </DropdownMenuPrimitive.DropdownMenuSubTrigger>
  );
};

// DropdownMenu SubContent
export interface DropdownMenuSubContentProps extends DropdownMenuPrimitive.DropdownMenuSubContentProps {
  children?: JSX.Element;
}

export const DropdownMenuSubContent: Component<DropdownMenuSubContentProps> = (props) => {
  const [local, others] = splitProps(props, ["class", "children"]);

  return (
    <DropdownMenuPrimitive.DropdownMenuSubContent
      class={cn(
        "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        local.class
      )}
      {...others}
    >
      {local.children}
    </DropdownMenuPrimitive.DropdownMenuSubContent>
  );
};

// DropdownMenu Content
export interface DropdownMenuContentProps extends DropdownMenuPrimitive.DropdownMenuContentProps {
  children?: JSX.Element;
}

export const DropdownMenuContent: Component<DropdownMenuContentProps> = (props) => {
  const [local, others] = splitProps(props, ["class", "children", "sideOffset"]);

  return (
    <DropdownMenuPrimitive.DropdownMenuContent
      sideOffset={local.sideOffset ?? 4}
      class={cn(
        "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        local.class
      )}
      {...others}
    >
      {local.children}
    </DropdownMenuPrimitive.DropdownMenuContent>
  );
};

// DropdownMenu Item
export interface DropdownMenuItemProps extends DropdownMenuPrimitive.DropdownMenuItemProps {
  children?: JSX.Element;
  inset?: boolean;
}

export const DropdownMenuItem: Component<DropdownMenuItemProps> = (props) => {
  const [local, others] = splitProps(props, ["class", "children", "inset"]);

  return (
    <DropdownMenuPrimitive.DropdownMenuItem
      class={cn(
        "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
        local.inset && "pl-8",
        local.class
      )}
      {...others}
    >
      {local.children}
    </DropdownMenuPrimitive.DropdownMenuItem>
  );
};

// DropdownMenu CheckboxItem
export interface DropdownMenuCheckboxItemProps extends DropdownMenuPrimitive.DropdownMenuCheckboxItemProps {
  children?: JSX.Element;
}

export const DropdownMenuCheckboxItem: Component<DropdownMenuCheckboxItemProps> = (props) => {
  const [local, others] = splitProps(props, ["class", "children", "checked"]);

  return (
    <DropdownMenuPrimitive.DropdownMenuCheckboxItem
      class={cn(
        "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        local.class
      )}
      checked={local.checked}
      {...others}
    >
      <span class="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <DropdownMenuPrimitive.DropdownMenuItemIndicator>
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
        </DropdownMenuPrimitive.DropdownMenuItemIndicator>
      </span>
      {local.children}
    </DropdownMenuPrimitive.DropdownMenuCheckboxItem>
  );
};

// DropdownMenu RadioItem
export interface DropdownMenuRadioItemProps extends DropdownMenuPrimitive.DropdownMenuRadioItemProps {
  children?: JSX.Element;
}

export const DropdownMenuRadioItem: Component<DropdownMenuRadioItemProps> = (props) => {
  const [local, others] = splitProps(props, ["class", "children"]);

  return (
    <DropdownMenuPrimitive.DropdownMenuRadioItem
      class={cn(
        "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        local.class
      )}
      {...others}
    >
      <span class="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <DropdownMenuPrimitive.DropdownMenuItemIndicator>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="h-2 w-2"
          >
            <circle cx="12" cy="12" r="10" />
          </svg>
        </DropdownMenuPrimitive.DropdownMenuItemIndicator>
      </span>
      {local.children}
    </DropdownMenuPrimitive.DropdownMenuRadioItem>
  );
};

// DropdownMenu Label
export interface DropdownMenuLabelProps extends DropdownMenuPrimitive.DropdownMenuLabelProps {
  children?: JSX.Element;
  inset?: boolean;
}

export const DropdownMenuLabel: Component<DropdownMenuLabelProps> = (props) => {
  const [local, others] = splitProps(props, ["class", "children", "inset"]);

  return (
    <DropdownMenuPrimitive.DropdownMenuLabel
      class={cn("px-2 py-1.5 text-sm font-semibold", local.inset && "pl-8", local.class)}
      {...others}
    >
      {local.children}
    </DropdownMenuPrimitive.DropdownMenuLabel>
  );
};

// DropdownMenu Separator
export interface DropdownMenuSeparatorProps extends DropdownMenuPrimitive.DropdownMenuSeparatorProps {}

export const DropdownMenuSeparator: Component<DropdownMenuSeparatorProps> = (props) => {
  const [local, others] = splitProps(props, ["class"]);

  return (
    <DropdownMenuPrimitive.DropdownMenuSeparator
      class={cn("-mx-1 my-1 h-px bg-muted", local.class)}
      {...others}
    />
  );
};

// DropdownMenu Shortcut
export interface DropdownMenuShortcutProps extends JSX.HTMLAttributes<HTMLSpanElement> {
  children?: JSX.Element;
}

export const DropdownMenuShortcut: Component<DropdownMenuShortcutProps> = (props) => {
  const [local, others] = splitProps(props, ["class", "children"]);

  return (
    <span
      class={cn("ml-auto text-xs tracking-widest opacity-60", local.class)}
      {...others}
    >
      {local.children}
    </span>
  );
};

// DropdownMenu Compound Component Type
export interface DropdownMenuComponent extends Component<DropdownMenuProps> {
  Trigger: typeof DropdownMenuTrigger;
  Content: typeof DropdownMenuContent;
  Item: typeof DropdownMenuItem;
  CheckboxItem: typeof DropdownMenuCheckboxItem;
  RadioItem: typeof DropdownMenuRadioItem;
  Label: typeof DropdownMenuLabel;
  Separator: typeof DropdownMenuSeparator;
  Shortcut: typeof DropdownMenuShortcut;
  Group: typeof DropdownMenuGroup;
  Sub: typeof DropdownMenuSub;
  SubTrigger: typeof DropdownMenuSubTrigger;
  SubContent: typeof DropdownMenuSubContent;
  RadioGroup: typeof DropdownMenuRadioGroup;
}

export const DropdownMenu = Object.assign(DropdownMenuBase, {
  Trigger: DropdownMenuTrigger,
  Content: DropdownMenuContent,
  Item: DropdownMenuItem,
  CheckboxItem: DropdownMenuCheckboxItem,
  RadioItem: DropdownMenuRadioItem,
  Label: DropdownMenuLabel,
  Separator: DropdownMenuSeparator,
  Shortcut: DropdownMenuShortcut,
  Group: DropdownMenuGroup,
  Sub: DropdownMenuSub,
  SubTrigger: DropdownMenuSubTrigger,
  SubContent: DropdownMenuSubContent,
  RadioGroup: DropdownMenuRadioGroup,
}) as DropdownMenuComponent;
