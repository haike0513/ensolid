import { splitProps, createSignal, createContext, useContext, Show, onMount, onCleanup, createEffect } from 'solid-js';
import { Portal, isServer } from 'solid-js/web';
import type { Component, JSX } from 'solid-js';

interface MenubarContextValue {
  value: () => string | undefined;
  setValue: (value: string | undefined) => void;
  triggerRefs: () => Map<string, HTMLElement>;
  setTriggerRef: (value: string, ref: HTMLElement | undefined) => void;
  setContentElement: (value: string, el: HTMLElement | undefined) => void;
}

const MenubarContext = createContext<MenubarContextValue>();

export const useMenubarContext = () => {
  const context = useContext(MenubarContext);
  if (!context) {
    throw new Error('Menubar components must be used within Menubar');
  }
  return context;
};

export interface MenubarProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /**
   * 当前打开的值
   */
  value?: string;
  /**
   * 默认打开的值
   */
  defaultValue?: string;
  /**
   * 值变化回调
   */
  onValueChange?: (value: string | undefined) => void;
  /**
   * 子元素
   */
  children?: JSX.Element;
}

const MenubarBase: Component<MenubarProps> = (props) => {
  const [local, others] = splitProps(props, [
    'value',
    'defaultValue',
    'onValueChange',
    'class',
    'children',
  ]);

  const [internalValue, setInternalValue] = createSignal<string | undefined>(
    local.value ?? local.defaultValue
  );
  const [triggerRefs, setTriggerRefs] = createSignal<Map<string, HTMLElement>>(new Map());
  const contentElements = new Map<string, HTMLElement>();

  const isControlled = () => local.value !== undefined;
  const value = () => (isControlled() ? local.value : internalValue());

  const handleValueChange = (newValue: string | undefined) => {
    if (!isControlled()) {
      setInternalValue(newValue);
    }
    local.onValueChange?.(newValue);
  };

  const setTriggerRef = (menuValue: string, ref: HTMLElement | undefined) => {
    const refs = new Map(triggerRefs());
    if (ref) {
      refs.set(menuValue, ref);
    } else {
      refs.delete(menuValue);
    }
    setTriggerRefs(refs);
  };

  const setContentElement = (menuValue: string, el: HTMLElement | undefined) => {
    if (el) {
      contentElements.set(menuValue, el);
    } else {
      contentElements.delete(menuValue);
    }
  };

  // 点击外部关闭
  const handleClickOutside = (e: MouseEvent) => {
    const currentValue = value();
    if (currentValue && !isServer) {
      const target = e.target as HTMLElement;
      const trigger = triggerRefs().get(currentValue);
      const content = contentElements.get(currentValue);

      if (trigger && content) {
        if (!trigger.contains(target) && !content.contains(target)) {
          handleValueChange(undefined);
        }
      }
    }
  };

  // ESC 键关闭
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && value()) {
      handleValueChange(undefined);
    }
  };

  createEffect(() => {
    if (!isServer) {
      if (value()) {
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

  const contextValue: MenubarContextValue = {
    value,
    setValue: handleValueChange,
    triggerRefs,
    setTriggerRef,
    setContentElement,
  };

  return (
    <MenubarContext.Provider value={contextValue}>
      <div
        class={local.class}
        role="menubar"
        {...others}
      >
        {local.children}
      </div>
    </MenubarContext.Provider>
  );
};

export interface MenubarComponent extends Component<MenubarProps> {
  Menu: Component<MenubarMenuProps>;
  Trigger: Component<MenubarTriggerProps>;
  Content: Component<MenubarContentProps>;
  Item: Component<MenubarItemProps>;
  Separator: Component<MenubarSeparatorProps>;
}

export const Menubar = Object.assign(MenubarBase, {
  Menu: null as unknown as Component<MenubarMenuProps>,
  Trigger: null as unknown as Component<MenubarTriggerProps>,
  Content: null as unknown as Component<MenubarContentProps>,
  Item: null as unknown as Component<MenubarItemProps>,
  Separator: null as unknown as Component<MenubarSeparatorProps>,
}) as MenubarComponent;

export interface MenubarMenuProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /**
   * 菜单的值
   */
  value: string;
  /**
   * 子元素
   */
  children?: JSX.Element;
}

export const MenubarMenu: Component<MenubarMenuProps> = (props) => {
  const [local, others] = splitProps(props, ['value', 'class', 'children']);

  return (
    <div
      class={local.class}
      data-value={local.value}
      {...others}
    >
      {local.children}
    </div>
  );
};

export interface MenubarTriggerProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * 子元素
   */
  children?: JSX.Element;
  /**
   * 是否作为子元素传递
   */
  asChild?: boolean;
}

export const MenubarTrigger: Component<MenubarTriggerProps> = (props) => {
  const [local, others] = splitProps(props, ['children', 'asChild', 'class', 'onClick']);
  const context = useMenubarContext();
  let triggerElement: HTMLButtonElement | undefined;
  let menuValue: string | undefined;

  // 从父元素获取 value
  onMount(() => {
    if (triggerElement) {
      const parent = triggerElement.closest('[data-value]');
      if (parent) {
        menuValue = parent.getAttribute('data-value') || undefined;
        if (menuValue) {
          context.setTriggerRef(menuValue, triggerElement);
        }
      }
    }
  });

  const isOpen = () => context.value() === menuValue;

  const handleClick: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (e) => {
    if (typeof local.onClick === 'function') {
      local.onClick(e);
    }
    if (menuValue) {
      context.setValue(isOpen() ? undefined : menuValue);
    }
  };

  return (
    <button
      type="button"
      ref={triggerElement}
      role="menuitem"
      class={local.class}
      onClick={handleClick}
      aria-expanded={isOpen()}
      data-state={isOpen() ? 'open' : 'closed'}
      {...others}
    >
      {local.children}
    </button>
  );
};

export interface MenubarContentProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /**
   * 子元素
   */
  children?: JSX.Element;
}

export const MenubarContent: Component<MenubarContentProps> = (props) => {
  const [local, others] = splitProps(props, ['class', 'children'] as const);
  const context = useMenubarContext();
  let contentElement: HTMLDivElement | undefined;
  let menuValue: string | undefined;

  onMount(() => {
    if (contentElement) {
      const parent = contentElement.closest('[data-value]');
      if (parent) {
        menuValue = parent.getAttribute('data-value') || undefined;
        if (menuValue) {
          context.setContentElement(menuValue, contentElement);
        }
      }
    }
  });

  const isOpen = () => menuValue ? context.value() === menuValue : false;

  const updatePosition = () => {
    if (!isServer && contentElement && menuValue) {
      const trigger = context.triggerRefs().get(menuValue);
      if (trigger) {
        const rect = trigger.getBoundingClientRect();
        const contentRect = contentElement.getBoundingClientRect();

        const top = rect.bottom + 8;
        const left = rect.left;

        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        let finalTop = top;
        let finalLeft = left;

        if (left + contentRect.width > viewportWidth) {
          finalLeft = viewportWidth - contentRect.width - 16;
        }

        if (top + contentRect.height > viewportHeight) {
          finalTop = rect.top - contentRect.height - 8;
        }

        contentElement.style.top = `${finalTop}px`;
        contentElement.style.left = `${finalLeft}px`;
      }
    }
  };

  createEffect(() => {
    if (isOpen() && !isServer) {
      requestAnimationFrame(() => {
        updatePosition();
      });
    }
  });

  return (
    <Show when={isOpen()}>
      <Portal mount={!isServer ? document.body : undefined}>
        <div
          ref={contentElement}
          role="menu"
          class={`fixed z-50 ${local.class || ''}`}
          data-state={isOpen() ? 'open' : 'closed'}
          style={{ top: '0px', left: '0px' }}
          {...others}
        >
          {local.children}
        </div>
      </Portal>
    </Show>
  );
};

export interface MenubarItemProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
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

export const MenubarItem: Component<MenubarItemProps> = (props) => {
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

export interface MenubarSeparatorProps extends JSX.HTMLAttributes<HTMLHRElement> {
}

export const MenubarSeparator: Component<MenubarSeparatorProps> = (props) => {
  const [local, others] = splitProps(props, ['class']);

  return (
    <hr
      role="separator"
      class={local.class}
      {...others}
    />
  );
};

Menubar.Menu = MenubarMenu;
Menubar.Trigger = MenubarTrigger;
Menubar.Content = MenubarContent;
Menubar.Item = MenubarItem;
Menubar.Separator = MenubarSeparator;

