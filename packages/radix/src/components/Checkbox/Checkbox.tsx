import { createSignal, splitProps } from "solid-js";
import type { Component } from "solid-js";
import type { JSX } from "solid-js";

export interface CheckboxProps
    extends
        Omit<
            JSX.InputHTMLAttributes<HTMLInputElement>,
            "checked" | "onChange"
        > {
    /**
     * 是否选中
     */
    checked?: boolean;
    /**
     * 默认选中状态
     */
    defaultChecked?: boolean;
    /**
     * 选中状态变化回调
     */
    onCheckedChange?: (checked: boolean) => void;
    /**
     * 是否禁用
     * @default false
     */
    disabled?: boolean;
    /**
     * 是否必填
     * @default false
     */
    required?: boolean;
}

export const Checkbox: Component<CheckboxProps> = (props) => {
    const [local, others] = splitProps(props, [
        "checked",
        "defaultChecked",
        "onCheckedChange",
        "disabled",
        "required",
        "class",
        "id",
    ]);

    const [internalChecked, setInternalChecked] = createSignal(
        local.checked ?? local.defaultChecked ?? false,
    );

    const isControlled = () => local.checked !== undefined;
    const checked = () => (isControlled() ? local.checked! : internalChecked());

    const handleChange = (e: Event) => {
        const target = e.currentTarget as HTMLInputElement;
        const newChecked = target.checked;

        if (!isControlled()) {
            setInternalChecked(newChecked);
        }

        local.onCheckedChange?.(newChecked);
    };

    return (
        <input
            type="checkbox"
            id={local.id}
            checked={checked()}
            disabled={local.disabled}
            required={local.required}
            class={local.class}
            onChange={handleChange}
            data-state={checked() ? "checked" : "unchecked"}
            aria-checked={checked()}
            {...others}
        />
    );
};

export const CheckboxIndicator: Component<JSX.HTMLAttributes<HTMLDivElement>> = (props) => {
    return <div {...props} />;
};
