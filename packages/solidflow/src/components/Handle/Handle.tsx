/**
 * Handle 组件 - 节点连接点
 */

import { Component, JSX, splitProps } from 'solid-js';
import type { Position } from '../../types';

export interface HandleProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /**
   * Handle 类型：source 或 target
   * @default 'source'
   */
  type?: 'source' | 'target';
  /**
   * Handle 位置
   * @default 'top'
   */
  position?: Position;
  /**
   * Handle ID
   */
  id?: string;
  /**
   * 是否可连接
   * @default true
   */
  connectable?: boolean;
  /**
   * 样式
   */
  style?: JSX.CSSProperties;
  /**
   * 类名
   */
  className?: string;
  /**
   * 子元素
   */
  children?: JSX.Element;
  /**
   * 连接有效时的回调
   */
  onConnect?: () => void;
  /**
   * 连接无效时的回调
   */
  onConnectReject?: () => void;
}

export const Handle: Component<HandleProps> = (props) => {
  const [local, others] = splitProps(props, [
    'type',
    'position',
    'id',
    'connectable',
    'style',
    'className',
    'children',
    'onConnect',
    'onConnectReject',
  ]);

  const type = () => local.type ?? 'source';
  const position = () => local.position ?? 'top';
  const connectable = () => local.connectable ?? true;

  const getPositionClasses = (pos: Position) => {
    const classes: Record<Position, string> = {
      top: 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2',
      bottom: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2',
      left: 'left-0 top-1/2 -translate-x-1/2 -translate-y-1/2',
      right: 'right-0 top-1/2 translate-x-1/2 -translate-y-1/2',
    };
    return classes[pos];
  };

  return (
    <div
      {...others}
      data-handleid={local.id}
      data-handlepos={position()}
      data-handletype={type()}
      data-connectable={connectable()}
      class={local.className}
      classList={{
        'absolute': true,
        [getPositionClasses(position())]: true,
        'w-3 h-3 rounded-full bg-blue-500 border-2 border-white cursor-crosshair': true,
        'pointer-events-auto': true,
        'z-10': true,
      }}
      style={{
        ...local.style,
      }}
    >
      {local.children}
    </div>
  );
};


