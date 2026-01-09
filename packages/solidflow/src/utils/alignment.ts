/**
 * 节点对齐工具
 * 用于检测和显示节点对齐辅助线
 */

import type { Node, XYPosition } from "../types";
import { getNodeCenter } from "./index";

/**
 * 对齐辅助线类型
 */
export interface AlignmentLine {
  type: "horizontal" | "vertical";
  position: number;
  nodes: Node[];
}

/**
 * 对齐检测结果
 */
export interface AlignmentResult {
  lines: AlignmentLine[];
  snapPosition?: XYPosition;
}

/**
 * 检测对齐辅助线
 * @param draggedNode 正在拖拽的节点
 * @param otherNodes 其他节点数组
 * @param threshold 对齐阈值（像素），默认 5
 * @returns 对齐辅助线数组
 */
export function detectAlignmentLines(
  draggedNode: Node,
  otherNodes: Node[],
  threshold: number = 5
): AlignmentLine[] {
  const lines: AlignmentLine[] = [];
  const draggedCenter = getNodeCenter(draggedNode);
  const draggedLeft = draggedNode.position.x;
  const draggedRight = draggedNode.position.x + (draggedNode.width ?? 150);
  const draggedTop = draggedNode.position.y;
  const draggedBottom = draggedNode.position.y + (draggedNode.height ?? 40);

  for (const node of otherNodes) {
    if (node.id === draggedNode.id) continue;

    const nodeCenter = getNodeCenter(node);
    const nodeLeft = node.position.x;
    const nodeRight = node.position.x + (node.width ?? 150);
    const nodeTop = node.position.y;
    const nodeBottom = node.position.y + (node.height ?? 40);

    // 检查水平对齐（中心、顶部、底部）
    if (Math.abs(draggedCenter.y - nodeCenter.y) < threshold) {
      lines.push({
        type: "horizontal",
        position: nodeCenter.y,
        nodes: [node],
      });
    } else if (Math.abs(draggedTop - nodeTop) < threshold) {
      lines.push({
        type: "horizontal",
        position: nodeTop,
        nodes: [node],
      });
    } else if (Math.abs(draggedBottom - nodeBottom) < threshold) {
      lines.push({
        type: "horizontal",
        position: nodeBottom,
        nodes: [node],
      });
    }

    // 检查垂直对齐（中心、左侧、右侧）
    if (Math.abs(draggedCenter.x - nodeCenter.x) < threshold) {
      lines.push({
        type: "vertical",
        position: nodeCenter.x,
        nodes: [node],
      });
    } else if (Math.abs(draggedLeft - nodeLeft) < threshold) {
      lines.push({
        type: "vertical",
        position: nodeLeft,
        nodes: [node],
      });
    } else if (Math.abs(draggedRight - nodeRight) < threshold) {
      lines.push({
        type: "vertical",
        position: nodeRight,
        nodes: [node],
      });
    }
  }

  return lines;
}

/**
 * 计算对齐后的位置
 * @param draggedNode 正在拖拽的节点
 * @param otherNodes 其他节点数组
 * @param threshold 对齐阈值（像素），默认 5
 * @returns 对齐后的位置，如果没有对齐则返回原位置
 */
export function calculateSnapPosition(
  draggedNode: Node,
  otherNodes: Node[],
  threshold: number = 5
): XYPosition {
  const lines = detectAlignmentLines(draggedNode, otherNodes, threshold);
  if (lines.length === 0) {
    return draggedNode.position;
  }

  let snapX = draggedNode.position.x;
  let snapY = draggedNode.position.y;
  const draggedCenter = getNodeCenter(draggedNode);

  // 找到最近的对齐线
  let minHorizontalDist = Infinity;
  let minVerticalDist = Infinity;
  let bestHorizontalLine: AlignmentLine | null = null;
  let bestVerticalLine: AlignmentLine | null = null;

  for (const line of lines) {
    if (line.type === "horizontal") {
      const dist = Math.abs(draggedCenter.y - line.position);
      if (dist < minHorizontalDist) {
        minHorizontalDist = dist;
        bestHorizontalLine = line;
      }
    } else {
      const dist = Math.abs(draggedCenter.x - line.position);
      if (dist < minVerticalDist) {
        minVerticalDist = dist;
        bestVerticalLine = line;
      }
    }
  }

  // 应用水平对齐
  if (bestHorizontalLine && minHorizontalDist < threshold) {
    const nodeHeight = draggedNode.height ?? 40;
    snapY = bestHorizontalLine.position - nodeHeight / 2;
  }

  // 应用垂直对齐
  if (bestVerticalLine && minVerticalDist < threshold) {
    const nodeWidth = draggedNode.width ?? 150;
    snapX = bestVerticalLine.position - nodeWidth / 2;
  }

  return { x: snapX, y: snapY };
}

/**
 * 网格对齐
 * @param position 原始位置
 * @param gridSize 网格大小，默认 20
 * @returns 对齐到网格后的位置
 */
export function snapToGrid(
  position: XYPosition,
  gridSize: number = 20
): XYPosition {
  return {
    x: Math.round(position.x / gridSize) * gridSize,
    y: Math.round(position.y / gridSize) * gridSize,
  };
}
