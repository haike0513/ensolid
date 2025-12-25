/**
 * Edge 组件 - 流程边/连接线
 */

import { Component, JSX, splitProps, Show } from 'solid-js';
import type { Edge as EdgeType, Node, XYPosition } from '../../types';

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
    'edge',
    'sourceNode',
    'targetNode',
    'selected',
    'sourcePosition',
    'targetPosition',
    'onClick',
    'onDoubleClick',
    'renderEdge',
  ]);

  const handleClick = (event: MouseEvent) => {
    local.onClick?.(event, local.edge);
  };

  const handleDoubleClick = (event: MouseEvent) => {
    local.onDoubleClick?.(event, local.edge);
  };

  // 计算边的路径
  const getEdgePath = (): string => {
    const sourcePos = local.sourcePosition ?? local.sourceNode?.position ?? { x: 0, y: 0 };
    const targetPos = local.targetPosition ?? local.targetNode?.position ?? { x: 0, y: 0 };

    const sourceX = sourcePos.x + (local.sourceNode?.width ?? 0) / 2;
    const sourceY = sourcePos.y + (local.sourceNode?.height ?? 0) / 2;
    const targetX = targetPos.x + (local.targetNode?.width ?? 0) / 2;
    const targetY = targetPos.y + (local.targetNode?.height ?? 0) / 2;

    // 简单的直线路径，可以根据需要扩展为贝塞尔曲线
    return `M ${sourceX} ${sourceY} L ${targetX} ${targetY}`;
  };

  const path = () => getEdgePath();

  const edgeStyle = () => ({
    zIndex: local.edge.zIndex ?? (local.selected ? 1000 : 1),
    ...local.edge.style,
  });

  return (
    <g
      {...others}
      data-id={local.edge.id}
      data-type={local.edge.type}
      data-selected={local.selected}
      class={local.edge.className}
      classList={{
        'solidflow-edge': true,
        'solidflow-edge-selected': local.selected,
        'solidflow-edge-animated': local.edge.animated,
        ...(local.edge.classList?.reduce(
          (acc, cls) => ({ ...acc, [cls]: true }),
          {} as Record<string, boolean>
        ) ?? {}),
      }}
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
              stroke={local.edge.style?.stroke ?? '#b1b1b7'}
              stroke-width={local.edge.style?.strokeWidth ?? '2'}
              style={edgeStyle() as any}
              marker-end={local.edge.markerEnd ? 'url(#arrowhead)' : undefined}
            />
            <Show when={local.edge.label}>
              <text
                 x={((local.sourcePosition?.x ?? 0) + (local.targetPosition?.x ?? 0)) / 2}
                 y={((local.sourcePosition?.y ?? 0) + (local.targetPosition?.y ?? 0)) / 2}
                text-anchor="middle"
                dominant-baseline="middle"
                fill={local.edge.labelStyle?.color ?? '#000'}
                 style={local.edge.labelStyle as any}
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


