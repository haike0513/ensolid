import {
    Component,
    createContext,
    createSignal,
    JSX,
    splitProps,
    useContext,
    For,
    Show,
} from "solid-js";

interface TreeViewContextValue {
    expanded: () => Set<string>;
    setExpanded: (nodeId: string, expanded: boolean) => void;
    selected: () => string | null;
    setSelected: (nodeId: string | null) => void;
    multiSelect: () => boolean;
}

const TreeViewContext = createContext<TreeViewContextValue>();

export const useTreeViewContext = () => {
    const context = useContext(TreeViewContext);
    if (!context) {
        throw new Error("TreeView components must be used within TreeView");
    }
    return context;
};

export interface TreeViewProps extends JSX.HTMLAttributes<HTMLUListElement> {
    /**
     * 当前展开的节点ID（受控）
     */
    expanded?: string[];
    /**
     * 默认展开的节点ID（非受控）
     */
    defaultExpanded?: string[];
    /**
     * 展开状态变化回调
     */
    onExpandedChange?: (expanded: string[]) => void;
    /**
     * 当前选中的节点ID（受控）
     */
    selected?: string | null;
    /**
     * 默认选中的节点ID（非受控）
     */
    defaultSelected?: string | null;
    /**
     * 选中状态变化回调
     */
    onSelectedChange?: (selected: string | null) => void;
    /**
     * 是否多选
     * @default false
     */
    multiSelect?: boolean;
    /**
     * 节点数据
     */
    nodes?: TreeNode[];
    /**
     * 子元素
     */
    children?: JSX.Element;
}

export interface TreeNode {
    id: string;
    label: JSX.Element;
    children?: TreeNode[];
    disabled?: boolean;
}

const TreeViewBase: Component<TreeViewProps> = (props) => {
    const [local, others] = splitProps(props, [
        "expanded",
        "defaultExpanded",
        "onExpandedChange",
        "selected",
        "defaultSelected",
        "onSelectedChange",
        "multiSelect",
        "nodes",
        "class",
        "children",
    ]);

    const multiSelect = () => local.multiSelect ?? false;

    const isExpandedControlled = () => local.expanded !== undefined;
    const [internalExpanded, setInternalExpanded] = createSignal<Set<string>>(
        new Set(local.expanded ?? local.defaultExpanded ?? []),
    );

    const expanded = () =>
        isExpandedControlled()
            ? new Set(local.expanded ?? [])
            : internalExpanded();

    const handleExpandedChange = (nodeId: string, newExpanded: boolean) => {
        const currentExpanded = expanded();
        const newExpandedSet = new Set(currentExpanded);

        if (newExpanded) {
            newExpandedSet.add(nodeId);
        } else {
            newExpandedSet.delete(nodeId);
        }

        if (!isExpandedControlled()) {
            setInternalExpanded(newExpandedSet);
        }
        local.onExpandedChange?.(Array.from(newExpandedSet));
    };

    const isSelectedControlled = () => local.selected !== undefined;
    const [internalSelected, setInternalSelected] = createSignal<string | null>(
        local.selected ?? local.defaultSelected ?? null,
    );

    const selected = () =>
        isSelectedControlled() ? local.selected ?? null : internalSelected();

    const handleSelectedChange = (nodeId: string | null) => {
        if (!isSelectedControlled()) {
            setInternalSelected(nodeId);
        }
        local.onSelectedChange?.(nodeId);
    };

    const contextValue: TreeViewContextValue = {
        expanded,
        setExpanded: handleExpandedChange,
        selected,
        setSelected: handleSelectedChange,
        multiSelect,
    };

    return (
        <TreeViewContext.Provider value={contextValue}>
            <ul
                role="tree"
                class={local.class}
                data-multi-select={multiSelect() ? "" : undefined}
                {...others}
            >
                {local.children}
            </ul>
        </TreeViewContext.Provider>
    );
};

export interface TreeViewComponent extends Component<TreeViewProps> {
    Item: Component<TreeItemProps>;
}

export const TreeView = Object.assign(TreeViewBase, {
    Item: null as unknown as Component<TreeItemProps>,
}) as TreeViewComponent;

export interface TreeItemProps extends JSX.LiHTMLAttributes<HTMLLIElement> {
    /**
     * 节点ID
     */
    nodeId: string;
    /**
     * 标签
     */
    label: JSX.Element;
    /**
     * 是否禁用
     */
    disabled?: boolean;
    /**
     * 子节点
     */
    items?: TreeNode[];
}

export const TreeItem: Component<TreeItemProps> = (props) => {
    const [local, others] = splitProps(props, [
        "nodeId",
        "label",
        "disabled",
        "items",
        "class",
    ]);
    const context = useTreeViewContext();

    const isExpanded = () => context.expanded().has(local.nodeId);
    const isSelected = () => context.selected() === local.nodeId;
    const hasChildren = () => {
        if (Array.isArray(local.items)) {
            return local.items.length > 0;
        }
        return false;
    };

    const handleToggle = () => {
        if (!local.disabled) {
            context.setExpanded(local.nodeId, !isExpanded());
        }
    };

    const handleSelect = () => {
        if (!local.disabled) {
            context.setSelected(isSelected() ? null : local.nodeId);
        }
    };

    return (
        <li
            role="treeitem"
            class={local.class}
            data-expanded={isExpanded() ? "" : undefined}
            data-selected={isSelected() ? "" : undefined}
            data-disabled={local.disabled ? "" : undefined}
            aria-expanded={hasChildren() ? isExpanded() : undefined}
            aria-selected={isSelected()}
            {...others}
        >
            <div
                role="button"
                onClick={handleSelect}
                onDblClick={handleToggle}
                tabIndex={0}
            >
                <Show when={hasChildren()}>
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleToggle();
                        }}
                        aria-label={isExpanded() ? "折叠" : "展开"}
                    >
                        {isExpanded() ? "▼" : "▶"}
                    </button>
                </Show>
                {local.label}
            </div>
            <Show when={isExpanded() && hasChildren()}>
                <ul role="group">
                    <For each={local.items}>
                        {(child) => (
                            <TreeItem
                                nodeId={child.id}
                                label={child.label}
                                disabled={child.disabled}
                                items={child.children}
                            />
                        )}
                    </For>
                </ul>
            </Show>
        </li>
    );
};

TreeView.Item = TreeItem;

