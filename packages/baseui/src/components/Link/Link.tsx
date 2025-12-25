import { Component, JSX, splitProps } from "solid-js";

export interface LinkProps extends JSX.AnchorHTMLAttributes<HTMLAnchorElement> {
    /**
     * Link 的根元素
     */
    slotProps?: {
        root?: JSX.AnchorHTMLAttributes<HTMLAnchorElement>;
    };
    /**
     * 链接地址
     */
    href?: string;
    /**
     * 是否在新标签页打开
     */
    target?: string;
    /**
     * 是否禁用
     */
    disabled?: boolean;
    /**
     * 是否显示下划线
     * @default 'hover'
     */
    underline?: "none" | "hover" | "always";
    /**
     * 颜色
     */
    color?: "primary" | "secondary" | "success" | "error" | "info" | "warning";
    /**
     * 变体
     * @default 'body1'
     */
    variant?: "body1" | "body2" | "button" | "caption" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "inherit" | "overline" | "subtitle1" | "subtitle2";
    /**
     * 子元素
     */
    children?: JSX.Element;
}

export const Link: Component<LinkProps> = (props) => {
    const [local, others] = splitProps(props, [
        "href",
        "target",
        "disabled",
        "underline",
        "color",
        "variant",
        "children",
        "slotProps",
        "class",
        "onClick",
    ]);

    const underline = () => local.underline ?? "hover";
    const color = () => local.color ?? "primary";
    const variant = () => local.variant ?? "body1";

    const rootSlotProps = () => local.slotProps?.root ?? {};

    const handleClick: JSX.EventHandler<HTMLAnchorElement, MouseEvent> = (e) => {
        if (local.disabled) {
            e.preventDefault();
            return;
        }
        if (typeof local.onClick === "function") {
            local.onClick(e);
        }
    };

    return (
        <a
            href={local.disabled ? undefined : local.href}
            target={local.target}
            class={local.class}
            data-underline={underline()}
            data-color={color()}
            data-variant={variant()}
            data-disabled={local.disabled ? "" : undefined}
            onClick={handleClick}
            aria-disabled={local.disabled}
            {...rootSlotProps()}
            {...others}
        >
            {local.children}
        </a>
    );
};

