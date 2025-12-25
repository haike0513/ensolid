import { Component, JSX, splitProps } from "solid-js";

export interface FabProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
    /**
     * Fab 的根元素
     */
    slotProps?: {
        root?: JSX.ButtonHTMLAttributes<HTMLButtonElement>;
    };
    /**
     * 颜色
     * @default 'default'
     */
    color?: "default" | "primary" | "secondary" | "success" | "error" | "info" | "warning";
    /**
     * 大小
     * @default 'large'
     */
    size?: "small" | "medium" | "large";
    /**
     * 变体
     * @default 'circular'
     */
    variant?: "circular" | "extended";
    /**
     * 是否禁用
     */
    disabled?: boolean;
    /**
     * 是否禁用聚焦提升
     */
    disableElevation?: boolean;
    /**
     * 是否禁用波纹效果
     */
    disableRipple?: boolean;
    /**
     * 子元素
     */
    children?: JSX.Element;
}

export const Fab: Component<FabProps> = (props) => {
    const [local, others] = splitProps(props, [
        "color",
        "size",
        "variant",
        "disabled",
        "disableElevation",
        "disableRipple",
        "children",
        "slotProps",
        "class",
    ]);

    const color = () => local.color ?? "default";
    const size = () => local.size ?? "large";
    const variant = () => local.variant ?? "circular";

    const rootSlotProps = () => local.slotProps?.root ?? {};

    return (
        <button
            type="button"
            class={local.class}
            disabled={local.disabled}
            data-color={color()}
            data-size={size()}
            data-variant={variant()}
            data-disable-elevation={local.disableElevation ? "" : undefined}
            {...rootSlotProps()}
            {...others}
        >
            {local.children}
        </button>
    );
};

