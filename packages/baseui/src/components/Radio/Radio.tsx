import { splitProps, Component, JSX, createContext, useContext, createSignal } from 'solid-js';

interface RadioGroupContextValue {
  value: () => string | undefined;
  setValue: (value: string) => void;
  name: () => string | undefined;
  disabled: () => boolean;
}

const RadioGroupContext = createContext<RadioGroupContextValue>();

export const useRadioGroupContext = () => {
  const context = useContext(RadioGroupContext);
  return context;
};

export interface RadioGroupProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /**
   * 选中的值（受控）
   */
  value?: string;
  /**
   * 默认选中的值（非受控）
   */
  defaultValue?: string;
  /**
   * 值变化回调
   */
  onValueChange?: (value: string) => void;
  /**
   * 名称（用于表单）
   */
  name?: string;
  /**
   * 是否禁用
   */
  disabled?: boolean;
  /**
   * 是否必填
   */
  required?: boolean;
  /**
   * 方向
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical';
  /**
   * 子元素
   */
  children?: JSX.Element;
}

const RadioGroupBase: Component<RadioGroupProps> = (props) => {
  const [local, others] = splitProps(props, [
    'value',
    'defaultValue',
    'onValueChange',
    'name',
    'disabled',
    'required',
    'orientation',
    'class',
    'children',
  ]);

  const isControlled = () => local.value !== undefined;
  const [internalValue, setInternalValue] = createSignal<string | undefined>(
    local.value ?? local.defaultValue
  );

  const value = () => (isControlled() ? local.value : internalValue());
  const disabled = () => local.disabled ?? false;

  const handleValueChange = (newValue: string) => {
    if (!isControlled()) {
      setInternalValue(newValue);
    }
    local.onValueChange?.(newValue);
  };

  const contextValue: RadioGroupContextValue = {
    value,
    setValue: handleValueChange,
    name: () => local.name,
    disabled,
  };

  return (
    <RadioGroupContext.Provider value={contextValue}>
      <div
        class={local.class}
        role="radiogroup"
        data-disabled={disabled() ? '' : undefined}
        data-orientation={local.orientation ?? 'horizontal'}
        {...others}
      >
        {local.children}
      </div>
    </RadioGroupContext.Provider>
  );
};

export interface RadioGroupComponent extends Component<RadioGroupProps> {
  Radio: Component<RadioProps>;
}

export const RadioGroup = Object.assign(RadioGroupBase, {
  Radio: null as unknown as Component<RadioProps>,
}) as RadioGroupComponent;

export interface RadioProps extends Omit<JSX.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /**
   * Radio 的根元素
   */
  slotProps?: {
    root?: JSX.HTMLAttributes<HTMLLabelElement>;
    input?: JSX.InputHTMLAttributes<HTMLInputElement>;
    radio?: JSX.HTMLAttributes<HTMLSpanElement>;
  };
  /**
   * 选项的值
   */
  value: string;
  /**
   * 是否禁用
   */
  disabled?: boolean;
  /**
   * 标签文本
   */
  label?: JSX.Element;
}

export const Radio: Component<RadioProps> = (props) => {
  const [local, inputProps, others] = splitProps(
    props,
    ['value', 'disabled', 'label', 'slotProps', 'class'],
    ['onChange', 'onClick', 'onFocus', 'onBlur']
  );

  const context = useRadioGroupContext();
  const isDisabled = () => local.disabled ?? context?.disabled() ?? false;
  const isChecked = () => context?.value() === local.value;

  const handleChange: JSX.EventHandler<HTMLInputElement, Event> = (e) => {
    if (typeof inputProps.onChange === 'function') {
      inputProps.onChange(e as any);
    }
    if (!isDisabled() && context) {
      context.setValue(local.value);
    }
  };

  const rootSlotProps = () => local.slotProps?.root ?? {};
  const inputSlotProps = () => local.slotProps?.input ?? {};
  const radioSlotProps = () => local.slotProps?.radio ?? {};

  return (
    <label
      class={local.class}
      data-disabled={isDisabled() ? '' : undefined}
      data-checked={isChecked() ? '' : undefined}
      {...rootSlotProps()}
    >
      <input
        type="radio"
        value={local.value}
        name={context?.name()}
        checked={isChecked()}
        disabled={isDisabled()}
        onChange={handleChange}
        onClick={inputProps.onClick}
        onFocus={inputProps.onFocus}
        onBlur={inputProps.onBlur}
        aria-checked={isChecked()}
        {...inputSlotProps()}
        {...others}
      />
      <span data-radio {...radioSlotProps()} />
      {local.label && <span data-label>{local.label}</span>}
    </label>
  );
};

RadioGroup.Radio = Radio;

