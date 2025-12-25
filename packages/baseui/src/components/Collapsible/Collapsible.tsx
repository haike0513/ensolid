import {
    Component,
    createContext,
    createSignal,
    JSX,
    splitProps,
    useContext,
    Show,
} from "solid-js";

interface CollapsibleContextValue {
    open: () => boolean;
    setOpen: (open: boolean) => void;
}

const CollapsibleContext = createContext<CollapsibleContextValue>();

export const useCollapsibleContext = () => {
    const context = useContext(CollapsibleContext);
    if (!context) {
        throw new Error("Collapsible components must be used within Collapsible");
    }
    return context;
};

export interface CollapsibleProps extends JSX.HTMLAttributes<HTMLDivElement> {
    /**
     * 是否打开（受控）
     */
    open?: boolean;
    /**
     * 默认打开状态（非受控）
     */
    defaultOpen?: boolean;
    /**
     * 打开状态变化回调
     */
    onOpenChange?: (open: boolean) => void;
    /**
     * 是否禁用
     */
    disabled?: boolean;
    /**
     * 子元素
     */
    children?: JSX.Element;
}

const CollapsibleBase: Component<CollapsibleProps> = (props) => {
    const [local, others] = splitProps(props, [
        "open",
        "defaultOpen",
        "onOpenChange",
        "disabled",
        "class",
        "children",
    ]);

    const isControlled = () => local.open !== undefined;
    const [internalOpen, setInternalOpen] = createSignal<boolean>(
        local.open ?? local.defaultOpen ?? false,
    );

    const open = () => (isControlled() ? local.open ?? false : internalOpen());

    const handleOpenChange = (newOpen: boolean) => {
        if (!isControlled()) {
            setInternalOpen(newOpen);
        }
        local.onOpenChange?.(newOpen);
    };

    const contextValue: CollapsibleContextValue = {
        open,
        setOpen: handleOpenChange,
    };

    return (
        <CollapsibleContext.Provider value={contextValue}>
            <div
                class={local.class}
                data-open={open() ? "" : undefined}
                data-disabled={local.disabled ? "" : undefined}
                {...others}
            >
                {local.children}
            </div>
        </CollapsibleContext.Provider>
    );
};

export interface CollapsibleComponent extends Component<CollapsibleProps> {
    Trigger: Component<CollapsibleTriggerProps>;
    Content: Component<CollapsibleContentProps>;
}

export const Collapsible = Object.assign(CollapsibleBase, {
    Trigger: null as unknown as Component<CollapsibleTriggerProps>,
    Content: null as unknown as Component<CollapsibleContentProps>,
}) as CollapsibleComponent;

export interface CollapsibleTriggerProps
    extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
    /**
     * 子元素
     */
    children?: JSX.Element;
}

export const CollapsibleTrigger: Component<CollapsibleTriggerProps> = (props) => {
    const [local, others] = splitProps(props, [
        "children",
        "class",
        "onClick",
    ]);
    const context = useCollapsibleContext();

    const handleClick: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (e) => {
        if (typeof local.onClick === "function") {
            local.onClick(e);
        }
        context.setOpen(!context.open());
    };

    return (
        <button
            type="button"
            class={local.class}
            onClick={handleClick}
            aria-expanded={context.open()}
            data-state={context.open() ? "open" : "closed"}
            {...others}
        >
            {local.children}
        </button>
    );
};

export interface CollapsibleContentProps
    extends JSX.HTMLAttributes<HTMLDivElement> {
    /**
     * 子元素
     */
    children?: JSX.Element;
}

export const CollapsibleContent: Component<CollapsibleContentProps> = (props) => {
    const [local, others] = splitProps(props, ["children", "class"]);
    const context = useCollapsibleContext();

    return (
        <Show when={context.open()}>
            <div
                class={local.class}
                hidden={!context.open()}
                data-state={context.open() ? "open" : "closed"}
                {...others}
            >
                {local.children}
            </div>
        </Show>
    );
};

Collapsible.Trigger = CollapsibleTrigger;
Collapsible.Content = CollapsibleContent;

