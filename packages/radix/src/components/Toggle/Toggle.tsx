import { splitProps, createSignal } from 'solid-js';
import type { Component } from 'solid-js';
import type { JSX } from 'solid-js';

export interface ToggleProps extends Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  /**
   * 是否按下
   */
  pressed?: boolean;
  /**
   * 默认按下状态
   */
  defaultPressed?: boolean;
  /**
   * 按下状态变化回调
   */
  onPressedChange?: (pressed: boolean) => void;
  /**
   * 是否禁用
   * @default false
   */
  disabled?: boolean;
}

export const Toggle: Component<ToggleProps> = (props) => {
  const [local, others] = splitProps(props, [
    'pressed',
    'defaultPressed',
    'onPressedChange',
    'disabled',
    'class',
    'children',
    'onClick',
  ]);

  const [internalPressed, setInternalPressed] = createSignal(
    local.pressed ?? local.defaultPressed ?? false
  );

  const isControlled = () => local.pressed !== undefined;
  const pressed = () => (isControlled() ? local.pressed! : internalPressed());

  const handleClick: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (e) => {
    if (local.disabled) {
      e.preventDefault();
      return;
    }

    if (typeof local.onClick === 'function') {
      local.onClick(e);
    }

    const newPressed = !pressed();
    
    if (!isControlled()) {
      setInternalPressed(newPressed);
    }
    
    local.onPressedChange?.(newPressed);
  };

  return (
    <button
      type="button"
      role="switch"
      aria-pressed={pressed()}
      disabled={local.disabled}
      class={local.class}
      onClick={handleClick}
      data-state={pressed() ? 'on' : 'off'}
      data-disabled={local.disabled ? '' : undefined}
      {...others}
    >
      {local.children}
    </button>
  );
};

