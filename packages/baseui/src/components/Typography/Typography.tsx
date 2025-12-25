import { Component, JSX, splitProps } from "solid-js";

export interface TypographyProps extends JSX.HTMLAttributes<HTMLElement> {
    /**
     * Typography 的根元素
     */
    slotProps?: {
        root?: JSX.HTMLAttributes<HTMLElement>;
    };
    /**
     * 作为根元素的标签名
     */
    component?: keyof JSX.IntrinsicElements;
    /**
     * 变体
     * @default 'body1'
     */
    variant?:
        | "body1"
        | "body2"
        | "button"
        | "caption"
        | "h1"
        | "h2"
        | "h3"
        | "h4"
        | "h5"
        | "h6"
        | "inherit"
        | "overline"
        | "subtitle1"
        | "subtitle2";
    /**
     * 对齐方式
     */
    align?: "left" | "center" | "right" | "justify";
    /**
     * 颜色
     */
    color?:
        | "primary"
        | "secondary"
        | "success"
        | "error"
        | "info"
        | "warning"
        | "textPrimary"
        | "textSecondary"
        | "textDisabled"
        | "inherit";
    /**
     * 是否不换行
     */
    noWrap?: boolean;
    /**
     * 是否使用 gutterBottom（底部间距）
     */
    gutterBottom?: boolean;
    /**
     * 子元素
     */
    children?: JSX.Element;
}

export const Typography: Component<TypographyProps> = (props) => {
    const [local, others] = splitProps(props, [
        "component",
        "variant",
        "align",
        "color",
        "noWrap",
        "gutterBottom",
        "children",
        "slotProps",
        "class",
    ]);

    const variant = () => local.variant ?? "body1";
    const rootSlotProps = () => local.slotProps?.root ?? {};

    // 根据 variant 自动选择组件
    const getComponent = (): keyof JSX.IntrinsicElements => {
        if (local.component) {
            return local.component;
        }
        if (variant().startsWith("h")) {
            return variant() as keyof JSX.IntrinsicElements;
        }
        return "p";
    };

    const Component = getComponent() as any;

    return (
        <Component
            class={local.class}
            data-variant={variant()}
            data-align={local.align}
            data-color={local.color}
            data-nowrap={local.noWrap ? "" : undefined}
            data-gutter-bottom={local.gutterBottom ? "" : undefined}
            {...rootSlotProps()}
            {...others}
        >
            {local.children}
        </Component>
    );
};

