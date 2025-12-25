import { Component, JSX, splitProps } from "solid-js";

export interface IconButtonProps
    extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
    /**
     * IconButton 的根元素
     */
    slotProps?: {
        root?: JSX.ButtonHTMLAttributes<HTMLButtonElement>;
    };
    /**
     * 颜色
     * @default 'default'
     */
    color?:
        | "default"
        | "primary"
        | "secondary"
        | "success"
        | "error"
        | "info"
        | "warning"
        | "inherit";
    /**
     * 大小
     * @default 'medium'
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
     * 边缘
     * @default 'medium'
     */
    edge?: "start" | "end" | false;
    /**
     * 子元素（图标）
     */
    children?: JSX.Element;
}

export const IconButton: Component<IconButtonProps> = (props) => {
    const [local, others] = splitProps(props, [
        "color",
        "size",
        "disabled",
        "disableElevation",
        "disableRipple",
        "edge",
        "children",
        "slotProps",
        "class",
    ]);

    const color = () => local.color ?? "default";
    const size = () => local.size ?? "medium";
    const edge = () => local.edge ?? false;

    const rootSlotProps = () => local.slotProps?.root ?? {};

    return (
        <button
            type="button"
            class={local.class}
            disabled={local.disabled}
            data-color={color()}
            data-size={size()}
            data-edge={edge() === false ? undefined : edge()}
            data-disable-elevation={local.disableElevation ? "" : undefined}
            aria-label={others["aria-label"]}
            {...rootSlotProps()}
            {...others}
        >
            {local.children}
        </button>
    );
};

