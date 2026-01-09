/**
 * 剪贴板管理器
 * 用于管理节点的复制粘贴功能
 */

import type { Node, Edge, XYPosition } from "../types";

/**
 * 生成唯一 ID
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * 剪贴板管理器类
 */
export class ClipboardManager {
  private clipboard: { nodes: Node[]; edges: Edge[] } | null = null;

  /**
   * 复制节点和边到剪贴板
   * @param nodes 要复制的节点数组
   * @param edges 要复制的边数组（可选，如果不提供则自动查找相关边）
   * @param allEdges 所有边的数组（用于查找相关边）
   */
  copy(nodes: Node[], edges?: Edge[], allEdges?: Edge[]): void {
    if (nodes.length === 0) {
      this.clipboard = null;
      return;
    }

    const nodeIds = new Set(nodes.map((n) => n.id));
    
    // 如果没有提供 edges，则自动查找相关边
    let edgesToCopy: Edge[] = [];
    if (edges) {
      edgesToCopy = edges;
    } else if (allEdges) {
      // 查找所有连接这些节点的边
      edgesToCopy = allEdges.filter(
        (edge) =>
          nodeIds.has(edge.source) && nodeIds.has(edge.target)
      );
    }

    // 深拷贝节点和边
    this.clipboard = {
      nodes: nodes.map((node) => ({ ...node })),
      edges: edgesToCopy.map((edge) => ({ ...edge })),
    };
  }

  /**
   * 从剪贴板粘贴节点和边
   * @param offset 粘贴位置的偏移量（默认 { x: 20, y: 20 }）
   * @returns 粘贴的节点和边，如果没有剪贴板内容则返回 null
   */
  paste(offset: XYPosition = { x: 20, y: 20 }): { nodes: Node[]; edges: Edge[] } | null {
    if (!this.clipboard) {
      return null;
    }

    // 生成新 ID 并偏移位置
    const idMap = new Map<string, string>();
    const newNodes = this.clipboard.nodes.map((node) => {
      const newId = generateId();
      idMap.set(node.id, newId);
      return {
        ...node,
        id: newId,
        position: {
          x: node.position.x + offset.x,
          y: node.position.y + offset.y,
        },
        // 清除选择状态
        selected: false,
        // 清除拖拽状态
        dragging: false,
      };
    });

    // 更新边的 source/target ID
    const newEdges = this.clipboard.edges.map((edge) => {
      const newSourceId = idMap.get(edge.source);
      const newTargetId = idMap.get(edge.target);
      
      // 如果边的源或目标节点不在剪贴板中，则跳过这条边
      if (!newSourceId || !newTargetId) {
        return null;
      }

      return {
        ...edge,
        id: generateId(),
        source: newSourceId,
        target: newTargetId,
        // 清除选择状态
        selected: false,
      };
    }).filter((edge): edge is Edge => edge !== null);

    return { nodes: newNodes, edges: newEdges };
  }

  /**
   * 检查剪贴板是否有内容
   */
  hasContent(): boolean {
    return this.clipboard !== null && this.clipboard.nodes.length > 0;
  }

  /**
   * 清空剪贴板
   */
  clear(): void {
    this.clipboard = null;
  }

  /**
   * 获取剪贴板内容（用于调试）
   */
  getContent(): { nodes: Node[]; edges: Edge[] } | null {
    return this.clipboard;
  }
}
