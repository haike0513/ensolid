import { Component, JSX, splitProps } from "solid-js";

export interface GridProps extends JSX.HTMLAttributes<HTMLElement> {
    /**
     * Grid 的根元素
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
     * 容器模式
     */
    container?: boolean;
    /**
     * 列数（容器模式）
     */
    columns?: number;
    /**
     * 间距
     */
    spacing?: number | string;
    /**
     * 列跨度（项目模式）
     */
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
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
     * 子元素
     */
    children?: JSX.Element;
}

export const Grid: Component<GridProps> = (props) => {
    const [local, others] = splitProps(props, [
        "component",
        "container",
        "columns",
        "spacing",
        "xs",
        "sm",
        "md",
        "lg",
        "xl",
        "alignItems",
        "justifyContent",
        "children",
        "slotProps",
        "class",
    ]);

    const Component = (local.component ?? "div") as any;
    const container = () => local.container ?? false;
    const columns = () => local.columns ?? 12;
    const spacing = () => local.spacing ?? 0;

    const rootSlotProps = () => local.slotProps?.root ?? {};

    const getContainerStyle = () => {
        if (!container()) {
            return {};
        }
        const spacingValue = spacing();
        return {
            display: "grid",
            "grid-template-columns": `repeat(${columns()}, 1fr)`,
            gap: typeof spacingValue === "number" ? `${spacingValue * 8}px` : spacingValue,
            "align-items": local.alignItems,
            "justify-content": local.justifyContent,
        };
    };

    const getItemStyle = () => {
        if (container()) {
            return {};
        }
        const styles: Record<string, string> = {};
        if (local.xs !== undefined) {
            styles["grid-column"] = `span ${local.xs} / span ${local.xs}`;
        }
        if (local.sm !== undefined) {
            styles["grid-column"] = `span ${local.sm} / span ${local.sm}`;
        }
        if (local.md !== undefined) {
            styles["grid-column"] = `span ${local.md} / span ${local.md}`;
        }
        if (local.lg !== undefined) {
            styles["grid-column"] = `span ${local.lg} / span ${local.lg}`;
        }
        if (local.xl !== undefined) {
            styles["grid-column"] = `span ${local.xl} / span ${local.xl}`;
        }
        return styles;
    };

    return (
        <Component
            class={local.class}
            data-container={container() ? "" : undefined}
            style={{
                ...getContainerStyle(),
                ...getItemStyle(),
            }}
            {...rootSlotProps()}
            {...others}
        >
            {local.children}
        </Component>
    );
};

