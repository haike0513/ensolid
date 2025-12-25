import { Component, JSX, splitProps } from "solid-js";

export interface TableProps extends JSX.HTMLAttributes<HTMLTableElement> {
    /**
     * Table 的根元素
     */
    slotProps?: {
        root?: JSX.HTMLAttributes<HTMLTableElement>;
    };
    /**
     * 是否显示边框
     */
    border?: boolean;
    /**
     * 是否紧凑模式
     */
    dense?: boolean;
    /**
     * 是否显示条纹
     */
    striped?: boolean;
    /**
     * 子元素
     */
    children?: JSX.Element;
}

export const Table: Component<TableProps> = (props) => {
    const [local, others] = splitProps(props, [
        "border",
        "dense",
        "striped",
        "children",
        "slotProps",
    ]);

    const rootSlotProps = () => local.slotProps?.root ?? {};

    return (
        <table
            data-border={local.border ? "" : undefined}
            data-dense={local.dense ? "" : undefined}
            data-striped={local.striped ? "" : undefined}
            {...rootSlotProps()}
            {...others}
        >
            {local.children}
        </table>
    );
};

export interface TableHeadProps
    extends JSX.HTMLAttributes<HTMLTableSectionElement> {
    /**
     * TableHead 的根元素
     */
    slotProps?: {
        root?: JSX.HTMLAttributes<HTMLTableSectionElement>;
    };
    /**
     * 子元素
     */
    children?: JSX.Element;
}

export const TableHead: Component<TableHeadProps> = (props) => {
    const [local, others] = splitProps(props, ["children", "slotProps", "class"]);

    const rootSlotProps = () => local.slotProps?.root ?? {};

    return (
        <thead class={local.class} {...rootSlotProps()} {...others}>
            {local.children}
        </thead>
    );
};

export interface TableBodyProps
    extends JSX.HTMLAttributes<HTMLTableSectionElement> {
    /**
     * TableBody 的根元素
     */
    slotProps?: {
        root?: JSX.HTMLAttributes<HTMLTableSectionElement>;
    };
    /**
     * 子元素
     */
    children?: JSX.Element;
}

export const TableBody: Component<TableBodyProps> = (props) => {
    const [local, others] = splitProps(props, ["children", "slotProps", "class"]);

    const rootSlotProps = () => local.slotProps?.root ?? {};

    return (
        <tbody class={local.class} {...rootSlotProps()} {...others}>
            {local.children}
        </tbody>
    );
};

export interface TableRowProps extends JSX.HTMLAttributes<HTMLTableRowElement> {
    /**
     * TableRow 的根元素
     */
    slotProps?: {
        root?: JSX.HTMLAttributes<HTMLTableRowElement>;
    };
    /**
     * 是否选中
     */
    selected?: boolean;
    /**
     * 是否悬停效果
     */
    hover?: boolean;
    /**
     * 子元素
     */
    children?: JSX.Element;
}

export const TableRow: Component<TableRowProps> = (props) => {
    const [local, others] = splitProps(props, [
        "selected",
        "hover",
        "children",
        "slotProps",
        "class",
    ]);

    const rootSlotProps = () => local.slotProps?.root ?? {};

    return (
        <tr
            class={local.class}
            data-selected={local.selected ? "" : undefined}
            data-hover={local.hover ? "" : undefined}
            {...rootSlotProps()}
            {...others}
        >
            {local.children}
        </tr>
    );
};

export interface TableCellProps
    extends JSX.TdHTMLAttributes<HTMLTableCellElement> {
    /**
     * TableCell 的根元素
     */
    slotProps?: {
        root?: JSX.TdHTMLAttributes<HTMLTableCellElement>;
    };
    /**
     * 是否作为表头单元格
     */
    component?: "td" | "th";
    /**
     * 对齐方式
     */
    align?: "left" | "center" | "right";
    /**
     * 子元素
     */
    children?: JSX.Element;
}

export const TableCell: Component<TableCellProps> = (props) => {
    const [local, others] = splitProps(props, [
        "component",
        "align",
        "children",
        "slotProps",
        "class",
    ]);

    const rootSlotProps = () => local.slotProps?.root ?? {};
    const Component = (local.component ?? "td") as any;

    return (
        <Component
            class={local.class}
            data-align={local.align}
            {...rootSlotProps()}
            {...others}
        >
            {local.children}
        </Component>
    );
};

