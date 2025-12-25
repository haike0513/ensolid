import { Component, JSX, splitProps, createContext, useContext } from "solid-js";

interface OptionGroupContextValue {
    disabled: () => boolean;
}

const OptionGroupContext = createContext<OptionGroupContextValue>();

export const useOptionGroupContext = () => {
    const context = useContext(OptionGroupContext);
    return context;
};

export interface OptionGroupProps extends JSX.HTMLAttributes<HTMLElement> {
    /**
     * OptionGroup 的根元素
     */
    slotProps?: {
        root?: JSX.HTMLAttributes<HTMLElement>;
        label?: JSX.HTMLAttributes<HTMLLIElement>;
    };
    /**
     * 选项组标签
     */
    label?: string | JSX.Element;
    /**
     * 是否禁用整个组
     */
    disabled?: boolean;
    /**
     * 作为根元素使用的 HTML 标签
     * @default 'ul'
     */
    component?: keyof JSX.IntrinsicElements;
    /**
     * 子元素
     */
    children?: JSX.Element;
}

export const OptionGroup: Component<OptionGroupProps> = (props) => {
    const [local, others] = splitProps(props, [
        "label",
        "disabled",
        "component",
        "children",
        "slotProps",
        "class",
    ]);

    const disabled = () => local.disabled ?? false;
    const Component = (local.component ?? "ul") as any;

    const rootSlotProps = () => local.slotProps?.root ?? {};
    const labelSlotProps = () => local.slotProps?.label ?? {};

    const contextValue: OptionGroupContextValue = {
        disabled,
    };

    return (
        <OptionGroupContext.Provider value={contextValue}>
            <Component
                role="group"
                class={local.class}
                data-disabled={disabled() ? "" : undefined}
                aria-disabled={disabled()}
                {...rootSlotProps()}
                {...others}
            >
                {local.label && (
                    <li role="presentation" {...labelSlotProps()}>
                        {typeof local.label === "string" ? (
                            <span>{local.label}</span>
                        ) : (
                            local.label
                        )}
                    </li>
                )}
                {local.children}
            </Component>
        </OptionGroupContext.Provider>
    );
};

