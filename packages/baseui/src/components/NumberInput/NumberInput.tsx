import {
    Component,
    createSignal,
    JSX,
    splitProps,
    Show,
} from "solid-js";

export interface NumberInputProps
    extends Omit<JSX.InputHTMLAttributes<HTMLInputElement>, "type" | "value" | "onChange"> {
    /**
     * NumberInput 的根元素
     */
    slotProps?: {
        root?: JSX.HTMLAttributes<HTMLDivElement>;
        input?: JSX.InputHTMLAttributes<HTMLInputElement>;
        incrementButton?: JSX.ButtonHTMLAttributes<HTMLButtonElement>;
        decrementButton?: JSX.ButtonHTMLAttributes<HTMLButtonElement>;
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
     * 最小值
     */
    min?: number;
    /**
     * 最大值
     */
    max?: number;
    /**
     * 步长
     * @default 1
     */
    step?: number;
    /**
     * 是否禁用
     */
    disabled?: boolean;
    /**
     * 是否只读
     */
    readOnly?: boolean;
    /**
     * 是否必填
     */
    required?: boolean;
    /**
     * 占位符
     */
    placeholder?: string;
    /**
     * 是否显示增减按钮
     * @default true
     */
    showButtons?: boolean;
    /**
     * 是否允许空值
     * @default false
     */
    allowEmpty?: boolean;
    /**
     * 格式化函数
     */
    formatValue?: (value: number | null) => string;
    /**
     * 解析函数
     */
    parseValue?: (value: string) => number | null;
}

export const NumberInput: Component<NumberInputProps> = (props) => {
    const [local, inputProps, others] = splitProps(
        props,
        [
            "value",
            "defaultValue",
            "onValueChange",
            "min",
            "max",
            "step",
            "disabled",
            "readOnly",
            "required",
            "placeholder",
            "showButtons",
            "allowEmpty",
            "formatValue",
            "parseValue",
            "slotProps",
            "class",
        ],
        ["onInput", "onchange", "onBlur", "onFocus"],
    );

    const isControlled = () => local.value !== undefined;
    const [internalValue, setInternalValue] = createSignal<number | null>(
        local.value ?? local.defaultValue ?? null,
    );
    const [inputValue, setInputValue] = createSignal<string>("");

    const step = () => local.step ?? 1;
    const showButtons = () => local.showButtons ?? true;
    const allowEmpty = () => local.allowEmpty ?? false;

    const formatValue = (val: number | null): string => {
        if (val === null || val === undefined) return "";
        if (local.formatValue) {
            return local.formatValue(val);
        }
        return String(val);
    };

    const parseValue = (val: string): number | null => {
        if (!val.trim()) {
            return allowEmpty() ? null : 0;
        }
        if (local.parseValue) {
            return local.parseValue(val);
        }
        const parsed = Number(val);
        return isNaN(parsed) ? null : parsed;
    };

    const currentValue = () =>
        isControlled() ? local.value ?? null : internalValue();

    const handleInput: JSX.EventHandler<HTMLInputElement, InputEvent> = (
        e,
    ) => {
        const newInputValue = e.currentTarget.value;
        setInputValue(newInputValue);
        const parsed = parseValue(newInputValue);
        if (parsed !== null) {
            if (!isControlled()) {
                setInternalValue(parsed);
            }
            local.onValueChange?.(parsed);
        }
        if (typeof (inputProps as any).onInput === "function") {
            (inputProps as any).onInput(e);
        }
    };

    const handleBlur: JSX.EventHandler<HTMLInputElement, FocusEvent> = (e) => {
        const parsed = parseValue(e.currentTarget.value);
        const finalValue = parsed ?? (allowEmpty() ? null : 0);
        if (!isControlled()) {
            setInternalValue(finalValue);
        }
        setInputValue(formatValue(finalValue));
        local.onValueChange?.(finalValue);
        if (typeof (inputProps as any).onBlur === "function") {
            (inputProps as any).onBlur(e);
        }
    };

    const clampValue = (val: number): number => {
        let result = val;
        if (local.min !== undefined) {
            result = Math.max(result, local.min);
        }
        if (local.max !== undefined) {
            result = Math.min(result, local.max);
        }
        return result;
    };

    const increment = () => {
        const current = currentValue() ?? 0;
        const newValue = clampValue(current + step());
        if (!isControlled()) {
            setInternalValue(newValue);
        }
        setInputValue(formatValue(newValue));
        local.onValueChange?.(newValue);
    };

    const decrement = () => {
        const current = currentValue() ?? 0;
        const newValue = clampValue(current - step());
        if (!isControlled()) {
            setInternalValue(newValue);
        }
        setInputValue(formatValue(newValue));
        local.onValueChange?.(newValue);
    };

    const rootSlotProps = () => local.slotProps?.root ?? {};
    const inputSlotProps = () => local.slotProps?.input ?? {};
    const incrementButtonProps = () => local.slotProps?.incrementButton ?? {};
    const decrementButtonProps = () => local.slotProps?.decrementButton ?? {};

    return (
        <div
            class={local.class}
            data-disabled={local.disabled ? "" : undefined}
            data-readonly={local.readOnly ? "" : undefined}
            {...rootSlotProps()}
        >
            <Show when={showButtons()}>
                <button
                    type="button"
                    disabled={local.disabled}
                    onClick={decrement}
                    data-decrement
                    {...decrementButtonProps()}
                >
                    −
                </button>
            </Show>
            <input
                type="text"
                inputMode="numeric"
                value={inputValue() || formatValue(currentValue())}
                disabled={local.disabled}
                readOnly={local.readOnly}
                required={local.required}
                placeholder={local.placeholder}
                onInput={handleInput}
                onBlur={handleBlur}
                onFocus={(inputProps as any).onFocus}
                {...inputSlotProps()}
                {...others}
            />
            <Show when={showButtons()}>
                <button
                    type="button"
                    disabled={local.disabled}
                    onClick={increment}
                    data-increment
                    {...incrementButtonProps()}
                >
                    +
                </button>
            </Show>
        </div>
    );
};

