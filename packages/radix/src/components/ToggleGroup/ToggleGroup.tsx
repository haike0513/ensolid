import { splitProps, createSignal, createContext, useContext } from 'solid-js';
import type { Component, JSX } from 'solid-js';

interface ToggleGroupContextValue {
  value: () => string | string[] | undefined;
  setValue: (value: string) => void;
  type: 'single' | 'multiple';
  disabled?: boolean;
}

const ToggleGroupContext = createContext<ToggleGroupContextValue>();

export const useToggleGroupContext = () => {
  const context = useContext(ToggleGroupContext);
  if (!context) {
    throw new Error('ToggleGroup.Item must be used within ToggleGroup');
  }
  return context;
};

export interface ToggleGroupProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /**
   * 当前选中的值（单个或数组）
   */
  value?: string | string[];
  /**
   * 默认选中的值
   */
  defaultValue?: string | string[];
  /**
   * 值变化回调
   */
  onValueChange?: (value: string | string[]) => void;
  /**
   * 类型：单个或多个
   * @default 'single'
   */
  type?: 'single' | 'multiple';
  /**
   * 是否禁用
   * @default false
   */
  disabled?: boolean;
  /**
   * 是否不允许取消选中（仅 single 类型）
   * @default false
   */
  rovingFocus?: boolean;
  /**
   * 子元素
   */
  children?: JSX.Element;
}

const ToggleGroupBase: Component<ToggleGroupProps> = (props) => {
  const [local, others] = splitProps(props, [
    'value',
    'defaultValue',
    'onValueChange',
    'type',
    'disabled',
    'rovingFocus',
    'class',
    'children',
  ]);

  const type = () => local.type ?? 'single';

  const [internalValue, setInternalValue] = createSignal<string | string[] | undefined>(
    local.value ?? local.defaultValue
  );

  const isControlled = () => local.value !== undefined;
  const value = () => (isControlled() ? local.value : internalValue());

  const handleValueChange = (itemValue: string) => {
    if (local.disabled) return;

    const currentValue = value();
    let newValue: string | string[];

    if (type() === 'single') {
      // 单个模式：如果点击的是已选中的项，则取消选中；否则选中该项
      if (currentValue === itemValue && local.rovingFocus !== true) {
        newValue = '';
      } else {
        newValue = itemValue;
      }
    } else {
      // 多个模式：切换该项的选中状态
      const currentArray = Array.isArray(currentValue) ? currentValue : currentValue ? [currentValue] : [];
      const index = currentArray.indexOf(itemValue);
      if (index > -1) {
        newValue = currentArray.filter((v) => v !== itemValue);
      } else {
        newValue = [...currentArray, itemValue];
      }
    }

    if (!isControlled()) {
      setInternalValue(newValue);
    }
    local.onValueChange?.(newValue);
  };

  const contextValue: ToggleGroupContextValue = {
    value,
    setValue: handleValueChange,
    type: type(),
    disabled: local.disabled,
  };

  return (
    <ToggleGroupContext.Provider value={contextValue}>
      <div
        class={local.class}
        role="group"
        data-disabled={local.disabled ? '' : undefined}
        {...others}
      >
        {local.children}
      </div>
    </ToggleGroupContext.Provider>
  );
};

export interface ToggleGroupComponent extends Component<ToggleGroupProps> {
  Item: Component<ToggleGroupItemProps>;
}

export const ToggleGroup = Object.assign(ToggleGroupBase, {
  Item: null as unknown as Component<ToggleGroupItemProps>,
}) as ToggleGroupComponent;

export interface ToggleGroupItemProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * 项的值
   */
  value: string;
  /**
   * 是否禁用
   * @default false
   */
  disabled?: boolean;
  /**
   * 子元素
   */
  children?: JSX.Element;
  /**
   * 是否作为子元素传递
   */
  asChild?: boolean;
}

export const ToggleGroupItem: Component<ToggleGroupItemProps> = (props) => {
  const [local, others] = splitProps(props, [
    'value',
    'disabled',
    'asChild',
    'children',
    'class',
    'onClick',
  ]);
  const context = useToggleGroupContext();

  const isSelected = () => {
    const currentValue = context.value();
    if (context.type === 'single') {
      return currentValue === local.value;
    } else {
      const currentArray = Array.isArray(currentValue) ? currentValue : [];
      return currentArray.includes(local.value);
    }
  };

  const handleClick: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (e) => {
    if (typeof local.onClick === 'function') {
      local.onClick(e);
    }
    if (!local.disabled && !context.disabled) {
      context.setValue(local.value);
    }
  };

  return (
    <button
      type="button"
      role="button"
      class={local.class}
      disabled={local.disabled || context.disabled}
      onClick={handleClick}
      aria-pressed={isSelected()}
      data-state={isSelected() ? 'on' : 'off'}
      data-disabled={local.disabled || context.disabled ? '' : undefined}
      {...others}
    >
      {local.children}
    </button>
  );
};

ToggleGroup.Item = ToggleGroupItem;

