import { Component, JSX, splitProps, For, Show } from "solid-js";

export interface PaginationProps extends JSX.HTMLAttributes<HTMLElement> {
    /**
     * Pagination 的根元素
     */
    slotProps?: {
        root?: JSX.HTMLAttributes<HTMLElement>;
        previousButton?: JSX.ButtonHTMLAttributes<HTMLButtonElement>;
        nextButton?: JSX.ButtonHTMLAttributes<HTMLButtonElement>;
        pageButton?: JSX.ButtonHTMLAttributes<HTMLButtonElement>;
    };
    /**
     * 当前页码（从1开始）
     */
    page?: number;
    /**
     * 默认页码
     */
    defaultPage?: number;
    /**
     * 页码变化回调
     */
    onPageChange?: (page: number) => void;
    /**
     * 总页数
     */
    count?: number;
    /**
     * 是否显示首末页按钮
     * @default false
     */
    showFirstButton?: boolean;
    /**
     * 是否显示上一页/下一页按钮
     * @default true
     */
    showPreviousNextButtons?: boolean;
    /**
     * 是否显示最后页按钮
     * @default false
     */
    showLastButton?: boolean;
    /**
     * 显示的页码数量（不包括首末和上下页按钮）
     * @default 7
     */
    siblingCount?: number;
    /**
     * 是否禁用
     */
    disabled?: boolean;
    /**
     * 颜色
     */
    color?: "primary" | "secondary" | "success" | "error" | "info" | "warning";
    /**
     * 大小
     */
    size?: "small" | "medium" | "large";
    /**
     * 形状
     * @default 'circular'
     */
    shape?: "circular" | "rounded";
    /**
     * 变体
     * @default 'outlined'
     */
    variant?: "text" | "outlined";
    /**
     * 子元素
     */
    children?: JSX.Element;
}

export const Pagination: Component<PaginationProps> = (props) => {
    const [local, others] = splitProps(props, [
        "page",
        "defaultPage",
        "onPageChange",
        "count",
        "showFirstButton",
        "showPreviousNextButtons",
        "showLastButton",
        "siblingCount",
        "disabled",
        "color",
        "size",
        "shape",
        "variant",
        "children",
        "slotProps",
        "class",
    ]);

    const count = () => local.count ?? 1;
    const currentPage = () => local.page ?? local.defaultPage ?? 1;
    const showFirstButton = () => local.showFirstButton ?? false;
    const showPreviousNextButtons = () => local.showPreviousNextButtons ?? true;
    const showLastButton = () => local.showLastButton ?? false;
    const siblingCount = () => local.siblingCount ?? 1;
    const color = () => local.color ?? "primary";
    const size = () => local.size ?? "medium";
    const shape = () => local.shape ?? "circular";
    const variant = () => local.variant ?? "outlined";

    const rootSlotProps = () => local.slotProps?.root ?? {};
    const previousButtonSlotProps = () => local.slotProps?.previousButton ?? {};
    const nextButtonSlotProps = () => local.slotProps?.nextButton ?? {};
    const pageButtonSlotProps = () => local.slotProps?.pageButton ?? {};

    const handlePageChange = (page: number) => {
        if (page < 1 || page > count() || page === currentPage()) {
            return;
        }
        local.onPageChange?.(page);
    };

    const getPages = (): (number | "ellipsis")[] => {
        const pages: (number | "ellipsis")[] = [];
        const totalPages = count();
        const current = currentPage();
        const siblings = siblingCount();

        if (totalPages <= 7 + siblings * 2) {
            // 显示所有页面
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // 使用省略号
            const startPage = Math.max(2, current - siblings);
            const endPage = Math.min(totalPages - 1, current + siblings);

            pages.push(1);
            if (startPage > 2) {
                pages.push("ellipsis");
            }
            for (let i = startPage; i <= endPage; i++) {
                pages.push(i);
            }
            if (endPage < totalPages - 1) {
                pages.push("ellipsis");
            }
            pages.push(totalPages);
        }

        return pages;
    };

    return (
        <nav
            class={local.class}
            aria-label="分页导航"
            data-color={color()}
            data-size={size()}
            data-shape={shape()}
            data-variant={variant()}
            data-disabled={local.disabled ? "" : undefined}
            {...rootSlotProps()}
            {...others}
        >
            <ul role="list" style={{ "list-style": "none", display: "flex", "gap": "8px" }}>
                <Show when={showFirstButton()}>
                    <li>
                        <button
                            type="button"
                            disabled={local.disabled || currentPage() === 1}
                            onClick={() => handlePageChange(1)}
                            aria-label="第一页"
                            {...previousButtonSlotProps()}
                        >
                            ««
                        </button>
                    </li>
                </Show>
                <Show when={showPreviousNextButtons()}>
                    <li>
                        <button
                            type="button"
                            disabled={local.disabled || currentPage() === 1}
                            onClick={() => handlePageChange(currentPage() - 1)}
                            aria-label="上一页"
                            {...previousButtonSlotProps()}
                        >
                            «
                        </button>
                    </li>
                </Show>
                <For each={getPages()}>
                    {(page) => (
                        <li>
                            {page === "ellipsis" ? (
                                <span data-ellipsis>…</span>
                            ) : (
                                <button
                                    type="button"
                                    disabled={local.disabled}
                                    onClick={() => handlePageChange(page)}
                                    aria-label={`第 ${page} 页`}
                                    aria-current={page === currentPage() ? "page" : undefined}
                                    data-selected={page === currentPage() ? "" : undefined}
                                    {...pageButtonSlotProps()}
                                >
                                    {page}
                                </button>
                            )}
                        </li>
                    )}
                </For>
                <Show when={showPreviousNextButtons()}>
                    <li>
                        <button
                            type="button"
                            disabled={local.disabled || currentPage() === count()}
                            onClick={() => handlePageChange(currentPage() + 1)}
                            aria-label="下一页"
                            {...nextButtonSlotProps()}
                        >
                            »
                        </button>
                    </li>
                </Show>
                <Show when={showLastButton()}>
                    <li>
                        <button
                            type="button"
                            disabled={local.disabled || currentPage() === count()}
                            onClick={() => handlePageChange(count())}
                            aria-label="最后页"
                            {...nextButtonSlotProps()}
                        >
                            »»
                        </button>
                    </li>
                </Show>
            </ul>
            {local.children}
        </nav>
    );
};

