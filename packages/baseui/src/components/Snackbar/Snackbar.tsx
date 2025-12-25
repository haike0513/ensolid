import {
    Component,
    createContext,
    createSignal,
    JSX,
    splitProps,
    useContext,
    Show,
    onMount,
    onCleanup,
} from "solid-js";

interface SnackbarContextValue {
    open: () => boolean;
    setOpen: (open: boolean) => void;
    message: () => string;
    setMessage: (message: string) => void;
}

const SnackbarContext = createContext<SnackbarContextValue>();

export const useSnackbarContext = () => {
    const context = useContext(SnackbarContext);
    if (!context) {
        throw new Error("Snackbar components must be used within SnackbarProvider");
    }
    return context;
};

export interface SnackbarProviderProps {
    /**
     * 子元素
     */
    children?: JSX.Element;
}

export const SnackbarProvider: Component<SnackbarProviderProps> = (props) => {
    const [open, setOpen] = createSignal(false);
    const [message, setMessage] = createSignal("");

    const contextValue: SnackbarContextValue = {
        open,
        setOpen,
        message,
        setMessage,
    };

    return (
        <SnackbarContext.Provider value={contextValue}>
            {props.children}
        </SnackbarContext.Provider>
    );
};

export interface SnackbarProps extends JSX.HTMLAttributes<HTMLDivElement> {
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
     * 消息内容
     */
    message?: string;
    /**
     * 自动关闭时间（毫秒），0 表示不自动关闭
     * @default 4000
     */
    autoHideDuration?: number;
    /**
     * 位置
     * @default 'bottom-center'
     */
    anchorOrigin?: {
        vertical: "top" | "bottom";
        horizontal: "left" | "center" | "right";
    };
    /**
     * 子元素
     */
    children?: JSX.Element;
}

export const Snackbar: Component<SnackbarProps> = (props) => {
    const [local, others] = splitProps(props, [
        "open",
        "defaultOpen",
        "onOpenChange",
        "message",
        "autoHideDuration",
        "anchorOrigin",
        "class",
        "children",
    ]);

    const isControlled = () => local.open !== undefined;
    const [internalOpen, setInternalOpen] = createSignal<boolean>(
        local.open ?? local.defaultOpen ?? false,
    );

    const open = () => (isControlled() ? local.open ?? false : internalOpen());
    const autoHideDuration = () => local.autoHideDuration ?? 4000;
    const anchorOrigin = () =>
        local.anchorOrigin ?? { vertical: "bottom", horizontal: "center" };

    const handleOpenChange = (newOpen: boolean) => {
        if (!isControlled()) {
            setInternalOpen(newOpen);
        }
        local.onOpenChange?.(newOpen);
    };

    let autoHideTimer: number | undefined;

    onMount(() => {
        if (open() && autoHideDuration() > 0) {
            autoHideTimer = window.setTimeout(() => {
                handleOpenChange(false);
            }, autoHideDuration());
        }
    });

    onCleanup(() => {
        if (autoHideTimer) {
            clearTimeout(autoHideTimer);
        }
    });

    return (
        <Show when={open()}>
            <div
                class={local.class}
                data-anchor-vertical={anchorOrigin().vertical}
                data-anchor-horizontal={anchorOrigin().horizontal}
                {...others}
            >
                {local.message && <div data-message>{local.message}</div>}
                {local.children}
            </div>
        </Show>
    );
};

