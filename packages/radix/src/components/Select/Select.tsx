import { splitProps, createSignal, createContext, useContext, Show, onMount, createEffect, onCleanup } from 'solid-js';
import { Portal } from 'solid-js/web';
import { isServer } from 'solid-js/web';
import type { Component, JSX } from 'solid-js';

interface SelectContextValue {
  value: () => string | undefined;
  setValue: (value: string) => void;
  open: () => boolean;
  setOpen: (open: boolean) => void;
  triggerRef: () => HTMLElement | undefined;
  setTriggerRef: (ref: HTMLElement | undefined) => void;
  setContentElement: (el: HTMLElement | undefined) => void;
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

const SelectBase: Component<SelectProps> = (props) => {
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
  const [triggerRef, setTriggerRef] = createSignal<HTMLElement | undefined>();

  const isControlled = () => local.value !== undefined;
  const value = () => (isControlled() ? local.value : internalValue());

  const handleValueChange = (newValue: string) => {
    if (!isControlled()) {
      setInternalValue(newValue);
    }
    local.onValueChange?.(newValue);
    setOpen(false);
  };

  // 点击外部关闭
  let contentElement: HTMLElement | undefined;
  const setContentElement = (el: HTMLElement | undefined) => {
    contentElement = el;
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (open() && !isServer) {
      const target = e.target as HTMLElement;
      const trigger = triggerRef();

      if (trigger && contentElement) {
        if (!trigger.contains(target) && !contentElement.contains(target)) {
          setOpen(false);
        }
      }
    }
  };

  createEffect(() => {
    if (!isServer) {
      if (open()) {
        // 延迟添加事件监听器，确保 DOM 已更新
        setTimeout(() => {
          document.addEventListener('mousedown', handleClickOutside);
        }, 0);
      } else {
        document.removeEventListener('mousedown', handleClickOutside);
      }
    }
  });

  onCleanup(() => {
    if (!isServer) {
      document.removeEventListener('mousedown', handleClickOutside);
    }
  });

  const contextValue: SelectContextValue = {
    value,
    setValue: handleValueChange,
    open,
    setOpen,
    triggerRef,
    setTriggerRef,
    setContentElement,
  };

  return (
    <SelectContext.Provider value={contextValue}>
      {local.children}
    </SelectContext.Provider>
  );
};

export interface SelectComponent extends Component<SelectProps> {
  Trigger: Component<SelectTriggerProps>;
  Value: Component<SelectValueProps>;
  Content: Component<SelectContentProps>;
  Item: Component<SelectItemProps>;
}

export const Select = Object.assign(SelectBase, {
  Trigger: null as unknown as Component<SelectTriggerProps>,
  Value: null as unknown as Component<SelectValueProps>,
  Content: null as unknown as Component<SelectContentProps>,
  Item: null as unknown as Component<SelectItemProps>,
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
  let triggerElement: HTMLButtonElement | undefined;

  const handleClick: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (e) => {
    if (typeof local.onClick === 'function') {
      local.onClick(e);
    }
    context.setOpen(!context.open());
  };

  onMount(() => {
    if (triggerElement) {
      context.setTriggerRef(triggerElement);
    }
  });

  return (
    <button
      type="button"
      role="combobox"
      ref={triggerElement}
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
  let contentElement: HTMLDivElement | undefined;

  const updatePosition = () => {
    if (!isServer && contentElement && context.triggerRef()) {
      const trigger = context.triggerRef()!;
      const rect = trigger.getBoundingClientRect();
      const contentRect = contentElement.getBoundingClientRect();

      // 默认在触发元素下方显示，宽度与触发元素相同
      const top = rect.bottom + 4;
      const left = rect.left;
      const width = rect.width;

      // 检查是否会超出视口
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let finalTop = top;
      let finalLeft = left;

      // 如果右侧超出，则左对齐
      if (left + width > viewportWidth) {
        finalLeft = viewportWidth - width - 16;
      }

      // 如果下方超出，则在上方显示
      if (top + contentRect.height > viewportHeight) {
        finalTop = rect.top - contentRect.height - 4;
      }

      contentElement.style.top = `${finalTop}px`;
      contentElement.style.left = `${finalLeft}px`;
      contentElement.style.width = `${width}px`;
    }
  };

  onMount(() => {
    if (contentElement) {
      context.setContentElement(contentElement);
    }
  });

  createEffect(() => {
    if (context.open() && !isServer) {
      // 延迟一帧确保 DOM 已渲染
      requestAnimationFrame(() => {
        updatePosition();
      });
    }
  });

  return (
    <Show when={context.open()}>
      <Portal mount={!isServer ? document.body : undefined}>
        <div
          ref={contentElement}
          role="listbox"
          class={`fixed z-50 ${local.class || ''}`}
          data-state={context.open() ? 'open' : 'closed'}
          style={{ top: '0px', left: '0px' }}
          {...others}
        >
          {local.children}
        </div>
      </Portal>
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

Select.Trigger = SelectTrigger;
Select.Value = SelectValue;
Select.Content = SelectContent;
Select.Item = SelectItem;

