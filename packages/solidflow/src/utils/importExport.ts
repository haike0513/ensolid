/**
 * 导入导出工具
 * 用于将流程图数据序列化为 JSON 或从 JSON 恢复
 */

import type { Node, Edge, Viewport } from "../types";

/**
 * 流程图数据格式
 */
export interface FlowData {
  nodes: Node[];
  edges: Edge[];
  viewport?: Viewport;
  version?: string;
}

/**
 * 当前版本号
 */
const CURRENT_VERSION = "1.0.0";

/**
 * 将流程图数据转换为 JSON 字符串
 * @param data 流程图数据
 * @returns JSON 字符串
 */
export function exportToJSON(data: FlowData): string {
  const exportData: FlowData = {
    ...data,
    version: CURRENT_VERSION,
  };
  return JSON.stringify(exportData, null, 2);
}

/**
 * 从 JSON 字符串导入流程图数据
 * @param json JSON 字符串
 * @returns 流程图数据
 * @throws 如果 JSON 格式无效或版本不兼容
 */
export function importFromJSON(json: string): FlowData {
  try {
    const data = JSON.parse(json) as FlowData;
    
    // 验证数据结构
    if (!data.nodes || !Array.isArray(data.nodes)) {
      throw new Error("Invalid data format: nodes is required and must be an array");
    }
    if (!data.edges || !Array.isArray(data.edges)) {
      throw new Error("Invalid data format: edges is required and must be an array");
    }

    // 检查版本兼容性（可选）
    if (data.version && data.version !== CURRENT_VERSION) {
      console.warn(
        `Version mismatch: imported version ${data.version}, current version ${CURRENT_VERSION}`
      );
    }

    return {
      nodes: data.nodes,
      edges: data.edges,
      viewport: data.viewport,
      version: data.version || CURRENT_VERSION,
    };
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(`Invalid JSON format: ${error.message}`);
    }
    throw error;
  }
}

/**
 * 下载流程图数据为 JSON 文件
 * @param data 流程图数据
 * @param filename 文件名（默认：flow.json）
 */
export function downloadFlowData(data: FlowData, filename: string = "flow.json"): void {
  const json = exportToJSON(data);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * 从文件读取流程图数据
 * @param file 文件对象
 * @returns Promise<FlowData>
 */
export function readFlowDataFromFile(file: File): Promise<FlowData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = event.target?.result as string;
        const data = importFromJSON(json);
        resolve(data);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };
    reader.readAsText(file);
  });
}
