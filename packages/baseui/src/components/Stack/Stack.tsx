import { Component, JSX, splitProps } from "solid-js";

export interface StackProps extends JSX.HTMLAttributes<HTMLElement> {
    /**
     * Stack 的根元素
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
     * 方向
     * @default 'column'
     */
    direction?: "row" | "row-reverse" | "column" | "column-reverse";
    /**
     * 间距
     */
    spacing?: number | string;
    /**
     * 是否使用 flexbox
     * @default true
     */
    useFlexGap?: boolean;
    /**
     * 对齐方式
     */
    alignItems?: "flex-start" | "center" | "flex-end" | "stretch" | "baseline";
    /**
     * 主轴对齐方式
     */
    justifyContent?:
        | "flex-start"
        | "center"
        | "flex-end"
        | "space-between"
        | "space-around"
        | "space-evenly";
    /**
     * 是否换行
     */
    flexWrap?: "nowrap" | "wrap" | "wrap-reverse";
    /**
     * 子元素
     */
    children?: JSX.Element;
}

export const Stack: Component<StackProps> = (props) => {
    const [local, others] = splitProps(props, [
        "component",
        "direction",
        "spacing",
        "useFlexGap",
        "alignItems",
        "justifyContent",
        "flexWrap",
        "children",
        "slotProps",
        "class",
    ]);

    const Component = (local.component ?? "div") as any;
    const direction = () => local.direction ?? "column";
    const spacing = () => local.spacing ?? 0;
    const useFlexGap = () => local.useFlexGap ?? true;

    const rootSlotProps = () => local.slotProps?.root ?? {};

    const getSpacingStyle = () => {
        if (useFlexGap()) {
            const spacingValue = spacing();
            return {
                gap: typeof spacingValue === "number" ? `${spacingValue * 8}px` : spacingValue,
            };
        }
        return {};
    };

    return (
        <Component
            class={local.class}
            data-direction={direction()}
            style={{
                display: "flex",
                "flex-direction": direction(),
                "align-items": local.alignItems,
                "justify-content": local.justifyContent,
                "flex-wrap": local.flexWrap,
                ...getSpacingStyle(),
            }}
            {...rootSlotProps()}
            {...others}
        >
            {local.children}
        </Component>
    );
};

