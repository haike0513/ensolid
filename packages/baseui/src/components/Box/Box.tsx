import { Component, JSX, splitProps } from "solid-js";

export interface BoxProps extends JSX.HTMLAttributes<HTMLElement> {
    /**
     * 作为根元素的标签名
     * @default 'div'
     */
    component?: keyof JSX.IntrinsicElements;
    /**
     * 子元素
     */
    children?: JSX.Element;
}

export const Box: Component<BoxProps> = (props) => {
    const [local, others] = splitProps(props, ["component", "children"]);

    const Component = (local.component ?? "div") as any;

    return <Component {...others}>{local.children}</Component>;
};

