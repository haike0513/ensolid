/**
 * SolidFlow 类型定义
 * 移植自 xyflow/react
 */

import type { Component } from "solid-js";

export type NodeId = string;
export type EdgeId = string;

export type XYPosition = {
  x: number;
  y: number;
};

export type Position = "top" | "bottom" | "left" | "right";

export interface Node<T = any> {
  id: NodeId;
  position: XYPosition;
  type?: string;
  data: T;
  style?: Partial<CSSStyleDeclaration>;
  className?: string;
  classList?: string[];
  selected?: boolean;
  dragging?: boolean;
  width?: number;
  height?: number;
  parentNode?: NodeId;
  extent?: "parent" | [[number, number], [number, number]];
  expandParent?: boolean;
  positionAbsolute?: XYPosition;
  ariaLabel?: string;
  zIndex?: number;
  hidden?: boolean;
  disabled?: boolean;
  deletable?: boolean;
  focusable?: boolean;
  connectable?: boolean;
}

export interface Edge<T = any> {
  id: EdgeId;
  source: NodeId;
  target: NodeId;
  sourceHandle?: string | null;
  targetHandle?: string | null;
  type?: string;
  animated?: boolean;
  hidden?: boolean;
  deletable?: boolean;
  focusable?: boolean;
  data?: T;
  style?: Partial<CSSStyleDeclaration>;
  className?: string;
  classList?: string[];
  label?: string;
  labelStyle?: Partial<CSSStyleDeclaration>;
  labelShowBg?: boolean;
  labelBgStyle?: Partial<CSSStyleDeclaration>;
  labelBgPadding?: [number, number];
  labelBgBorderRadius?: number;
  markerStart?: EdgeMarkerType;
  markerEnd?: EdgeMarkerType;
  zIndex?: number;
  ariaLabel?: string;
  selected?: boolean;
}

export type EdgeMarkerType = string | {
  type: MarkerType;
  color?: string;
  width?: number;
  height?: number;
};
export type MarkerType = "arrow" | "arrowclosed";

export interface Viewport {
  x: number;
  y: number;
  zoom: number;
}

export interface Dimensions {
  width: number;
  height: number;
}

export interface Rect {
  width: number;
  height: number;
  x: number;
  y: number;
}

export interface NodeDimensions extends Dimensions {
  x: number;
  y: number;
}

export interface HandleElement {
  id?: string | null;
  type: "source" | "target";
  position: Position;
  nodeId: NodeId;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}

export interface Connection {
  source: NodeId | null;
  target: NodeId | null;
  sourceHandle: string | null;
  targetHandle: string | null;
}

export type NodeComponentProps = { node: Node };
export type EdgeComponentProps = { edge: Edge; path: string };

export type NodeTypes = Record<string, Component<NodeComponentProps>>;
export type EdgeTypes = Record<string, Component<EdgeComponentProps>>;

export type OnNodesChange = (changes: NodeChange[]) => void;
export type OnEdgesChange = (changes: EdgeChange[]) => void;
export type OnConnect = (connection: Connection) => void;
export type OnConnectStart = (
  event: MouseEvent | TouchEvent,
  params: {
    nodeId: NodeId | null;
    handleId: string | null;
    handleType: "source" | "target" | null;
  },
) => void;
export type OnConnectEnd = (event: MouseEvent | TouchEvent) => void;
export type OnNodesDelete = (nodes: Node[]) => void;
export type OnEdgesDelete = (edges: Edge[]) => void;
export type OnSelectionChange = (
  params: { nodes: Node[]; edges: Edge[] },
) => void;

export type NodeChange =
  | {
    id: NodeId;
    type: "position";
    position?: XYPosition;
    positionAbsolute?: XYPosition;
    dragging?: boolean;
  }
  | {
    id: NodeId;
    type: "dimensions";
    dimensions?: NodeDimensions;
  }
  | {
    id: NodeId;
    type: "select";
    selected: boolean;
  }
  | {
    id: NodeId;
    type: "remove";
  }
  | {
    id: NodeId;
    type: "add";
    item: Node;
  }
  | {
    id: NodeId;
    type: "reset";
    item: Node;
  };

export type EdgeChange =
  | {
    id: EdgeId;
    type: "select";
    selected: boolean;
  }
  | {
    id: EdgeId;
    type: "remove";
  }
  | {
    id: EdgeId;
    type: "add";
    item: Edge;
  }
  | {
    id: EdgeId;
    type: "reset";
    item: Edge;
  };

export interface FlowInstance {
  zoomIn: () => void;
  zoomOut: () => void;
  zoomTo: (zoom: number) => void;
  fitView: (options?: FitViewOptions) => void;
  setViewport: (viewport: Viewport) => void;
  getViewport: () => Viewport;
  project: (position: XYPosition) => XYPosition;
  toObject: () => { nodes: Node[]; edges: Edge[]; viewport: Viewport };
}

export interface FlowProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange?: OnNodesChange;
  onEdgesChange?: OnEdgesChange;
  onConnect?: OnConnect;
  onConnectStart?: OnConnectStart;
  onConnectEnd?: OnConnectEnd;
  onNodesDelete?: OnNodesDelete;
  onEdgesDelete?: OnEdgesDelete;
  onSelectionChange?: OnSelectionChange;
  onInit?: (instance: FlowInstance) => void;
  nodeTypes?: NodeTypes;
  edgeTypes?: EdgeTypes;
  defaultViewport?: Viewport;
  minZoom?: number;
  maxZoom?: number;
  defaultEdgeOptions?: Partial<Edge>;
  fitView?: boolean;
  fitViewOptions?: FitViewOptions;
  nodesDraggable?: boolean;
  nodesConnectable?: boolean;
  elementsSelectable?: boolean;
  selectNodesOnDrag?: boolean;
  panOnDrag?: boolean | number[];
  panOnScroll?: boolean;
  zoomOnScroll?: boolean;
  zoomOnPinch?: boolean;
  zoomOnDoubleClick?: boolean;
  preventScrolling?: boolean;
  style?: Partial<CSSStyleDeclaration>;
  className?: string;
  classList?: string[];
  id?: string;
  children?: any;
}

export interface FitViewOptions {
  padding?: number;
  includeHiddenNodes?: boolean;
  minZoom?: number;
  maxZoom?: number;
  duration?: number;
  nodes?: NodeId[];
}
