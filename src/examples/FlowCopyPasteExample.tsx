/**
 * Flow 复制粘贴示例
 */

import type { Component } from "solid-js";
import { createSignal } from "solid-js";
import { Flow, DefaultNode, applyNodeChanges } from "@ensolid/solidflow";
import type { Node, Edge, NodeChange, EdgeChange } from "@ensolid/solidflow";

export const FlowCopyPasteExample: Component = () => {
  const [nodes, setNodes] = createSignal<Node[]>([
    {
      id: "1",
      type: "default",
      position: { x: 100, y: 100 },
      data: { label: "节点 1" },
      width: 150,
      height: 40,
    },
    {
      id: "2",
      type: "default",
      position: { x: 300, y: 100 },
      data: { label: "节点 2" },
      width: 150,
      height: 40,
    },
    {
      id: "3",
      type: "default",
      position: { x: 500, y: 100 },
      data: { label: "节点 3" },
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

  return (
    <div class="space-y-4 p-6">
      <h2 class="text-2xl font-bold mb-4">复制粘贴功能示例</h2>

      <div class="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
        <div class="text-sm text-blue-900 dark:text-blue-100 space-y-2">
          <p class="font-semibold">💡 使用说明：</p>
          <ul class="list-disc list-inside space-y-1 ml-2">
            <li>选中一个或多个节点（点击节点，或按住 Ctrl/Cmd 多选）</li>
            <li>按 <kbd class="px-2 py-1 bg-white dark:bg-gray-800 rounded border">Ctrl+C</kbd> 或 <kbd class="px-2 py-1 bg-white dark:bg-gray-800 rounded border">Cmd+C</kbd> 复制</li>
            <li>按 <kbd class="px-2 py-1 bg-white dark:bg-gray-800 rounded border">Ctrl+V</kbd> 或 <kbd class="px-2 py-1 bg-white dark:bg-gray-800 rounded border">Cmd+V</kbd> 粘贴</li>
            <li>粘贴的节点会自动生成新 ID 并偏移位置</li>
            <li>如果复制了节点之间的边，粘贴时也会自动复制相关边</li>
          </ul>
        </div>
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
          fitView
          fitViewOptions={{ padding: 0.2 }}
        />
      </div>
    </div>
  );
};
