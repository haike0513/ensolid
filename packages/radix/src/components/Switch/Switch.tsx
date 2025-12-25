import { Component, splitProps, createSignal } from 'solid-js';
import type { JSX } from 'solid-js';

export interface SwitchProps extends Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
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

export const Switch: Component<SwitchProps> = (props) => {
  const [local, others] = splitProps(props, [
    'checked',
    'defaultChecked',
    'onCheckedChange',
    'disabled',
    'required',
    'class',
    'id',
  ]);

  const [internalChecked, setInternalChecked] = createSignal(
    local.checked ?? local.defaultChecked ?? false
  );

  const isControlled = () => local.checked !== undefined;
  const checked = () => (isControlled() ? local.checked! : internalChecked());

  const handleClick = () => {
    if (local.disabled) return;
    
    const newChecked = !checked();
    
    if (!isControlled()) {
      setInternalChecked(newChecked);
    }
    
    local.onCheckedChange?.(newChecked);
  };

  return (
    <button
      type="button"
      role="switch"
      id={local.id}
      aria-checked={checked()}
      aria-required={local.required}
      disabled={local.disabled}
      class={local.class}
      onClick={handleClick}
      data-state={checked() ? 'checked' : 'unchecked'}
      data-disabled={local.disabled ? '' : undefined}
      {...others}
    />
  );
};

