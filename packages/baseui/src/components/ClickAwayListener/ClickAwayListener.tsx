import {
    Component,
    JSX,
    onMount,
    onCleanup,
} from "solid-js";

export interface ClickAwayListenerProps {
    /**
     * 点击外部区域时的回调
     */
    onClickAway: (event: MouseEvent | TouchEvent) => void;
    /**
     * 子元素
     */
    children?: JSX.Element;
    /**
     * 是否禁用
     */
    disabled?: boolean;
    /**
     * 鼠标事件类型
     * @default 'click'
     */
    mouseEvent?: "onClick" | "onMouseDown" | "onMouseUp" | false;
    /**
     * 触摸事件类型
     * @default 'onTouchEnd'
     */
    touchEvent?: "onTouchEnd" | "onTouchStart" | false;
}

export const ClickAwayListener: Component<ClickAwayListenerProps> = (
    props,
) => {
    let nodeRef: HTMLElement | null = null;

    const handleClickAway = (event: MouseEvent | TouchEvent) => {
        if (props.disabled) {
            return;
        }

        const target = event.target as Node;

        if (
            nodeRef &&
            nodeRef.contains(target) &&
            !nodeRef.isSameNode(target)
        ) {
            return;
        }

        props.onClickAway(event);
    };

    onMount(() => {
        const mouseEvent = props.mouseEvent ?? "onClick";
        const touchEvent = props.touchEvent ?? "onTouchEnd";

        if (mouseEvent !== false) {
            const eventName =
                mouseEvent === "onClick"
                    ? "click"
                    : mouseEvent === "onMouseDown"
                      ? "mousedown"
                      : "mouseup";
            document.addEventListener(eventName, handleClickAway);
        }

        if (touchEvent !== false) {
            const eventName =
                touchEvent === "onTouchEnd" ? "touchend" : "touchstart";
            document.addEventListener(eventName, handleClickAway);
        }
    });

    onCleanup(() => {
        const mouseEvent = props.mouseEvent ?? "onClick";
        const touchEvent = props.touchEvent ?? "onTouchEnd";

        if (mouseEvent !== false) {
            const eventName =
                mouseEvent === "onClick"
                    ? "click"
                    : mouseEvent === "onMouseDown"
                      ? "mousedown"
                      : "mouseup";
            document.removeEventListener(eventName, handleClickAway);
        }

        if (touchEvent !== false) {
            const eventName =
                touchEvent === "onTouchEnd" ? "touchend" : "touchstart";
            document.removeEventListener(eventName, handleClickAway);
        }
    });

    return (
        <div
            ref={(el) => {
                nodeRef = el;
            }}
        >
            {props.children}
        </div>
    );
};

