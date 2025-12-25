import { Component, JSX, Show, splitProps, createSignal, onMount } from "solid-js";
import { isServer } from "solid-js/web";

export interface NoSsrProps extends JSX.HTMLAttributes<HTMLDivElement> {
    /**
     * 是否禁用 SSR（服务端渲染）
     * @default true
     */
    disableSsr?: boolean;
    /**
     * SSR 降级内容
     */
    fallback?: JSX.Element;
    /**
     * 延迟渲染（用于性能优化）
     */
    defer?: boolean;
    /**
     * 子元素
     */
    children?: JSX.Element;
}

export const NoSsr: Component<NoSsrProps> = (props) => {
    const [local, others] = splitProps(props, [
        "disableSsr",
        "fallback",
        "defer",
        "children",
        "class",
    ]);

    const disableSsr = () => local.disableSsr ?? true;
    const defer = () => local.defer ?? false;
    const [mounted, setMounted] = createSignal(false);

    onMount(() => {
        if (defer()) {
            // 延迟到下一帧渲染
            requestAnimationFrame(() => {
                setMounted(true);
            });
        } else {
            setMounted(true);
        }
    });

    // 在服务端，如果禁用了 SSR，则返回 fallback
    if (isServer && disableSsr()) {
        return <div class={local.class} {...others}>{local.fallback}</div>;
    }

    // 在客户端，如果需要延迟，等待 mounted 信号
    if (defer()) {
        return (
            <div class={local.class} {...others}>
                <Show when={mounted()} fallback={local.fallback}>
                    {local.children}
                </Show>
            </div>
        );
    }

    // 在客户端，直接渲染
    return <div class={local.class} {...others}>{local.children}</div>;
};

