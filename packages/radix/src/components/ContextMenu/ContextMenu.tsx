import { splitProps, createSignal, createContext, useContext, Show, onMount, onCleanup, createEffect } from 'solid-js';
import { Portal, isServer } from 'solid-js/web';
import type { Component, JSX } from 'solid-js';

interface ContextMenuContextValue {
  open: () => boolean;
  setOpen: (open: boolean) => void;
  triggerRef: () => HTMLElement | undefined;
  setTriggerRef: (ref: HTMLElement | undefined) => void;
  setContentElement: (el: HTMLElement | undefined) => void;
  position: () => { x: number; y: number } | undefined;
  setPosition: (pos: { x: number; y: number } | undefined) => void;
}

const ContextMenuContext = createContext<ContextMenuContextValue>();

export const useContextMenuContext = () => {
  const context = useContext(ContextMenuContext);
  if (!context) {
    throw new Error('ContextMenu components must be used within ContextMenu');
  }
  return context;
};

export interface ContextMenuProps extends JSX.HTMLAttributes<HTMLDivElement> {
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

const ContextMenuBase: Component<ContextMenuProps> = (props) => {
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
  const [position, setPosition] = createSignal<{ x: number; y: number } | undefined>();

  const isControlled = () => local.open !== undefined;
  const open = () => (isControlled() ? local.open! : internalOpen());

  const handleOpenChange = (newOpen: boolean) => {
    if (!isControlled()) {
      setInternalOpen(newOpen);
    }
    if (!newOpen) {
      setPosition(undefined);
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

  const contextValue: ContextMenuContextValue = {
    open,
    setOpen: handleOpenChange,
    triggerRef,
    setTriggerRef,
    setContentElement,
    position,
    setPosition,
  };

  return (
    <ContextMenuContext.Provider value={contextValue}>
      {local.children}
    </ContextMenuContext.Provider>
  );
};

export interface ContextMenuComponent extends Component<ContextMenuProps> {
  Trigger: Component<ContextMenuTriggerProps>;
  Content: Component<ContextMenuContentProps>;
  Item: Component<ContextMenuItemProps>;
  Label: Component<ContextMenuLabelProps>;
  Separator: Component<ContextMenuSeparatorProps>;
}

export const ContextMenu = Object.assign(ContextMenuBase, {
  Trigger: null as unknown as Component<ContextMenuTriggerProps>,
  Content: null as unknown as Component<ContextMenuContentProps>,
  Item: null as unknown as Component<ContextMenuItemProps>,
  Label: null as unknown as Component<ContextMenuLabelProps>,
  Separator: null as unknown as Component<ContextMenuSeparatorProps>,
}) as ContextMenuComponent;

export interface ContextMenuTriggerProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /**
   * 子元素
   */
  children?: JSX.Element;
  /**
   * 是否作为子元素传递
   */
  asChild?: boolean;
}

export const ContextMenuTrigger: Component<ContextMenuTriggerProps> = (props) => {
  const [local, others] = splitProps(props, ['children', 'asChild', 'class', 'onContextMenu']);
  const context = useContextMenuContext();
  let triggerElement: HTMLDivElement | undefined;

  const handleContextMenu: JSX.EventHandler<HTMLDivElement, MouseEvent> = (e) => {
    if (typeof local.onContextMenu === 'function') {
      local.onContextMenu(e as any);
    }
    e.preventDefault();
    const pos = { x: e.clientX, y: e.clientY };
    context.setPosition(pos);
    context.setOpen(true);
  };

  onMount(() => {
    if (triggerElement) {
      context.setTriggerRef(triggerElement);
    }
  });

  return (
    <div
      ref={triggerElement}
      class={local.class}
      onContextMenu={handleContextMenu}
      {...others}
    >
      {local.children}
    </div>
  );
};

export interface ContextMenuContentProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /**
   * 子元素
   */
  children?: JSX.Element;
}

export const ContextMenuContent: Component<ContextMenuContentProps> = (props) => {
  const [local, others] = splitProps(props, ['class', 'children'] as const);
  const context = useContextMenuContext();
  let contentElement: HTMLDivElement | undefined;

  const updatePosition = () => {
    if (!isServer && contentElement && context.position()) {
      const pos = context.position()!;
      const contentRect = contentElement.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let finalTop = pos.y;
      let finalLeft = pos.x;

      // 如果右侧超出，则左对齐
      if (pos.x + contentRect.width > viewportWidth) {
        finalLeft = viewportWidth - contentRect.width - 16;
      }

      // 如果下方超出，则在上方显示
      if (pos.y + contentRect.height > viewportHeight) {
        finalTop = pos.y - contentRect.height;
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
    if (context.open() && !isServer && context.position()) {
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
          style={{
            top: context.position() ? `${context.position()!.y}px` : '0px',
            left: context.position() ? `${context.position()!.x}px` : '0px',
          }}
          {...others}
        >
          {local.children}
        </div>
      </Portal>
    </Show>
  );
};

export interface ContextMenuItemProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * 子元素
   */
  children?: JSX.Element;
  /**
   * 是否禁用
   * @default false
   */
  disabled?: boolean;
  /**
   * 是否作为子元素传递
   */
  asChild?: boolean;
}

export const ContextMenuItem: Component<ContextMenuItemProps> = (props) => {
  const [local, others] = splitProps(props, ['children', 'disabled', 'asChild', 'class', 'onClick']);

  const handleClick: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (e) => {
    if (local.disabled) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    if (typeof local.onClick === 'function') {
      local.onClick(e);
    }
  };

  return (
    <button
      type="button"
      role="menuitem"
      class={local.class}
      disabled={local.disabled}
      onClick={handleClick}
      data-disabled={local.disabled ? '' : undefined}
      {...others}
    >
      {local.children}
    </button>
  );
};

export interface ContextMenuLabelProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /**
   * 子元素
   */
  children?: JSX.Element;
}

export const ContextMenuLabel: Component<ContextMenuLabelProps> = (props) => {
  const [local, others] = splitProps(props, ['children', 'class']);

  return (
    <div
      role="menuitem"
      class={local.class}
      {...others}
    >
      {local.children}
    </div>
  );
};

export interface ContextMenuSeparatorProps extends JSX.HTMLAttributes<HTMLHRElement> {
}

export const ContextMenuSeparator: Component<ContextMenuSeparatorProps> = (props) => {
  const [local, others] = splitProps(props, ['class']);

  return (
    <hr
      role="separator"
      class={local.class}
      {...others}
    />
  );
};

ContextMenu.Trigger = ContextMenuTrigger;
ContextMenu.Content = ContextMenuContent;
ContextMenu.Item = ContextMenuItem;
ContextMenu.Label = ContextMenuLabel;
ContextMenu.Separator = ContextMenuSeparator;

