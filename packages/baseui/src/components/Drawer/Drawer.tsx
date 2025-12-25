import {
    Component,
    createContext,
    createSignal,
    JSX,
    splitProps,
    useContext,
    Show,
} from "solid-js";

interface DrawerContextValue {
    open: () => boolean;
    setOpen: (open: boolean) => void;
    anchor: () => "left" | "right" | "top" | "bottom";
}

const DrawerContext = createContext<DrawerContextValue>();

export const useDrawerContext = () => {
    const context = useContext(DrawerContext);
    if (!context) {
        throw new Error("Drawer components must be used within Drawer");
    }
    return context;
};

export interface DrawerProps extends JSX.HTMLAttributes<HTMLDivElement> {
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
     * 锚点位置
     * @default 'left'
     */
    anchor?: "left" | "right" | "top" | "bottom";
    /**
     * 是否禁用背景点击关闭
     */
    disableBackdropClick?: boolean;
    /**
     * 是否禁用 ESC 关闭
     */
    disableEscapeKeyDown?: boolean;
    /**
     * 子元素
     */
    children?: JSX.Element;
}

const DrawerBase: Component<DrawerProps> = (props) => {
    const [local, others] = splitProps(props, [
        "open",
        "defaultOpen",
        "onOpenChange",
        "anchor",
        "disableBackdropClick",
        "disableEscapeKeyDown",
        "class",
        "children",
    ]);

    const isControlled = () => local.open !== undefined;
    const [internalOpen, setInternalOpen] = createSignal<boolean>(
        local.open ?? local.defaultOpen ?? false,
    );

    const open = () => (isControlled() ? local.open ?? false : internalOpen());
    const anchor = () => local.anchor ?? "left";

    const handleOpenChange = (newOpen: boolean) => {
        if (!isControlled()) {
            setInternalOpen(newOpen);
        }
        local.onOpenChange?.(newOpen);
    };

    const handleBackdropClick: JSX.EventHandler<HTMLDivElement, MouseEvent> = (
        e,
    ) => {
        if (e.target === e.currentTarget && !local.disableBackdropClick) {
            handleOpenChange(false);
        }
    };

    const handleKeyDown: JSX.EventHandler<HTMLDivElement, KeyboardEvent> = (e) => {
        if (e.key === "Escape" && !local.disableEscapeKeyDown) {
            handleOpenChange(false);
        }
    };

    const contextValue: DrawerContextValue = {
        open,
        setOpen: handleOpenChange,
        anchor,
    };

    return (
        <Show when={open()}>
            <DrawerContext.Provider value={contextValue}>
                <div
                    class={local.class}
                    data-open={open() ? "" : undefined}
                    data-anchor={anchor()}
                    onClick={handleBackdropClick}
                    onKeyDown={handleKeyDown}
                    role="presentation"
                    {...others}
                >
                    {local.children}
                </div>
            </DrawerContext.Provider>
        </Show>
    );
};

export interface DrawerComponent extends Component<DrawerProps> {
    Trigger: Component<DrawerTriggerProps>;
    Content: Component<DrawerContentProps>;
    Close: Component<DrawerCloseProps>;
}

export const Drawer = Object.assign(DrawerBase, {
    Trigger: null as unknown as Component<DrawerTriggerProps>,
    Content: null as unknown as Component<DrawerContentProps>,
    Close: null as unknown as Component<DrawerCloseProps>,
}) as DrawerComponent;

export interface DrawerTriggerProps
    extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
    /**
     * 子元素
     */
    children?: JSX.Element;
}

export const DrawerTrigger: Component<DrawerTriggerProps> = (props) => {
    const [local, others] = splitProps(props, ["children", "class", "onClick"]);
    const context = useDrawerContext();

    const handleClick: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (e) => {
        if (typeof local.onClick === "function") {
            local.onClick(e);
        }
        context.setOpen(true);
    };

    return (
        <button type="button" class={local.class} onClick={handleClick} {...others}>
            {local.children}
        </button>
    );
};

export interface DrawerContentProps extends JSX.HTMLAttributes<HTMLDivElement> {
    /**
     * 子元素
     */
    children?: JSX.Element;
}

export const DrawerContent: Component<DrawerContentProps> = (props) => {
    const [local, others] = splitProps(props, ["children", "class", "onClick"]);
    const context = useDrawerContext();

    const handleClick: JSX.EventHandler<HTMLDivElement, MouseEvent> = (e) => {
        e.stopPropagation();
        if (typeof local.onClick === "function") {
            local.onClick(e);
        }
    };

    return (
        <div
            class={local.class}
            role="dialog"
            aria-modal="true"
            data-anchor={context.anchor()}
            onClick={handleClick}
            {...others}
        >
            {local.children}
        </div>
    );
};

export interface DrawerCloseProps
    extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
    /**
     * 子元素
     */
    children?: JSX.Element;
}

export const DrawerClose: Component<DrawerCloseProps> = (props) => {
    const [local, others] = splitProps(props, ["children", "class", "onClick"]);
    const context = useDrawerContext();

    const handleClick: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (e) => {
        if (typeof local.onClick === "function") {
            local.onClick(e);
        }
        context.setOpen(false);
    };

    return (
        <button
            type="button"
            class={local.class}
            onClick={handleClick}
            aria-label="关闭"
            {...others}
        >
            {local.children}
        </button>
    );
};

Drawer.Trigger = DrawerTrigger;
Drawer.Content = DrawerContent;
Drawer.Close = DrawerClose;

