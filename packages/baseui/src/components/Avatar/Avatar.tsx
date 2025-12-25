import { Component, JSX, splitProps, Show } from "solid-js";

export interface AvatarProps extends JSX.HTMLAttributes<HTMLDivElement> {
    /**
     * Avatar 的根元素
     */
    slotProps?: {
        root?: JSX.HTMLAttributes<HTMLDivElement>;
        img?: JSX.ImgHTMLAttributes<HTMLImageElement>;
    };
    /**
     * 图片源
     */
    src?: string;
    /**
     * 图片替代文本
     */
    alt?: string;
    /**
     * 变体
     * @default 'circular'
     */
    variant?: "circular" | "rounded" | "square";
    /**
     * 大小
     * @default 'medium'
     */
    size?: "small" | "medium" | "large";
    /**
     * 颜色
     */
    color?: "primary" | "secondary" | "success" | "error" | "info" | "warning";
    /**
     * 子元素（用于显示文字或图标）
     */
    children?: JSX.Element;
}

export const Avatar: Component<AvatarProps> = (props) => {
    const [local, others] = splitProps(props, [
        "src",
        "alt",
        "variant",
        "size",
        "color",
        "children",
        "slotProps",
        "class",
    ]);

    const variant = () => local.variant ?? "circular";
    const size = () => local.size ?? "medium";
    const color = () => local.color ?? "primary";

    const rootSlotProps = () => local.slotProps?.root ?? {};
    const imgSlotProps = () => local.slotProps?.img ?? {};

    return (
        <div
            class={local.class}
            role="img"
            aria-label={local.alt}
            data-variant={variant()}
            data-size={size()}
            data-color={color()}
            {...rootSlotProps()}
            {...others}
        >
            <Show when={local.src}>
                <img
                    src={local.src}
                    alt={local.alt}
                    {...imgSlotProps()}
                />
            </Show>
            <Show when={!local.src}>{local.children}</Show>
        </div>
    );
};

