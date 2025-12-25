import { Component, JSX, splitProps, Show, For } from "solid-js";

export interface BreadcrumbsProps extends JSX.HTMLAttributes<HTMLElement> {
    /**
     * Breadcrumbs 的根元素
     */
    slotProps?: {
        root?: JSX.HTMLAttributes<HTMLElement>;
        ol?: JSX.OlHTMLAttributes<HTMLOListElement>;
        li?: JSX.LiHTMLAttributes<HTMLLIElement>;
        separator?: JSX.LiHTMLAttributes<HTMLLIElement>;
    };
    /**
     * 作为根元素的标签名
     * @default 'nav'
     */
    component?: keyof JSX.IntrinsicElements;
    /**
     * 分隔符
     * @default '/'
     */
    separator?: JSX.Element;
    /**
     * 最大显示项数（超过的部分用省略号表示）
     */
    maxItems?: number;
    /**
     * 项列表
     */
    items?: Array<{
        label: JSX.Element;
        href?: string;
        onClick?: () => void;
    }>;
    /**
     * 子元素（用于自定义渲染）
     */
    children?: JSX.Element;
}

export const Breadcrumbs: Component<BreadcrumbsProps> = (props) => {
    const [local, others] = splitProps(props, [
        "component",
        "separator",
        "maxItems",
        "items",
        "children",
        "slotProps",
        "class",
    ]);

    const Component = (local.component ?? "nav") as any;
    const separator = () => local.separator ?? "/";
    const rootSlotProps = () => local.slotProps?.root ?? {};
    const olSlotProps = () => local.slotProps?.ol ?? {};
    const liSlotProps = () => local.slotProps?.li ?? {};
    const separatorSlotProps = () => local.slotProps?.separator ?? {};

    const getDisplayItems = () => {
        if (!local.items) return [];
        const items = local.items;
        if (!local.maxItems || items.length <= local.maxItems) {
            return items;
        }
        // 超过最大项数时，显示首尾和省略号
        const first = items[0];
        const last = items[items.length - 1];
        return [first, { label: "…", href: undefined, onClick: undefined }, last];
    };

    return (
        <Component
            class={local.class}
            aria-label="breadcrumb"
            {...rootSlotProps()}
            {...others}
        >
            <ol {...olSlotProps()}>
                <Show when={local.children}>{local.children}</Show>
                <Show when={local.items}>
                    <For each={getDisplayItems()}>
                        {(item, index) => (
                            <>
                                <Show when={index() > 0}>
                                    <li
                                        role="presentation"
                                        data-separator
                                        {...separatorSlotProps()}
                                    >
                                        {separator()}
                                    </li>
                                </Show>
                                <li {...liSlotProps()}>
                                    {item.href || item.onClick ? (
                                        <a
                                            href={item.href}
                                            onClick={(e) => {
                                                if (item.onClick) {
                                                    e.preventDefault();
                                                    item.onClick();
                                                }
                                            }}
                                        >
                                            {item.label}
                                        </a>
                                    ) : (
                                        <span>{item.label}</span>
                                    )}
                                </li>
                            </>
                        )}
                    </For>
                </Show>
            </ol>
        </Component>
    );
};

