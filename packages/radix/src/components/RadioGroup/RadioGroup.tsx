import { splitProps, createSignal, createContext, useContext } from 'solid-js';
import type { Component } from 'solid-js';
import type { JSX as JSXTypes } from 'solid-js';

interface RadioGroupContextValue {
  value: () => string | undefined;
  setValue: (value: string) => void;
  disabled?: boolean;
  name?: string;
}

const RadioGroupContext = createContext<RadioGroupContextValue>();

export const useRadioGroupContext = () => {
  const context = useContext(RadioGroupContext);
  if (!context) {
    throw new Error('RadioGroup.Item must be used within RadioGroup');
  }
  return context;
};

export interface RadioGroupProps extends JSXTypes.HTMLAttributes<HTMLDivElement> {
  /**
   * 选中的值
   */
  value?: string;
  /**
   * 默认选中的值
   */
  defaultValue?: string;
  /**
   * 值变化回调
   */
  onValueChange?: (value: string) => void;
  /**
   * 是否禁用
   * @default false
   */
  disabled?: boolean;
  /**
   * 表单字段名称
   */
  name?: string;
  /**
   * 是否必填
   * @default false
   */
  required?: boolean;
}

const RadioGroupBase: Component<RadioGroupProps> = (props) => {
  const [local, others] = splitProps(props, [
    'value',
    'defaultValue',
    'onValueChange',
    'disabled',
    'name',
    'required',
    'class',
    'children',
  ]);

  const [internalValue, setInternalValue] = createSignal<string | undefined>(
    local.value ?? local.defaultValue
  );

  const isControlled = () => local.value !== undefined;
  const value = () => (isControlled() ? local.value : internalValue());

  const handleValueChange = (newValue: string) => {
    if (!isControlled()) {
      setInternalValue(newValue);
    }
    local.onValueChange?.(newValue);
  };

  const contextValue: RadioGroupContextValue = {
    value,
    setValue: handleValueChange,
    disabled: local.disabled,
    name: local.name,
  };

  return (
    <RadioGroupContext.Provider value={contextValue}>
      <div
        role="radiogroup"
        class={local.class}
        aria-required={local.required}
        data-disabled={local.disabled ? '' : undefined}
        {...others}
      >
        {local.children}
      </div>
    </RadioGroupContext.Provider>
  );
};

export interface RadioGroupComponent extends Component<RadioGroupProps> {
  Item: Component<RadioGroupItemProps>;
}

export const RadioGroup = Object.assign(RadioGroupBase, {
  Item: null as unknown as Component<RadioGroupItemProps>,
}) as RadioGroupComponent;

export interface RadioGroupItemProps extends JSXTypes.InputHTMLAttributes<HTMLInputElement> {
  /**
   * 选项的值
   */
  value: string;
  /**
   * 是否禁用
   * @default false
   */
  disabled?: boolean;
}

export const RadioGroupItem: Component<RadioGroupItemProps> = (props) => {
  const [local, others] = splitProps(props, ['value', 'disabled', 'class', 'id']);
  const context = useRadioGroupContext();

  const checked = () => context.value() === local.value;
  const disabled = () => local.disabled ?? context.disabled;

  const handleChange = () => {
    if (!disabled()) {
      context.setValue(local.value);
    }
  };

  return (
    <input
      type="radio"
      id={local.id}
      name={context.name}
      value={local.value}
      checked={checked()}
      disabled={disabled()}
      class={local.class}
      onChange={handleChange}
      data-state={checked() ? 'checked' : 'unchecked'}
      aria-checked={checked()}
      {...others}
    />
  );
};

RadioGroup.Item = RadioGroupItem;

