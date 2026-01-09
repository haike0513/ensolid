/**
 * SolidFlow 工具函数
 */

import type {
    Connection,
    Edge,
    EdgeChange,
    Node,
    NodeChange,
    Position,
    Viewport,
    XYPosition,
} from "../types";

/**
 * 计算两点之间的距离
 */
export function getDistance(
    point1: XYPosition,
    point2: XYPosition,
): number {
    const dx = point2.x - point1.x;
    const dy = point2.y - point1.y;
    return Math.sqrt(dx * dx + dy * dy);
}

/**
 * 计算两点之间的角度
 */
export function getAngle(point1: XYPosition, point2: XYPosition): number {
    return Math.atan2(point2.y - point1.y, point2.x - point1.x);
}

/**
 * 将屏幕坐标转换为流程图画布坐标
 */
export function screenToFlowPosition(
    screenPosition: XYPosition,
    viewport: Viewport,
): XYPosition {
    return {
        x: (screenPosition.x - viewport.x) / viewport.zoom,
        y: (screenPosition.y - viewport.y) / viewport.zoom,
    };
}

/**
 * 将流程图画布坐标转换为屏幕坐标
 */
export function flowToScreenPosition(
    flowPosition: XYPosition,
    viewport: Viewport,
): XYPosition {
    return {
        x: flowPosition.x * viewport.zoom + viewport.x,
        y: flowPosition.y * viewport.zoom + viewport.y,
    };
}

/**
 * 限制数值在范围内
 */
export function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
}

/**
 * 限制缩放级别
 */
export function clampZoom(
    zoom: number,
    minZoom?: number,
    maxZoom?: number,
): number {
    return clamp(zoom, minZoom ?? 0.5, maxZoom ?? 2);
}

/**
 * 获取节点的中心位置
 */
export function getNodeCenter(node: Node): XYPosition {
    const width = node.width ?? 0;
    const height = node.height ?? 0;
    return {
        x: node.position.x + width / 2,
        y: node.position.y + height / 2,
    };
}

/**
 * 检查点是否在矩形内
 */
export function isPointInRect(
    point: XYPosition,
    rect: { x: number; y: number; width: number; height: number },
): boolean {
    return (
        point.x >= rect.x &&
        point.x <= rect.x + rect.width &&
        point.y >= rect.y &&
        point.y <= rect.y + rect.height
    );
}

/**
 * 合并类名
 */
export function classNames(
    ...classes: (string | undefined | null | false)[]
): string {
    return classes.filter(Boolean).join(" ");
}

/**
 * 获取元素的边界矩形
 */
export function getRectOfNodes(nodes: Node[]): {
    x: number;
    y: number;
    width: number;
    height: number;
} {
    if (nodes.length === 0) {
        return { x: 0, y: 0, width: 0, height: 0 };
    }

    const xs = nodes.map((node) => node.position.x);
    const ys = nodes.map((node) => node.position.y);
    const widths = nodes.map((node) => node.width ?? 0);
    const heights = nodes.map((node) => node.height ?? 0);

    const minX = Math.min(...xs);
    const minY = Math.min(...ys);
    const maxX = Math.max(...xs.map((x, i) => x + widths[i]));
    const maxY = Math.max(...ys.map((y, i) => y + heights[i]));

    return {
        x: minX,
        y: minY,
        width: maxX - minX,
        height: maxY - minY,
    };
}

/**
 * 获取 Handle 的位置（相对于节点的坐标）
 */
export function getHandlePosition(
    position: Position,
    nodeWidth: number = 150,
    nodeHeight: number = 40,
): XYPosition {
    switch (position) {
        case "top":
            return { x: nodeWidth / 2, y: 0 };
        case "bottom":
            return { x: nodeWidth / 2, y: nodeHeight };
        case "left":
            return { x: 0, y: nodeHeight / 2 };
        case "right":
            return { x: nodeWidth, y: nodeHeight / 2 };
        default:
            return { x: nodeWidth / 2, y: nodeHeight / 2 };
    }
}

/**
 * 获取节点的 Handle 绝对位置
 */
export function getNodeHandlePosition(
    node: Node,
    handleId: string | null,
    handlePosition: Position,
): XYPosition {
    const nodePos = node.position;
    const nodeWidth = node.width ?? 150;
    const nodeHeight = node.height ?? 40;

    let pos = handlePosition;
    if (handleId && ["top", "bottom", "left", "right"].includes(handleId)) {
        pos = handleId as Position;
    }

    const handleRelativePos = getHandlePosition(pos, nodeWidth, nodeHeight);

    return {
        x: nodePos.x + handleRelativePos.x,
        y: nodePos.y + handleRelativePos.y,
    };
}

/**
 * 获取直线路径
 */
export function getStraightPath(
    sourcePos: XYPosition,
    targetPos: XYPosition,
): string {
    return `M ${sourcePos.x} ${sourcePos.y} L ${targetPos.x} ${targetPos.y}`;
}

/**
 * 获取简单贝塞尔曲线路径
 */
export function getSimpleBezierPath(
    sourcePos: XYPosition,
    targetPos: XYPosition,
    sourcePosition: Position = "right",
    targetPosition: Position = "left",
): string {
    const offset = 50;
    let sourceX = sourcePos.x;
    let sourceY = sourcePos.y;
    let targetX = targetPos.x;
    let targetY = targetPos.y;

    // 根据位置调整控制点
    switch (sourcePosition) {
        case "right":
            sourceX += offset;
            break;
        case "left":
            sourceX -= offset;
            break;
        case "top":
            sourceY -= offset;
            break;
        case "bottom":
            sourceY += offset;
            break;
    }

    switch (targetPosition) {
        case "right":
            targetX += offset;
            break;
        case "left":
            targetX -= offset;
            break;
        case "top":
            targetY -= offset;
            break;
        case "bottom":
            targetY += offset;
            break;
    }

    const dx = targetX - sourceX;
    const cp1x = sourceX + dx * 0.25;
    const cp1y = sourceY;
    const cp2x = sourceX + dx * 0.75;
    const cp2y = targetY;

    return `M ${sourcePos.x} ${sourcePos.y} C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${targetPos.x} ${targetPos.y}`;
}

/**
 * 获取贝塞尔曲线路径
 */
export function getBezierPath(
    sourcePos: XYPosition,
    targetPos: XYPosition,
    sourcePosition: Position = "right",
    targetPosition: Position = "left",
): string {
    const offset = 50;
    let sourceX = sourcePos.x;
    let sourceY = sourcePos.y;
    let targetX = targetPos.x;
    let targetY = targetPos.y;

    // 根据位置调整控制点
    switch (sourcePosition) {
        case "right":
            sourceX += offset;
            break;
        case "left":
            sourceX -= offset;
            break;
        case "top":
            sourceY -= offset;
            break;
        case "bottom":
            sourceY += offset;
            break;
    }

    switch (targetPosition) {
        case "right":
            targetX += offset;
            break;
        case "left":
            targetX -= offset;
            break;
        case "top":
            targetY -= offset;
            break;
        case "bottom":
            targetY += offset;
            break;
    }

    return `M ${sourcePos.x} ${sourcePos.y} C ${sourceX} ${sourceY} ${targetX} ${targetY} ${targetPos.x} ${targetPos.y}`;
}

/**
 * 获取平滑步进路径
 */
export function getSmoothStepPath(
    sourcePos: XYPosition,
    targetPos: XYPosition,
    sourcePosition: Position = "right",
    targetPosition: Position = "left",
): string {
    const offset = 25;
    let sourceX = sourcePos.x;
    let sourceY = sourcePos.y;
    let targetX = targetPos.x;
    let targetY = targetPos.y;

    // 根据源位置计算第一个中间点
    let firstX = sourceX;
    let firstY = sourceY;
    switch (sourcePosition) {
        case "right":
            firstX = sourceX + offset;
            break;
        case "left":
            firstX = sourceX - offset;
            break;
        case "top":
            firstY = sourceY - offset;
            break;
        case "bottom":
            firstY = sourceY + offset;
            break;
    }

    // 根据目标位置计算第二个中间点
    let secondX = targetX;
    let secondY = targetY;
    switch (targetPosition) {
        case "right":
            secondX = targetX + offset;
            break;
        case "left":
            secondX = targetX - offset;
            break;
        case "top":
            secondY = targetY - offset;
            break;
        case "bottom":
            secondY = targetY + offset;
            break;
    }

    // 确定中间点的位置
    let midX: number;
    let midY: number;

    if (sourcePosition === "right" || sourcePosition === "left") {
        // 从左右开始，先水平再垂直
        midX = secondX;
        midY = firstY;
    } else {
        // 从上下开始，先垂直再水平
        midX = firstX;
        midY = secondY;
    }

    // 构建路径，使用 L 命令创建阶梯效果
    return `M ${sourcePos.x} ${sourcePos.y} L ${firstX} ${firstY} L ${midX} ${midY} L ${secondX} ${secondY} L ${targetPos.x} ${targetPos.y}`;
}

/**
 * 应用节点变化
 */
export function applyNodeChanges(
    changes: NodeChange[],
    nodes: Node[],
): Node[] {
    const newNodes = [...nodes];

    for (const change of changes) {
        const index = newNodes.findIndex((n) => n.id === change.id);

        switch (change.type) {
            case "position": {
                if (index !== -1) {
                    const node = newNodes[index];
                    newNodes[index] = {
                        ...node,
                        ...(change.position && { position: change.position }),
                        ...(change.positionAbsolute && {
                            positionAbsolute: change.positionAbsolute,
                        }),
                        ...(change.dragging !== undefined && {
                            dragging: change.dragging,
                        }),
                    };
                }
                break;
            }
            case "dimensions": {
                if (index !== -1 && change.dimensions) {
                    const node = newNodes[index];
                    newNodes[index] = {
                        ...node,
                        width: change.dimensions.width,
                        height: change.dimensions.height,
                        position: {
                            x: change.dimensions.x,
                            y: change.dimensions.y,
                        },
                    };
                }
                break;
            }
            case "select": {
                if (index !== -1) {
                    const node = newNodes[index];
                    newNodes[index] = {
                        ...node,
                        selected: change.selected,
                    };
                }
                break;
            }
            case "remove": {
                if (index !== -1) {
                    newNodes.splice(index, 1);
                }
                break;
            }
            case "add": {
                if (index === -1 && change.item) {
                    newNodes.push(change.item);
                }
                break;
            }
            case "reset": {
                if (index !== -1 && change.item) {
                    newNodes[index] = change.item;
                }
                break;
            }
        }
    }

    return newNodes;
}

/**
 * 应用边变化
 */
export function applyEdgeChanges(
    changes: EdgeChange[],
    edges: Edge[],
): Edge[] {
    const newEdges = [...edges];

    for (const change of changes) {
        const index = newEdges.findIndex((e) => e.id === change.id);

        switch (change.type) {
            case "select": {
                if (index !== -1) {
                    const edge = newEdges[index];
                    newEdges[index] = {
                        ...edge,
                        selected: change.selected,
                    };
                }
                break;
            }
            case "remove": {
                if (index !== -1) {
                    newEdges.splice(index, 1);
                }
                break;
            }
            case "add": {
                if (index === -1 && change.item) {
                    newEdges.push(change.item);
                }
                break;
            }
            case "reset": {
                if (index !== -1 && change.item) {
                    newEdges[index] = change.item;
                }
                break;
            }
        }
    }

    return newEdges;
}

/**
 * 添加边
 */
export function addEdge(
    connection: Connection,
    edges: Edge[],
    options?: Partial<Edge>,
): Edge[] {
    if (
        !connection.source ||
        !connection.target ||
        connection.source === connection.target
    ) {
        return edges;
    }

    const newEdge: Edge = {
        id: `${connection.source}-${connection.target}`,
        source: connection.source,
        target: connection.target,
        sourceHandle: connection.sourceHandle ?? null,
        targetHandle: connection.targetHandle ?? null,
        ...options,
    };

    // 检查是否已存在相同的边
    const edgeExists = edges.some(
        (e) =>
            e.source === newEdge.source &&
            e.target === newEdge.target &&
            e.sourceHandle === newEdge.sourceHandle &&
            e.targetHandle === newEdge.targetHandle,
    );

    if (edgeExists) {
        return edges;
    }

    return [...edges, newEdge];
}

/**
 * 判断是否为节点
 */
export function isNode(item: Node | Edge): item is Node {
    return "position" in item && "data" in item;
}

/**
 * 判断是否为边
 */
export function isEdge(item: Node | Edge): item is Edge {
  return "source" in item && "target" in item;
}

// 导出历史管理器
export { HistoryManager } from "./history";
export type { HistoryState } from "./history";

// 导出剪贴板管理器
export { ClipboardManager } from "./clipboard";

// 导出对齐工具
export {
  detectAlignmentLines,
  calculateSnapPosition,
  snapToGrid,
} from "./alignment";
export type { AlignmentLine, AlignmentResult } from "./alignment";

// 导出节点分组工具
export {
  calculateAbsolutePosition,
  isNodeInParentBounds,
  clampNodePositionToParent,
  getChildNodes,
  getDescendantNodes,
} from "./parentNode";

// 导出导入导出工具
export {
  exportToJSON,
  importFromJSON,
  downloadFlowData,
  readFlowDataFromFile,
} from "./importExport";
export type { FlowData } from "./importExport";
