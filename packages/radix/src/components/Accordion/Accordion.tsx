import { splitProps, createSignal, createContext, useContext } from 'solid-js';
import type { Component, JSX } from 'solid-js';

interface AccordionContextValue {
  value: () => string | string[] | undefined;
  setValue: (value: string) => void;
  type: 'single' | 'multiple';
  collapsible: boolean;
  isItemOpen: (itemValue: string) => boolean;
}

const AccordionContext = createContext<AccordionContextValue>();
const AccordionItemContext = createContext<{ value: string; disabled?: boolean }>();

export const useAccordionContext = () => {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error('Accordion components must be used within Accordion');
  }
  return context;
};

export const useAccordionItemContext = () => {
  const context = useContext(AccordionItemContext);
  if (!context) {
    throw new Error('Accordion.Trigger and Accordion.Content must be used within Accordion.Item');
  }
  return context;
};

export interface AccordionProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /**
   * 当前打开的值（单个或数组）
   */
  value?: string | string[];
  /**
   * 默认打开的值
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
   * 是否可折叠（仅 single 类型）
   * @default false
   */
  collapsible?: boolean;
  /**
   * 子元素
   */
  children?: JSX.Element;
}

const AccordionBase: Component<AccordionProps> = (props) => {
  const [local, others] = splitProps(props, [
    'value',
    'defaultValue',
    'onValueChange',
    'type',
    'collapsible',
    'class',
    'children',
  ]);

  const type = () => local.type ?? 'single';
  const collapsible = () => local.collapsible ?? false;

  const [internalValue, setInternalValue] = createSignal<string | string[] | undefined>(
    local.value ?? local.defaultValue
  );

  const isControlled = () => local.value !== undefined;
  const value = () => (isControlled() ? local.value : internalValue());

  const handleValueChange = (itemValue: string) => {
    const currentValue = value();
    let newValue: string | string[];

    if (type() === 'single') {
      // 单个模式：如果点击的是已打开的项且可折叠，则关闭；否则打开该项
      if (collapsible() && currentValue === itemValue) {
        newValue = '';
      } else {
        newValue = itemValue;
      }
    } else {
      // 多个模式：切换该项的打开状态
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

  const isItemOpen = (itemValue: string) => {
    const currentValue = value();
    if (type() === 'single') {
      return currentValue === itemValue;
    } else {
      const currentArray = Array.isArray(currentValue) ? currentValue : [];
      return currentArray.includes(itemValue);
    }
  };

  const contextValue: AccordionContextValue = {
    value,
    setValue: handleValueChange,
    type: type(),
    collapsible: collapsible(),
    isItemOpen,
  };

  return (
    <AccordionContext.Provider value={contextValue}>
      <div class={local.class} {...others}>
        {local.children}
      </div>
    </AccordionContext.Provider>
  );
};

export interface AccordionComponent extends Component<AccordionProps> {
  Item: Component<AccordionItemProps>;
  Trigger: Component<AccordionTriggerProps>;
  Content: Component<AccordionContentProps>;
}

export const Accordion = Object.assign(AccordionBase, {
  Item: null as unknown as Component<AccordionItemProps>,
  Trigger: null as unknown as Component<AccordionTriggerProps>,
  Content: null as unknown as Component<AccordionContentProps>,
}) as AccordionComponent;

export interface AccordionItemProps extends JSX.HTMLAttributes<HTMLDivElement> {
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
}

export const AccordionItem: Component<AccordionItemProps> = (props) => {
  const [local, others] = splitProps(props, ['value', 'disabled', 'children', 'class']);
  const context = useAccordionContext();

  const isOpen = () => context.isItemOpen(local.value);

  const itemContext = {
    value: local.value,
    disabled: local.disabled,
  };

  return (
    <AccordionItemContext.Provider value={itemContext}>
      <div
        class={local.class}
        data-state={isOpen() ? 'open' : 'closed'}
        data-disabled={local.disabled ? '' : undefined}
        {...others}
      >
        {local.children}
      </div>
    </AccordionItemContext.Provider>
  );
};

export interface AccordionTriggerProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * 子元素
   */
  children?: JSX.Element;
}

export const AccordionTrigger: Component<AccordionTriggerProps> = (props) => {
  const [local, others] = splitProps(props, ['children', 'class', 'onClick']);
  const context = useAccordionContext();
  const itemContext = useAccordionItemContext();

  const isOpen = () => context.isItemOpen(itemContext.value);

  const handleClick: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (e) => {
    if (typeof local.onClick === 'function') {
      local.onClick(e);
    }
    if (!itemContext.disabled) {
      context.setValue(itemContext.value);
    }
  };

  return (
    <button
      type="button"
      class={local.class}
      onClick={handleClick}
      disabled={itemContext.disabled}
      aria-expanded={isOpen()}
      aria-controls={`accordion-content-${itemContext.value}`}
      data-state={isOpen() ? 'open' : 'closed'}
      data-disabled={itemContext.disabled ? '' : undefined}
      {...others}
    >
      {local.children}
    </button>
  );
};

export interface AccordionContentProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /**
   * 子元素
   */
  children?: JSX.Element;
}

export const AccordionContent: Component<AccordionContentProps> = (props) => {
  const [local, others] = splitProps(props, ['children', 'class']);
  const context = useAccordionContext();
  const itemContext = useAccordionItemContext();

  const isOpen = () => context.isItemOpen(itemContext.value);

  return (
    <div
      id={`accordion-content-${itemContext.value}`}
      class={local.class}
      hidden={!isOpen()}
      data-state={isOpen() ? 'open' : 'closed'}
      {...others}
    >
      {isOpen() && local.children}
    </div>
  );
};

Accordion.Item = AccordionItem;
Accordion.Trigger = AccordionTrigger;
Accordion.Content = AccordionContent;

