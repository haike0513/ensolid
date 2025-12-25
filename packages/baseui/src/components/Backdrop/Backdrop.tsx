import { Component, JSX, splitProps, Show } from "solid-js";

export interface BackdropProps extends JSX.HTMLAttributes<HTMLDivElement> {
    /**
     * Backdrop 的根元素
     */
    slotProps?: {
        root?: JSX.HTMLAttributes<HTMLDivElement>;
    };
    /**
     * 是否显示
     */
    open?: boolean;
    /**
     * 是否可点击关闭
     */
    invisible?: boolean;
    /**
     * 点击回调
     */
    onClick?: JSX.EventHandler<HTMLDivElement, MouseEvent>;
    /**
     * 子元素
     */
    children?: JSX.Element;
}

export const Backdrop: Component<BackdropProps> = (props) => {
    const [local, others] = splitProps(props, [
        "open",
        "invisible",
        "onClick",
        "children",
        "slotProps",
        "class",
    ]);

    const open = () => local.open ?? true;
    const rootSlotProps = () => local.slotProps?.root ?? {};

    const handleClick: JSX.EventHandler<HTMLDivElement, MouseEvent> = (e) => {
        if (e.target === e.currentTarget && typeof local.onClick === "function") {
            local.onClick(e);
        }
    };

    return (
        <Show when={open()}>
            <div
                class={local.class}
                data-invisible={local.invisible ? "" : undefined}
                onClick={handleClick}
                role="presentation"
                {...rootSlotProps()}
                {...others}
            >
                {local.children}
            </div>
        </Show>
    );
};

