import { splitProps, Component, JSX, createSignal, createContext, useContext, Show } from 'solid-js';

interface MenuContextValue {
  open: () => boolean;
  setOpen: (open: boolean) => void;
  anchorEl: () => HTMLElement | null;
  setAnchorEl: (el: HTMLElement | null) => void;
}

const MenuContext = createContext<MenuContextValue>();

export const useMenuContext = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('Menu components must be used within Menu');
  }
  return context;
};

export interface MenuProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /**
   * 是否打开（受控）
   */
  open?: boolean;
  /**
   * 默认打开状态（非受控）
   */
  defaultOpen?: boolean;
  /**
   * 打开状态变化回调
   */
  onOpenChange?: (open: boolean) => void;
  /**
   * 锚点元素
   */
  anchorEl?: HTMLElement | null;
  /**
   * 菜单位置
   */
  placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end' | 'left-start' | 'left-end' | 'right-start' | 'right-end';
  /**
   * 子元素
   */
  children?: JSX.Element;
}

const MenuBase: Component<MenuProps> = (props) => {
  const [local, others] = splitProps(props, [
    'open',
    'defaultOpen',
    'onOpenChange',
    'anchorEl',
    'placement',
    'class',
    'children',
  ]);

  const isControlled = () => local.open !== undefined;
  const [internalOpen, setInternalOpen] = createSignal<boolean>(local.open ?? local.defaultOpen ?? false);
  const [internalAnchorEl, setInternalAnchorEl] = createSignal<HTMLElement | null>(local.anchorEl ?? null);

  const open = () => (isControlled() ? local.open ?? false : internalOpen());
  const anchorEl = () => local.anchorEl ?? internalAnchorEl();

  const handleOpenChange = (newOpen: boolean) => {
    if (!isControlled()) {
      setInternalOpen(newOpen);
    }
    local.onOpenChange?.(newOpen);
  };

  const contextValue: MenuContextValue = {
    open,
    setOpen: handleOpenChange,
    anchorEl,
    setAnchorEl: setInternalAnchorEl,
  };

  return (
    <MenuContext.Provider value={contextValue}>
      <div class={local.class} data-open={open() ? '' : undefined} {...others}>
        {local.children}
      </div>
    </MenuContext.Provider>
  );
};

export interface MenuComponent extends Component<MenuProps> {
  Trigger: Component<MenuTriggerProps>;
  List: Component<MenuListProps>;
  Item: Component<MenuItemProps>;
  Separator: Component<MenuSeparatorProps>;
}

export const Menu = Object.assign(MenuBase, {
  Trigger: null as unknown as Component<MenuTriggerProps>,
  List: null as unknown as Component<MenuListProps>,
  Item: null as unknown as Component<MenuItemProps>,
  Separator: null as unknown as Component<MenuSeparatorProps>,
}) as MenuComponent;

export interface MenuTriggerProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * 子元素
   */
  children?: JSX.Element;
}

export const MenuTrigger: Component<MenuTriggerProps> = (props) => {
  const [local, others] = splitProps(props, ['children', 'class', 'onClick', 'ref']);
  const context = useMenuContext();

  const handleClick: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (e) => {
    if (typeof local.onClick === 'function') {
      local.onClick(e);
    }
    context.setAnchorEl(e.currentTarget);
    context.setOpen(!context.open());
  };

  return (
    <button
      type="button"
      class={local.class}
      onClick={handleClick}
      aria-expanded={context.open()}
      aria-haspopup="menu"
      ref={(el) => {
        if (typeof local.ref === 'function') {
          local.ref(el);
        }
        context.setAnchorEl(el);
      }}
      {...others}
    >
      {local.children}
    </button>
  );
};

export interface MenuListProps extends JSX.HTMLAttributes<HTMLUListElement> {
  /**
   * 子元素
   */
  children?: JSX.Element;
}

export const MenuList: Component<MenuListProps> = (props) => {
  const [local, others] = splitProps(props, ['children', 'class']);
  const context = useMenuContext();

  return (
    <Show when={context.open()}>
      <ul
        role="menu"
        class={local.class}
        data-open={context.open() ? '' : undefined}
        {...others}
      >
        {local.children}
      </ul>
    </Show>
  );
};

export interface MenuItemProps extends JSX.LiHTMLAttributes<HTMLLIElement> {
  /**
   * 是否禁用
   */
  disabled?: boolean;
  /**
   * 点击回调
   */
  onSelect?: () => void;
  /**
   * 子元素
   */
  children?: JSX.Element;
}

export const MenuItem: Component<MenuItemProps> = (props) => {
  const [local, others] = splitProps(props, ['disabled', 'onSelect', 'children', 'class', 'onClick']);
  const context = useMenuContext();

  const handleClick: JSX.EventHandler<HTMLLIElement, MouseEvent> = (e) => {
    if (typeof local.onClick === 'function') {
      local.onClick(e);
    }
    if (!local.disabled) {
      local.onSelect?.();
      context.setOpen(false);
    }
  };

  return (
    <li
      role="menuitem"
      class={local.class}
      data-disabled={local.disabled ? '' : undefined}
      aria-disabled={local.disabled}
      onClick={handleClick}
      {...others}
    >
      {local.children}
    </li>
  );
};

export interface MenuSeparatorProps extends JSX.HTMLAttributes<HTMLLIElement> {
  /**
   * 子元素
   */
  children?: JSX.Element;
}

export const MenuSeparator: Component<MenuSeparatorProps> = (props) => {
  const [local, others] = splitProps(props, ['children', 'class']);
  return (
    <li role="separator" class={local.class} data-separator {...others}>
      {local.children}
    </li>
  );
};

Menu.Trigger = MenuTrigger;
Menu.List = MenuList;
Menu.Item = MenuItem;
Menu.Separator = MenuSeparator;

