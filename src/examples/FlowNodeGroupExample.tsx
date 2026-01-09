/**
 * Flow 节点分组示例
 */

import type { Component } from "solid-js";
import { createSignal } from "solid-js";
import { Flow, DefaultNode, applyNodeChanges } from "@ensolid/solidflow";
import type { Node, Edge, NodeChange, EdgeChange } from "@ensolid/solidflow";

export const FlowNodeGroupExample: Component = () => {
  const [nodes, setNodes] = createSignal<Node[]>([
    // 父节点（分组）
    {
      id: "group1",
      type: "default",
      position: { x: 100, y: 100 },
      data: { label: "分组 1" },
      width: 400,
      height: 300,
      style: {
        background: "rgba(59, 130, 246, 0.1)",
        border: "2px solid rgba(59, 130, 246, 0.5)",
        borderRadius: "8px",
      },
    },
    // 子节点（在分组内）
    {
      id: "1",
      type: "default",
      position: { x: 20, y: 20 },
      data: { label: "子节点 1" },
      width: 150,
      height: 40,
      parentNode: "group1",
    },
    {
      id: "2",
      type: "default",
      position: { x: 200, y: 20 },
      data: { label: "子节点 2" },
      width: 150,
      height: 40,
      parentNode: "group1",
    },
    {
      id: "3",
      type: "default",
      position: { x: 20, y: 100 },
      data: { label: "子节点 3" },
      width: 150,
      height: 40,
      parentNode: "group1",
    },
    // 另一个分组
    {
      id: "group2",
      type: "default",
      position: { x: 600, y: 100 },
      data: { label: "分组 2" },
      width: 300,
      height: 200,
      style: {
        background: "rgba(16, 185, 129, 0.1)",
        border: "2px solid rgba(16, 185, 129, 0.5)",
        borderRadius: "8px",
      },
    },
    {
      id: "4",
      type: "default",
      position: { x: 20, y: 20 },
      data: { label: "子节点 4" },
      width: 150,
      height: 40,
      parentNode: "group2",
    },
    {
      id: "5",
      type: "default",
      position: { x: 20, y: 100 },
      data: { label: "子节点 5" },
      width: 150,
      height: 40,
      parentNode: "group2",
    },
  ]);

  const [edges] = createSignal<Edge[]>([]);

  const handleNodesChange = (changes: NodeChange[]) => {
    setNodes((prevNodes) => applyNodeChanges(changes, prevNodes));
  };

  const handleEdgesChange = (changes: EdgeChange[]) => {
    // 处理边变化
  };

  return (
    <div class="space-y-4 p-6">
      <h2 class="text-2xl font-bold mb-4">节点分组功能示例</h2>

      <div class="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
        <div class="text-sm text-blue-900 dark:text-blue-100 space-y-2">
          <p class="font-semibold">💡 使用说明：</p>
          <ul class="list-disc list-inside space-y-1 ml-2">
            <li>节点可以通过 <code class="px-1 py-0.5 bg-white dark:bg-gray-800 rounded">parentNode</code> 属性设置为其他节点的子节点</li>
            <li>子节点的位置是相对于父节点的</li>
            <li>子节点只能在父节点的边界内移动</li>
            <li>子节点会随父节点一起移动</li>
            <li>可以创建多级嵌套的分组结构</li>
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
