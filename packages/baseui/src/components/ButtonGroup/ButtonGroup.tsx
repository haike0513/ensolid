import { Component, JSX, splitProps } from "solid-js";

export interface ButtonGroupProps extends JSX.HTMLAttributes<HTMLDivElement> {
    /**
     * ButtonGroup 的根元素
     */
    slotProps?: {
        root?: JSX.HTMLAttributes<HTMLDivElement>;
    };
    /**
     * 方向
     * @default 'horizontal'
     */
    orientation?: "horizontal" | "vertical";
    /**
     * 变体
     * @default 'outlined'
     */
    variant?: "text" | "outlined" | "contained";
    /**
     * 颜色
     */
    color?: "primary" | "secondary" | "success" | "error" | "info" | "warning";
    /**
     * 大小
     */
    size?: "small" | "medium" | "large";
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
     * 是否全宽
     */
    fullWidth?: boolean;
    /**
     * 子元素
     */
    children?: JSX.Element;
}

export const ButtonGroup: Component<ButtonGroupProps> = (props) => {
    const [local, others] = splitProps(props, [
        "orientation",
        "variant",
        "color",
        "size",
        "disabled",
        "disableElevation",
        "disableRipple",
        "fullWidth",
        "children",
        "slotProps",
        "class",
    ]);

    const orientation = () => local.orientation ?? "horizontal";
    const variant = () => local.variant ?? "outlined";
    const color = () => local.color ?? "primary";
    const size = () => local.size ?? "medium";

    const rootSlotProps = () => local.slotProps?.root ?? {};

    return (
        <div
            role="group"
            class={local.class}
            data-orientation={orientation()}
            data-variant={variant()}
            data-color={color()}
            data-size={size()}
            data-disabled={local.disabled ? "" : undefined}
            data-disable-elevation={local.disableElevation ? "" : undefined}
            data-full-width={local.fullWidth ? "" : undefined}
            {...rootSlotProps()}
            {...others}
        >
            {local.children}
        </div>
    );
};

