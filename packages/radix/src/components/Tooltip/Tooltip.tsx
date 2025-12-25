import { Component, splitProps, createSignal, createContext, useContext, Show, onCleanup } from 'solid-js';
import { Portal } from 'solid-js/web';
import { isServer } from 'solid-js/web';
import type { JSX } from 'solid-js';

interface TooltipContextValue {
  open: () => boolean;
  setOpen: (open: boolean) => void;
}

const TooltipContext = createContext<TooltipContextValue>();

export const useTooltipContext = () => {
  const context = useContext(TooltipContext);
  if (!context) {
    throw new Error('Tooltip components must be used within Tooltip');
  }
  return context;
};

export interface TooltipProps extends JSX.HTMLAttributes<HTMLDivElement> {
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
   * 延迟显示时间（毫秒）
   * @default 700
   */
  delayDuration?: number;
  /**
   * 子元素
   */
  children?: JSX.Element;
}

export const Tooltip: Component<TooltipProps> = (props) => {
  const [local] = splitProps(props, [
    'open',
    'defaultOpen',
    'onOpenChange',
    'delayDuration',
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

  const contextValue: TooltipContextValue = {
    open,
    setOpen: handleOpenChange,
  };

  return (
    <TooltipContext.Provider value={contextValue}>
      {local.children}
    </TooltipContext.Provider>
  );
};

export interface TooltipTriggerProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /**
   * 子元素
   */
  children?: JSX.Element;
  /**
   * 是否作为子元素传递
   */
  asChild?: boolean;
}

export const TooltipTrigger: Component<TooltipTriggerProps> = (props) => {
  const [local, others] = splitProps(props, ['children', 'asChild', 'class']);
  const context = useTooltipContext();
  let timeoutId: number | undefined;

  const handleMouseEnter = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      context.setOpen(true);
    }, 700) as unknown as number;
  };

  const handleMouseLeave = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    context.setOpen(false);
  };

  onCleanup(() => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  });

  return (
    <div
      class={local.class}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...others}
    >
      {local.children}
    </div>
  );
};

export interface TooltipContentProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /**
   * 子元素
   */
  children?: JSX.Element;
}

export const TooltipContent: Component<TooltipContentProps> = (props) => {
  const [local, others] = splitProps(props, ['class', 'children'] as const);
  const context = useTooltipContext();

  return (
    <Show when={context.open()}>
      <Portal mount={!isServer ? document.body : undefined}>
        <div
          role="tooltip"
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

(Tooltip as any).Trigger = TooltipTrigger;
(Tooltip as any).Content = TooltipContent;

