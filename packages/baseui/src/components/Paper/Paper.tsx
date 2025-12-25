import { Component, JSX, splitProps } from "solid-js";

export interface PaperProps extends JSX.HTMLAttributes<HTMLElement> {
    /**
     * Paper 的根元素
     */
    slotProps?: {
        root?: JSX.HTMLAttributes<HTMLElement>;
    };
    /**
     * 作为根元素的标签名
     * @default 'div'
     */
    component?: keyof JSX.IntrinsicElements;
    /**
     * 阴影级别
     * @default 1
     */
    elevation?: number;
    /**
     * 变体
     * @default 'elevation'
     */
    variant?: "elevation" | "outlined";
    /**
     * 是否方形（无圆角）
     * @default false
     */
    square?: boolean;
    /**
     * 子元素
     */
    children?: JSX.Element;
}

export const Paper: Component<PaperProps> = (props) => {
    const [local, others] = splitProps(props, [
        "component",
        "elevation",
        "variant",
        "square",
        "children",
        "slotProps",
    ]);

    const Component = (local.component ?? "div") as any;
    const elevation = () => local.elevation ?? 1;
    const variant = () => local.variant ?? "elevation";
    const rootSlotProps = () => local.slotProps?.root ?? {};

    return (
        <Component
            data-elevation={variant() === "elevation" ? elevation() : undefined}
            data-variant={variant()}
            data-square={local.square ? "" : undefined}
            {...rootSlotProps()}
            {...others}
        >
            {local.children}
        </Component>
    );
};

