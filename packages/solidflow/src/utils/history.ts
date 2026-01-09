/**
 * 历史记录管理器 - 用于实现撤销/重做功能
 */

import type { Node, Edge, Viewport } from "../types";

export interface HistoryState {
  nodes: Node[];
  edges: Edge[];
  viewport: Viewport;
}

export class HistoryManager {
  private history: HistoryState[] = [];
  private currentIndex: number = -1;
  private maxHistorySize: number = 50;

  constructor(maxHistorySize: number = 50) {
    this.maxHistorySize = maxHistorySize;
  }

  /**
   * 添加新的历史状态
   */
  push(state: HistoryState): void {
    // 如果当前不在历史记录的末尾，删除当前位置之后的所有记录
    if (this.currentIndex < this.history.length - 1) {
      this.history = this.history.slice(0, this.currentIndex + 1);
    }

    // 添加新状态
    this.history.push({
      nodes: JSON.parse(JSON.stringify(state.nodes)),
      edges: JSON.parse(JSON.stringify(state.edges)),
      viewport: { ...state.viewport },
    });

    // 限制历史记录大小
    if (this.history.length > this.maxHistorySize) {
      this.history.shift();
    } else {
      this.currentIndex = this.history.length - 1;
    }
  }

  /**
   * 撤销操作
   */
  undo(): HistoryState | null {
    if (!this.canUndo()) {
      return null;
    }

    this.currentIndex--;
    return this.getCurrentState();
  }

  /**
   * 重做操作
   */
  redo(): HistoryState | null {
    if (!this.canRedo()) {
      return null;
    }

    this.currentIndex++;
    return this.getCurrentState();
  }

  /**
   * 检查是否可以撤销
   */
  canUndo(): boolean {
    return this.currentIndex > 0;
  }

  /**
   * 检查是否可以重做
   */
  canRedo(): boolean {
    return this.currentIndex < this.history.length - 1;
  }

  /**
   * 获取当前状态
   */
  getCurrentState(): HistoryState | null {
    if (this.currentIndex < 0 || this.currentIndex >= this.history.length) {
      return null;
    }

    const state = this.history[this.currentIndex];
    return {
      nodes: JSON.parse(JSON.stringify(state.nodes)),
      edges: JSON.parse(JSON.stringify(state.edges)),
      viewport: { ...state.viewport },
    };
  }

  /**
   * 清空历史记录
   */
  clear(): void {
    this.history = [];
    this.currentIndex = -1;
  }

  /**
   * 获取历史记录数量
   */
  getHistoryLength(): number {
    return this.history.length;
  }

  /**
   * 获取当前索引
   */
  getCurrentIndex(): number {
    return this.currentIndex;
  }
}
