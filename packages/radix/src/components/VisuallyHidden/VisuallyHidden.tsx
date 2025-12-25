import { splitProps } from 'solid-js';
import type { Component, JSX } from 'solid-js';

export interface VisuallyHiddenProps extends JSX.HTMLAttributes<HTMLSpanElement> {
  /**
   * 子元素
   */
  children?: JSX.Element;
}

export const VisuallyHidden: Component<VisuallyHiddenProps> = (props) => {
  const [local, others] = splitProps(props, ['class', 'children', 'style']);

  return (
    <span
      class={local.class}
      style={`position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border-width: 0; ${typeof local.style === 'string' ? local.style : ''}`}
      {...others}
    >
      {local.children}
    </span>
  );
};

