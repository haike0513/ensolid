import {
    Component,
    createSignal,
    JSX,
    splitProps,
    onMount,
    onCleanup,
    createEffect,
    Show,
} from "solid-js";

export interface PopperProps extends JSX.HTMLAttributes<HTMLDivElement> {
    /**
     * 锚点元素
     */
    anchorEl?: HTMLElement | null | (() => HTMLElement | null);
    /**
     * 是否打开
     */
    open?: boolean;
    /**
     * 位置
     * @default 'bottom'
     */
    placement?:
        | "bottom-start"
        | "bottom"
        | "bottom-end"
        | "left-start"
        | "left"
        | "left-end"
        | "right-start"
        | "right"
        | "right-end"
        | "top-start"
        | "top"
        | "top-end";
    /**
     * 偏移量
     */
    offset?: number;
    /**
     * 是否禁用定位
     */
    disablePortal?: boolean;
    /**
     * 是否禁用定位更新
     */
    disableUpdate?: boolean;
    /**
     * 子元素
     */
    children?: JSX.Element;
}

export const Popper: Component<PopperProps> = (props) => {
    const [local, others] = splitProps(props, [
        "anchorEl",
        "open",
        "placement",
        "offset",
        "disablePortal",
        "disableUpdate",
        "class",
        "children",
    ]);

    const [position, setPosition] = createSignal<{ top: number; left: number }>({
        top: 0,
        left: 0,
    });
    let popperRef: HTMLDivElement | undefined;

    const placement = () => local.placement ?? "bottom";
    const offset = () => local.offset ?? 8;
    const open = () => local.open ?? false;

    const getAnchorEl = (): HTMLElement | null => {
        if (typeof local.anchorEl === "function") {
            return local.anchorEl();
        }
        return local.anchorEl ?? null;
    };

    const calculatePosition = () => {
        const anchor = getAnchorEl();
        if (!anchor || !popperRef || !open()) {
            return;
        }

        const anchorRect = anchor.getBoundingClientRect();
        const popperRect = popperRef.getBoundingClientRect();
        const scrollX = window.scrollX || window.pageXOffset;
        const scrollY = window.scrollY || window.pageYOffset;

        let top = 0;
        let left = 0;

        const placementValue = placement();
        const offsetValue = offset();

        // 根据 placement 计算位置
        if (placementValue.startsWith("top")) {
            top = anchorRect.top - popperRect.height - offsetValue + scrollY;
        } else if (placementValue.startsWith("bottom")) {
            top = anchorRect.bottom + offsetValue + scrollY;
        } else {
            top = anchorRect.top + scrollY;
        }

        if (placementValue.endsWith("start")) {
            left = anchorRect.left + scrollX;
        } else if (placementValue.endsWith("end")) {
            left = anchorRect.right - popperRect.width + scrollX;
        } else if (placementValue.startsWith("left")) {
            left = anchorRect.left - popperRect.width - offsetValue + scrollX;
        } else if (placementValue.startsWith("right")) {
            left = anchorRect.right + offsetValue + scrollX;
        } else {
            // center
            left = anchorRect.left + (anchorRect.width - popperRect.width) / 2 + scrollX;
        }

        // 边界检测和调整
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        if (left < scrollX) {
            left = scrollX + 8;
        } else if (left + popperRect.width > scrollX + viewportWidth) {
            left = scrollX + viewportWidth - popperRect.width - 8;
        }

        if (top < scrollY) {
            top = scrollY + 8;
        } else if (top + popperRect.height > scrollY + viewportHeight) {
            top = scrollY + viewportHeight - popperRect.height - 8;
        }

        setPosition({ top, left });
    };

    const updatePosition = () => {
        if (local.disableUpdate) {
            return;
        }
        requestAnimationFrame(() => {
            calculatePosition();
        });
    };

    onMount(() => {
        if (open()) {
            updatePosition();
        }
    });

    createEffect(() => {
        if (open() && !local.disableUpdate) {
            updatePosition();

            // 监听滚动和窗口大小变化
            window.addEventListener("scroll", updatePosition, true);
            window.addEventListener("resize", updatePosition);

            return () => {
                window.removeEventListener("scroll", updatePosition, true);
                window.removeEventListener("resize", updatePosition);
            };
        }
    });

    onCleanup(() => {
        window.removeEventListener("scroll", updatePosition, true);
        window.removeEventListener("resize", updatePosition);
    });

    return (
        <Show when={open()}>
            <div
                ref={popperRef}
                class={local.class}
                data-placement={placement()}
                style={{
                    position: local.disablePortal ? "absolute" : "fixed",
                    top: `${position().top}px`,
                    left: `${position().left}px`,
                    "z-index": 1300,
                }}
                {...others}
            >
                {local.children}
            </div>
        </Show>
    );
};

