/**
 * MiniMap 组件 - 流程图画布小地图
 */

import { Component, JSX, splitProps } from 'solid-js';
import type { Node, Edge, Viewport } from '../../types';

export interface MiniMapProps {
  /**
   * 节点数组
   */
  nodes: Node[];
  /**
   * 边数组
   */
  edges?: Edge[];
  /**
   * 视口信息
   */
  viewport: Viewport;
  /**
   * 节点颜色
   */
  nodeColor?: string | ((node: Node) => string);
  /**
   * 节点描边颜色
   */
  nodeStrokeColor?: string | ((node: Node) => string);
  /**
   * 节点描边宽度
   */
  nodeStrokeWidth?: number;
  /**
   * 遮罩颜色
   */
  maskColor?: string;
  /**
   * 类名
   */
  className?: string;
  /**
   * 样式
   */
  style?: JSX.CSSProperties;
  /**
   * 位置
   * @default 'bottom-right'
   */
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  /**
   * 是否可点击平移
   * @default true
   */
  pannable?: boolean;
  /**
   * 是否可缩放
   * @default false
   */
  zoomable?: boolean;
  /**
   * 点击回调
   */
  onClick?: (event: MouseEvent) => void;
  /**
   * 点击节点回调
   */
  onNodeClick?: (event: MouseEvent, node: Node) => void;
}

export const MiniMap: Component<MiniMapProps> = (props) => {
  const [local, others] = splitProps(props, [
    'nodes',
    'edges',
    'viewport',
    'nodeColor',
    'nodeStrokeColor',
    'nodeStrokeWidth',
    'maskColor',
    'className',
    'style',
    'position',
    'pannable',
    'zoomable',
    'onClick',
    'onNodeClick',
  ]);

  const position = () => local.position ?? 'bottom-right';
  const pannable = () => local.pannable ?? true;
  const nodeStrokeWidth = () => local.nodeStrokeWidth ?? 2;

  const getPositionClasses = (pos: string) => {
    const classes: Record<string, string> = {
      'top-left': 'top-4 left-4',
      'top-right': 'top-4 right-4',
      'bottom-left': 'bottom-4 left-4',
      'bottom-right': 'bottom-4 right-4',
    };
    return classes[pos];
  };

  const getNodeColor = (node: Node): string => {
    if (typeof local.nodeColor === 'function') {
      return local.nodeColor(node);
    }
    return local.nodeColor ?? (node.selected ? '#ff0072' : '#1a192b');
  };

  const getNodeStrokeColor = (node: Node): string => {
    if (typeof local.nodeStrokeColor === 'function') {
      return local.nodeStrokeColor(node);
    }
    return local.nodeStrokeColor ?? '#fff';
  };

  // 计算节点边界
  const getBounds = () => {
    if (local.nodes.length === 0) {
      return { x: 0, y: 0, width: 100, height: 100 };
    }

    const xs = local.nodes.map((node) => node.position.x);
    const ys = local.nodes.map((node) => node.position.y);
    const widths = local.nodes.map((node) => node.width ?? 150);
    const heights = local.nodes.map((node) => node.height ?? 40);

    const minX = Math.min(...xs);
    const minY = Math.min(...ys);
    const maxX = Math.max(...xs.map((x, i) => x + widths[i]));
    const maxY = Math.max(...ys.map((y, i) => y + heights[i]));

    const padding = 20;
    return {
      x: minX - padding,
      y: minY - padding,
      width: maxX - minX + padding * 2,
      height: maxY - minY + padding * 2,
    };
  };

  const bounds = () => getBounds();

  return (
    <div
      {...others}
      class={local.className}
      classList={{
        'absolute z-10 bg-white border border-gray-300 rounded shadow-lg overflow-hidden': true,
        [getPositionClasses(position())]: true,
      }}
      style={{
        width: '200px',
        height: '200px',
        ...local.style,
      }}
      onClick={local.onClick}
    >
      <svg width="200" height="200" viewBox={`${bounds().x} ${bounds().y} ${bounds().width} ${bounds().height}`}>
        {local.nodes.map((node) => (
          <rect
            x={node.position.x}
            y={node.position.y}
            width={node.width ?? 150}
            height={node.height ?? 40}
            fill={getNodeColor(node)}
            stroke={getNodeStrokeColor(node)}
            stroke-width={nodeStrokeWidth()}
            rx="4"
            onClick={(e) => local.onNodeClick?.(e, node)}
            style={{ cursor: pannable() ? 'pointer' : 'default' }}
          />
        ))}
      </svg>
    </div>
  );
};

