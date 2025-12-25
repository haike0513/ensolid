import { splitProps, Component, JSX, createSignal } from 'solid-js';

export interface SliderProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /**
   * Slider 的根元素
   */
  slotProps?: {
    root?: JSX.HTMLAttributes<HTMLDivElement>;
    input?: JSX.InputHTMLAttributes<HTMLInputElement>;
    track?: JSX.HTMLAttributes<HTMLDivElement>;
    thumb?: JSX.HTMLAttributes<HTMLSpanElement>;
  };
  /**
   * 当前值（受控）
   */
  value?: number | number[];
  /**
   * 默认值（非受控）
   */
  defaultValue?: number | number[];
  /**
   * 值变化回调
   */
  onValueChange?: (value: number | number[]) => void;
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
   */
  disabled?: boolean;
  /**
   * 是否只读
   */
  readOnly?: boolean;
  /**
   * 是否显示标记
   */
  marks?: boolean | Array<{ value: number; label?: string }>;
  /**
   * 方向
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical';
  /**
   * 是否反向
   */
  reverse?: boolean;
}

export const Slider: Component<SliderProps> = (props) => {
  const [local, inputProps, others] = splitProps(
    props,
    [
      'value',
      'defaultValue',
      'onValueChange',
      'min',
      'max',
      'step',
      'disabled',
      'readOnly',
      'marks',
      'orientation',
      'reverse',
      'slotProps',
      'class',
    ],
    ['onchange', 'onInput']
  );

  const min = () => local.min ?? 0;
  const max = () => local.max ?? 100;
  const step = () => local.step ?? 1;
  const orientation = () => local.orientation ?? 'horizontal';
  const reverse = () => local.reverse ?? false;

  const isControlled = () => local.value !== undefined;
  const defaultValue = () => {
    if (Array.isArray(local.defaultValue)) {
      return local.defaultValue;
    }
    return local.defaultValue ?? min();
  };
  const [internalValue, setInternalValue] = createSignal<number | number[]>(defaultValue());

  const value = () => (isControlled() ? local.value ?? min() : internalValue());

  const handleInput: JSX.EventHandler<HTMLInputElement, InputEvent> = (e) => {
    const newValue = Number(e.currentTarget.value);
    if (!isControlled()) {
      setInternalValue(newValue);
    }
    local.onValueChange?.(newValue);
    if (typeof (inputProps as any).onInput === 'function') {
      (inputProps as any).onInput(e);
    }
  };

  const handleChange: JSX.EventHandler<HTMLInputElement, Event> = (e) => {
    if (typeof (inputProps as any).onchange === 'function') {
      (inputProps as any).onchange(e);
    }
  };

  const getPercentage = (val: number) => {
    return ((val - min()) / (max() - min())) * 100;
  };

  const currentValue = () => {
    const val = value();
    return Array.isArray(val) ? val[0] : val;
  };

  const percentage = () => getPercentage(currentValue());

  const rootSlotProps = () => local.slotProps?.root ?? {};
  const inputSlotProps = () => local.slotProps?.input ?? {};
  const trackSlotProps = () => local.slotProps?.track ?? {};
  const thumbSlotProps = () => local.slotProps?.thumb ?? {};

  return (
    <div
      class={local.class}
      data-disabled={local.disabled ? '' : undefined}
      data-readonly={local.readOnly ? '' : undefined}
      data-orientation={orientation()}
      data-reverse={reverse() ? '' : undefined}
      {...rootSlotProps()}
      {...others}
    >
      <input
        type="range"
        min={min()}
        max={max()}
        step={step()}
        value={currentValue()}
        disabled={local.disabled}
        readOnly={local.readOnly}
        onInput={handleInput}
        onChange={handleChange}
        {...inputSlotProps()}
      />
      <div data-track style={{ '--percentage': `${percentage()}%` }} {...trackSlotProps()}>
        <span
          data-thumb
          style={{
            [orientation() === 'horizontal' ? 'left' : 'bottom']: `${percentage()}%`,
          }}
          {...thumbSlotProps()}
        />
      </div>
    </div>
  );
};

