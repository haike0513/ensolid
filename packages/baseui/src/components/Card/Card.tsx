import { Component, JSX, splitProps } from "solid-js";

export interface CardProps extends JSX.HTMLAttributes<HTMLDivElement> {
    /**
     * Card 的根元素
     */
    slotProps?: {
        root?: JSX.HTMLAttributes<HTMLDivElement>;
    };
    /**
     * 变体
     * @default 'elevation'
     */
    variant?: "elevation" | "outlined";
    /**
     * 阴影级别（仅 elevation 变体）
     * @default 1
     */
    elevation?: number;
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

export const Card: Component<CardProps> = (props) => {
    const [local, others] = splitProps(props, [
        "variant",
        "elevation",
        "square",
        "children",
        "slotProps",
        "class",
    ]);

    const variant = () => local.variant ?? "elevation";
    const elevation = () => local.elevation ?? 1;
    const rootSlotProps = () => local.slotProps?.root ?? {};

    return (
        <div
            class={local.class}
            data-variant={variant()}
            data-elevation={variant() === "elevation" ? elevation() : undefined}
            data-square={local.square ? "" : undefined}
            {...rootSlotProps()}
            {...others}
        >
            {local.children}
        </div>
    );
};

export interface CardHeaderProps extends JSX.HTMLAttributes<HTMLDivElement> {
    /**
     * CardHeader 的根元素
     */
    slotProps?: {
        root?: JSX.HTMLAttributes<HTMLDivElement>;
    };
    /**
     * 子元素
     */
    children?: JSX.Element;
}

export const CardHeader: Component<CardHeaderProps> = (props) => {
    const [local, others] = splitProps(props, [
        "children",
        "slotProps",
        "class",
    ]);

    const rootSlotProps = () => local.slotProps?.root ?? {};

    return (
        <div class={local.class} {...rootSlotProps()} {...others}>
            {local.children}
        </div>
    );
};

export interface CardTitleProps extends JSX.HTMLAttributes<HTMLHeadingElement> {
    /**
     * CardTitle 的根元素
     */
    slotProps?: {
        root?: JSX.HTMLAttributes<HTMLHeadingElement>;
    };
    /**
     * 子元素
     */
    children?: JSX.Element;
}

export const CardTitle: Component<CardTitleProps> = (props) => {
    const [local, others] = splitProps(props, [
        "children",
        "slotProps",
        "class",
    ]);

    const rootSlotProps = () => local.slotProps?.root ?? {};

    return (
        <h3 class={local.class} {...rootSlotProps()} {...others}>
            {local.children}
        </h3>
    );
};

export interface CardDescriptionProps
    extends JSX.HTMLAttributes<HTMLParagraphElement> {
    /**
     * CardDescription 的根元素
     */
    slotProps?: {
        root?: JSX.HTMLAttributes<HTMLParagraphElement>;
    };
    /**
     * 子元素
     */
    children?: JSX.Element;
}

export const CardDescription: Component<CardDescriptionProps> = (props) => {
    const [local, others] = splitProps(props, [
        "children",
        "slotProps",
        "class",
    ]);

    const rootSlotProps = () => local.slotProps?.root ?? {};

    return (
        <p class={local.class} {...rootSlotProps()} {...others}>
            {local.children}
        </p>
    );
};

export interface CardContentProps extends JSX.HTMLAttributes<HTMLDivElement> {
    /**
     * CardContent 的根元素
     */
    slotProps?: {
        root?: JSX.HTMLAttributes<HTMLDivElement>;
    };
    /**
     * 子元素
     */
    children?: JSX.Element;
}

export const CardContent: Component<CardContentProps> = (props) => {
    const [local, others] = splitProps(props, [
        "children",
        "slotProps",
        "class",
    ]);

    const rootSlotProps = () => local.slotProps?.root ?? {};

    return (
        <div class={local.class} {...rootSlotProps()} {...others}>
            {local.children}
        </div>
    );
};

export interface CardActionsProps extends JSX.HTMLAttributes<HTMLDivElement> {
    /**
     * CardActions 的根元素
     */
    slotProps?: {
        root?: JSX.HTMLAttributes<HTMLDivElement>;
    };
    /**
     * 子元素
     */
    children?: JSX.Element;
}

export const CardActions: Component<CardActionsProps> = (props) => {
    const [local, others] = splitProps(props, [
        "children",
        "slotProps",
        "class",
    ]);

    const rootSlotProps = () => local.slotProps?.root ?? {};

    return (
        <div class={local.class} {...rootSlotProps()} {...others}>
            {local.children}
        </div>
    );
};
