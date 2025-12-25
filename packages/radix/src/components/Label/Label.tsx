import { Component, splitProps } from 'solid-js';
import type { JSX } from 'solid-js';

export interface LabelProps extends JSX.LabelHTMLAttributes<HTMLLabelElement> {
  /**
   * 标签文本
   */
  children?: JSX.Element;
  /**
   * 是否禁用
   * @default false
   */
  disabled?: boolean;
}

export const Label: Component<LabelProps> = (props) => {
  const [local, others] = splitProps(props, ['children', 'disabled', 'class']);
  
  return (
    <label
      class={local.class}
      data-disabled={local.disabled ? '' : undefined}
      {...others}
    >
      {local.children}
    </label>
  );
};

