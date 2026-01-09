/**
 * Edge 组件 - 流程边/连接线
 */

import { type Component, type JSX, Show, splitProps, createSignal, onMount, createEffect } from "solid-js";
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
   * 边标签编辑回调
   */
  onLabelEdit?: (edgeId: string, label: string) => void;
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
    "onLabelEdit",
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
    <svg
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
        position: "absolute",
        width: "100%",
        height: "100%",
        top: 0,
        left: 0,
        overflow: "visible",
        "pointer-events": "none",
        "z-index": local.edge.zIndex ?? (local.selected ? 1000 : 1),
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
            <Show when={local.edge.label !== undefined || local.onLabelEdit}>
              {(() => {
                const [isEditing, setIsEditing] = createSignal(false);
                const [labelText, setLabelText] = createSignal(local.edge.label || "");
                let inputRef: HTMLInputElement | undefined;
                let foreignObjectRef: SVGForeignObjectElement | undefined;

                const handleDoubleClick = (e: MouseEvent) => {
                  if (local.onLabelEdit) {
                    e.stopPropagation();
                    setIsEditing(true);
                  }
                  local.onDoubleClick?.(e, local.edge);
                };

                const handleBlur = () => {
                  setIsEditing(false);
                  if (local.onLabelEdit && labelText() !== local.edge.label) {
                    local.onLabelEdit(local.edge.id, labelText());
                  }
                };

                const handleKeyDown = (e: KeyboardEvent) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleBlur();
                  } else if (e.key === "Escape") {
                    e.preventDefault();
                    setLabelText(local.edge.label || "");
                    setIsEditing(false);
                  }
                };

                // 同步外部 label 变化
                createEffect(() => {
                  if (!isEditing() && local.edge.label !== labelText()) {
                    setLabelText(local.edge.label || "");
                  }
                });

                onMount(() => {
                  if (isEditing() && inputRef) {
                    inputRef.focus();
                    inputRef.select();
                  }
                });

                const labelX = (sourcePos().x + targetPos().x) / 2;
                const labelY = (sourcePos().y + targetPos().y) / 2;
                const labelBgPadding = local.edge.labelBgPadding ?? [4, 2];
                const labelBgBorderRadius = local.edge.labelBgBorderRadius ?? 4;

                return (
                  <Show
                    when={isEditing()}
                    fallback={
                      <g
                        onDblClick={handleDoubleClick}
                        style={{ cursor: local.onLabelEdit ? "text" : "default" }}
                      >
                        <Show when={local.edge.labelShowBg && (local.edge.label || labelText())}>
                          <rect
                            x={labelX - (labelText().length * 6 + labelBgPadding[0] * 2) / 2}
                            y={labelY - 10 - labelBgPadding[1]}
                            width={labelText().length * 6 + labelBgPadding[0] * 2}
                            height={20 + labelBgPadding[1] * 2}
                            rx={labelBgBorderRadius}
                            fill={local.edge.labelBgStyle?.backgroundColor ?? "white"}
                            stroke={local.edge.labelBgStyle?.borderColor ?? "transparent"}
                            stroke-width={local.edge.labelBgStyle?.borderWidth ?? 0}
                            opacity={local.edge.labelBgStyle?.opacity ?? 0.9}
                          />
                        </Show>
                        <text
                          x={labelX}
                          y={labelY}
                          text-anchor="middle"
                          dominant-baseline="middle"
                          fill={local.edge.labelStyle?.color ?? "#000"}
                          style={{
                            ...local.edge.labelStyle,
                            "pointer-events": "all",
                            cursor: local.onLabelEdit ? "text" : "default",
                          } as any}
                          class="solidflow-edge-label"
                        >
                          {labelText() || local.edge.label || ""}
                        </text>
                      </g>
                    }
                  >
                    <foreignObject
                      ref={foreignObjectRef}
                      x={labelX - 50}
                      y={labelY - 12}
                      width="100"
                      height="24"
                      style={{ "pointer-events": "all" }}
                    >
                      <input
                        ref={inputRef}
                        type="text"
                        value={labelText()}
                        onInput={(e) => setLabelText(e.currentTarget.value)}
                        onBlur={handleBlur}
                        onKeyDown={handleKeyDown}
                        style={{
                          width: "100%",
                          padding: "2px 6px",
                          border: "1px solid #3b82f6",
                          "border-radius": "4px",
                          "font-size": "12px",
                          "text-align": "center",
                          outline: "none",
                        }}
                        class="solidflow-edge-label-input"
                      />
                    </foreignObject>
                  </Show>
                );
              })()}
            </Show>
          </>
        }
      >
        {local.renderEdge?.(local.edge, path())}
      </Show>
    </svg>
  );
};
