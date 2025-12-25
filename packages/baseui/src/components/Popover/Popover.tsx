import {
    Component,
    createContext,
    createSignal,
    JSX,
    splitProps,
    useContext,
    Show,
    onMount,
} from "solid-js";

interface PopoverContextValue {
    open: () => boolean;
    setOpen: (open: boolean) => void;
    anchorEl: () => HTMLElement | null;
    setAnchorEl: (el: HTMLElement | null) => void;
}

const PopoverContext = createContext<PopoverContextValue>();

export const usePopoverContext = () => {
    const context = useContext(PopoverContext);
    if (!context) {
        throw new Error("Popover components must be used within Popover");
    }
    return context;
};

export interface PopoverProps extends JSX.HTMLAttributes<HTMLDivElement> {
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
     * 子元素
     */
    children?: JSX.Element;
}

const PopoverBase: Component<PopoverProps> = (props) => {
    const [local, others] = splitProps(props, [
        "open",
        "defaultOpen",
        "onOpenChange",
        "anchorEl",
        "placement",
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

    const contextValue: PopoverContextValue = {
        open,
        setOpen: handleOpenChange,
        anchorEl,
        setAnchorEl: setInternalAnchorEl,
    };

    return (
        <PopoverContext.Provider value={contextValue}>
            <div class={local.class} data-open={open() ? "" : undefined} {...others}>
                {local.children}
            </div>
        </PopoverContext.Provider>
    );
};

export interface PopoverComponent extends Component<PopoverProps> {
    Trigger: Component<PopoverTriggerProps>;
    Content: Component<PopoverContentProps>;
}

export const Popover = Object.assign(PopoverBase, {
    Trigger: null as unknown as Component<PopoverTriggerProps>,
    Content: null as unknown as Component<PopoverContentProps>,
}) as PopoverComponent;

export interface PopoverTriggerProps
    extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
    /**
     * 子元素
     */
    children?: JSX.Element;
}

export const PopoverTrigger: Component<PopoverTriggerProps> = (props) => {
    const [local, others] = splitProps(props, [
        "children",
        "class",
        "onClick",
        "ref",
    ]);
    const context = usePopoverContext();

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
            aria-haspopup="dialog"
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

export interface PopoverContentProps extends JSX.HTMLAttributes<HTMLDivElement> {
    /**
     * 子元素
     */
    children?: JSX.Element;
}

export const PopoverContent: Component<PopoverContentProps> = (props) => {
    const [local, others] = splitProps(props, ["children", "class"]);
    const context = usePopoverContext();
    let contentRef: HTMLDivElement | undefined;

    const updatePosition = () => {
        if (contentRef && context.anchorEl()) {
            const anchor = context.anchorEl()!;
            const anchorRect = anchor.getBoundingClientRect();
            const contentRect = contentRef.getBoundingClientRect();

            let top = anchorRect.bottom + 8;
            let left = anchorRect.left;

            // 简单的定位逻辑，可以根据 placement 属性扩展
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            if (left + contentRect.width > viewportWidth) {
                left = viewportWidth - contentRect.width - 16;
            }

            if (top + contentRect.height > viewportHeight) {
                top = anchorRect.top - contentRect.height - 8;
            }

            contentRef.style.position = "fixed";
            contentRef.style.top = `${top}px`;
            contentRef.style.left = `${left}px`;
        }
    };

    onMount(() => {
        if (context.open()) {
            requestAnimationFrame(() => {
                updatePosition();
            });
        }
    });

    return (
        <Show when={context.open()}>
            <div
                ref={contentRef}
                role="dialog"
                class={local.class}
                data-open={context.open() ? "" : undefined}
                {...others}
            >
                {local.children}
            </div>
        </Show>
    );
};

Popover.Trigger = PopoverTrigger;
Popover.Content = PopoverContent;

