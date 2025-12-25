/**
 * Controls 组件 - 流程图画布控制按钮
 */

import { Component, JSX, splitProps, Show } from 'solid-js';

export interface ControlsProps {
  /**
   * 显示缩放按钮
   * @default true
   */
  showZoom?: boolean;
  /**
   * 显示适合视图按钮
   * @default true
   */
  showFitView?: boolean;
  /**
   * 显示交互按钮
   * @default true
   */
  showInteractive?: boolean;
  /**
   * 适合视图按钮点击回调
   */
  onFitView?: () => void;
  /**
   * 缩小按钮点击回调
   */
  onZoomOut?: () => void;
  /**
   * 放大按钮点击回调
   */
  onZoomIn?: () => void;
  /**
   * 重置缩放按钮点击回调
   */
  onZoomReset?: () => void;
  /**
   * 类名
   */
  className?: string;
  /**
   * 样式
   */
  style?: JSX.CSSProperties;
  /**
   * 位置
   * @default 'bottom-left'
   */
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

export const Controls: Component<ControlsProps> = (props) => {
  const [local, others] = splitProps(props, [
    'showZoom',
    'showFitView',
    'showInteractive',
    'onFitView',
    'onZoomOut',
    'onZoomIn',
    'onZoomReset',
    'className',
    'style',
    'position',
  ]);

  const showZoom = () => local.showZoom ?? true;
  const showFitView = () => local.showFitView ?? true;
  const position = () => local.position ?? 'bottom-left';

  const getPositionClasses = (pos: string) => {
    const classes: Record<string, string> = {
      'top-left': 'top-4 left-4',
      'top-right': 'top-4 right-4',
      'bottom-left': 'bottom-4 left-4',
      'bottom-right': 'bottom-4 right-4',
    };
    return classes[pos];
  };

  return (
    <div
      {...others}
      class={local.className}
      classList={{
        'absolute': true,
        [getPositionClasses(position())]: true,
        'flex flex-col gap-1 z-10': true,
      }}
      style={local.style}
    >
      <Show when={showZoom()}>
        <button
          type="button"
          onClick={local.onZoomIn}
          class="solidflow-controls-button"
          aria-label="Zoom in"
          title="Zoom in"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
          </svg>
        </button>
        <button
          type="button"
          onClick={local.onZoomOut}
          class="solidflow-controls-button"
          aria-label="Zoom out"
          title="Zoom out"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z" />
          </svg>
        </button>
      </Show>
      <Show when={showFitView()}>
        <button
          type="button"
          onClick={local.onFitView}
          class="solidflow-controls-button"
          aria-label="Fit view"
          title="Fit view"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M6 2a.5.5 0 0 1 .5.5V4h3a.5.5 0 0 1 0 1h-3v1.5a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 6 2zm4 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0V4H7a.5.5 0 0 1 0-1h3.5V2.5A.5.5 0 0 1 10 2zM6 14a.5.5 0 0 1-.5-.5V11H2a.5.5 0 0 1 0-1h3.5V8.5a.5.5 0 0 1 1 0v2a.5.5 0 0 1-.5.5zm4 0a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 1 1 0V11h3a.5.5 0 0 1 0 1h-3v1.5a.5.5 0 0 1-.5.5z" />
          </svg>
        </button>
      </Show>
    </div>
  );
};

