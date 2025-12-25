import { splitProps } from 'solid-js';
import type { Component, JSX } from 'solid-js';

export interface SeparatorProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /**
   * 分隔线的方向
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical';
  /**
   * 是否为装饰性分隔线（不用于语义分隔）
   * @default false
   */
  decorative?: boolean;
}

export const Separator: Component<SeparatorProps> = (props) => {
  const [local, others] = splitProps(props, ['orientation', 'decorative', 'class']);
  
  const orientation = () => local.orientation ?? 'horizontal';
  const decorative = () => local.decorative ?? false;
  
  return (
    <div
      role={decorative() ? 'presentation' : 'separator'}
      aria-orientation={!decorative() ? orientation() : undefined}
      data-orientation={orientation()}
      class={local.class}
      {...others}
    />
  );
};

