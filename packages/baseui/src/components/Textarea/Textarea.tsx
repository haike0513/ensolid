import { splitProps, Component, JSX, createSignal } from 'solid-js';

export interface TextareaProps extends JSX.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /**
   * Textarea 的根元素
   */
  slotProps?: {
    root?: JSX.HTMLAttributes<HTMLDivElement>;
    textarea?: JSX.TextareaHTMLAttributes<HTMLTextAreaElement>;
  };
  /**
   * 文本域的值（受控）
   */
  value?: string;
  /**
   * 文本域的默认值（非受控）
   */
  defaultValue?: string;
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
   * 最小行数
   */
  minRows?: number;
  /**
   * 最大行数
   */
  maxRows?: number;
  /**
   * 是否自动调整大小
   */
  autosize?: boolean;
  /**
   * 子元素（通常用于装饰性元素）
   */
  children?: JSX.Element;
}

export const Textarea: Component<TextareaProps> = (props) => {
  const [local, textareaProps, others] = splitProps(
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
      'minRows',
      'maxRows',
      'autosize',
      'children',
      'slotProps',
      'class',
    ],
    ['onInput', 'onChange', 'onBlur', 'onFocus']
  );

  const isControlled = () => local.value !== undefined;
  const [internalValue, setInternalValue] = createSignal<string>(
    local.value ?? local.defaultValue ?? ''
  );

  const value = () => (isControlled() ? String(local.value ?? '') : internalValue());

  const handleInput: JSX.EventHandler<HTMLTextAreaElement, InputEvent> = (e) => {
    const newValue = e.currentTarget.value;
    if (!isControlled()) {
      setInternalValue(newValue);
    }
    local.onValueChange?.(newValue);
    if (typeof textareaProps.onInput === 'function') {
      textareaProps.onInput(e as any);
    }
  };

  const handleChange: JSX.EventHandler<HTMLTextAreaElement, Event> = (e) => {
    if (typeof textareaProps.onChange === 'function') {
      textareaProps.onChange(e as any);
    }
  };

  const rootSlotProps = () => local.slotProps?.root ?? {};
  const textareaSlotProps = () => local.slotProps?.textarea ?? {};

  return (
    <div
      class={local.class}
      data-disabled={local.disabled ? '' : undefined}
      data-error={local.error ? '' : undefined}
      data-readonly={local.readOnly ? '' : undefined}
      {...rootSlotProps()}
    >
      <textarea
        value={value()}
        disabled={local.disabled}
        readOnly={local.readOnly}
        required={local.required}
        placeholder={local.placeholder}
        rows={local.minRows}
        onInput={handleInput}
        onChange={handleChange}
        onBlur={textareaProps.onBlur}
        onFocus={textareaProps.onFocus}
        data-error={local.error ? '' : undefined}
        {...textareaSlotProps()}
        {...others}
      />
      {local.children}
    </div>
  );
};

