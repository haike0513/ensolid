/**
 * Flow 导入导出示例
 */

import type { Component } from "solid-js";
import { createSignal } from "solid-js";
import { Flow, DefaultNode, applyNodeChanges, downloadFlowData, readFlowDataFromFile, importFromJSON } from "@ensolid/solidflow";
import type { Node, Edge, NodeChange, EdgeChange, FlowInstance } from "@ensolid/solidflow";

export const FlowImportExportExample: Component = () => {
  const [nodes, setNodes] = createSignal<Node[]>([
    {
      id: "1",
      type: "default",
      position: { x: 100, y: 100 },
      data: { label: "开始" },
      width: 150,
      height: 40,
    },
    {
      id: "2",
      type: "default",
      position: { x: 300, y: 100 },
      data: { label: "处理" },
      width: 150,
      height: 40,
    },
    {
      id: "3",
      type: "default",
      position: { x: 500, y: 100 },
      data: { label: "结束" },
      width: 150,
      height: 40,
    },
  ]);

  const [edges, setEdges] = createSignal<Edge[]>([
    {
      id: "e1-2",
      source: "1",
      target: "2",
      type: "default",
    },
    {
      id: "e2-3",
      source: "2",
      target: "3",
      type: "default",
    },
  ]);

  let flowInstance: FlowInstance | undefined;

  const handleNodesChange = (changes: NodeChange[]) => {
    setNodes((prevNodes) => applyNodeChanges(changes, prevNodes));
  };

  const handleEdgesChange = (changes: EdgeChange[]) => {
    setEdges((prevEdges) => {
      const newEdges = [...prevEdges];
      for (const change of changes) {
        const index = newEdges.findIndex((e) => e.id === change.id);
        if (change.type === "remove" && index !== -1) {
          newEdges.splice(index, 1);
        } else if (change.type === "add" && index === -1) {
          newEdges.push(change.item);
        }
      }
      return newEdges;
    });
  };

  const handleExport = () => {
    if (flowInstance) {
      const data = flowInstance.toObject();
      downloadFlowData(data, "flow-export.json");
    }
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file && flowInstance) {
        try {
          const data = await readFlowDataFromFile(file);
          flowInstance.fromObject(data);
        } catch (error) {
          alert(`导入失败: ${error instanceof Error ? error.message : String(error)}`);
        }
      }
    };
    input.click();
  };

  const handleClear = () => {
    if (flowInstance) {
      flowInstance.fromObject({ nodes: [], edges: [] });
    }
  };

  return (
    <div class="space-y-4 p-6">
      <h2 class="text-2xl font-bold mb-4">导入导出功能示例</h2>

      <div class="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
        <div class="text-sm text-blue-900 dark:text-blue-100 space-y-2">
          <p class="font-semibold">💡 使用说明：</p>
          <ul class="list-disc list-inside space-y-1 ml-2">
            <li>点击"导出"按钮可以将当前流程图保存为 JSON 文件</li>
            <li>点击"导入"按钮可以从 JSON 文件加载流程图</li>
            <li>导出的文件包含节点、边和视口信息</li>
            <li>支持版本兼容性检查</li>
          </ul>
        </div>
      </div>

      <div class="flex gap-2 mb-4">
        <button
          onClick={handleExport}
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          导出为 JSON
        </button>
        <button
          onClick={handleImport}
          class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          从 JSON 导入
        </button>
        <button
          onClick={handleClear}
          class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          清空画布
        </button>
      </div>

      <div class="border rounded-lg overflow-hidden" style="height: 600px;">
        <Flow
          nodes={nodes()}
          edges={edges()}
          onNodesChange={handleNodesChange}
          onEdgesChange={handleEdgesChange}
          nodeTypes={{
            default: DefaultNode,
          }}
          onInit={(instance) => {
            flowInstance = instance;
          }}
          fitView
          fitViewOptions={{ padding: 0.2 }}
        />
      </div>
    </div>
  );
};
