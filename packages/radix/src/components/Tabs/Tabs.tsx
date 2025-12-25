import { createContext, createSignal, splitProps, useContext } from "solid-js";
import type { Component, JSX } from "solid-js";

interface TabsContextValue {
  value: () => string | undefined;
  setValue: (value: string) => void;
  orientation?: "horizontal" | "vertical";
}

const TabsContext = createContext<TabsContextValue>();

export const useTabsContext = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("Tabs components must be used within Tabs");
  }
  return context;
};

export interface TabsProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /**
   * 当前激活的标签页值
   */
  value?: string;
  /**
   * 默认激活的标签页值
   */
  defaultValue?: string;
  /**
   * 值变化回调
   */
  onValueChange?: (value: string) => void;
  /**
   * 标签页方向
   * @default 'horizontal'
   */
  orientation?: "horizontal" | "vertical";
  /**
   * 子元素
   */
  children?: JSX.Element;
}

const TabsBase: Component<TabsProps> = (props) => {
  const [local, others] = splitProps(props, [
    "value",
    "defaultValue",
    "onValueChange",
    "orientation",
    "class",
    "children",
  ]);

  const [internalValue, setInternalValue] = createSignal<string | undefined>(
    local.value ?? local.defaultValue,
  );

  const isControlled = () => local.value !== undefined;
  const value = () => (isControlled() ? local.value : internalValue());

  const handleValueChange = (newValue: string) => {
    if (!isControlled()) {
      setInternalValue(newValue);
    }
    local.onValueChange?.(newValue);
  };

  const contextValue: TabsContextValue = {
    value,
    setValue: handleValueChange,
    orientation: local.orientation ?? "horizontal",
  };

  return (
    <TabsContext.Provider value={contextValue}>
      <div
        class={local.class}
        data-orientation={contextValue.orientation}
        {...others}
      >
        {local.children}
      </div>
    </TabsContext.Provider>
  );
};

export interface TabsComponent extends Component<TabsProps> {
  List: Component<TabsListProps>;
  Trigger: Component<TabsTriggerProps>;
  Content: Component<TabsContentProps>;
}

export const Tabs = Object.assign(TabsBase, {
  List: null as unknown as Component<TabsListProps>,
  Trigger: null as unknown as Component<TabsTriggerProps>,
  Content: null as unknown as Component<TabsContentProps>,
}) as TabsComponent;

export interface TabsListProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /**
   * 子元素
   */
  children?: JSX.Element;
}

export const TabsList: Component<TabsListProps> = (props) => {
  const [local, others] = splitProps(props, ["children", "class"]);
  const context = useTabsContext();

  return (
    <div
      role="tablist"
      class={local.class}
      aria-orientation={context.orientation}
      data-orientation={context.orientation}
      {...others}
    >
      {local.children}
    </div>
  );
};

export interface TabsTriggerProps
  extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * 标签页的值
   */
  value: string;
  /**
   * 是否禁用
   * @default false
   */
  disabled?: boolean;
  /**
   * 子元素
   */
  children?: JSX.Element;
}

export const TabsTrigger: Component<TabsTriggerProps> = (props) => {
  const [local, others] = splitProps(props, [
    "value",
    "disabled",
    "children",
    "class",
    "onClick",
  ]);
  const context = useTabsContext();

  const isActive = () => context.value() === local.value;

  const handleClick: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (e) => {
    if (typeof local.onClick === "function") {
      local.onClick(e);
    }
    if (!local.disabled) {
      context.setValue(local.value);
    }
  };

  return (
    <button
      type="button"
      role="tab"
      class={local.class}
      disabled={local.disabled}
      aria-selected={isActive()}
      aria-controls={`tabpanel-${local.value}`}
      data-state={isActive() ? "active" : "inactive"}
      data-disabled={local.disabled ? "" : undefined}
      onClick={handleClick}
      {...others}
    >
      {local.children}
    </button>
  );
};

export interface TabsContentProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /**
   * 内容对应的标签页值
   */
  value: string;
  /**
   * 子元素
   */
  children?: JSX.Element;
}

export const TabsContent: Component<TabsContentProps> = (props) => {
  const [local, others] = splitProps(props, ["value", "children", "class"]);
  const context = useTabsContext();

  const isActive = () => context.value() === local.value;

  return (
    <div
      role="tabpanel"
      id={`tabpanel-${local.value}`}
      class={local.class}
      aria-labelledby={`tab-${local.value}`}
      hidden={!isActive()}
      data-state={isActive() ? "active" : "inactive"}
      {...others}
    >
      {isActive() && local.children}
    </div>
  );
};

Tabs.List = TabsList;
Tabs.Trigger = TabsTrigger;
Tabs.Content = TabsContent;
