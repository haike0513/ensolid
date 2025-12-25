import {
    Component,
    JSX,
    onMount,
    onCleanup,
    createEffect,
} from "solid-js";

export interface FocusTrapProps {
    /**
     * 是否启用焦点陷阱
     * @default true
     */
    enabled?: boolean;
    /**
     * 是否自动聚焦第一个可聚焦元素
     * @default true
     */
    autoFocus?: boolean;
    /**
     * 是否在禁用时恢复焦点
     * @default true
     */
    restoreFocus?: boolean;
    /**
     * 子元素
     */
    children?: JSX.Element;
}

export const FocusTrap: Component<FocusTrapProps> = (props) => {
    let containerRef: HTMLElement | null = null;
    let previousActiveElement: HTMLElement | null = null;

    const getFocusableElements = (): HTMLElement[] => {
        if (!containerRef) return [];

        const selector = [
            "a[href]",
            "button:not([disabled])",
            "textarea:not([disabled])",
            "input:not([disabled])",
            "select:not([disabled])",
            "[tabindex]:not([tabindex='-1'])",
        ].join(", ");

        return Array.from(containerRef.querySelectorAll<HTMLElement>(selector));
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key !== "Tab" || !props.enabled) {
            return;
        }

        const focusableElements = getFocusableElements();
        if (focusableElements.length === 0) {
            e.preventDefault();
            return;
        }

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            }
        } else {
            if (document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    };

    onMount(() => {
        if (props.enabled !== false) {
            previousActiveElement = document.activeElement as HTMLElement;
            containerRef?.addEventListener("keydown", handleKeyDown);

            if (props.autoFocus !== false) {
                const focusableElements = getFocusableElements();
                if (focusableElements.length > 0) {
                    focusableElements[0].focus();
                }
            }
        }
    });

    onCleanup(() => {
        containerRef?.removeEventListener("keydown", handleKeyDown);

        if (props.restoreFocus !== false && previousActiveElement) {
            previousActiveElement.focus();
        }
    });

    createEffect(() => {
        if (props.enabled !== false) {
            containerRef?.addEventListener("keydown", handleKeyDown);
        } else {
            containerRef?.removeEventListener("keydown", handleKeyDown);
        }
    });

    return (
        <div
            ref={(el) => {
                containerRef = el;
            }}
        >
            {props.children}
        </div>
    );
};

