import { Component, JSX, splitProps } from "solid-js";

export interface OptionProps extends JSX.LiHTMLAttributes<HTMLLIElement> {
    /**
     * Option 的根元素
     */
    slotProps?: {
        root?: JSX.LiHTMLAttributes<HTMLLIElement>;
    };
    /**
     * 选项的值
     */
    value: string | number;
    /**
     * 选项的标签（如果未提供，使用 children）
     */
    label?: string;
    /**
     * 是否禁用
     */
    disabled?: boolean;
    /**
     * 子元素
     */
    children?: JSX.Element;
}

export const Option: Component<OptionProps> = (props) => {
    const [local, others] = splitProps(props, [
        "value",
        "label",
        "disabled",
        "children",
        "slotProps",
        "class",
    ]);

    const rootSlotProps = () => local.slotProps?.root ?? {};

    return (
        <li
            role="option"
            class={local.class}
            data-value={local.value}
            data-disabled={local.disabled ? "" : undefined}
            aria-disabled={local.disabled}
            {...rootSlotProps()}
            {...others}
        >
            {local.label ?? local.children}
        </li>
    );
};

