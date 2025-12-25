import { Component, JSX, splitProps } from "solid-js";

export interface DividerProps extends JSX.HTMLAttributes<HTMLHRElement> {
    /**
     * Divider 的根元素
     */
    slotProps?: {
        root?: JSX.HTMLAttributes<HTMLHRElement>;
    };
    /**
     * 方向
     * @default 'horizontal'
     */
    orientation?: "horizontal" | "vertical";
    /**
     * 是否使用 flex 项样式（用于 flex 容器中）
     */
    flexItem?: boolean;
    /**
     * 文本标签
     */
    textAlign?: "left" | "center" | "right";
    /**
     * 子元素（用于显示标签文本）
     */
    children?: JSX.Element;
}

export const Divider: Component<DividerProps> = (props) => {
    const [local, others] = splitProps(props, [
        "orientation",
        "flexItem",
        "textAlign",
        "children",
        "slotProps",
        "class",
    ]);

    const orientation = () => local.orientation ?? "horizontal";
    const rootSlotProps = () => local.slotProps?.root ?? {};

    return (
        <hr
            class={local.class}
            role="separator"
            data-orientation={orientation()}
            data-flex-item={local.flexItem ? "" : undefined}
            data-text-align={local.textAlign}
            {...rootSlotProps()}
            {...others}
        >
            {local.children && (
                <span data-label data-text-align={local.textAlign}>
                    {local.children}
                </span>
            )}
        </hr>
    );
};

