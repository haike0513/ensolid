import { type Component, type JSX, splitProps, Show, onMount, onCleanup } from "solid-js";
import type { Node as NodeType } from "../../types";

export interface NodeProps {
  /**
   * 节点数据
   */
  node: NodeType;
  /**
   * 是否选中
   */
  selected?: boolean;
  /**
   * 是否正在拖拽
   */
  dragging?: boolean;
  /**
   * 连接点组件
   */
  children?: JSX.Element;
  /**
   * 自定义节点渲染
   */
  renderNode?: (node: NodeType) => JSX.Element;
  /**
   * 节点点击事件
   */
  onClick?: (event: MouseEvent, node: NodeType) => void;
  /**
   * 节点双击事件
   */
  onDoubleClick?: (event: MouseEvent, node: NodeType) => void;
  /**
   * 节点鼠标进入事件
   */
  onMouseEnter?: (event: MouseEvent, node: NodeType) => void;
  /**
   * 节点鼠标离开事件
   */
  onMouseLeave?: (event: MouseEvent, node: NodeType) => void;
  /**
   * 节点鼠标按下事件
   */
  onMouseDown?: (event: MouseEvent, node: NodeType) => void;
  /**
   * 节点鼠标抬起事件
   */
  onMouseUp?: (event: MouseEvent, node: NodeType) => void;
  /**
   * 节点尺寸变化事件
   */
  onDimensionsChange?: (
    id: string,
    dimensions: { width: number; height: number; x: number; y: number }
  ) => void;
}

export const Node: Component<NodeProps> = (props) => {
  const [local, others] = splitProps(props, [
    "node",
    "selected",
    "dragging",
    "children",
    "renderNode",
    "onClick",
    "onDoubleClick",
    "onMouseEnter",
    "onMouseLeave",
    "onMouseDown",
    "onMouseUp",
    "onDimensionsChange",
  ]);

  let nodeRef: HTMLDivElement | undefined;

  onMount(() => {
    if (nodeRef) {
      const observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          if (local.onDimensionsChange) {
            local.onDimensionsChange(local.node.id, {
              width:
                entry.borderBoxSize?.[0]?.inlineSize ?? entry.contentRect.width,
              height:
                entry.borderBoxSize?.[0]?.blockSize ?? entry.contentRect.height,
              x: local.node.position.x,
              y: local.node.position.y,
            });
          }
        }
      });
      observer.observe(nodeRef);

      onCleanup(() => {
        observer.disconnect();
      });
    }
  });

  const handleClick = (event: MouseEvent) => {
    // console.log("NodeComponent: Native click received", local.node.id);
    local.onClick?.(event, local.node);
  };

  const handleDoubleClick = (event: MouseEvent) => {
    // console.log("NodeComponent: Native double click received", local.node.id);
    local.onDoubleClick?.(event, local.node);
  };

  const handleMouseEnter = (event: MouseEvent) => {
    // console.log("NodeComponent: Native mouse enter received", event);
    local.onMouseEnter?.(event, local.node);
  };

  const handleMouseLeave = (event: MouseEvent) => {
    // console.log("NodeComponent: Native mouse leave received", local.node.id);
    local.onMouseLeave?.(event, local.node);
  };

  const handleMouseDown = (event: MouseEvent) => {
    // console.log("NodeComponent: Native mouse down received", local.node.id);
    local.onMouseDown?.(event, local.node);
  };

  const handleMouseUp = (event: MouseEvent) => {
    console.log("NodeComponent: Native mouse up received", local.node.id);
    local.onMouseUp?.(event, local.node);
  };

  const nodeStyle = () => ({
    position: "absolute" as const,
    left: `${local.node.position.x}px`,
    top: `${local.node.position.y}px`,
    width: local.node.width ? `${local.node.width}px` : "auto",
    height: local.node.height ? `${local.node.height}px` : "auto",
    zIndex: local.node.zIndex ?? (local.selected ? 1000 : 1),
    "pointer-events": "auto",
    ...local.node.style,
  });

  return (
    <div
      ref={nodeRef}
      {...others}
      data-id={local.node.id}
      data-type={local.node.type}
      data-selected={local.selected}
      data-dragging={local.dragging}
      class={local.node.className}
      classList={{
        "solidflow-node": true,
        "solidflow-node-selected": local.selected,
        "solidflow-node-dragging": local.dragging,
        ...(local.node.classList?.reduce(
          (acc, cls) => ({ ...acc, [cls]: true }),
          {} as Record<string, boolean>
        ) ?? {}),
      }}
      style={nodeStyle() as any}
      onClick={handleClick}
      onDblClick={handleDoubleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <Show
        when={local.renderNode}
        fallback={<div>{local.node.data?.label ?? local.node.id}</div>}
      >
        {local.renderNode?.(local.node)}
      </Show>
      {local.children}
    </div>
  );
};
