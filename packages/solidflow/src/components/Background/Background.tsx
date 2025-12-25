/**
 * Background 组件 - 流程图画布背景
 */

import { Component, JSX, splitProps } from 'solid-js';

export interface BackgroundProps {
  /**
   * 背景颜色
   * @default '#ffffff'
   */
  color?: string;
  /**
   * 背景网格大小
   * @default 20
   */
  gap?: number;
  /**
   * 背景线条宽度
   * @default 1
   */
  lineWidth?: number;
  /**
   * 背景线条颜色
   * @default '#e2e8f0'
   */
  lineColor?: string;
  /**
   * 背景变体
   * @default 'dots'
   */
  variant?: 'dots' | 'lines' | 'cross';
  /**
   * 背景大小
   */
  size?: number;
  /**
   * 类名
   */
  className?: string;
  /**
   * 样式
   */
  style?: JSX.CSSProperties;
}

export const Background: Component<BackgroundProps> = (props) => {
  const [local, others] = splitProps(props, [
    'color',
    'gap',
    'lineWidth',
    'lineColor',
    'variant',
    'size',
    'className',
    'style',
  ]);

  const color = () => local.color ?? '#ffffff';
  const gap = () => local.gap ?? 20;
  const lineWidth = () => local.lineWidth ?? 1;
  const lineColor = () => local.lineColor ?? '#e2e8f0';
  const variant = () => local.variant ?? 'dots';
  const size = () => local.size ?? gap();

  const patternId = () => `solidflow-background-${variant()}-${gap()}-${size()}`;

  const createPattern = () => {
    if (variant() === 'dots') {
      return (
        <pattern
          id={patternId()}
          x="0"
          y="0"
          width={gap()}
          height={gap()}
          patternUnits="userSpaceOnUse"
        >
          <circle cx={size() / 2} cy={size() / 2} r="1" fill={lineColor()} />
        </pattern>
      );
    } else if (variant() === 'lines') {
      return (
        <pattern
          id={patternId()}
          x="0"
          y="0"
          width={gap()}
          height={gap()}
          patternUnits="userSpaceOnUse"
        >
          <line
            x1="0"
            y1={gap()}
            x2={gap()}
            y2={gap()}
            stroke={lineColor()}
            stroke-width={lineWidth()}
          />
          <line
            x1={gap()}
            y1="0"
            x2={gap()}
            y2={gap()}
            stroke={lineColor()}
            stroke-width={lineWidth()}
          />
        </pattern>
      );
    } else {
      // cross
      return (
        <pattern
          id={patternId()}
          x="0"
          y="0"
          width={gap()}
          height={gap()}
          patternUnits="userSpaceOnUse"
        >
          <line
            x1="0"
            y1={gap()}
            x2={gap()}
            y2={gap()}
            stroke={lineColor()}
            stroke-width={lineWidth()}
          />
          <line
            x1={gap()}
            y1="0"
            x2={gap()}
            y2={gap()}
            stroke={lineColor()}
            stroke-width={lineWidth()}
          />
        </pattern>
      );
    }
  };

  return (
    <div
      {...others}
      class={local.className}
      classList={{
        'absolute inset-0 pointer-events-none': true,
      }}
      style={{
        'background-color': color(),
        ...local.style,
      }}
    >
      <svg class="absolute inset-0 w-full h-full">
        <defs>{createPattern()}</defs>
        <rect width="100%" height="100%" fill={`url(#${patternId()})`} />
      </svg>
    </div>
  );
};

