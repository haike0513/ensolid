import {
    Component,
    createContext,
    createSignal,
    JSX,
    splitProps,
    useContext,
} from "solid-js";

interface ToggleButtonGroupContextValue {
    value: () => string | string[] | undefined;
    setValue: (value: string) => void;
    exclusive: () => boolean;
    disabled: () => boolean;
    size?: () => "small" | "medium" | "large" | undefined;
    color?: () => "primary" | "secondary" | "success" | "error" | "info" | "warning" | undefined;
}

const ToggleButtonGroupContext = createContext<ToggleButtonGroupContextValue>();

export const useToggleButtonGroupContext = () => {
    const context = useContext(ToggleButtonGroupContext);
    return context;
};

export interface ToggleButtonGroupProps extends JSX.HTMLAttributes<HTMLDivElement> {
    /**
     * 当前值（受控）
     */
    value?: string | string[];
    /**
     * 默认值（非受控）
     */
    defaultValue?: string | string[];
    /**
     * 值变化回调
     */
    onValueChange?: (value: string | string[]) => void;
    /**
     * 是否互斥（单选模式）
     * @default false
     */
    exclusive?: boolean;
    /**
     * 是否禁用
     */
    disabled?: boolean;
    /**
     * 方向
     * @default 'horizontal'
     */
    orientation?: "horizontal" | "vertical";
    /**
     * 大小
     */
    size?: "small" | "medium" | "large";
    /**
     * 颜色
     */
    color?: "primary" | "secondary" | "success" | "error" | "info" | "warning";
    /**
     * 子元素
     */
    children?: JSX.Element;
}

const ToggleButtonGroupBase: Component<ToggleButtonGroupProps> = (props) => {
    const [local, others] = splitProps(props, [
        "value",
        "defaultValue",
        "onValueChange",
        "exclusive",
        "disabled",
        "orientation",
        "size",
        "color",
        "class",
        "children",
    ]);

    const exclusive = () => local.exclusive ?? false;
    const disabled = () => local.disabled ?? false;

    const isControlled = () => local.value !== undefined;
    const [internalValue, setInternalValue] = createSignal<string | string[] | undefined>(
        local.value ?? local.defaultValue,
    );

    const value = () => (isControlled() ? local.value : internalValue());

    const handleValueChange = (buttonValue: string) => {
        let newValue: string | string[];

        if (exclusive()) {
            // 单选模式：如果点击的是已选中的，则取消选中；否则选中该项
            newValue = value() === buttonValue ? "" : buttonValue;
        } else {
            // 多选模式：切换该项的选中状态
            const currentVal = value();
            const currentArray: string[] = Array.isArray(currentVal)
                ? currentVal
                : currentVal
                  ? [currentVal as string]
                  : [];
            const index = currentArray.indexOf(buttonValue);
            if (index > -1) {
                newValue = currentArray.filter((v: string) => v !== buttonValue);
            } else {
                newValue = [...currentArray, buttonValue];
            }
        }

        if (!isControlled()) {
            setInternalValue(newValue);
        }
        local.onValueChange?.(newValue);
    };

    const contextValue: ToggleButtonGroupContextValue = {
        value,
        setValue: handleValueChange,
        exclusive,
        disabled,
        size: () => local.size,
        color: () => local.color,
    };

    return (
        <ToggleButtonGroupContext.Provider value={contextValue}>
            <div
                class={local.class}
                role="group"
                data-exclusive={exclusive() ? "" : undefined}
                data-disabled={disabled() ? "" : undefined}
                data-orientation={local.orientation ?? "horizontal"}
                data-size={local.size}
                data-color={local.color}
                {...others}
            >
                {local.children}
            </div>
        </ToggleButtonGroupContext.Provider>
    );
};

export interface ToggleButtonGroupComponent extends Component<ToggleButtonGroupProps> {
    Button: Component<ToggleButtonProps>;
}

export const ToggleButtonGroup = Object.assign(ToggleButtonGroupBase, {
    Button: null as unknown as Component<ToggleButtonProps>,
}) as ToggleButtonGroupComponent;

export interface ToggleButtonProps
    extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
    /**
     * 按钮的值
     */
    value: string;
    /**
     * 是否禁用
     */
    disabled?: boolean;
    /**
     * 大小
     */
    size?: "small" | "medium" | "large";
    /**
     * 颜色
     */
    color?: "primary" | "secondary" | "success" | "error" | "info" | "warning";
    /**
     * 子元素
     */
    children?: JSX.Element;
}

export const ToggleButton: Component<ToggleButtonProps> = (props) => {
    const [local, others] = splitProps(props, [
        "value",
        "disabled",
        "size",
        "color",
        "children",
        "class",
        "onClick",
    ]);

    const context = useToggleButtonGroupContext();
    const isDisabled = () => local.disabled ?? context?.disabled() ?? false;

    const isSelected = () => {
        if (!context) return false;
        const val = context.value();
        if (context.exclusive()) {
            return val === local.value;
        } else {
            const array = Array.isArray(val) ? val : val ? [val as string] : [];
            return array.includes(local.value);
        }
    };

    const handleClick: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (e) => {
        if (typeof local.onClick === "function") {
            local.onClick(e);
        }
        if (!isDisabled() && context) {
            context.setValue(local.value);
        }
    };

    return (
        <button
            type="button"
            class={local.class}
            disabled={isDisabled()}
            onClick={handleClick}
            aria-pressed={isSelected()}
            data-selected={isSelected() ? "" : undefined}
            data-size={local.size ?? context?.size?.()}
            data-color={local.color ?? context?.color?.()}
            {...others}
        >
            {local.children}
        </button>
    );
};

ToggleButtonGroup.Button = ToggleButton;

