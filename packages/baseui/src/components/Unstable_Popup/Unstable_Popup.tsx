import {
    Component,
    createContext,
    createSignal,
    JSX,
    splitProps,
    useContext,
    Show,
} from "solid-js";

interface PopupContextValue {
    open: () => boolean;
    setOpen: (open: boolean) => void;
    anchorEl: () => HTMLElement | null;
    setAnchorEl: (el: HTMLElement | null) => void;
}

const PopupContext = createContext<PopupContextValue>();

export const usePopupContext = () => {
    const context = useContext(PopupContext);
    if (!context) {
        throw new Error("Popup components must be used within Popup");
    }
    return context;
};

export interface Unstable_PopupProps extends JSX.HTMLAttributes<HTMLDivElement> {
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
     * 锚点元素
     */
    anchorEl?: HTMLElement | null;
    /**
     * 位置
     */
    placement?:
        | "bottom-start"
        | "bottom"
        | "bottom-end"
        | "left-start"
        | "left"
        | "left-end"
        | "right-start"
        | "right"
        | "right-end"
        | "top-start"
        | "top"
        | "top-end";
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

const Unstable_PopupBase: Component<Unstable_PopupProps> = (props) => {
    const [local, others] = splitProps(props, [
        "open",
        "defaultOpen",
        "onOpenChange",
        "anchorEl",
        "placement",
        "disableBackdropClick",
        "disableEscapeKeyDown",
        "class",
        "children",
    ]);

    const isControlled = () => local.open !== undefined;
    const [internalOpen, setInternalOpen] = createSignal<boolean>(
        local.open ?? local.defaultOpen ?? false,
    );
    const [internalAnchorEl, setInternalAnchorEl] = createSignal<HTMLElement | null>(
        local.anchorEl ?? null,
    );

    const open = () => (isControlled() ? local.open ?? false : internalOpen());
    const anchorEl = () => local.anchorEl ?? internalAnchorEl();

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

    const contextValue: PopupContextValue = {
        open,
        setOpen: handleOpenChange,
        anchorEl,
        setAnchorEl: setInternalAnchorEl,
    };

    return (
        <Show when={open()}>
            <PopupContext.Provider value={contextValue}>
                <div
                    class={local.class}
                    data-open={open() ? "" : undefined}
                    onClick={handleBackdropClick}
                    onKeyDown={handleKeyDown}
                    role="presentation"
                    {...others}
                >
                    {local.children}
                </div>
            </PopupContext.Provider>
        </Show>
    );
};

export interface Unstable_PopupComponent extends Component<Unstable_PopupProps> {
    Trigger: Component<PopupTriggerProps>;
    Content: Component<PopupContentProps>;
}

export const Unstable_Popup = Object.assign(Unstable_PopupBase, {
    Trigger: null as unknown as Component<PopupTriggerProps>,
    Content: null as unknown as Component<PopupContentProps>,
}) as Unstable_PopupComponent;

export interface PopupTriggerProps
    extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
    /**
     * 子元素
     */
    children?: JSX.Element;
}

export const PopupTrigger: Component<PopupTriggerProps> = (props) => {
    const [local, others] = splitProps(props, [
        "children",
        "class",
        "onClick",
        "ref",
    ]);
    const context = usePopupContext();

    const handleClick: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (e) => {
        if (typeof local.onClick === "function") {
            local.onClick(e);
        }
        context.setAnchorEl(e.currentTarget);
        context.setOpen(!context.open());
    };

    return (
        <button
            type="button"
            class={local.class}
            onClick={handleClick}
            aria-expanded={context.open()}
            aria-haspopup="true"
            ref={(el) => {
                if (typeof local.ref === "function") {
                    local.ref(el);
                }
                context.setAnchorEl(el);
            }}
            {...others}
        >
            {local.children}
        </button>
    );
};

export interface PopupContentProps extends JSX.HTMLAttributes<HTMLDivElement> {
    /**
     * 子元素
     */
    children?: JSX.Element;
}

export const PopupContent: Component<PopupContentProps> = (props) => {
    const [local, others] = splitProps(props, ["children", "class"]);
    const context = usePopupContext();

    return (
        <div
            class={local.class}
            role="dialog"
            aria-modal="true"
            data-open={context.open() ? "" : undefined}
            {...others}
        >
            {local.children}
        </div>
    );
};

Unstable_Popup.Trigger = PopupTrigger;
Unstable_Popup.Content = PopupContent;

