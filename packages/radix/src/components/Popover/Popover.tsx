import { Component, splitProps, createSignal, createContext, useContext, Show, onMount, onCleanup, createEffect } from 'solid-js';
import { Portal } from 'solid-js/web';
import { isServer } from 'solid-js/web';
import type { JSX } from 'solid-js';

interface PopoverContextValue {
  open: () => boolean;
  setOpen: (open: boolean) => void;
}

const PopoverContext = createContext<PopoverContextValue>();

export const usePopoverContext = () => {
  const context = useContext(PopoverContext);
  if (!context) {
    throw new Error('Popover components must be used within Popover');
  }
  return context;
};

export interface PopoverProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /**
   * 是否打开
   */
  open?: boolean;
  /**
   * 默认打开状态
   */
  defaultOpen?: boolean;
  /**
   * 打开状态变化回调
   */
  onOpenChange?: (open: boolean) => void;
  /**
   * 子元素
   */
  children?: JSX.Element;
}

export const Popover: Component<PopoverProps> = (props) => {
  const [local] = splitProps(props, [
    'open',
    'defaultOpen',
    'onOpenChange',
    'children',
  ]);

  const [internalOpen, setInternalOpen] = createSignal(
    local.open ?? local.defaultOpen ?? false
  );

  const isControlled = () => local.open !== undefined;
  const open = () => (isControlled() ? local.open! : internalOpen());

  const handleOpenChange = (newOpen: boolean) => {
    if (!isControlled()) {
      setInternalOpen(newOpen);
    }
    local.onOpenChange?.(newOpen);
  };

  // 点击外部关闭
  const handleClickOutside = () => {
    if (open() && !isServer) {
      // 这里需要检查点击是否在 Popover 外部
      // 简化实现，实际需要更复杂的逻辑
    }
  };

  onMount(() => {
    if (!isServer && open()) {
      document.addEventListener('mousedown', handleClickOutside);
    }
  });

  createEffect(() => {
    if (!isServer) {
      if (open()) {
        document.addEventListener('mousedown', handleClickOutside);
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

  const contextValue: PopoverContextValue = {
    open,
    setOpen: handleOpenChange,
  };

  return (
    <PopoverContext.Provider value={contextValue}>
      {local.children}
    </PopoverContext.Provider>
  );
};

export interface PopoverTriggerProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * 子元素
   */
  children?: JSX.Element;
  /**
   * 是否作为子元素传递
   */
  asChild?: boolean;
}

export const PopoverTrigger: Component<PopoverTriggerProps> = (props) => {
  const [local, others] = splitProps(props, ['children', 'asChild', 'class', 'onClick']);
  const context = usePopoverContext();

  const handleClick: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (e) => {
    if (typeof local.onClick === 'function') {
      local.onClick(e);
    }
    context.setOpen(!context.open());
  };

  return (
    <button type="button" class={local.class} onClick={handleClick} {...others}>
      {local.children}
    </button>
  );
};

export interface PopoverContentProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /**
   * 子元素
   */
  children?: JSX.Element;
}

export const PopoverContent: Component<PopoverContentProps> = (props) => {
  const [local, others] = splitProps(props, ['class', 'children'] as const);
  const context = usePopoverContext();

  return (
    <Show when={context.open()}>
      <Portal mount={!isServer ? document.body : undefined}>
        <div
          role="dialog"
          class={local.class}
          data-state={context.open() ? 'open' : 'closed'}
          {...others}
        >
          {local.children}
        </div>
      </Portal>
    </Show>
  );
};

(Popover as any).Trigger = PopoverTrigger;
(Popover as any).Content = PopoverContent;

