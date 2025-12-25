/**
 * Panel 组件 - 流程图画布面板
 */

import { Component, JSX, splitProps } from 'solid-js';

export interface PanelProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /**
   * 位置
   * @default 'top-left'
   */
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  /**
   * 子元素
   */
  children?: JSX.Element;
}

export const Panel: Component<PanelProps> = (props) => {
  const [local, others] = splitProps(props, ['position', 'children', 'class', 'style']);

  const position = () => local.position ?? 'top-left';

  const getPositionClasses = (pos: string) => {
    const classes: Record<string, string> = {
      'top-left': 'top-4 left-4',
      'top-center': 'top-4 left-1/2 -translate-x-1/2',
      'top-right': 'top-4 right-4',
      'bottom-left': 'bottom-4 left-4',
      'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
      'bottom-right': 'bottom-4 right-4',
    };
    return classes[pos];
  };

  return (
    <div
      {...others}
      class={local.class}
      classList={{
        'absolute z-10': true,
        [getPositionClasses(position())]: true,
      }}
      style={local.style}
    >
      {local.children}
    </div>
  );
};


