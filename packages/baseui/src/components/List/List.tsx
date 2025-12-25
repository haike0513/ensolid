import { Component, JSX, splitProps, Show } from "solid-js";

export interface ListProps extends JSX.HTMLAttributes<HTMLUListElement> {
    /**
     * List 的根元素
     */
    slotProps?: {
        root?: JSX.HTMLAttributes<HTMLUListElement>;
    };
    /**
     * 是否禁用内边距
     */
    disablePadding?: boolean;
    /**
     * 子元素
     */
    children?: JSX.Element;
}

export const List: Component<ListProps> = (props) => {
    const [local, others] = splitProps(props, [
        "disablePadding",
        "children",
        "slotProps",
        "class",
    ]);

    const rootSlotProps = () => local.slotProps?.root ?? {};

    return (
        <ul
            class={local.class}
            data-disable-padding={local.disablePadding ? "" : undefined}
            {...rootSlotProps()}
            {...others}
        >
            {local.children}
        </ul>
    );
};

export interface ListItemProps extends JSX.LiHTMLAttributes<HTMLLIElement> {
    /**
     * ListItem 的根元素
     */
    slotProps?: {
        root?: JSX.LiHTMLAttributes<HTMLLIElement>;
    };
    /**
     * 是否禁用内边距
     */
    disablePadding?: boolean;
    /**
     * 是否禁用选中的视觉效果
     */
    disableGutters?: boolean;
    /**
     * 子元素
     */
    children?: JSX.Element;
}

export const ListItem: Component<ListItemProps> = (props) => {
    const [local, others] = splitProps(props, [
        "disablePadding",
        "disableGutters",
        "children",
        "slotProps",
        "class",
    ]);

    const rootSlotProps = () => local.slotProps?.root ?? {};

    return (
        <li
            class={local.class}
            data-disable-padding={local.disablePadding ? "" : undefined}
            data-disable-gutters={local.disableGutters ? "" : undefined}
            {...rootSlotProps()}
            {...others}
        >
            {local.children}
        </li>
    );
};

export interface ListItemButtonProps
    extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
    /**
     * ListItemButton 的根元素
     */
    slotProps?: {
        root?: JSX.ButtonHTMLAttributes<HTMLButtonElement>;
    };
    /**
     * 是否选中
     */
    selected?: boolean;
    /**
     * 是否自动聚焦
     */
    autoFocus?: boolean;
    /**
     * 子元素
     */
    children?: JSX.Element;
}

export const ListItemButton: Component<ListItemButtonProps> = (props) => {
    const [local, others] = splitProps(props, [
        "selected",
        "autoFocus",
        "children",
        "slotProps",
        "class",
    ]);

    const rootSlotProps = () => local.slotProps?.root ?? {};

    return (
        <button
            type="button"
            class={local.class}
            data-selected={local.selected ? "" : undefined}
            autofocus={local.autoFocus}
            {...rootSlotProps()}
            {...others}
        >
            {local.children}
        </button>
    );
};

export interface ListItemIconProps extends JSX.HTMLAttributes<HTMLDivElement> {
    /**
     * ListItemIcon 的根元素
     */
    slotProps?: {
        root?: JSX.HTMLAttributes<HTMLDivElement>;
    };
    /**
     * 子元素
     */
    children?: JSX.Element;
}

export const ListItemIcon: Component<ListItemIconProps> = (props) => {
    const [local, others] = splitProps(props, [
        "children",
        "slotProps",
        "class",
    ]);

    const rootSlotProps = () => local.slotProps?.root ?? {};

    return (
        <div class={local.class} data-icon {...rootSlotProps()} {...others}>
            {local.children}
        </div>
    );
};

export interface ListItemTextProps extends JSX.HTMLAttributes<HTMLDivElement> {
    /**
     * ListItemText 的根元素
     */
    slotProps?: {
        root?: JSX.HTMLAttributes<HTMLDivElement>;
        primary?: JSX.HTMLAttributes<HTMLSpanElement>;
        secondary?: JSX.HTMLAttributes<HTMLSpanElement>;
    };
    /**
     * 主文本
     */
    primary?: JSX.Element;
    /**
     * 次文本
     */
    secondary?: JSX.Element;
    /**
     * 子元素
     */
    children?: JSX.Element;
}

export const ListItemText: Component<ListItemTextProps> = (props) => {
    const [local, others] = splitProps(props, [
        "primary",
        "secondary",
        "children",
        "slotProps",
        "class",
    ]);

    const rootSlotProps = () => local.slotProps?.root ?? {};
    const primarySlotProps = () => local.slotProps?.primary ?? {};
    const secondarySlotProps = () => local.slotProps?.secondary ?? {};

    return (
        <div class={local.class} {...rootSlotProps()} {...others}>
            <Show when={local.primary}>
                <span data-primary {...primarySlotProps()}>
                    {local.primary}
                </span>
            </Show>
            <Show when={local.secondary}>
                <span data-secondary {...secondarySlotProps()}>
                    {local.secondary}
                </span>
            </Show>
            {local.children}
        </div>
    );
};

