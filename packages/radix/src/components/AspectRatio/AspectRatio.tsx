import { splitProps } from 'solid-js';
import type { Component, JSX } from 'solid-js';

export interface AspectRatioProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /**
   * 宽高比
   * @default 1
   */
  ratio?: number;
  /**
   * 子元素
   */
  children?: JSX.Element;
}

export const AspectRatio: Component<AspectRatioProps> = (props) => {
  const [local, others] = splitProps(props, ['ratio', 'class', 'children', 'style']);

  const ratio = () => local.ratio ?? 1;
  const paddingBottom = () => `${(1 / ratio()) * 100}%`;

  return (
    <div
      class={local.class}
      style={`position: relative; width: 100%; padding-bottom: ${paddingBottom()}; ${typeof local.style === 'string' ? local.style : ''}`}
      {...others}
    >
      <div
        style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
      >
        {local.children}
      </div>
    </div>
  );
};

