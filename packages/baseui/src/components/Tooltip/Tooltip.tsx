import {
    Component,
    createContext,
    createSignal,
    JSX,
    splitProps,
    useContext,
    Show,
    onCleanup,
} from "solid-js";

interface TooltipContextValue {
    open: () => boolean;
    setOpen: (open: boolean) => void;
    triggerRef: () => HTMLElement | undefined;
    setTriggerRef: (ref: HTMLElement | undefined) => void;
}

const TooltipContext = createContext<TooltipContextValue>();

export const useTooltipContext = () => {
    const context = useContext(TooltipContext);
    if (!context) {
        throw new Error("Tooltip components must be used within Tooltip");
    }
    return context;
};

export interface TooltipProps extends JSX.HTMLAttributes<HTMLDivElement> {
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
     * 延迟显示时间（毫秒）
     * @default 0
     */
    enterDelay?: number;
    /**
     * 延迟隐藏时间（毫秒）
     * @default 0
     */
    leaveDelay?: number;
    /**
     * 子元素
     */
    children?: JSX.Element;
}

const TooltipBase: Component<TooltipProps> = (props) => {
    const [local, others] = splitProps(props, [
        "open",
        "defaultOpen",
        "onOpenChange",
        "disabled",
        "enterDelay",
        "leaveDelay",
        "class",
        "children",
    ]);

    const isControlled = () => local.open !== undefined;
    const [internalOpen, setInternalOpen] = createSignal<boolean>(
        local.open ?? local.defaultOpen ?? false,
    );
    const [triggerRef, setTriggerRef] = createSignal<HTMLElement | undefined>();

    const open = () => (isControlled() ? local.open ?? false : internalOpen());

    const handleOpenChange = (newOpen: boolean) => {
        if (!isControlled()) {
            setInternalOpen(newOpen);
        }
        local.onOpenChange?.(newOpen);
    };

    const contextValue: TooltipContextValue = {
        open,
        setOpen: handleOpenChange,
        triggerRef,
        setTriggerRef,
    };

    return (
        <TooltipContext.Provider value={contextValue}>
            <div class={local.class} {...others}>
                {local.children}
            </div>
        </TooltipContext.Provider>
    );
};

export interface TooltipComponent extends Component<TooltipProps> {
    Trigger: Component<TooltipTriggerProps>;
    Content: Component<TooltipContentProps>;
}

export const Tooltip = Object.assign(TooltipBase, {
    Trigger: null as unknown as Component<TooltipTriggerProps>,
    Content: null as unknown as Component<TooltipContentProps>,
}) as TooltipComponent;

export interface TooltipTriggerProps
    extends JSX.HTMLAttributes<HTMLElement> {
    /**
     * 作为触发器的元素类型
     * @default 'div'
     */
    as?: keyof JSX.IntrinsicElements;
    /**
     * 子元素
     */
    children?: JSX.Element;
}

export const TooltipTrigger: Component<TooltipTriggerProps> = (props) => {
    const [local, others] = splitProps(props, [
        "as",
        "children",
        "class",
        "onMouseEnter",
        "onMouseLeave",
        "onFocus",
        "onBlur",
    ]);
    const context = useTooltipContext();

    let enterTimer: number | undefined;
    let leaveTimer: number | undefined;

    const handleMouseEnter: JSX.EventHandler<HTMLElement, MouseEvent> = (e) => {
        if (typeof local.onMouseEnter === "function") {
            local.onMouseEnter(e);
        }
        if (enterTimer) {
            clearTimeout(enterTimer);
        }
        if (leaveTimer) {
            clearTimeout(leaveTimer);
        }
        enterTimer = window.setTimeout(() => {
            context.setOpen(true);
        }, 0);
    };

    const handleMouseLeave: JSX.EventHandler<HTMLElement, MouseEvent> = (e) => {
        if (typeof local.onMouseLeave === "function") {
            local.onMouseLeave(e);
        }
        if (enterTimer) {
            clearTimeout(enterTimer);
        }
        if (leaveTimer) {
            clearTimeout(leaveTimer);
        }
        leaveTimer = window.setTimeout(() => {
            context.setOpen(false);
        }, 0);
    };

    const handleFocus: JSX.EventHandler<HTMLElement, FocusEvent> = (e) => {
        if (typeof local.onFocus === "function") {
            local.onFocus(e);
        }
        context.setOpen(true);
    };

    const handleBlur: JSX.EventHandler<HTMLElement, FocusEvent> = (e) => {
        if (typeof local.onBlur === "function") {
            local.onBlur(e);
        }
        context.setOpen(false);
    };

    onCleanup(() => {
        if (enterTimer) {
            clearTimeout(enterTimer);
        }
        if (leaveTimer) {
            clearTimeout(leaveTimer);
        }
    });

    const Element = (local.as ?? "div") as any;

    return (
        <Element
            ref={(el: HTMLElement) => {
                context.setTriggerRef(el);
            }}
            class={local.class}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...others}
        >
            {local.children}
        </Element>
    );
};

export interface TooltipContentProps extends JSX.HTMLAttributes<HTMLDivElement> {
    /**
     * 子元素
     */
    children?: JSX.Element;
    /**
     * 位置
     * @default 'bottom'
     */
    placement?: "top" | "bottom" | "left" | "right";
}

export const TooltipContent: Component<TooltipContentProps> = (props) => {
    const [local, others] = splitProps(props, [
        "children",
        "class",
        "placement",
    ]);
    const context = useTooltipContext();

    return (
        <Show when={context.open()}>
            <div
                role="tooltip"
                class={local.class}
                data-placement={local.placement ?? "bottom"}
                {...others}
            >
                {local.children}
            </div>
        </Show>
    );
};

Tooltip.Trigger = TooltipTrigger;
Tooltip.Content = TooltipContent;

