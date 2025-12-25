import { Component, splitProps, createSignal, createContext, useContext, Show, onMount, onCleanup, createEffect } from 'solid-js';
import { Portal, isServer } from 'solid-js/web';
import type { JSX } from 'solid-js';

interface DropdownMenuContextValue {
  open: () => boolean;
  setOpen: (open: boolean) => void;
  triggerRef: () => HTMLElement | undefined;
  setTriggerRef: (ref: HTMLElement | undefined) => void;
  setContentElement: (el: HTMLElement | undefined) => void;
}

const DropdownMenuContext = createContext<DropdownMenuContextValue>();

export const useDropdownMenuContext = () => {
  const context = useContext(DropdownMenuContext);
  if (!context) {
    throw new Error('DropdownMenu components must be used within DropdownMenu');
  }
  return context;
};

export interface DropdownMenuProps extends JSX.HTMLAttributes<HTMLDivElement> {
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

const DropdownMenuBase: Component<DropdownMenuProps> = (props) => {
  const [local] = splitProps(props, [
    'open',
    'defaultOpen',
    'onOpenChange',
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
          handleOpenChange(false);
        }
      }
    }
  };

  // ESC 键关闭
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && open()) {
      handleOpenChange(false);
    }
  };

  createEffect(() => {
    if (!isServer) {
      if (open()) {
        // 延迟添加事件监听器，确保 DOM 已更新
        setTimeout(() => {
          document.addEventListener('keydown', handleKeyDown);
          document.addEventListener('mousedown', handleClickOutside);
        }, 0);
      } else {
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('mousedown', handleClickOutside);
      }
    }
  });

  onCleanup(() => {
    if (!isServer) {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    }
  });

  const contextValue: DropdownMenuContextValue = {
    open,
    setOpen: handleOpenChange,
    triggerRef,
    setTriggerRef,
    setContentElement,
  };

  return (
    <DropdownMenuContext.Provider value={contextValue}>
      {local.children}
    </DropdownMenuContext.Provider>
  );
};

export interface DropdownMenuComponent extends Component<DropdownMenuProps> {
  Trigger: Component<DropdownMenuTriggerProps>;
  Content: Component<DropdownMenuContentProps>;
  Item: Component<DropdownMenuItemProps>;
  Label: Component<DropdownMenuLabelProps>;
  Separator: Component<DropdownMenuSeparatorProps>;
}

export const DropdownMenu = Object.assign(DropdownMenuBase, {
  Trigger: null as unknown as Component<DropdownMenuTriggerProps>,
  Content: null as unknown as Component<DropdownMenuContentProps>,
  Item: null as unknown as Component<DropdownMenuItemProps>,
  Label: null as unknown as Component<DropdownMenuLabelProps>,
  Separator: null as unknown as Component<DropdownMenuSeparatorProps>,
}) as DropdownMenuComponent;

export interface DropdownMenuTriggerProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * 子元素
   */
  children?: JSX.Element;
  /**
   * 是否作为子元素传递
   */
  asChild?: boolean;
}

export const DropdownMenuTrigger: Component<DropdownMenuTriggerProps> = (props) => {
  const [local, others] = splitProps(props, ['children', 'asChild', 'class', 'onClick']);
  const context = useDropdownMenuContext();
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
      ref={triggerElement}
      class={local.class} 
      onClick={handleClick} 
      {...others}
    >
      {local.children}
    </button>
  );
};

export interface DropdownMenuContentProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /**
   * 子元素
   */
  children?: JSX.Element;
}

export const DropdownMenuContent: Component<DropdownMenuContentProps> = (props) => {
  const [local, others] = splitProps(props, ['class', 'children'] as const);
  const context = useDropdownMenuContext();
  let contentElement: HTMLDivElement | undefined;

  const updatePosition = () => {
    if (!isServer && contentElement && context.triggerRef()) {
      const trigger = context.triggerRef()!;
      const rect = trigger.getBoundingClientRect();
      const contentRect = contentElement.getBoundingClientRect();

      // 默认在触发元素下方显示
      const top = rect.bottom + 4;
      const left = rect.left;

      // 检查是否会超出视口
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let finalTop = top;
      let finalLeft = left;

      // 如果右侧超出，则左对齐
      if (left + contentRect.width > viewportWidth) {
        finalLeft = viewportWidth - contentRect.width - 16;
      }

      // 如果下方超出，则在上方显示
      if (top + contentRect.height > viewportHeight) {
        finalTop = rect.top - contentRect.height - 4;
      }

      contentElement.style.top = `${finalTop}px`;
      contentElement.style.left = `${finalLeft}px`;
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
          role="menu"
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

export interface DropdownMenuItemProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /**
   * 子元素
   */
  children?: JSX.Element;
  /**
   * 是否禁用
   * @default false
   */
  disabled?: boolean;
}

export const DropdownMenuItem: Component<DropdownMenuItemProps> = (props) => {
  const [local, others] = splitProps(props, ['children', 'disabled', 'class', 'onClick']);

  const handleClick: JSX.EventHandler<HTMLDivElement, MouseEvent> = (e) => {
    if (local.disabled) {
      e.preventDefault();
      return;
    }
    if (typeof local.onClick === 'function') {
      local.onClick(e);
    }
  };

  return (
    <div
      role="menuitem"
      class={local.class}
      data-disabled={local.disabled ? '' : undefined}
      onClick={handleClick}
      {...others}
    >
      {local.children}
    </div>
  );
};

export interface DropdownMenuLabelProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /**
   * 子元素
   */
  children?: JSX.Element;
}

export const DropdownMenuLabel: Component<DropdownMenuLabelProps> = (props) => {
  const [local, others] = splitProps(props, ['children', 'class'] as const);

  return (
    <div class={local.class} {...others}>
      {local.children}
    </div>
  );
};

export interface DropdownMenuSeparatorProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /**
   * 子元素
   */
  children?: JSX.Element;
}

export const DropdownMenuSeparator: Component<DropdownMenuSeparatorProps> = (props) => {
  const [local, others] = splitProps(props, ['class'] as const);

  return (
    <div
      role="separator"
      class={local.class}
      {...others}
    />
  );
};

DropdownMenu.Trigger = DropdownMenuTrigger;
DropdownMenu.Content = DropdownMenuContent;
DropdownMenu.Item = DropdownMenuItem;
DropdownMenu.Label = DropdownMenuLabel;
DropdownMenu.Separator = DropdownMenuSeparator;

