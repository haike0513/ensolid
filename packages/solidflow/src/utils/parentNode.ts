/**
 * 节点分组工具
 * 用于处理嵌套节点（parentNode）的功能
 */

import type { Node, XYPosition } from "../types";

/**
 * 计算嵌套节点的绝对位置
 * @param node 节点
 * @param allNodes 所有节点数组
 * @returns 绝对位置
 */
export function calculateAbsolutePosition(
  node: Node,
  allNodes: Node[]
): XYPosition {
  if (!node.parentNode) {
    return node.position;
  }

  const parent = allNodes.find((n) => n.id === node.parentNode);
  if (!parent) {
    return node.position;
  }

  const parentAbsolute = calculateAbsolutePosition(parent, allNodes);
  return {
    x: parentAbsolute.x + node.position.x,
    y: parentAbsolute.y + node.position.y,
  };
}

/**
 * 检查节点是否在父节点边界内
 * @param node 节点
 * @param parent 父节点
 * @returns 是否在边界内
 */
export function isNodeInParentBounds(
  node: Node,
  parent: Node
): boolean {
  const nodeBounds = {
    x: node.position.x,
    y: node.position.y,
    width: node.width ?? 150,
    height: node.height ?? 40,
  };

  const parentBounds = {
    x: 0,
    y: 0,
    width: parent.width ?? 150,
    height: parent.height ?? 40,
  };

  return (
    nodeBounds.x >= parentBounds.x &&
    nodeBounds.y >= parentBounds.y &&
    nodeBounds.x + nodeBounds.width <= parentBounds.x + parentBounds.width &&
    nodeBounds.y + nodeBounds.height <= parentBounds.y + parentBounds.height
  );
}

/**
 * 限制节点位置在父节点边界内
 * @param node 节点
 * @param newPosition 新位置
 * @param parent 父节点
 * @returns 限制后的位置
 */
export function clampNodePositionToParent(
  node: Node,
  newPosition: XYPosition,
  parent: Node
): XYPosition {
  const nodeWidth = node.width ?? 150;
  const nodeHeight = node.height ?? 40;
  const parentWidth = parent.width ?? 150;
  const parentHeight = parent.height ?? 40;

  return {
    x: Math.max(0, Math.min(parentWidth - nodeWidth, newPosition.x)),
    y: Math.max(0, Math.min(parentHeight - nodeHeight, newPosition.y)),
  };
}

/**
 * 获取节点的所有子节点
 * @param nodeId 节点 ID
 * @param allNodes 所有节点数组
 * @returns 子节点数组
 */
export function getChildNodes(
  nodeId: string,
  allNodes: Node[]
): Node[] {
  return allNodes.filter((n) => n.parentNode === nodeId);
}

/**
 * 获取节点的所有后代节点（包括子节点、孙节点等）
 * @param nodeId 节点 ID
 * @param allNodes 所有节点数组
 * @returns 后代节点数组
 */
export function getDescendantNodes(
  nodeId: string,
  allNodes: Node[]
): Node[] {
  const descendants: Node[] = [];
  const children = getChildNodes(nodeId, allNodes);
  
  for (const child of children) {
    descendants.push(child);
    descendants.push(...getDescendantNodes(child.id, allNodes));
  }
  
  return descendants;
}
