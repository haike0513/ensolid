import { Component, JSX, splitProps, Show } from "solid-js";

export interface ChipProps extends JSX.HTMLAttributes<HTMLDivElement> {
    /**
     * Chip 的根元素
     */
    slotProps?: {
        root?: JSX.HTMLAttributes<HTMLDivElement>;
        label?: JSX.HTMLAttributes<HTMLSpanElement>;
        deleteIcon?: JSX.HTMLAttributes<HTMLButtonElement>;
    };
    /**
     * 标签文本
     */
    label?: JSX.Element;
    /**
     * 是否可删除
     */
    deletable?: boolean;
    /**
     * 删除回调
     */
    onDelete?: () => void;
    /**
     * 颜色
     */
    color?: "primary" | "secondary" | "success" | "error" | "info" | "warning";
    /**
     * 变体
     * @default 'filled'
     */
    variant?: "filled" | "outlined";
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
     * 是否点击
     */
    clickable?: boolean;
    /**
     * 图标（前置）
     */
    icon?: JSX.Element;
    /**
     * 删除图标
     */
    deleteIcon?: JSX.Element;
    /**
     * 子元素
     */
    children?: JSX.Element;
}

export const Chip: Component<ChipProps> = (props) => {
    const [local, others] = splitProps(props, [
        "label",
        "deletable",
        "onDelete",
        "color",
        "variant",
        "size",
        "disabled",
        "clickable",
        "icon",
        "deleteIcon",
        "children",
        "slotProps",
        "class",
        "onClick",
    ]);

    const color = () => local.color ?? "primary";
    const variant = () => local.variant ?? "filled";
    const size = () => local.size ?? "medium";
    const deletable = () => local.deletable ?? false;
    const clickable = () => local.clickable ?? false;

    const rootSlotProps = () => local.slotProps?.root ?? {};
    const labelSlotProps = () => local.slotProps?.label ?? {};
    const deleteIconSlotProps = () => local.slotProps?.deleteIcon ?? {};

    const handleDelete: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (e) => {
        e.stopPropagation();
        local.onDelete?.();
    };

    return (
        <div
            class={local.class}
            data-color={color()}
            data-variant={variant()}
            data-size={size()}
            data-disabled={local.disabled ? "" : undefined}
            data-clickable={clickable() ? "" : undefined}
            role={clickable() ? "button" : undefined}
            tabIndex={clickable() && !local.disabled ? 0 : undefined}
            onClick={local.onClick}
            {...rootSlotProps()}
            {...others}
        >
            <Show when={local.icon}>
                <span data-icon>{local.icon}</span>
            </Show>
            <span data-label {...labelSlotProps()}>
                {local.label ?? local.children}
            </span>
            <Show when={deletable()}>
                <button
                    type="button"
                    data-delete
                    onClick={handleDelete}
                    disabled={local.disabled}
                    aria-label="删除"
                    {...deleteIconSlotProps()}
                >
                    {local.deleteIcon ?? "×"}
                </button>
            </Show>
        </div>
    );
};

