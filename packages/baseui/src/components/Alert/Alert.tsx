import { Component, JSX, splitProps, Show } from "solid-js";

export interface AlertProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "title"> {
    /**
     * Alert 的根元素
     */
    slotProps?: {
        root?: JSX.HTMLAttributes<HTMLDivElement>;
        icon?: JSX.HTMLAttributes<HTMLDivElement>;
        title?: JSX.HTMLAttributes<HTMLDivElement>;
        action?: JSX.HTMLAttributes<HTMLDivElement>;
    };
    /**
     * 严重程度/颜色
     * @default 'standard'
     */
    severity?: "error" | "info" | "success" | "warning";
    /**
     * 变体
     * @default 'standard'
     */
    variant?: "filled" | "outlined" | "standard";
    /**
     * 图标
     */
    icon?: JSX.Element;
    /**
     * 是否显示图标
     * @default true
     */
    iconMapping?: {
        error?: JSX.Element;
        info?: JSX.Element;
        success?: JSX.Element;
        warning?: JSX.Element;
    };
    /**
     * 标题
     */
    title?: JSX.Element;
    /**
     * 操作按钮
     */
    action?: JSX.Element;
    /**
     * 是否可关闭
     */
    onClose?: () => void;
    /**
     * 子元素
     */
    children?: JSX.Element;
}

export const Alert: Component<AlertProps> = (props) => {
    const [local, others] = splitProps(props, [
        "severity",
        "variant",
        "icon",
        "iconMapping",
        "title",
        "action",
        "onClose",
        "children",
        "slotProps",
        "class",
    ]);

    const severity = () => local.severity ?? "info";
    const variant = () => local.variant ?? "standard";

    const rootSlotProps = () => local.slotProps?.root ?? {};
    const iconSlotProps = () => local.slotProps?.icon ?? {};
    const titleSlotProps = () => local.slotProps?.title ?? {};
    const actionSlotProps = () => local.slotProps?.action ?? {};

    const getIcon = () => {
        if (local.icon !== undefined) {
            return local.icon;
        }
        if (local.iconMapping) {
            return local.iconMapping[severity() as keyof typeof local.iconMapping];
        }
        return null;
    };

    const icon = () => getIcon();

    return (
        <div
            role="alert"
            class={local.class}
            data-severity={severity()}
            data-variant={variant()}
            {...rootSlotProps()}
            {...others}
        >
            <Show when={icon()}>
                <div data-icon {...iconSlotProps()}>
                    {icon()}
                </div>
            </Show>
            <div data-content>
                <Show when={local.title}>
                    <div data-title {...titleSlotProps()}>
                        {local.title}
                    </div>
                </Show>
                {local.children}
            </div>
            <Show when={local.action || local.onClose}>
                <div data-action {...actionSlotProps()}>
                    {local.action}
                    <Show when={local.onClose}>
                        <button
                            type="button"
                            data-close
                            onClick={local.onClose}
                            aria-label="关闭"
                        >
                            ×
                        </button>
                    </Show>
                </div>
            </Show>
        </div>
    );
};

