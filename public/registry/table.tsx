import type { Component, JSX } from "solid-js";
import { splitProps } from "solid-js";
import { cn } from "./utils";

// Table Root
export interface TableProps extends JSX.HTMLAttributes<HTMLTableElement> {
  children?: JSX.Element;
}

export const Table: Component<TableProps> = (props) => {
  const [local, others] = splitProps(props, ["class", "children"]);

  return (
    <div class="relative w-full overflow-auto">
      <table
        class={cn("w-full caption-bottom text-sm", local.class)}
        {...others}
      >
        {local.children}
      </table>
    </div>
  );
};

// Table Header
export interface TableHeaderProps extends JSX.HTMLAttributes<HTMLTableSectionElement> {
  children?: JSX.Element;
}

export const TableHeader: Component<TableHeaderProps> = (props) => {
  const [local, others] = splitProps(props, ["class", "children"]);

  return (
    <thead class={cn("[&_tr]:border-b", local.class)} {...others}>
      {local.children}
    </thead>
  );
};

// Table Body
export interface TableBodyProps extends JSX.HTMLAttributes<HTMLTableSectionElement> {
  children?: JSX.Element;
}

export const TableBody: Component<TableBodyProps> = (props) => {
  const [local, others] = splitProps(props, ["class", "children"]);

  return (
    <tbody class={cn("[&_tr:last-child]:border-0", local.class)} {...others}>
      {local.children}
    </tbody>
  );
};

// Table Footer
export interface TableFooterProps extends JSX.HTMLAttributes<HTMLTableSectionElement> {
  children?: JSX.Element;
}

export const TableFooter: Component<TableFooterProps> = (props) => {
  const [local, others] = splitProps(props, ["class", "children"]);

  return (
    <tfoot
      class={cn("border-t bg-muted/50 font-medium [&>tr]:last:border-b-0", local.class)}
      {...others}
    >
      {local.children}
    </tfoot>
  );
};

// Table Row
export interface TableRowProps extends JSX.HTMLAttributes<HTMLTableRowElement> {
  children?: JSX.Element;
}

export const TableRow: Component<TableRowProps> = (props) => {
  const [local, others] = splitProps(props, ["class", "children"]);

  return (
    <tr
      class={cn(
        "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
        local.class
      )}
      {...others}
    >
      {local.children}
    </tr>
  );
};

// Table Head
export interface TableHeadProps extends JSX.ThHTMLAttributes<HTMLTableCellElement> {
  children?: JSX.Element;
}

export const TableHead: Component<TableHeadProps> = (props) => {
  const [local, others] = splitProps(props, ["class", "children"]);

  return (
    <th
      class={cn(
        "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
        local.class
      )}
      {...others}
    >
      {local.children}
    </th>
  );
};

// Table Cell
export interface TableCellProps extends JSX.TdHTMLAttributes<HTMLTableCellElement> {
  children?: JSX.Element;
}

export const TableCell: Component<TableCellProps> = (props) => {
  const [local, others] = splitProps(props, ["class", "children"]);

  return (
    <td
      class={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", local.class)}
      {...others}
    >
      {local.children}
    </td>
  );
};

// Table Caption
export interface TableCaptionProps extends JSX.HTMLAttributes<HTMLTableCaptionElement> {
  children?: JSX.Element;
}

export const TableCaption: Component<TableCaptionProps> = (props) => {
  const [local, others] = splitProps(props, ["class", "children"]);

  return (
    <caption
      class={cn("mt-4 text-sm text-muted-foreground", local.class)}
      {...others}
    >
      {local.children}
    </caption>
  );
};
