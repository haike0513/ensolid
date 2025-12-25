import { Component, JSX, splitProps, For, Show } from "solid-js";

export interface ImageListProps extends JSX.HTMLAttributes<HTMLUListElement> {
    /**
     * ImageList 的根元素
     */
    slotProps?: {
        root?: JSX.HTMLAttributes<HTMLUListElement>;
    };
    /**
     * 列数
     * @default 4
     */
    cols?: number;
    /**
     * 行高
     */
    rowHeight?: number | "auto";
    /**
     * 间距
     * @default 4
     */
    gap?: number;
    /**
     * 变体
     * @default 'standard'
     */
    variant?: "standard" | "woven" | "masonry" | "quilted";
    /**
     * 图片项列表
     */
    items?: Array<{
        src: string;
        alt?: string;
        title?: string;
        subtitle?: string;
        aspectRatio?: number;
    }>;
    /**
     * 子元素（用于自定义渲染）
     */
    children?: JSX.Element;
}

export const ImageList: Component<ImageListProps> = (props) => {
    const [local, others] = splitProps(props, [
        "cols",
        "rowHeight",
        "gap",
        "variant",
        "items",
        "children",
        "slotProps",
        "class",
    ]);

    const cols = () => local.cols ?? 4;
    const rowHeight = () => local.rowHeight ?? "auto";
    const gap = () => local.gap ?? 4;
    const variant = () => local.variant ?? "standard";

    const rootSlotProps = () => local.slotProps?.root ?? {};

    const getStyle = () => {
        const rowHeightValue = rowHeight();
        return {
            display: "grid",
            "grid-template-columns": `repeat(${cols()}, 1fr)`,
            gap: `${gap() * 4}px`,
            "grid-auto-rows":
                typeof rowHeightValue === "number"
                    ? `${rowHeightValue}px`
                    : String(rowHeightValue),
        } as JSX.CSSProperties;
    };

    return (
        <ul
            class={local.class}
            data-variant={variant()}
            style={getStyle()}
            {...rootSlotProps()}
            {...others}
        >
            <Show when={local.children}>{local.children}</Show>
            <Show when={local.items}>
                <For each={local.items}>
                    {(item) => (
                        <li data-item>
                            <img src={item.src} alt={item.alt} />
                            <Show when={item.title || item.subtitle}>
                                <div data-overlay>
                                    <Show when={item.title}>
                                        <div data-title>{item.title}</div>
                                    </Show>
                                    <Show when={item.subtitle}>
                                        <div data-subtitle>{item.subtitle}</div>
                                    </Show>
                                </div>
                            </Show>
                        </li>
                    )}
                </For>
            </Show>
        </ul>
    );
};

export interface ImageListItemProps extends Omit<JSX.LiHTMLAttributes<HTMLLIElement>, "title"> {
    /**
     * ImageListItem 的根元素
     */
    slotProps?: {
        root?: JSX.LiHTMLAttributes<HTMLLIElement>;
        img?: JSX.ImgHTMLAttributes<HTMLImageElement>;
    };
    /**
     * 图片源
     */
    src: string;
    /**
     * 图片替代文本
     */
    alt?: string;
    /**
     * 标题
     */
    title?: JSX.Element;
    /**
     * 副标题
     */
    subtitle?: JSX.Element;
    /**
     * 宽高比
     */
    aspectRatio?: number;
    /**
     * 子元素
     */
    children?: JSX.Element;
}

export const ImageListItem: Component<ImageListItemProps> = (props) => {
    const [local, others] = splitProps(props, [
        "src",
        "alt",
        "title",
        "subtitle",
        "aspectRatio",
        "children",
        "slotProps",
        "class",
    ]);

    const rootSlotProps = () => local.slotProps?.root ?? {};
    const imgSlotProps = () => local.slotProps?.img ?? {};

    return (
        <li
            class={local.class}
            data-aspect-ratio={local.aspectRatio}
            {...rootSlotProps()}
            {...others}
        >
            <img src={local.src} alt={local.alt} {...imgSlotProps()} />
            <Show when={local.title || local.subtitle}>
                <div data-overlay>
                    <Show when={local.title}>
                        <div data-title>{local.title}</div>
                    </Show>
                    <Show when={local.subtitle}>
                        <div data-subtitle>{local.subtitle}</div>
                    </Show>
                </div>
            </Show>
            {local.children}
        </li>
    );
};

