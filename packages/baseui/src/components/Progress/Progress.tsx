import { Component, JSX, splitProps, Show } from "solid-js";

export interface ProgressProps extends JSX.HTMLAttributes<HTMLDivElement> {
    /**
     * Progress 的根元素
     */
    slotProps?: {
        root?: JSX.HTMLAttributes<HTMLDivElement>;
        bar?: JSX.HTMLAttributes<HTMLDivElement>;
    };
    /**
     * 进度值（0-100）
     */
    value?: number;
    /**
     * 最小值
     * @default 0
     */
    min?: number;
    /**
     * 最大值
     * @default 100
     */
    max?: number;
    /**
     * 是否显示值
     * @default false
     */
    showValue?: boolean;
    /**
     * 变体
     * @default 'determinate'
     */
    variant?: "determinate" | "indeterminate" | "buffer";
    /**
     * 颜色
     */
    color?: "primary" | "secondary" | "success" | "error" | "info" | "warning";
    /**
     * 大小
     */
    size?: "small" | "medium" | "large";
    /**
     * 子元素
     */
    children?: JSX.Element;
}

export const Progress: Component<ProgressProps> = (props) => {
    const [local, others] = splitProps(props, [
        "value",
        "min",
        "max",
        "showValue",
        "variant",
        "color",
        "size",
        "children",
        "slotProps",
        "class",
    ]);

    const min = () => local.min ?? 0;
    const max = () => local.max ?? 100;
    const variant = () => local.variant ?? "determinate";
    const color = () => local.color ?? "primary";
    const size = () => local.size ?? "medium";
    const showValue = () => local.showValue ?? false;

    const getValue = () => {
        const val = local.value ?? 0;
        const percentage = ((val - min()) / (max() - min())) * 100;
        return Math.min(Math.max(percentage, 0), 100);
    };

    const rootSlotProps = () => local.slotProps?.root ?? {};
    const barSlotProps = () => local.slotProps?.bar ?? {};

    return (
        <div
            class={local.class}
            role="progressbar"
            aria-valuemin={min()}
            aria-valuemax={max()}
            aria-valuenow={variant() === "determinate" ? local.value : undefined}
            data-variant={variant()}
            data-color={color()}
            data-size={size()}
            {...rootSlotProps()}
            {...others}
        >
            <div
                data-bar
                style={{
                    width:
                        variant() === "determinate"
                            ? `${getValue()}%`
                            : undefined,
                }}
                {...barSlotProps()}
            />
            <Show when={showValue() && variant() === "determinate"}>
                <span data-value>{Math.round(getValue())}%</span>
            </Show>
            {local.children}
        </div>
    );
};

