import { splitProps } from 'solid-js';
import type { Component, JSX } from 'solid-js';

export interface ScrollAreaProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /**
   * 子元素
   */
  children?: JSX.Element;
  /**
   * 滚动条方向
   * @default 'vertical'
   */
  orientation?: 'vertical' | 'horizontal' | 'both';
  /**
   * 类型
   * @default 'hover'
   */
  type?: 'auto' | 'always' | 'scroll' | 'hover';
}

export interface ScrollAreaComponent extends Component<ScrollAreaProps> {
  Viewport: Component<ScrollAreaViewportProps>;
  Scrollbar: Component<ScrollAreaScrollbarProps>;
  Thumb: Component<ScrollAreaThumbProps>;
  Corner: Component<ScrollAreaCornerProps>;
}

const ScrollAreaBase: Component<ScrollAreaProps> = (props) => {
  const [local, others] = splitProps(props, [
    'children',
    'orientation',
    'type',
    'class',
  ]);

  return (
    <div
      class={local.class}
      data-orientation={local.orientation ?? 'vertical'}
      {...others}
    >
      {local.children}
    </div>
  );
};

export const ScrollArea = Object.assign(ScrollAreaBase, {
  Viewport: null as unknown as Component<ScrollAreaViewportProps>,
  Scrollbar: null as unknown as Component<ScrollAreaScrollbarProps>,
  Thumb: null as unknown as Component<ScrollAreaThumbProps>,
  Corner: null as unknown as Component<ScrollAreaCornerProps>,
}) as ScrollAreaComponent;

export interface ScrollAreaViewportProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /**
   * 子元素
   */
  children?: JSX.Element;
}

export const ScrollAreaViewport: Component<ScrollAreaViewportProps> = (props) => {
  const [local, others] = splitProps(props, ['children', 'class']);

  return (
    <div
      class={local.class}
      style="overflow: scroll; width: 100%; height: 100%;"
      {...others}
    >
      {local.children}
    </div>
  );
};

export interface ScrollAreaScrollbarProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /**
   * 滚动条方向
   */
  orientation?: 'vertical' | 'horizontal';
  /**
   * 是否强制显示
   * @default false
   */
  forceMount?: boolean;
  /**
   * 子元素
   */
  children?: JSX.Element;
}

export const ScrollAreaScrollbar: Component<ScrollAreaScrollbarProps> = (props) => {
  const [local, others] = splitProps(props, [
    'orientation',
    'forceMount',
    'class',
    'children',
  ]);

  return (
    <div
      role="scrollbar"
      class={local.class}
      data-orientation={local.orientation}
      {...others}
    >
      {local.children}
    </div>
  );
};

export interface ScrollAreaThumbProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /**
   * 子元素
   */
  children?: JSX.Element;
}

export const ScrollAreaThumb: Component<ScrollAreaThumbProps> = (props) => {
  const [local, others] = splitProps(props, ['children', 'class']);

  return (
    <div
      class={local.class}
      {...others}
    >
      {local.children}
    </div>
  );
};

export interface ScrollAreaCornerProps extends JSX.HTMLAttributes<HTMLDivElement> {
}

export const ScrollAreaCorner: Component<ScrollAreaCornerProps> = (props) => {
  const [local, others] = splitProps(props, ['class']);

  return (
    <div
      class={local.class}
      {...others}
    />
  );
};

ScrollArea.Viewport = ScrollAreaViewport;
ScrollArea.Scrollbar = ScrollAreaScrollbar;
ScrollArea.Thumb = ScrollAreaThumb;
ScrollArea.Corner = ScrollAreaCorner;

