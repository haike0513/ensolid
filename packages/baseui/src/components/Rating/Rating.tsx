import { Component, createSignal, JSX, splitProps, For, Show } from "solid-js";

export interface RatingProps extends JSX.HTMLAttributes<HTMLDivElement> {
    /**
     * Rating 的根元素
     */
    slotProps?: {
        root?: JSX.HTMLAttributes<HTMLDivElement>;
        icon?: JSX.HTMLAttributes<HTMLElement>;
        emptyIcon?: JSX.HTMLAttributes<HTMLElement>;
    };
    /**
     * 当前值（受控）
     */
    value?: number | null;
    /**
     * 默认值（非受控）
     */
    defaultValue?: number | null;
    /**
     * 值变化回调
     */
    onValueChange?: (value: number | null) => void;
    /**
     * 最大值
     * @default 5
     */
    max?: number;
    /**
     * 精度（允许半星）
     * @default 1
     */
    precision?: 0.5 | 1;
    /**
     * 是否只读
     */
    readOnly?: boolean;
    /**
     * 是否禁用
     */
    disabled?: boolean;
    /**
     * 图标
     */
    icon?: JSX.Element;
    /**
     * 空图标
     */
    emptyIcon?: JSX.Element;
    /**
     * 是否显示标签
     */
    showLabel?: boolean;
    /**
     * 标签文本
     */
    label?: string;
    /**
     * 子元素
     */
    children?: JSX.Element;
}

export const Rating: Component<RatingProps> = (props) => {
    const [local, others] = splitProps(props, [
        "value",
        "defaultValue",
        "onValueChange",
        "max",
        "precision",
        "readOnly",
        "disabled",
        "icon",
        "emptyIcon",
        "showLabel",
        "label",
        "children",
        "slotProps",
        "class",
    ]);

    const max = () => local.max ?? 5;
    const precision = () => local.precision ?? 1;
    const isDisabled = () => local.disabled ?? false;
    const isReadOnly = () => local.readOnly ?? false;

    const isControlled = () => local.value !== undefined;
    const [internalValue, setInternalValue] = createSignal<number | null>(
        local.value ?? local.defaultValue ?? null,
    );
    const [hoverValue, setHoverValue] = createSignal<number | null>(null);

    const value = () => (isControlled() ? local.value ?? null : internalValue());
    const displayValue = () => hoverValue() ?? value() ?? 0;

    const handleValueChange = (newValue: number) => {
        if (isDisabled() || isReadOnly()) return;

        let finalValue: number;
        if (precision() === 0.5) {
            // 半星精度
            const rounded = Math.round(newValue * 2) / 2;
            finalValue = rounded;
        } else {
            // 整星精度
            finalValue = Math.round(newValue);
        }

        if (!isControlled()) {
            setInternalValue(finalValue);
        }
        local.onValueChange?.(finalValue);
    };

    const handleMouseEnter = (index: number) => {
        if (isDisabled() || isReadOnly()) return;
        setHoverValue(index + 1);
    };

    const handleMouseLeave = () => {
        if (isDisabled() || isReadOnly()) return;
        setHoverValue(null);
    };

    const handleClick = (index: number) => {
        handleValueChange(index + 1);
    };

    const rootSlotProps = () => local.slotProps?.root ?? {};
    const iconSlotProps = () => local.slotProps?.icon ?? {};
    const emptyIconSlotProps = () => local.slotProps?.emptyIcon ?? {};

    const getIconValue = (index: number): number => {
        const currentValue = displayValue();
        if (currentValue > index + 1) {
            return 1; // 完全填充
        } else if (currentValue > index) {
            return currentValue - index; // 部分填充
        }
        return 0; // 空
    };

    return (
        <div
            class={local.class}
            role={isReadOnly() ? "img" : "radiogroup"}
            aria-label={local.label}
            data-disabled={isDisabled() ? "" : undefined}
            data-readonly={isReadOnly() ? "" : undefined}
            {...rootSlotProps()}
            {...others}
        >
            <For each={Array.from({ length: max() })}>
                {(_, index) => {
                    const iconValue = () => getIconValue(index());
                    return (
                        <span
                            data-icon
                            data-value={iconValue()}
                            onMouseEnter={() => handleMouseEnter(index())}
                            onMouseLeave={handleMouseLeave}
                            onClick={() => handleClick(index())}
                            style={{
                                cursor:
                                    isDisabled() || isReadOnly()
                                        ? "default"
                                        : "pointer",
                            }}
                            {...(iconValue() > 0 ? iconSlotProps() : emptyIconSlotProps())}
                        >
                            {iconValue() > 0
                                ? local.icon ?? "★"
                                : local.emptyIcon ?? "☆"}
                        </span>
                    );
                }}
            </For>
            <Show when={local.showLabel && value() !== null}>
                <span data-label>{local.label ?? `${value()}/${max()}`}</span>
            </Show>
            {local.children}
        </div>
    );
};

