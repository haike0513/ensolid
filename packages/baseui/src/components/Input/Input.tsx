import { splitProps, Component, JSX, createSignal, Show } from 'solid-js';

export interface InputProps extends JSX.InputHTMLAttributes<HTMLInputElement> {
  /**
   * 输入框的根元素
   */
  slotProps?: {
    root?: JSX.HTMLAttributes<HTMLDivElement>;
    input?: JSX.InputHTMLAttributes<HTMLInputElement>;
  };
  /**
   * 输入框的值（受控）
   */
  value?: string | number;
  /**
   * 输入框的默认值（非受控）
   */
  defaultValue?: string | number;
  /**
   * 值变化回调
   */
  onValueChange?: (value: string) => void;
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
   * 错误状态
   */
  error?: boolean;
  /**
   * 占位符
   */
  placeholder?: string;
  /**
   * 输入框类型
   */
  type?: string;
  /**
   * 是否自动聚焦
   */
  autoFocus?: boolean;
  /**
   * 子元素（通常用于装饰性元素）
   */
  children?: JSX.Element;
}

export const Input: Component<InputProps> = (props) => {
  const [local, inputProps, others] = splitProps(
    props,
    [
      'value',
      'defaultValue',
      'onValueChange',
      'disabled',
      'readOnly',
      'required',
      'error',
      'placeholder',
      'type',
      'autoFocus',
      'children',
      'slotProps',
      'class',
    ],
    ['onInput', 'onChange', 'onBlur', 'onFocus']
  );

  const isControlled = () => local.value !== undefined;
  const [internalValue, setInternalValue] = createSignal<string>(
    String(local.value ?? local.defaultValue ?? '')
  );

  const value = () => (isControlled() ? String(local.value ?? '') : internalValue());

  const handleInput: JSX.EventHandler<HTMLInputElement, InputEvent> = (e) => {
    const newValue = e.currentTarget.value;
    if (!isControlled()) {
      setInternalValue(newValue);
    }
    local.onValueChange?.(newValue);
    if (typeof inputProps.onInput === 'function') {
      inputProps.onInput(e as any);
    }
  };

  const handleChange: JSX.EventHandler<HTMLInputElement, Event> = (e) => {
    if (typeof inputProps.onChange === 'function') {
      inputProps.onChange(e as any);
    }
  };

  const rootSlotProps = () => local.slotProps?.root ?? {};
  const inputSlotProps = () => local.slotProps?.input ?? {};

  return (
    <div
      class={local.class}
      data-disabled={local.disabled ? '' : undefined}
      data-error={local.error ? '' : undefined}
      data-readonly={local.readOnly ? '' : undefined}
      {...rootSlotProps()}
    >
      <input
        type={local.type ?? 'text'}
        value={value()}
        disabled={local.disabled}
        readOnly={local.readOnly}
        required={local.required}
        placeholder={local.placeholder}
        autofocus={local.autoFocus}
        onInput={handleInput}
        onChange={handleChange}
        onBlur={inputProps.onBlur}
        onFocus={inputProps.onFocus}
        data-error={local.error ? '' : undefined}
        {...inputSlotProps()}
        {...others}
      />
      <Show when={local.children}>{local.children}</Show>
    </div>
  );
};

