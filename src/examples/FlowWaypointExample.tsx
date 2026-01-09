/**
 * Flow 边中间点编辑示例
 */

import type { Component } from "solid-js";
import { createSignal } from "solid-js";
import {
  Flow,
  DefaultNode,
  applyNodeChanges,
  applyEdgeChanges,
  type Node,
  type Edge,
  type NodeChange,
  type EdgeChange,
  type XYPosition,
} from "@ensolid/solidflow";

export const FlowWaypointExample: Component = () => {
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
      position: { x: 400, y: 300 },
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
      // 添加初始中间点
      waypoints: [
        { x: 250, y: 150 },
        { x: 300, y: 200 },
      ],
    },
  ]);

  const handleNodesChange = (changes: NodeChange[]) => {
    setNodes((prevNodes) => applyNodeChanges(changes, prevNodes));
  };

  const handleEdgesChange = (changes: EdgeChange[]) => {
    setEdges((prevEdges) => applyEdgeChanges(changes, prevEdges));
  };

  return (
    <div class="space-y-4 p-6">
      <h2 class="text-2xl font-bold mb-4">边中间点编辑示例</h2>

      <div class="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
        <div class="text-sm text-blue-900 dark:text-blue-100 space-y-2">
          <p class="font-semibold">💡 使用说明：</p>
          <ul class="list-disc list-inside space-y-1 ml-2">
            <li>点击边以选中它</li>
            <li>选中边后，会显示蓝色的中间点控制点</li>
            <li>拖拽中间点可以调整边的路径</li>
            <li>支持多个中间点，可以创建复杂的边路径</li>
            <li>适用于所有边类型（straight、bezier、smoothstep等）</li>
          </ul>
        </div>
      </div>

      <div class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden" style="height: 500px;">
        <Flow
          nodes={nodes()}
          edges={edges()}
          nodeTypes={{ default: DefaultNode }}
          onNodesChange={handleNodesChange}
          onEdgesChange={handleEdgesChange}
          elementsSelectable={true}
        />
      </div>

      <div class="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
        <h3 class="font-semibold mb-2">代码示例：</h3>
        <pre class="text-xs overflow-x-auto">
          <code>{`const [edges, setEdges] = createSignal<Edge[]>([
  {
    id: "e1-2",
    source: "1",
    target: "2",
    type: "default",
    // 添加中间点
    waypoints: [
      { x: 250, y: 150 },
      { x: 300, y: 200 },
    ],
  },
]);

// 处理边变化，包括waypoint更新
const handleEdgesChange = (changes: EdgeChange[]) => {
  setEdges((prevEdges) => applyEdgeChanges(changes, prevEdges));
};`}</code>
        </pre>
      </div>
    </div>
  );
};
