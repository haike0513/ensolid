/**
 * Edge 组件 - 流程边/连接线
 */

import { type Component, type JSX, Show, splitProps } from "solid-js";
import type { Edge as EdgeType, Node, Position, XYPosition } from "../../types";
import {
  getBezierPath,
  getNodeHandlePosition,
  getSimpleBezierPath,
  getSmoothStepPath,
  getStraightPath,
} from "../../utils";

export interface EdgeProps {
  /**
   * 边数据
   */
  edge: EdgeType;
  /**
   * 源节点
   */
  sourceNode?: Node;
  /**
   * 目标节点
   */
  targetNode?: Node;
  /**
   * 是否选中
   */
  selected?: boolean;
  /**
   * 源节点位置
   */
  sourcePosition?: XYPosition;
  /**
   * 目标节点位置
   */
  targetPosition?: XYPosition;
  /**
   * 边点击事件
   */
  onClick?: (event: MouseEvent, edge: EdgeType) => void;
  /**
   * 边双击事件
   */
  onDoubleClick?: (event: MouseEvent, edge: EdgeType) => void;
  /**
   * 自定义边渲染
   */
  renderEdge?: (edge: EdgeType, path: string) => JSX.Element;
}

export const Edge: Component<EdgeProps> = (props) => {
  const [local, others] = splitProps(props, [
    "edge",
    "sourceNode",
    "targetNode",
    "selected",
    "sourcePosition",
    "targetPosition",
    "onClick",
    "onDoubleClick",
    "renderEdge",
  ]);

  const handleClick = (event: MouseEvent) => {
    local.onClick?.(event, local.edge);
  };

  const handleDoubleClick = (event: MouseEvent) => {
    local.onDoubleClick?.(event, local.edge);
  };

  // 获取源节点的 Handle 位置
  const getSourcePosition = (): XYPosition => {
    if (local.sourcePosition) {
      return local.sourcePosition;
    }
    if (local.sourceNode) {
      // 如果指定了 sourceHandle，尝试找到对应的 Handle 位置
      const handleId = local.edge.sourceHandle;
      const sourceNode = local.sourceNode;

      // 默认使用 right 位置（输出）
      const defaultPosition: Position = "right";
      return getNodeHandlePosition(
        sourceNode,
        handleId ?? null,
        defaultPosition,
      );
    }
    return { x: 0, y: 0 };
  };

  // 获取目标节点的 Handle 位置
  const getTargetPosition = (): XYPosition => {
    if (local.targetPosition) {
      return local.targetPosition;
    }
    if (local.targetNode) {
      // 如果指定了 targetHandle，尝试找到对应的 Handle 位置
      const handleId = local.edge.targetHandle;
      const targetNode = local.targetNode;

      // 默认使用 left 位置（输入）
      const defaultPosition: Position = "left";
      return getNodeHandlePosition(
        targetNode,
        handleId ?? null,
        defaultPosition,
      );
    }
    return { x: 0, y: 0 };
  };

  // 计算边的路径
  const getEdgePath = (): string => {
    const sourcePos = getSourcePosition();
    const targetPos = getTargetPosition();

    // 确定源和目标的位置（用于路径计算）
    const sourcePosition: Position = local.edge.sourceHandle
      ? "right" // 可以根据实际 Handle 位置确定
      : "right";
    const targetPosition: Position = local.edge.targetHandle
      ? "left" // 可以根据实际 Handle 位置确定
      : "left";

    const edgeType = local.edge.type ?? "default";

    switch (edgeType) {
      case "straight":
        return getStraightPath(sourcePos, targetPos);
      case "step":
      case "smoothstep":
        return getSmoothStepPath(
          sourcePos,
          targetPos,
          sourcePosition,
          targetPosition,
        );
      case "bezier":
        return getBezierPath(
          sourcePos,
          targetPos,
          sourcePosition,
          targetPosition,
        );
      case "simplebezier":
      case "default":
      default:
        return getSimpleBezierPath(
          sourcePos,
          targetPos,
          sourcePosition,
          targetPosition,
        );
    }
  };

  const path = () => getEdgePath();
  const sourcePos = () => getSourcePosition();
  const targetPos = () => getTargetPosition();

  const edgeStyle = () => ({
    zIndex: local.edge.zIndex ?? (local.selected ? 1000 : 1),
    ...local.edge.style,
  });

  // 获取标记 ID
  const getMarkerEnd = (): string | undefined => {
    if (!local.edge.markerEnd && !local.edge.markerStart) {
      // 默认添加箭头标记
      return local.selected ? "url(#arrowhead-selected)" : "url(#arrowhead)";
    }

    if (local.edge.markerEnd) {
      if (typeof local.edge.markerEnd === "string") {
        return `url(#${local.edge.markerEnd})`;
      } else {
        const markerType = local.edge.markerEnd.type === "arrowclosed"
          ? "arrowclosed"
          : "arrowhead";
        const markerId = local.selected ? `${markerType}-selected` : markerType;
        return `url(#${markerId})`;
      }
    }

    return undefined;
  };

  const getMarkerStart = (): string | undefined => {
    if (local.edge.markerStart) {
      if (typeof local.edge.markerStart === "string") {
        return `url(#${local.edge.markerStart})`;
      } else {
        const markerType = local.edge.markerStart.type === "arrowclosed"
          ? "arrowclosed"
          : "arrowhead";
        const markerId = local.selected ? `${markerType}-selected` : markerType;
        return `url(#${markerId})`;
      }
    }
    return undefined;
  };

  return (
    <g
      {...others}
      data-id={local.edge.id}
      data-type={local.edge.type}
      data-selected={local.selected}
      class={local.edge.className}
      classList={{
        "solidflow-edge": true,
        "solidflow-edge-selected": local.selected,
        "solidflow-edge-animated": local.edge.animated,
        ...(local.edge.classList?.reduce(
          (acc, cls) => ({ ...acc, [cls]: true }),
          {} as Record<string, boolean>,
        ) ?? {}),
      }}
      style={{
        "pointer-events": "all",
      } as any}
      onClick={handleClick}
      onDblClick={handleDoubleClick}
    >
      <Show
        when={local.renderEdge}
        fallback={
          <>
            <path
              d={path()}
              fill="none"
              stroke={local.edge.style?.stroke ??
                (local.selected ? "#3b82f6" : "#b1b1b7")}
              stroke-width={local.edge.style?.strokeWidth ??
                (local.selected ? "3" : "2")}
              style={{
                ...edgeStyle(),
                "pointer-events": "stroke",
                cursor: "pointer",
              } as any}
              marker-start={getMarkerStart()}
              marker-end={getMarkerEnd()}
            />
            <Show when={local.edge.label}>
              <text
                x={(sourcePos().x + targetPos().x) / 2}
                y={(sourcePos().y + targetPos().y) / 2}
                text-anchor="middle"
                dominant-baseline="middle"
                fill={local.edge.labelStyle?.color ?? "#000"}
                style={local.edge.labelStyle as any}
                class="solidflow-edge-label"
              >
                {local.edge.label}
              </text>
            </Show>
          </>
        }
      >
        {local.renderEdge?.(local.edge, path())}
      </Show>
    </g>
  );
};
