import { splitProps } from 'solid-js';
import type { Component, JSX } from 'solid-js';

export interface ToolbarProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /**
   * 子元素
   */
  children?: JSX.Element;
}

export interface ToolbarComponent extends Component<ToolbarProps> {
  ToggleGroup: Component<ToolbarToggleGroupProps>;
  ToggleItem: Component<ToolbarToggleItemProps>;
  Separator: Component<ToolbarSeparatorProps>;
  Link: Component<ToolbarLinkProps>;
  Button: Component<ToolbarButtonProps>;
}

const ToolbarBase: Component<ToolbarProps> = (props) => {
  const [local, others] = splitProps(props, ['class', 'children']);

  return (
    <div
      role="toolbar"
      class={local.class}
      aria-orientation="horizontal"
      {...others}
    >
      {local.children}
    </div>
  );
};

export const Toolbar = Object.assign(ToolbarBase, {
  ToggleGroup: null as unknown as Component<ToolbarToggleGroupProps>,
  ToggleItem: null as unknown as Component<ToolbarToggleItemProps>,
  Separator: null as unknown as Component<ToolbarSeparatorProps>,
  Link: null as unknown as Component<ToolbarLinkProps>,
  Button: null as unknown as Component<ToolbarButtonProps>,
}) as ToolbarComponent;

export interface ToolbarToggleGroupProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /**
   * 类型：单个或多个
   * @default 'single'
   */
  type?: 'single' | 'multiple';
  /**
   * 当前选中的值
   */
  value?: string | string[];
  /**
   * 默认选中的值
   */
  defaultValue?: string | string[];
  /**
   * 值变化回调
   */
  onValueChange?: (value: string | string[]) => void;
  /**
   * 是否禁用
   * @default false
   */
  disabled?: boolean;
  /**
   * 子元素
   */
  children?: JSX.Element;
}

export const ToolbarToggleGroup: Component<ToolbarToggleGroupProps> = (props) => {
  const [local, others] = splitProps(props, [
    'type',
    'value',
    'defaultValue',
    'onValueChange',
    'disabled',
    'class',
    'children',
  ]);

  return (
    <div
      class={local.class}
      role="group"
      data-disabled={local.disabled ? '' : undefined}
      {...others}
    >
      {local.children}
    </div>
  );
};

export interface ToolbarToggleItemProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * 项的值
   */
  value: string;
  /**
   * 是否禁用
   * @default false
   */
  disabled?: boolean;
  /**
   * 子元素
   */
  children?: JSX.Element;
}

export const ToolbarToggleItem: Component<ToolbarToggleItemProps> = (props) => {
  const [local, others] = splitProps(props, ['value', 'disabled', 'class', 'children']);

  return (
    <button
      type="button"
      role="button"
      class={local.class}
      disabled={local.disabled}
      data-disabled={local.disabled ? '' : undefined}
      {...others}
    >
      {local.children}
    </button>
  );
};

export interface ToolbarSeparatorProps extends JSX.HTMLAttributes<HTMLHRElement> {
}

export const ToolbarSeparator: Component<ToolbarSeparatorProps> = (props) => {
  const [local, others] = splitProps(props, ['class']);

  return (
    <hr
      role="separator"
      class={local.class}
      {...others}
    />
  );
};

export interface ToolbarLinkProps extends JSX.AnchorHTMLAttributes<HTMLAnchorElement> {
  /**
   * 子元素
   */
  children?: JSX.Element;
}

export const ToolbarLink: Component<ToolbarLinkProps> = (props) => {
  const [local, others] = splitProps(props, ['class', 'children']);

  return (
    <a
      class={local.class}
      {...others}
    >
      {local.children}
    </a>
  );
};

export interface ToolbarButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * 子元素
   */
  children?: JSX.Element;
  /**
   * 是否作为子元素传递
   */
  asChild?: boolean;
}

export const ToolbarButton: Component<ToolbarButtonProps> = (props) => {
  const [local, others] = splitProps(props, ['children', 'asChild', 'class']);

  return (
    <button
      type="button"
      class={local.class}
      {...others}
    >
      {local.children}
    </button>
  );
};

Toolbar.ToggleGroup = ToolbarToggleGroup;
Toolbar.ToggleItem = ToolbarToggleItem;
Toolbar.Separator = ToolbarSeparator;
Toolbar.Link = ToolbarLink;
Toolbar.Button = ToolbarButton;

