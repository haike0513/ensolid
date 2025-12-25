import { Component, JSX, splitProps } from "solid-js";

export interface ButtonProps
    extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
    /**
     * 按钮的根元素
     * @default 'button'
     */
    slotProps?: {
        root?: JSX.ButtonHTMLAttributes<HTMLButtonElement>;
    };
    /**
     * 按钮的变体
     */
    variant?: "text" | "outlined" | "contained";
    /**
     * 按钮的颜色
     */
    color?: "primary" | "secondary" | "success" | "error" | "info" | "warning";
    /**
     * 按钮的大小
     */
    size?: "small" | "medium" | "large";
    /**
     * 是否禁用
     */
    disabled?: boolean;
    /**
     * 是否全宽
     */
    fullWidth?: boolean;
    /**
     * 子元素
     */
    children?: JSX.Element;
}

export const Button: Component<ButtonProps> = (props) => {
    const [local, rootProps, others] = splitProps(
        props,
        [
            "variant",
            "color",
            "size",
            "disabled",
            "fullWidth",
            "children",
            "slotProps",
            "class",
        ],
        ["onClick", "type", "disabled", "aria-label", "aria-disabled"],
    );

    const variant = () => local.variant ?? "text";
    const color = () => local.color ?? "primary";
    const size = () => local.size ?? "medium";
    const disabled = () => local.disabled ?? false;
    const fullWidth = () => local.fullWidth ?? false;

    const rootSlotProps = () => local.slotProps?.root ?? {};

    return (
        <button
            type={rootProps.type ?? "button"}
            class={local.class}
            disabled={disabled()}
            onClick={rootProps.onClick}
            aria-label={rootProps["aria-label"]}
            aria-disabled={disabled()}
            data-variant={variant()}
            data-color={color()}
            data-size={size()}
            data-full-width={fullWidth() ? "" : undefined}
            {...rootSlotProps()}
            {...others}
        >
            {local.children}
        </button>
    );
};
