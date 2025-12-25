import {
    Component,
    createContext,
    createSignal,
    JSX,
    splitProps,
    useContext,
    Show,
} from "solid-js";

interface AlertDialogContextValue {
    open: () => boolean;
    setOpen: (open: boolean) => void;
    onClose?: () => void;
}

const AlertDialogContext = createContext<AlertDialogContextValue>();

export const useAlertDialogContext = () => {
    const context = useContext(AlertDialogContext);
    if (!context) {
        throw new Error("AlertDialog components must be used within AlertDialog");
    }
    return context;
};

export interface AlertDialogProps extends JSX.HTMLAttributes<HTMLDivElement> {
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
     * 关闭回调
     */
    onClose?: () => void;
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

const AlertDialogBase: Component<AlertDialogProps> = (props) => {
    const [local, others] = splitProps(props, [
        "open",
        "defaultOpen",
        "onOpenChange",
        "onClose",
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

    const handleOpenChange = (newOpen: boolean) => {
        if (!isControlled()) {
            setInternalOpen(newOpen);
        }
        local.onOpenChange?.(newOpen);
        if (!newOpen) {
            local.onClose?.();
        }
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

    const contextValue: AlertDialogContextValue = {
        open,
        setOpen: handleOpenChange,
        onClose: local.onClose,
    };

    return (
        <Show when={open()}>
            <AlertDialogContext.Provider value={contextValue}>
                <div
                    class={local.class}
                    data-open={open() ? "" : undefined}
                    onClick={handleBackdropClick}
                    onKeyDown={handleKeyDown}
                    role="alertdialog"
                    aria-modal="true"
                    {...others}
                >
                    {local.children}
                </div>
            </AlertDialogContext.Provider>
        </Show>
    );
};

export interface AlertDialogComponent extends Component<AlertDialogProps> {
    Trigger: Component<AlertDialogTriggerProps>;
    Content: Component<AlertDialogContentProps>;
    Title: Component<AlertDialogTitleProps>;
    Description: Component<AlertDialogDescriptionProps>;
    Action: Component<AlertDialogActionProps>;
    Cancel: Component<AlertDialogCancelProps>;
}

export const AlertDialog = Object.assign(AlertDialogBase, {
    Trigger: null as unknown as Component<AlertDialogTriggerProps>,
    Content: null as unknown as Component<AlertDialogContentProps>,
    Title: null as unknown as Component<AlertDialogTitleProps>,
    Description: null as unknown as Component<AlertDialogDescriptionProps>,
    Action: null as unknown as Component<AlertDialogActionProps>,
    Cancel: null as unknown as Component<AlertDialogCancelProps>,
}) as AlertDialogComponent;

export interface AlertDialogTriggerProps
    extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
    /**
     * 子元素
     */
    children?: JSX.Element;
}

export const AlertDialogTrigger: Component<AlertDialogTriggerProps> = (props) => {
    const [local, others] = splitProps(props, ["children", "class", "onClick"]);
    const context = useAlertDialogContext();

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

export interface AlertDialogContentProps
    extends JSX.HTMLAttributes<HTMLDivElement> {
    /**
     * 子元素
     */
    children?: JSX.Element;
}

export const AlertDialogContent: Component<AlertDialogContentProps> = (props) => {
    const [local, others] = splitProps(props, ["children", "class", "onClick"]);

    const handleClick: JSX.EventHandler<HTMLDivElement, MouseEvent> = (e) => {
        e.stopPropagation();
        if (typeof local.onClick === "function") {
            local.onClick(e);
        }
    };

    return (
        <div class={local.class} role="document" onClick={handleClick} {...others}>
            {local.children}
        </div>
    );
};

export interface AlertDialogTitleProps
    extends JSX.HTMLAttributes<HTMLHeadingElement> {
    /**
     * 子元素
     */
    children?: JSX.Element;
}

export const AlertDialogTitle: Component<AlertDialogTitleProps> = (props) => {
    const [local, others] = splitProps(props, ["children", "class"]);
    return (
        <h2 class={local.class} {...others}>
            {local.children}
        </h2>
    );
};

export interface AlertDialogDescriptionProps
    extends JSX.HTMLAttributes<HTMLParagraphElement> {
    /**
     * 子元素
     */
    children?: JSX.Element;
}

export const AlertDialogDescription: Component<AlertDialogDescriptionProps> = (
    props,
) => {
    const [local, others] = splitProps(props, ["children", "class"]);
    return (
        <p class={local.class} {...others}>
            {local.children}
        </p>
    );
};

export interface AlertDialogActionProps
    extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
    /**
     * 子元素
     */
    children?: JSX.Element;
}

export const AlertDialogAction: Component<AlertDialogActionProps> = (props) => {
    const [local, others] = splitProps(props, ["children", "class", "onClick"]);
    const context = useAlertDialogContext();

    const handleClick: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (e) => {
        if (typeof local.onClick === "function") {
            local.onClick(e);
        }
        context.setOpen(false);
    };

    return (
        <button type="button" class={local.class} onClick={handleClick} {...others}>
            {local.children}
        </button>
    );
};

export interface AlertDialogCancelProps
    extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
    /**
     * 子元素
     */
    children?: JSX.Element;
}

export const AlertDialogCancel: Component<AlertDialogCancelProps> = (props) => {
    const [local, others] = splitProps(props, ["children", "class", "onClick"]);
    const context = useAlertDialogContext();

    const handleClick: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (e) => {
        if (typeof local.onClick === "function") {
            local.onClick(e);
        }
        context.setOpen(false);
    };

    return (
        <button type="button" class={local.class} onClick={handleClick} {...others}>
            {local.children}
        </button>
    );
};

AlertDialog.Trigger = AlertDialogTrigger;
AlertDialog.Content = AlertDialogContent;
AlertDialog.Title = AlertDialogTitle;
AlertDialog.Description = AlertDialogDescription;
AlertDialog.Action = AlertDialogAction;
AlertDialog.Cancel = AlertDialogCancel;

