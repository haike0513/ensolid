import { Component, splitProps, createSignal, createContext, useContext, Show } from 'solid-js';
import type { JSX } from 'solid-js';

interface SelectContextValue {
  value: () => string | undefined;
  setValue: (value: string) => void;
  open: () => boolean;
  setOpen: (open: boolean) => void;
}

const SelectContext = createContext<SelectContextValue>();

export const useSelectContext = () => {
  const context = useContext(SelectContext);
  if (!context) {
    throw new Error('Select components must be used within Select');
  }
  return context;
};

export interface SelectProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /**
   * 选中的值
   */
  value?: string;
  /**
   * 默认选中的值
   */
  defaultValue?: string;
  /**
   * 值变化回调
   */
  onValueChange?: (value: string) => void;
  /**
   * 是否禁用
   * @default false
   */
  disabled?: boolean;
  /**
   * 子元素
   */
  children?: JSX.Element;
}

export const Select: Component<SelectProps> = (props) => {
  const [local] = splitProps(props, [
    'value',
    'defaultValue',
    'onValueChange',
    'disabled',
    'children',
  ]);

  const [internalValue, setInternalValue] = createSignal<string | undefined>(
    local.value ?? local.defaultValue
  );
  const [open, setOpen] = createSignal(false);

  const isControlled = () => local.value !== undefined;
  const value = () => (isControlled() ? local.value : internalValue());

  const handleValueChange = (newValue: string) => {
    if (!isControlled()) {
      setInternalValue(newValue);
    }
    local.onValueChange?.(newValue);
    setOpen(false);
  };

  const contextValue: SelectContextValue = {
    value,
    setValue: handleValueChange,
    open,
    setOpen,
  };

  return (
    <SelectContext.Provider value={contextValue}>
      {local.children}
    </SelectContext.Provider>
  );
};

export interface SelectTriggerProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * 子元素
   */
  children?: JSX.Element;
}

export const SelectTrigger: Component<SelectTriggerProps> = (props) => {
  const [local, others] = splitProps(props, ['children', 'class', 'onClick']);
  const context = useSelectContext();

  const handleClick: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (e) => {
    if (typeof local.onClick === 'function') {
      local.onClick(e);
    }
    context.setOpen(!context.open());
  };

  return (
    <button
      type="button"
      role="combobox"
      class={local.class}
      onClick={handleClick}
      aria-expanded={context.open()}
      data-state={context.open() ? 'open' : 'closed'}
      {...others}
    >
      {local.children}
    </button>
  );
};

export interface SelectValueProps extends JSX.HTMLAttributes<HTMLSpanElement> {
  /**
   * 占位符文本
   */
  placeholder?: string;
}

export const SelectValue: Component<SelectValueProps> = (props) => {
  const [local, others] = splitProps(props, ['placeholder', 'class']);
  const context = useSelectContext();

  return (
    <span class={local.class} {...others}>
      {context.value() ?? local.placeholder ?? 'Select...'}
    </span>
  );
};

export interface SelectContentProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /**
   * 子元素
   */
  children?: JSX.Element;
}

export const SelectContent: Component<SelectContentProps> = (props) => {
  const [local, others] = splitProps(props, ['class', 'children'] as const);
  const context = useSelectContext();

  return (
    <Show when={context.open()}>
      <div
        role="listbox"
        class={local.class}
        data-state={context.open() ? 'open' : 'closed'}
        {...others}
      >
        {local.children}
      </div>
    </Show>
  );
};

export interface SelectItemProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /**
   * 选项的值
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
}

export const SelectItem: Component<SelectItemProps> = (props) => {
  const [local, others] = splitProps(props, ['value', 'disabled', 'children', 'class', 'onClick']);
  const context = useSelectContext();

  const isSelected = () => context.value() === local.value;

  const handleClick: JSX.EventHandler<HTMLDivElement, MouseEvent> = (e) => {
    if (local.disabled) {
      e.preventDefault();
      return;
    }
    if (typeof local.onClick === 'function') {
      local.onClick(e);
    }
    context.setValue(local.value);
  };

  return (
    <div
      role="option"
      class={local.class}
      data-selected={isSelected() ? '' : undefined}
      data-disabled={local.disabled ? '' : undefined}
      onClick={handleClick}
      {...others}
    >
      {local.children}
    </div>
  );
};

(Select as any).Trigger = SelectTrigger;
(Select as any).Value = SelectValue;
(Select as any).Content = SelectContent;
(Select as any).Item = SelectItem;

