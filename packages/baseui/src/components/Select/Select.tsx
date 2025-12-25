import { splitProps, Component, JSX, createSignal, createContext, useContext, Show } from 'solid-js';

interface SelectContextValue {
  value: () => string | string[] | undefined;
  setValue: (value: string) => void;
  multiple: () => boolean;
  disabled: () => boolean;
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
   * 选中的值（受控）
   */
  value?: string | string[];
  /**
   * 默认选中的值（非受控）
   */
  defaultValue?: string | string[];
  /**
   * 值变化回调
   */
  onValueChange?: (value: string | string[]) => void;
  /**
   * 是否多选
   */
  multiple?: boolean;
  /**
   * 是否禁用
   */
  disabled?: boolean;
  /**
   * 是否必填
   */
  required?: boolean;
  /**
   * 占位符
   */
  placeholder?: string;
  /**
   * 子元素
   */
  children?: JSX.Element;
}

const SelectBase: Component<SelectProps> = (props) => {
  const [local, others] = splitProps(props, [
    'value',
    'defaultValue',
    'onValueChange',
    'multiple',
    'disabled',
    'required',
    'placeholder',
    'class',
    'children',
  ]);

  const multiple = () => local.multiple ?? false;
  const disabled = () => local.disabled ?? false;

  const isControlled = () => local.value !== undefined;
  const [internalValue, setInternalValue] = createSignal<string | string[] | undefined>(
    local.value ?? local.defaultValue
  );
  const [open, setOpen] = createSignal(false);

  const value = () => (isControlled() ? local.value : internalValue());

  const handleValueChange = (newValue: string) => {
    let updatedValue: string | string[];

    if (multiple()) {
      const currentVal = value();
      const currentArray: string[] = Array.isArray(currentVal) ? currentVal : currentVal ? [currentVal as string] : [];
      const index = currentArray.indexOf(newValue);
      if (index > -1) {
        updatedValue = currentArray.filter((v: string) => v !== newValue);
      } else {
        updatedValue = [...currentArray, newValue];
      }
    } else {
      updatedValue = newValue;
      setOpen(false);
    }

    if (!isControlled()) {
      setInternalValue(updatedValue);
    }
    local.onValueChange?.(updatedValue);
  };

  const contextValue: SelectContextValue = {
    value,
    setValue: handleValueChange,
    multiple,
    disabled,
    open,
    setOpen,
  };

  return (
    <SelectContext.Provider value={contextValue}>
      <div
        class={local.class}
        data-disabled={disabled() ? '' : undefined}
        data-open={open() ? '' : undefined}
        data-multiple={multiple() ? '' : undefined}
        {...others}
      >
        {local.children}
      </div>
    </SelectContext.Provider>
  );
};

export interface SelectComponent extends Component<SelectProps> {
  Trigger: Component<SelectTriggerProps>;
  Listbox: Component<SelectListboxProps>;
  Option: Component<SelectOptionProps>;
}

export const Select = Object.assign(SelectBase, {
  Trigger: null as unknown as Component<SelectTriggerProps>,
  Listbox: null as unknown as Component<SelectListboxProps>,
  Option: null as unknown as Component<SelectOptionProps>,
}) as SelectComponent;

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
    if (!context.disabled()) {
      context.setOpen(!context.open());
    }
  };

  const displayValue = () => {
    const val = context.value();
    if (context.multiple()) {
      return Array.isArray(val) && val.length > 0 ? val.join(', ') : '';
    }
    return val ? String(val) : '';
  };

  return (
    <button
      type="button"
      class={local.class}
      disabled={context.disabled()}
      onClick={handleClick}
      aria-expanded={context.open()}
      aria-haspopup="listbox"
      data-open={context.open() ? '' : undefined}
      {...others}
    >
      {displayValue() || local.children}
    </button>
  );
};

export interface SelectListboxProps extends JSX.HTMLAttributes<HTMLUListElement> {
  /**
   * 子元素
   */
  children?: JSX.Element;
}

export const SelectListbox: Component<SelectListboxProps> = (props) => {
  const [local, others] = splitProps(props, ['children', 'class']);
  const context = useSelectContext();

  return (
    <Show when={context.open()}>
      <ul
        role="listbox"
        class={local.class}
        data-open={context.open() ? '' : undefined}
        aria-multiselectable={context.multiple() ? 'true' : undefined}
        {...others}
      >
        {local.children}
      </ul>
    </Show>
  );
};

export interface SelectOptionProps extends JSX.LiHTMLAttributes<HTMLLIElement> {
  /**
   * 选项的值
   */
  value: string;
  /**
   * 是否禁用
   */
  disabled?: boolean;
  /**
   * 子元素
   */
  children?: JSX.Element;
}

export const SelectOption: Component<SelectOptionProps> = (props) => {
  const [local, others] = splitProps(props, ['value', 'disabled', 'children', 'class', 'onClick']);
  const context = useSelectContext();

  const isSelected = () => {
    const val = context.value();
    if (context.multiple()) {
      return Array.isArray(val) && val.includes(local.value);
    }
    return val === local.value;
  };

  const handleClick: JSX.EventHandler<HTMLLIElement, MouseEvent> = (e) => {
    if (typeof local.onClick === 'function') {
      local.onClick(e);
    }
    if (!local.disabled && !context.disabled()) {
      context.setValue(local.value);
    }
  };

  return (
    <li
      role="option"
      class={local.class}
      data-selected={isSelected() ? '' : undefined}
      data-disabled={local.disabled ? '' : undefined}
      aria-selected={isSelected()}
      onClick={handleClick}
      {...others}
    >
      {local.children}
    </li>
  );
};

Select.Trigger = SelectTrigger;
Select.Listbox = SelectListbox;
Select.Option = SelectOption;

