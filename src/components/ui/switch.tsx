import type { Component, JSX } from "solid-js";
import { splitProps, createMemo } from "solid-js";
import * as SwitchPrimitive from "@resolid/radix";
import { cn } from "./utils";

export interface SwitchProps extends SwitchPrimitive.SwitchProps {
  children?: JSX.Element;
}

export const Switch: Component<SwitchProps> = (props) => {
  const [local, others] = splitProps(props, ["class", "children", "checked", "defaultChecked"]);

  const checked = createMemo(() => local.checked ?? local.defaultChecked ?? false);

  return (
    <SwitchPrimitive.Switch
      checked={local.checked}
      defaultChecked={local.defaultChecked}
      class={cn(
        "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
        local.class
      )}
      {...others}
    >
      <span
        class={cn(
          "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform",
          checked() ? "translate-x-5" : "translate-x-0"
        )}
      />
    </SwitchPrimitive.Switch>
  );
};

