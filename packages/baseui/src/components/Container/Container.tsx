import { Component, JSX, splitProps } from "solid-js";

export interface ContainerProps extends JSX.HTMLAttributes<HTMLElement> {
    /**
     * Container 的根元素
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
     * 是否禁用 gutters（内边距）
     * @default false
     */
    disableGutters?: boolean;
    /**
     * 最大宽度
     * @default 'lg'
     */
    maxWidth?: "xs" | "sm" | "md" | "lg" | "xl" | false;
    /**
     * 是否固定（固定宽度而非响应式）
     * @default false
     */
    fixed?: boolean;
    /**
     * 子元素
     */
    children?: JSX.Element;
}

export const Container: Component<ContainerProps> = (props) => {
    const [local, others] = splitProps(props, [
        "component",
        "disableGutters",
        "maxWidth",
        "fixed",
        "children",
        "slotProps",
        "class",
    ]);

    const Component = (local.component ?? "div") as any;
    const maxWidth = () => local.maxWidth ?? "lg";
    const disableGutters = () => local.disableGutters ?? false;
    const fixed = () => local.fixed ?? false;

    const rootSlotProps = () => local.slotProps?.root ?? {};

    const getMaxWidthStyle = () => {
        const maxWidthValue = maxWidth();
        if (maxWidthValue === false) {
            return { "max-width": "none" };
        }
        const maxWidthMap: Record<string, string> = {
            xs: "444px",
            sm: "600px",
            md: "900px",
            lg: "1200px",
            xl: "1536px",
        };
        return { "max-width": maxWidthMap[maxWidthValue] };
    };

    return (
        <Component
            class={local.class}
            data-max-width={maxWidth() === false ? undefined : maxWidth()}
            data-fixed={fixed() ? "" : undefined}
            data-disable-gutters={disableGutters() ? "" : undefined}
            style={{
                width: "100%",
                "margin-left": "auto",
                "margin-right": "auto",
                "padding-left": disableGutters() ? "0" : "16px",
                "padding-right": disableGutters() ? "0" : "16px",
                ...getMaxWidthStyle(),
            }}
            {...rootSlotProps()}
            {...others}
        >
            {local.children}
        </Component>
    );
};

