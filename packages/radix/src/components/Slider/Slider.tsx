import { splitProps, createSignal } from 'solid-js';
import type { Component } from 'solid-js';
import type { JSX } from 'solid-js';

export interface SliderProps extends Omit<JSX.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  /**
   * 当前值
   */
  value?: number[];
  /**
   * 默认值
   */
  defaultValue?: number[];
  /**
   * 值变化回调
   */
  onValueChange?: (value: number[]) => void;
  /**
   * 最小值
   * @default 0
   */
  min?: number;
  /**
   * 最大值
   * @default 100
   */
  max?: number;
  /**
   * 步长
   * @default 1
   */
  step?: number;
  /**
   * 是否禁用
   * @default false
   */
  disabled?: boolean;
}

export const Slider: Component<SliderProps> = (props) => {
  const [local, others] = splitProps(props, [
    'value',
    'defaultValue',
    'onValueChange',
    'min',
    'max',
    'step',
    'disabled',
    'class',
  ]);

  const [internalValue, setInternalValue] = createSignal<number[]>(
    local.value ?? local.defaultValue ?? [50]
  );

  const isControlled = () => local.value !== undefined;
  const value = () => (isControlled() ? local.value! : internalValue());
  const min = () => local.min ?? 0;
  const max = () => local.max ?? 100;
  const step = () => local.step ?? 1;

  const handleInput = (e: Event) => {
    const target = e.currentTarget as HTMLInputElement;
    const newValue = [parseFloat(target.value)];

    if (!isControlled()) {
      setInternalValue(newValue);
    }
    local.onValueChange?.(newValue);
  };

  const percentage = () => {
    const val = value()[0] ?? min();
    return ((val - min()) / (max() - min())) * 100;
  };

  return (
    <div class={local.class} data-disabled={local.disabled ? '' : undefined}>
      <input
        type="range"
        min={min()}
        max={max()}
        step={step()}
        value={value()[0] ?? min()}
        disabled={local.disabled}
        onInput={handleInput}
        class="w-full"
        style={`--value: ${percentage()}%`}
        {...others}
      />
    </div>
  );
};

