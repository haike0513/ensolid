import { Component, splitProps } from 'solid-js';
import type { JSX } from 'solid-js';

export interface ProgressProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /**
   * 进度值（0-100）
   */
  value?: number;
  /**
   * 最大值
   * @default 100
   */
  max?: number;
  /**
   * 是否显示值
   * @default false
   */
  showValue?: boolean;
}

export const Progress: Component<ProgressProps> = (props) => {
  const [local, others] = splitProps(props, [
    'value',
    'max',
    'showValue',
    'class',
    'children',
  ]);

  const value = () => local.value ?? 0;
  const max = () => local.max ?? 100;
  const percentage = () => Math.min(Math.max((value() / max()) * 100, 0), 100);

  return (
    <div
      class={local.class}
      role="progressbar"
      aria-valuenow={value()}
      aria-valuemin={0}
      aria-valuemax={max()}
      data-value={value()}
      data-max={max()}
      {...others}
    >
      <div
        class="h-full transition-all"
        style={`width: ${percentage()}%`}
      />
      {local.showValue && (
        <span class="absolute inset-0 flex items-center justify-center text-sm">
          {Math.round(percentage())}%
        </span>
      )}
      {local.children}
    </div>
  );
};

