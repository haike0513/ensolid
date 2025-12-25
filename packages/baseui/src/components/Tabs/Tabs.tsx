import { Component, createContext, createSignal, JSX, splitProps, useContext } from "solid-js";

interface TabsContextValue {
    value: () => string | undefined;
    setValue: (value: string) => void;
    orientation: () => "horizontal" | "vertical";
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
     * 当前选中的标签值（受控）
     */
    value?: string;
    /**
     * 默认选中的标签值（非受控）
     */
    defaultValue?: string;
    /**
     * 值变化回调
     */
    onValueChange?: (value: string) => void;
    /**
     * 方向
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

    const isControlled = () => local.value !== undefined;
    const [internalValue, setInternalValue] = createSignal<string | undefined>(
        local.value ?? local.defaultValue,
    );

    const value = () => (isControlled() ? local.value : internalValue());
    const orientation = () => local.orientation ?? "horizontal";

    const handleValueChange = (newValue: string) => {
        if (!isControlled()) {
            setInternalValue(newValue);
        }
        local.onValueChange?.(newValue);
    };

    const contextValue: TabsContextValue = {
        value,
        setValue: handleValueChange,
        orientation,
    };

    return (
        <TabsContext.Provider value={contextValue}>
            <div
                class={local.class}
                data-orientation={orientation()}
                {...others}
            >
                {local.children}
            </div>
        </TabsContext.Provider>
    );
};

export interface TabsComponent extends Component<TabsProps> {
    List: Component<TabsListProps>;
    Tab: Component<TabProps>;
    Panel: Component<TabPanelProps>;
}

export const Tabs = Object.assign(TabsBase, {
    List: null as unknown as Component<TabsListProps>,
    Tab: null as unknown as Component<TabProps>,
    Panel: null as unknown as Component<TabPanelProps>,
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
            data-orientation={context.orientation()}
            {...others}
        >
            {local.children}
        </div>
    );
};

export interface TabProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
    /**
     * 标签的值
     */
    value: string;
    /**
     * 是否禁用
     */
    disabled?: boolean;
    /**
     * 子元素
     */
    children?: JSX.Element;
}

export const Tab: Component<TabProps> = (props) => {
    const [local, others] = splitProps(props, [
        "value",
        "disabled",
        "children",
        "class",
        "onClick",
    ]);
    const context = useTabsContext();

    const isSelected = () => context.value() === local.value;

    const handleClick: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (
        e,
    ) => {
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
            onClick={handleClick}
            aria-selected={isSelected()}
            aria-controls={`tabpanel-${local.value}`}
            data-selected={isSelected() ? "" : undefined}
            data-disabled={local.disabled ? "" : undefined}
            {...others}
        >
            {local.children}
        </button>
    );
};

export interface TabPanelProps extends JSX.HTMLAttributes<HTMLDivElement> {
    /**
     * 面板的值
     */
    value: string;
    /**
     * 子元素
     */
    children?: JSX.Element;
}

export const TabPanel: Component<TabPanelProps> = (props) => {
    const [local, others] = splitProps(props, ["value", "children", "class"]);
    const context = useTabsContext();

    const isSelected = () => context.value() === local.value;

    return (
        <div
            role="tabpanel"
            id={`tabpanel-${local.value}`}
            class={local.class}
            hidden={!isSelected()}
            data-selected={isSelected() ? "" : undefined}
            {...others}
        >
            {isSelected() && local.children}
        </div>
    );
};

Tabs.List = TabsList;
Tabs.Tab = Tab;
Tabs.Panel = TabPanel;

