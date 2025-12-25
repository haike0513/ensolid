import { Component, JSX, splitProps, createSignal, Show, For } from "solid-js";

export interface TablePaginationProps extends JSX.HTMLAttributes<HTMLDivElement> {
    /**
     * TablePagination 的根元素
     */
    slotProps?: {
        root?: JSX.HTMLAttributes<HTMLDivElement>;
        select?: JSX.SelectHTMLAttributes<HTMLSelectElement>;
        selectLabel?: JSX.HTMLAttributes<HTMLSpanElement>;
        displayedRows?: JSX.HTMLAttributes<HTMLDivElement>;
        actions?: JSX.HTMLAttributes<HTMLDivElement>;
        previousButton?: JSX.ButtonHTMLAttributes<HTMLButtonElement>;
        nextButton?: JSX.ButtonHTMLAttributes<HTMLButtonElement>;
        firstButton?: JSX.ButtonHTMLAttributes<HTMLButtonElement>;
        lastButton?: JSX.ButtonHTMLAttributes<HTMLButtonElement>;
    };
    /**
     * 当前页码（从0开始）
     */
    page?: number;
    /**
     * 默认页码
     */
    defaultPage?: number;
    /**
     * 页码变化回调
     */
    onPageChange?: (event: Event, page: number) => void;
    /**
     * 每页行数
     */
    rowsPerPage?: number;
    /**
     * 默认每页行数
     */
    defaultRowsPerPage?: number;
    /**
     * 每页行数变化回调
     */
    onRowsPerPageChange?: (event: Event) => void;
    /**
     * 总行数
     */
    count?: number;
    /**
     * 每页行数选项
     * @default [10, 25, 50, 100]
     */
    rowsPerPageOptions?: number[];
    /**
     * 是否显示每页行数选择器
     * @default true
     */
    showRowsPerPage?: boolean;
    /**
     * 是否显示首末页按钮
     * @default false
     */
    showFirstButton?: boolean;
    /**
     * 是否显示最后页按钮
     * @default false
     */
    showLastButton?: boolean;
    /**
     * 标签文本
     */
    labelDisplayedRows?: (params: {
        from: number;
        to: number;
        count: number;
    }) => string;
    /**
     * 每页行数标签文本
     */
    labelRowsPerPage?: string;
    /**
     * 是否禁用
     */
    disabled?: boolean;
    /**
     * 颜色
     */
    color?: "primary" | "secondary";
    /**
     * 大小
     */
    size?: "small" | "medium";
    /**
     * 子元素
     */
    children?: JSX.Element;
}

export const TablePagination: Component<TablePaginationProps> = (props) => {
    const [local, others] = splitProps(props, [
        "page",
        "defaultPage",
        "onPageChange",
        "rowsPerPage",
        "defaultRowsPerPage",
        "onRowsPerPageChange",
        "count",
        "rowsPerPageOptions",
        "showRowsPerPage",
        "showFirstButton",
        "showLastButton",
        "labelDisplayedRows",
        "labelRowsPerPage",
        "disabled",
        "color",
        "size",
        "children",
        "slotProps",
        "class",
    ]);

    const count = () => local.count ?? 0;
    const rowsPerPageOptions = () => local.rowsPerPageOptions ?? [10, 25, 50, 100];
    const showRowsPerPage = () => local.showRowsPerPage ?? true;
    const showFirstButton = () => local.showFirstButton ?? false;
    const showLastButton = () => local.showLastButton ?? false;
    const color = () => local.color ?? "primary";
    const size = () => local.size ?? "medium";

    const isControlled = () => local.page !== undefined;
    const [internalPage, setInternalPage] = createSignal(
        local.page ?? local.defaultPage ?? 0
    );
    const [internalRowsPerPage, setInternalRowsPerPage] = createSignal(
        local.rowsPerPage ?? local.defaultRowsPerPage ?? 10
    );

    const page = () => (isControlled() ? local.page! : internalPage());
    const rowsPerPage = () => local.rowsPerPage ?? internalRowsPerPage();

    const handlePageChange = (newPage: number, event: Event) => {
        if (newPage < 0 || newPage > getLastPage()) {
            return;
        }
        if (!isControlled()) {
            setInternalPage(newPage);
        }
        local.onPageChange?.(event, newPage);
    };

    const handleRowsPerPageChange: JSX.EventHandler<HTMLSelectElement, Event> = (
        event
    ) => {
        const newRowsPerPage = parseInt(event.currentTarget.value, 10);
        setInternalRowsPerPage(newRowsPerPage);
        setInternalPage(0);
        local.onRowsPerPageChange?.(event);
    };

    const getLastPage = () => {
        return Math.max(0, Math.ceil(count() / rowsPerPage()) - 1);
    };

    const getDisplayedRows = () => {
        const currentPage = page();
        const rowsPerPageValue = rowsPerPage();
        const from = count() === 0 ? 0 : currentPage * rowsPerPageValue + 1;
        const to = Math.min(count(), (currentPage + 1) * rowsPerPageValue);
        return { from, to, count: count() };
    };

    const defaultLabelDisplayedRows = (params: {
        from: number;
        to: number;
        count: number;
    }) => {
        const { from, to, count } = params;
        return `${from}-${to} of ${count !== -1 ? count : `more than ${to}`}`;
    };

    const labelDisplayedRows = () =>
        local.labelDisplayedRows ?? defaultLabelDisplayedRows;
    const labelRowsPerPage = () => local.labelRowsPerPage ?? "Rows per page:";

    const displayedRows = () => getDisplayedRows();

    const rootSlotProps = () => local.slotProps?.root ?? {};
    const selectSlotProps = () => local.slotProps?.select ?? {};
    const selectLabelSlotProps = () => local.slotProps?.selectLabel ?? {};
    const displayedRowsSlotProps = () => local.slotProps?.displayedRows ?? {};
    const actionsSlotProps = () => local.slotProps?.actions ?? {};
    const previousButtonSlotProps = () => local.slotProps?.previousButton ?? {};
    const nextButtonSlotProps = () => local.slotProps?.nextButton ?? {};
    const firstButtonSlotProps = () => local.slotProps?.firstButton ?? {};
    const lastButtonSlotProps = () => local.slotProps?.lastButton ?? {};

    return (
        <div
            class={local.class}
            data-color={color()}
            data-size={size()}
            data-disabled={local.disabled ? "" : undefined}
            {...rootSlotProps()}
            {...others}
        >
            <Show when={showRowsPerPage()}>
                <div style={{ display: "flex", "align-items": "center", gap: "8px" }}>
                    <span {...selectLabelSlotProps()}>{labelRowsPerPage()}</span>
                    <select
                        value={rowsPerPage()}
                        onChange={handleRowsPerPageChange}
                        disabled={local.disabled}
                        {...selectSlotProps()}
                    >
                        <For each={rowsPerPageOptions()}>
                            {(option) => (
                                <option value={option}>{option}</option>
                            )}
                        </For>
                    </select>
                </div>
            </Show>
            <div
                style={{ display: "flex", "align-items": "center", gap: "8px" }}
                {...displayedRowsSlotProps()}
            >
                <span>{labelDisplayedRows()(displayedRows())}</span>
            </div>
            <div
                style={{ display: "flex", gap: "8px" }}
                {...actionsSlotProps()}
            >
                <Show when={showFirstButton()}>
                    <button
                        type="button"
                        disabled={local.disabled || page() === 0}
                        onClick={(e) => handlePageChange(0, e)}
                        aria-label="第一页"
                        {...firstButtonSlotProps()}
                    >
                        ««
                    </button>
                </Show>
                <button
                    type="button"
                    disabled={local.disabled || page() === 0}
                    onClick={(e) => handlePageChange(page() - 1, e)}
                    aria-label="上一页"
                    {...previousButtonSlotProps()}
                >
                    «
                </button>
                <button
                    type="button"
                    disabled={local.disabled || page() >= getLastPage()}
                    onClick={(e) => handlePageChange(page() + 1, e)}
                    aria-label="下一页"
                    {...nextButtonSlotProps()}
                >
                    »
                </button>
                <Show when={showLastButton()}>
                    <button
                        type="button"
                        disabled={local.disabled || page() >= getLastPage()}
                        onClick={(e) => handlePageChange(getLastPage(), e)}
                        aria-label="最后页"
                        {...lastButtonSlotProps()}
                    >
                        »»
                    </button>
                </Show>
            </div>
            {local.children}
        </div>
    );
};

