import { splitProps, createSignal, createContext, useContext, Show, onMount, onCleanup, createEffect } from 'solid-js';
import { Portal, isServer } from 'solid-js/web';
import type { Component, JSX } from 'solid-js';

interface NavigationMenuContextValue {
  value: () => string | undefined;
  setValue: (value: string | undefined) => void;
  triggerRefs: () => Map<string, HTMLElement>;
  setTriggerRef: (value: string, ref: HTMLElement | undefined) => void;
  setContentElement: (value: string, el: HTMLElement | undefined) => void;
}

const NavigationMenuContext = createContext<NavigationMenuContextValue>();

export const useNavigationMenuContext = () => {
  const context = useContext(NavigationMenuContext);
  if (!context) {
    throw new Error('NavigationMenu components must be used within NavigationMenu');
  }
  return context;
};

export interface NavigationMenuProps extends JSX.HTMLAttributes<HTMLElement> {
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
   * 方向
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical';
  /**
   * 子元素
   */
  children?: JSX.Element;
}

const NavigationMenuBase: Component<NavigationMenuProps> = (props) => {
  const [local, others] = splitProps(props, [
    'value',
    'defaultValue',
    'onValueChange',
    'orientation',
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

  const setTriggerRef = (itemValue: string, ref: HTMLElement | undefined) => {
    const refs = new Map(triggerRefs());
    if (ref) {
      refs.set(itemValue, ref);
    } else {
      refs.delete(itemValue);
    }
    setTriggerRefs(refs);
  };

  const setContentElement = (itemValue: string, el: HTMLElement | undefined) => {
    if (el) {
      contentElements.set(itemValue, el);
    } else {
      contentElements.delete(itemValue);
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

  const contextValue: NavigationMenuContextValue = {
    value,
    setValue: handleValueChange,
    triggerRefs,
    setTriggerRef,
    setContentElement,
  };

  return (
    <NavigationMenuContext.Provider value={contextValue}>
      <nav
        class={local.class}
        role="navigation"
        aria-orientation={local.orientation ?? 'horizontal'}
        {...others}
      >
        {local.children}
      </nav>
    </NavigationMenuContext.Provider>
  );
};

export interface NavigationMenuComponent extends Component<NavigationMenuProps> {
  List: Component<NavigationMenuListProps>;
  Item: Component<NavigationMenuItemProps>;
  Trigger: Component<NavigationMenuTriggerProps>;
  Content: Component<NavigationMenuContentProps>;
  Link: Component<NavigationMenuLinkProps>;
  Indicator: Component<NavigationMenuIndicatorProps>;
  Viewport: Component<NavigationMenuViewportProps>;
}

export const NavigationMenu = Object.assign(NavigationMenuBase, {
  List: null as unknown as Component<NavigationMenuListProps>,
  Item: null as unknown as Component<NavigationMenuItemProps>,
  Trigger: null as unknown as Component<NavigationMenuTriggerProps>,
  Content: null as unknown as Component<NavigationMenuContentProps>,
  Link: null as unknown as Component<NavigationMenuLinkProps>,
  Indicator: null as unknown as Component<NavigationMenuIndicatorProps>,
  Viewport: null as unknown as Component<NavigationMenuViewportProps>,
}) as NavigationMenuComponent;

export interface NavigationMenuListProps extends JSX.HTMLAttributes<HTMLUListElement> {
  /**
   * 子元素
   */
  children?: JSX.Element;
}

export const NavigationMenuList: Component<NavigationMenuListProps> = (props) => {
  const [local, others] = splitProps(props, ['class', 'children']);

  return (
    <ul
      class={local.class}
      role="list"
      {...others}
    >
      {local.children}
    </ul>
  );
};

export interface NavigationMenuItemProps extends JSX.LiHTMLAttributes<HTMLLIElement> {
  /**
   * 项的值
   */
  value: string;
  /**
   * 子元素
   */
  children?: JSX.Element;
}

export const NavigationMenuItem: Component<NavigationMenuItemProps> = (props) => {
  const [local, others] = splitProps(props, ['value', 'class', 'children']);

  return (
    <li
      class={local.class}
      data-value={local.value}
      {...others}
    >
      {local.children}
    </li>
  );
};

export interface NavigationMenuTriggerProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * 子元素
   */
  children?: JSX.Element;
  /**
   * 是否作为子元素传递
   */
  asChild?: boolean;
}

export const NavigationMenuTrigger: Component<NavigationMenuTriggerProps> = (props) => {
  const [local, others] = splitProps(props, ['children', 'asChild', 'class', 'onClick']);
  const context = useNavigationMenuContext();
  let triggerElement: HTMLButtonElement | undefined;
  let itemValue: string | undefined;

  onMount(() => {
    if (triggerElement) {
      const parent = triggerElement.closest('[data-value]');
      if (parent) {
        itemValue = parent.getAttribute('data-value') || undefined;
        if (itemValue) {
          context.setTriggerRef(itemValue, triggerElement);
        }
      }
    }
  });

  const isOpen = () => context.value() === itemValue;

  const handleClick: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (e) => {
    if (typeof local.onClick === 'function') {
      local.onClick(e);
    }
    if (itemValue) {
      context.setValue(isOpen() ? undefined : itemValue);
    }
  };

  return (
    <button
      type="button"
      ref={triggerElement}
      class={local.class}
      onClick={handleClick}
      aria-expanded={isOpen()}
      aria-controls={itemValue ? `navigation-menu-content-${itemValue}` : undefined}
      data-state={isOpen() ? 'open' : 'closed'}
      {...others}
    >
      {local.children}
    </button>
  );
};

export interface NavigationMenuContentProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /**
   * 子元素
   */
  children?: JSX.Element;
}

export const NavigationMenuContent: Component<NavigationMenuContentProps> = (props) => {
  const [local, others] = splitProps(props, ['class', 'children'] as const);
  const context = useNavigationMenuContext();
  let contentElement: HTMLDivElement | undefined;
  let itemValue: string | undefined;

  onMount(() => {
    if (contentElement) {
      const parent = contentElement.closest('[data-value]');
      if (parent) {
        itemValue = parent.getAttribute('data-value') || undefined;
        if (itemValue) {
          context.setContentElement(itemValue, contentElement);
        }
      }
    }
  });

  const isOpen = () => itemValue ? context.value() === itemValue : false;

  const updatePosition = () => {
    if (!isServer && contentElement && itemValue) {
      const trigger = context.triggerRefs().get(itemValue);
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
          id={itemValue ? `navigation-menu-content-${itemValue}` : undefined}
          role="menu"
          class={`fixed z-50 ${local.class || ''}`}
          data-state={isOpen() ? 'open' : 'closed'}
          style="top: 0px; left: 0px;"
          {...others}
        >
          {local.children}
        </div>
      </Portal>
    </Show>
  );
};

export interface NavigationMenuLinkProps extends JSX.AnchorHTMLAttributes<HTMLAnchorElement> {
  /**
   * 子元素
   */
  children?: JSX.Element;
  /**
   * 是否作为子元素传递
   */
  asChild?: boolean;
}

export const NavigationMenuLink: Component<NavigationMenuLinkProps> = (props) => {
  const [local, others] = splitProps(props, ['children', 'asChild', 'class']);

  return (
    <a
      class={local.class}
      {...others}
    >
      {local.children}
    </a>
  );
};

export interface NavigationMenuIndicatorProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /**
   * 子元素
   */
  children?: JSX.Element;
}

export const NavigationMenuIndicator: Component<NavigationMenuIndicatorProps> = (props) => {
  const [local, others] = splitProps(props, ['class', 'children']);

  return (
    <div
      class={local.class}
      {...others}
    >
      {local.children}
    </div>
  );
};

export interface NavigationMenuViewportProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /**
   * 子元素
   */
  children?: JSX.Element;
}

export const NavigationMenuViewport: Component<NavigationMenuViewportProps> = (props) => {
  const [local, others] = splitProps(props, ['class', 'children']);

  return (
    <div
      class={local.class}
      {...others}
    >
      {local.children}
    </div>
  );
};

NavigationMenu.List = NavigationMenuList;
NavigationMenu.Item = NavigationMenuItem;
NavigationMenu.Trigger = NavigationMenuTrigger;
NavigationMenu.Content = NavigationMenuContent;
NavigationMenu.Link = NavigationMenuLink;
NavigationMenu.Indicator = NavigationMenuIndicator;
NavigationMenu.Viewport = NavigationMenuViewport;

