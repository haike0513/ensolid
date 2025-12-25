import {
    Component,
    createContext,
    createSignal,
    JSX,
    splitProps,
    useContext,
    Show,
} from "solid-js";

interface AutocompleteContextValue {
    open: () => boolean;
    setOpen: (open: boolean) => void;
    value: () => string | null;
    setValue: (value: string | null) => void;
    inputValue: () => string;
    setInputValue: (value: string) => void;
    options: () => string[];
    filteredOptions: () => string[];
}

const AutocompleteContext = createContext<AutocompleteContextValue>();

export const useAutocompleteContext = () => {
    const context = useContext(AutocompleteContext);
    if (!context) {
        throw new Error("Autocomplete components must be used within Autocomplete");
    }
    return context;
};

export interface AutocompleteProps extends JSX.HTMLAttributes<HTMLDivElement> {
    /**
     * 选项列表
     */
    options: string[];
    /**
     * 当前值（受控）
     */
    value?: string | null;
    /**
     * 默认值（非受控）
     */
    defaultValue?: string | null;
    /**
     * 值变化回调
     */
    onValueChange?: (value: string | null) => void;
    /**
     * 输入值（受控）
     */
    inputValue?: string;
    /**
     * 默认输入值（非受控）
     */
    defaultInputValue?: string;
    /**
     * 输入值变化回调
     */
    onInputValueChange?: (value: string) => void;
    /**
     * 是否禁用
     */
    disabled?: boolean;
    /**
     * 是否只读
     */
    readOnly?: boolean;
    /**
     * 占位符
     */
    placeholder?: string;
    /**
     * 是否自动高亮第一个选项
     */
    autoHighlight?: boolean;
    /**
     * 是否自动完成
     */
    autoComplete?: boolean;
    /**
     * 过滤函数
     */
    filterOptions?: (options: string[], inputValue: string) => string[];
    /**
     * 子元素
     */
    children?: JSX.Element;
}

const AutocompleteBase: Component<AutocompleteProps> = (props) => {
    const [local, others] = splitProps(props, [
        "options",
        "value",
        "defaultValue",
        "onValueChange",
        "inputValue",
        "defaultInputValue",
        "onInputValueChange",
        "disabled",
        "readOnly",
        "placeholder",
        "autoHighlight",
        "autoComplete",
        "filterOptions",
        "class",
        "children",
    ]);

    const isControlled = () => local.value !== undefined;
    const isInputControlled = () => local.inputValue !== undefined;

    const [internalValue, setInternalValue] = createSignal<string | null>(
        local.value ?? local.defaultValue ?? null,
    );
    const [internalInputValue, setInternalInputValue] = createSignal<string>(
        local.inputValue ?? local.defaultInputValue ?? "",
    );
    const [open, setOpen] = createSignal(false);

    const value = () => (isControlled() ? local.value ?? null : internalValue());
    const inputValue = () =>
        isInputControlled()
            ? local.inputValue ?? ""
            : internalInputValue();

    const defaultFilterOptions = (options: string[], inputValue: string) => {
        if (!inputValue) return options;
        return options.filter((option) =>
            option.toLowerCase().includes(inputValue.toLowerCase()),
        );
    };

    const filterOptions = () =>
        local.filterOptions ?? defaultFilterOptions;

    const filteredOptions = () => {
        const currentInputValue = inputValue();
        return filterOptions()(local.options, currentInputValue);
    };

    const handleValueChange = (newValue: string | null) => {
        if (!isControlled()) {
            setInternalValue(newValue);
        }
        local.onValueChange?.(newValue);
    };

    const handleInputValueChange = (newInputValue: string) => {
        if (!isInputControlled()) {
            setInternalInputValue(newInputValue);
        }
        local.onInputValueChange?.(newInputValue);
        setOpen(true);
    };

    const contextValue: AutocompleteContextValue = {
        open,
        setOpen,
        value,
        setValue: handleValueChange,
        inputValue,
        setInputValue: handleInputValueChange,
        options: () => local.options,
        filteredOptions,
    };

    return (
        <AutocompleteContext.Provider value={contextValue}>
            <div
                class={local.class}
                data-disabled={local.disabled ? "" : undefined}
                data-open={open() ? "" : undefined}
                {...others}
            >
                {local.children}
            </div>
        </AutocompleteContext.Provider>
    );
};

export interface AutocompleteComponent extends Component<AutocompleteProps> {
    Input: Component<AutocompleteInputProps>;
    Listbox: Component<AutocompleteListboxProps>;
    Option: Component<AutocompleteOptionProps>;
}

export const Autocomplete = Object.assign(AutocompleteBase, {
    Input: null as unknown as Component<AutocompleteInputProps>,
    Listbox: null as unknown as Component<AutocompleteListboxProps>,
    Option: null as unknown as Component<AutocompleteOptionProps>,
}) as AutocompleteComponent;

export interface AutocompleteInputProps
    extends JSX.InputHTMLAttributes<HTMLInputElement> {
    /**
     * 子元素
     */
    children?: JSX.Element;
}

export const AutocompleteInput: Component<AutocompleteInputProps> = (props) => {
    const [local, others] = splitProps(props, [
        "children",
        "class",
        "onInput",
        "onFocus",
        "onBlur",
    ]);
    const context = useAutocompleteContext();

    const handleInput: JSX.EventHandler<HTMLInputElement, InputEvent> = (e) => {
        const newValue = e.currentTarget.value;
        context.setInputValue(newValue);
        if (typeof local.onInput === "function") {
            local.onInput(e as any);
        }
    };

    const handleFocus: JSX.EventHandler<HTMLInputElement, FocusEvent> = (e) => {
        context.setOpen(true);
        if (typeof local.onFocus === "function") {
            local.onFocus(e as any);
        }
    };

    const handleBlur: JSX.EventHandler<HTMLInputElement, FocusEvent> = (e) => {
        // 延迟关闭，以便点击选项时能触发
        setTimeout(() => {
            context.setOpen(false);
        }, 200);
        if (typeof local.onBlur === "function") {
            local.onBlur(e as any);
        }
    };

    return (
        <input
            type="text"
            class={local.class}
            value={context.inputValue()}
            onInput={handleInput}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...others}
        />
    );
};

export interface AutocompleteListboxProps
    extends JSX.HTMLAttributes<HTMLUListElement> {
    /**
     * 子元素
     */
    children?: JSX.Element;
}

export const AutocompleteListbox: Component<AutocompleteListboxProps> = (
    props,
) => {
    const [local, others] = splitProps(props, ["children", "class"]);
    const context = useAutocompleteContext();

    return (
        <Show when={context.open() && context.filteredOptions().length > 0}>
            <ul role="listbox" class={local.class} {...others}>
                {local.children}
            </ul>
        </Show>
    );
};

export interface AutocompleteOptionProps
    extends JSX.LiHTMLAttributes<HTMLLIElement> {
    /**
     * 选项的值
     */
    value: string;
    /**
     * 是否禁用
     */
    disabled?: boolean;
    /**
     * 子元素
     */
    children?: JSX.Element;
}

export const AutocompleteOption: Component<AutocompleteOptionProps> = (
    props,
) => {
    const [local, others] = splitProps(props, [
        "value",
        "disabled",
        "children",
        "class",
        "onClick",
    ]);
    const context = useAutocompleteContext();

    const isSelected = () => context.value() === local.value;

    const handleClick: JSX.EventHandler<HTMLLIElement, MouseEvent> = (e) => {
        if (typeof local.onClick === "function") {
            local.onClick(e);
        }
        if (!local.disabled) {
            context.setValue(local.value);
            context.setInputValue(local.value);
            context.setOpen(false);
        }
    };

    return (
        <li
            role="option"
            class={local.class}
            data-selected={isSelected() ? "" : undefined}
            data-disabled={local.disabled ? "" : undefined}
            aria-selected={isSelected()}
            onClick={handleClick}
            {...others}
        >
            {local.children ?? local.value}
        </li>
    );
};

Autocomplete.Input = AutocompleteInput;
Autocomplete.Listbox = AutocompleteListbox;
Autocomplete.Option = AutocompleteOption;

