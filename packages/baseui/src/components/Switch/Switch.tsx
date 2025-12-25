import { splitProps, Component, JSX, createSignal } from 'solid-js';

export interface SwitchProps extends Omit<JSX.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /**
   * Switch 的根元素
   */
  slotProps?: {
    root?: JSX.HTMLAttributes<HTMLLabelElement>;
    input?: JSX.InputHTMLAttributes<HTMLInputElement>;
    thumb?: JSX.HTMLAttributes<HTMLSpanElement>;
    track?: JSX.HTMLAttributes<HTMLSpanElement>;
  };
  /**
   * 是否选中（受控）
   */
  checked?: boolean;
  /**
   * 默认选中状态（非受控）
   */
  defaultChecked?: boolean;
  /**
   * 选中状态变化回调
   */
  onCheckedChange?: (checked: boolean) => void;
  /**
   * 是否禁用
   */
  disabled?: boolean;
  /**
   * 是否必填
   */
  required?: boolean;
  /**
   * 是否只读
   */
  readOnly?: boolean;
  /**
   * 标签文本
   */
  label?: JSX.Element;
}

export const Switch: Component<SwitchProps> = (props) => {
  const [local, inputProps, others] = splitProps(
    props,
    [
      'checked',
      'defaultChecked',
      'onCheckedChange',
      'disabled',
      'required',
      'readOnly',
      'label',
      'slotProps',
      'class',
    ],
    ['onChange', 'onClick', 'onFocus', 'onBlur']
  );

  const isControlled = () => local.checked !== undefined;
  const [internalChecked, setInternalChecked] = createSignal<boolean>(
    local.checked ?? local.defaultChecked ?? false
  );

  const checked = () => (isControlled() ? local.checked ?? false : internalChecked());

  const handleChange: JSX.EventHandler<HTMLInputElement, Event> = (e) => {
    const newChecked = e.currentTarget.checked;
    if (!isControlled()) {
      setInternalChecked(newChecked);
    }
    local.onCheckedChange?.(newChecked);
    if (typeof inputProps.onChange === 'function') {
      inputProps.onChange(e as any);
    }
  };

  const rootSlotProps = () => local.slotProps?.root ?? {};
  const inputSlotProps = () => local.slotProps?.input ?? {};
  const thumbSlotProps = () => local.slotProps?.thumb ?? {};
  const trackSlotProps = () => local.slotProps?.track ?? {};

  return (
    <label
      class={local.class}
      data-disabled={local.disabled ? '' : undefined}
      data-checked={checked() ? '' : undefined}
      data-readonly={local.readOnly ? '' : undefined}
      {...rootSlotProps()}
    >
      <input
        type="checkbox"
        role="switch"
        checked={checked()}
        disabled={local.disabled}
        required={local.required}
        readOnly={local.readOnly}
        onChange={handleChange}
        onClick={inputProps.onClick}
        onFocus={inputProps.onFocus}
        onBlur={inputProps.onBlur}
        aria-checked={checked()}
        {...inputSlotProps()}
        {...others}
      />
      <span data-track {...trackSlotProps()}>
        <span data-thumb {...thumbSlotProps()} />
      </span>
      {local.label && <span data-label>{local.label}</span>}
    </label>
  );
};

