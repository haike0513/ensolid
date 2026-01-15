import { splitProps, createSignal, createContext, useContext, Show, onMount, onCleanup, createEffect } from 'solid-js';
import { Portal, isServer } from 'solid-js/web';
import type { Component, JSX } from 'solid-js';

interface HoverCardContextValue {
  open: () => boolean;
  setOpen: (open: boolean) => void;
  triggerRef: () => HTMLElement | undefined;
  setTriggerRef: (ref: HTMLElement | undefined) => void;
  setContentElement: (el: HTMLElement | undefined) => void;
  delayDuration: number;
}

const HoverCardContext = createContext<HoverCardContextValue>();

export const useHoverCardContext = () => {
  const context = useContext(HoverCardContext);
  if (!context) {
    throw new Error('HoverCard components must be used within HoverCard');
  }
  return context;
};

export interface HoverCardProps extends JSX.HTMLAttributes<HTMLDivElement> {
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
  openDelay?: number;
  /**
   * 延迟隐藏时间（毫秒）
   * @default 300
   */
  closeDelay?: number;
  /**
   * 子元素
   */
  children?: JSX.Element;
}

const HoverCardBase: Component<HoverCardProps> = (props) => {
  const [local] = splitProps(props, [
    'open',
    'defaultOpen',
    'onOpenChange',
    'openDelay',
    'closeDelay',
    'children',
  ]);

  const [internalOpen, setInternalOpen] = createSignal(
    local.open ?? local.defaultOpen ?? false
  );
  const [triggerRef, setTriggerRef] = createSignal<HTMLElement | undefined>();

  const isControlled = () => local.open !== undefined;
  const open = () => (isControlled() ? local.open! : internalOpen());
  const delayDuration = local.openDelay ?? 700;

  const handleOpenChange = (newOpen: boolean) => {
    if (!isControlled()) {
      setInternalOpen(newOpen);
    }
    local.onOpenChange?.(newOpen);
  };

  // 点击外部关闭
  const setContentElement = (_el: HTMLElement | undefined) => {
    // contentElement reference stored in context
  };

  const contextValue: HoverCardContextValue = {
    open,
    setOpen: handleOpenChange,
    triggerRef,
    setTriggerRef,
    setContentElement,
    delayDuration,
  };

  return (
    <HoverCardContext.Provider value={contextValue}>
      {local.children}
    </HoverCardContext.Provider>
  );
};

export interface HoverCardComponent extends Component<HoverCardProps> {
  Trigger: Component<HoverCardTriggerProps>;
  Content: Component<HoverCardContentProps>;
}

export const HoverCard = Object.assign(HoverCardBase, {
  Trigger: null as unknown as Component<HoverCardTriggerProps>,
  Content: null as unknown as Component<HoverCardContentProps>,
}) as HoverCardComponent;

export interface HoverCardTriggerProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /**
   * 子元素
   */
  children?: JSX.Element;
  /**
   * 是否作为子元素传递
   */
  asChild?: boolean;
}

export const HoverCardTrigger: Component<HoverCardTriggerProps> = (props) => {
  const [local, others] = splitProps(props, ['children', 'asChild', 'class', 'onMouseEnter', 'onMouseLeave']);
  const context = useHoverCardContext();
  let triggerElement: HTMLDivElement | undefined;
  let openTimeoutId: number | undefined;
  let closeTimeoutId: number | undefined;

  const handleMouseEnter: JSX.EventHandler<HTMLDivElement, MouseEvent> = (e) => {
    if (closeTimeoutId) {
      clearTimeout(closeTimeoutId);
      closeTimeoutId = undefined;
    }
    if (typeof local.onMouseEnter === 'function') {
      local.onMouseEnter(e);
    }
    openTimeoutId = setTimeout(() => {
      context.setOpen(true);
    }, context.delayDuration) as unknown as number;
  };

  const handleMouseLeave: JSX.EventHandler<HTMLDivElement, MouseEvent> = (e) => {
    if (openTimeoutId) {
      clearTimeout(openTimeoutId);
      openTimeoutId = undefined;
    }
    if (typeof local.onMouseLeave === 'function') {
      local.onMouseLeave(e);
    }
    closeTimeoutId = setTimeout(() => {
      context.setOpen(false);
    }, 300) as unknown as number;
  };

  onMount(() => {
    if (triggerElement) {
      context.setTriggerRef(triggerElement);
    }
  });

  onCleanup(() => {
    if (openTimeoutId) {
      clearTimeout(openTimeoutId);
    }
    if (closeTimeoutId) {
      clearTimeout(closeTimeoutId);
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

export interface HoverCardContentProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /**
   * 子元素
   */
  children?: JSX.Element;
  /**
   * 显示位置
   */
  side?: 'top' | 'right' | 'bottom' | 'left';
  /**
   * 偏移量
   */
  sideOffset?: number;
  /**
   * 对齐方式
   */
  align?: 'start' | 'center' | 'end';
  /**
   * 对齐偏移量
   */
  alignOffset?: number;
}

export const HoverCardContent: Component<HoverCardContentProps> = (props) => {
  const [local, others] = splitProps(props, ['class', 'children'] as const);
  const context = useHoverCardContext();
  let contentElement: HTMLDivElement | undefined;
  let closeTimeoutId: number | undefined;

  const updatePosition = () => {
    if (!isServer && contentElement && context.triggerRef()) {
      const trigger = context.triggerRef()!;
      const rect = trigger.getBoundingClientRect();
      const contentRect = contentElement.getBoundingClientRect();

      // 默认在触发元素下方显示
      const top = rect.bottom + 8;
      const left = rect.left + (rect.width / 2) - (contentRect.width / 2);

      // 检查是否会超出视口
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let finalTop = top;
      let finalLeft = left;

      // 如果左侧超出，则左对齐
      if (left < 0) {
        finalLeft = 16;
      }

      // 如果右侧超出，则右对齐
      if (left + contentRect.width > viewportWidth) {
        finalLeft = viewportWidth - contentRect.width - 16;
      }

      // 如果下方超出，则在上方显示
      if (top + contentRect.height > viewportHeight) {
        finalTop = rect.top - contentRect.height - 8;
      }

      contentElement.style.top = `${finalTop}px`;
      contentElement.style.left = `${finalLeft}px`;
    }
  };

  const handleMouseEnter = () => {
    if (closeTimeoutId) {
      clearTimeout(closeTimeoutId);
      closeTimeoutId = undefined;
    }
  };

  const handleMouseLeave = () => {
    closeTimeoutId = setTimeout(() => {
      context.setOpen(false);
    }, 300) as unknown as number;
  };

  onMount(() => {
    if (contentElement) {
      context.setContentElement(contentElement);
    }
  });

  onCleanup(() => {
    if (closeTimeoutId) {
      clearTimeout(closeTimeoutId);
    }
  });

  createEffect(() => {
    if (context.open() && !isServer) {
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
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          {...others}
        >
          {local.children}
        </div>
      </Portal>
    </Show>
  );
};

HoverCard.Trigger = HoverCardTrigger;
HoverCard.Content = HoverCardContent;

