import { Component, splitProps, createSignal, createContext, useContext, Show, onMount, onCleanup, createEffect } from 'solid-js';
import { Portal } from 'solid-js/web';
import { isServer } from 'solid-js/web';
import type { JSX } from 'solid-js';

interface DropdownMenuContextValue {
  open: () => boolean;
  setOpen: (open: boolean) => void;
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

export const DropdownMenu: Component<DropdownMenuProps> = (props) => {
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

  // ESC 键关闭
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && open()) {
      handleOpenChange(false);
    }
  };

  onMount(() => {
    if (!isServer && open()) {
      document.addEventListener('keydown', handleKeyDown);
    }
  });

  createEffect(() => {
    if (!isServer) {
      if (open()) {
        document.addEventListener('keydown', handleKeyDown);
      } else {
        document.removeEventListener('keydown', handleKeyDown);
      }
    }
  });

  onCleanup(() => {
    if (!isServer) {
      document.removeEventListener('keydown', handleKeyDown);
    }
  });

  const contextValue: DropdownMenuContextValue = {
    open,
    setOpen: handleOpenChange,
  };

  return (
    <DropdownMenuContext.Provider value={contextValue}>
      {local.children}
    </DropdownMenuContext.Provider>
  );
};

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

export interface DropdownMenuContentProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /**
   * 子元素
   */
  children?: JSX.Element;
}

export const DropdownMenuContent: Component<DropdownMenuContentProps> = (props) => {
  const [local, others] = splitProps(props, ['class', 'children'] as const);
  const context = useDropdownMenuContext();

  return (
    <Show when={context.open()}>
      <Portal mount={!isServer ? document.body : undefined}>
        <div
          role="menu"
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

(DropdownMenu as any).Trigger = DropdownMenuTrigger;
(DropdownMenu as any).Content = DropdownMenuContent;
(DropdownMenu as any).Item = DropdownMenuItem;
(DropdownMenu as any).Label = DropdownMenuLabel;
(DropdownMenu as any).Separator = DropdownMenuSeparator;

