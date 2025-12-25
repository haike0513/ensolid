import { Component, JSX, splitProps } from "solid-js";

export interface SkeletonProps extends JSX.HTMLAttributes<HTMLElement> {
    /**
     * Skeleton 的根元素
     */
    slotProps?: {
        root?: JSX.HTMLAttributes<HTMLElement>;
    };
    /**
     * 作为根元素的标签名
     * @default 'span'
     */
    component?: keyof JSX.IntrinsicElements;
    /**
     * 变体
     * @default 'text'
     */
    variant?: "text" | "circular" | "rectangular" | "rounded";
    /**
     * 动画
     * @default 'pulse'
     */
    animation?: "pulse" | "wave" | false;
    /**
     * 宽度
     */
    width?: number | string;
    /**
     * 高度
     */
    height?: number | string;
    /**
     * 子元素
     */
    children?: JSX.Element;
}

export const Skeleton: Component<SkeletonProps> = (props) => {
    const [local, others] = splitProps(props, [
        "component",
        "variant",
        "animation",
        "width",
        "height",
        "children",
        "slotProps",
        "class",
    ]);

    const Component = (local.component ?? "span") as any;
    const variant = () => local.variant ?? "text";
    const animation = () => local.animation ?? "pulse";
    const rootSlotProps = () => local.slotProps?.root ?? {};

    const getStyle = () => {
        const style: Record<string, string> = {};
        if (local.width !== undefined) {
            style.width =
                typeof local.width === "number" ? `${local.width}px` : local.width;
        }
        if (local.height !== undefined) {
            style.height =
                typeof local.height === "number" ? `${local.height}px` : local.height;
        }
        return style;
    };

    return (
        <Component
            class={local.class}
            data-variant={variant()}
            data-animation={animation() === false ? undefined : animation()}
            style={getStyle()}
            aria-busy="true"
            aria-live="polite"
            {...rootSlotProps()}
            {...others}
        >
            {local.children}
        </Component>
    );
};

