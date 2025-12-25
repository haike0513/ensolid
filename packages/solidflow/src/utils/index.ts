/**
 * SolidFlow 工具函数
 */

import type { Node, Viewport, XYPosition } from "../types";

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
