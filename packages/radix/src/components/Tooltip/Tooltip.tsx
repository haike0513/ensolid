import { Component, splitProps, createSignal, createContext, useContext, Show, onMount, onCleanup, createEffect } from 'solid-js';
import { Portal } from 'solid-js/web';
import { isServer } from 'solid-js/web';
import type { JSX } from 'solid-js';

interface TooltipContextValue {
  open: () => boolean;
  setOpen: (open: boolean) => void;
  triggerRef: () => HTMLElement | undefined;
  setTriggerRef: (ref: HTMLElement | undefined) => void;
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
  const [triggerRef, setTriggerRef] = createSignal<HTMLElement | undefined>();

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
    triggerRef,
    setTriggerRef,
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
  let triggerElement: HTMLDivElement | undefined;
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

  onMount(() => {
    if (triggerElement) {
      context.setTriggerRef(triggerElement);
    }
  });

  onCleanup(() => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  });

  return (
    <div
      ref={triggerElement}
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
  let contentElement: HTMLDivElement | undefined;

  const updatePosition = () => {
    if (!isServer && contentElement && context.triggerRef()) {
      const trigger = context.triggerRef()!;
      const rect = trigger.getBoundingClientRect();
      const contentRect = contentElement.getBoundingClientRect();

      // 默认在触发元素上方显示
      const top = rect.top - contentRect.height - 8;
      const left = rect.left + (rect.width / 2) - (contentRect.width / 2);

      // 检查是否会超出视口
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let finalTop = top;
      let finalLeft = left;

      // 如果上方超出，则在下方显示
      if (top < 0) {
        finalTop = rect.bottom + 8;
      }

      // 如果左侧超出，则左对齐
      if (left < 0) {
        finalLeft = 8;
      }

      // 如果右侧超出，则右对齐
      if (left + contentRect.width > viewportWidth) {
        finalLeft = viewportWidth - contentRect.width - 8;
      }

      contentElement.style.top = `${finalTop}px`;
      contentElement.style.left = `${finalLeft}px`;
    }
  };

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
          role="tooltip"
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

(Tooltip as any).Trigger = TooltipTrigger;
(Tooltip as any).Content = TooltipContent;

