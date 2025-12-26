/**
 * Flow 组件示例
 */

import type { Component } from "solid-js";
import { createSignal } from "solid-js";
import { Flow, DefaultNode, applyNodeChanges } from "@ensolid/solidflow";
import type { Node, Edge, NodeChange, EdgeChange } from "@ensolid/solidflow";

export const FlowExample: Component = () => {
  const [nodes, setNodes] = createSignal<Node[]>([
    {
      id: "1",
      type: "default",
      position: { x: 100, y: 100 },
      data: { label: "开始节点" },
      width: 150,
      height: 40,
    },
    {
      id: "2",
      type: "default",
      position: { x: 300, y: 100 },
      data: { label: "处理节点" },
      width: 150,
      height: 40,
    },
    {
      id: "3",
      type: "default",
      position: { x: 500, y: 100 },
      data: { label: "结束节点" },
      width: 150,
      height: 40,
    },
    {
      id: "4",
      type: "default",
      position: { x: 300, y: 250 },
      data: { label: "分支节点" },
      width: 150,
      height: 40,
    },
  ]);

  const [edges] = createSignal<Edge[]>([
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
    {
      id: "e2-4",
      source: "2",
      target: "4",
      type: "default",
    },
  ]);

  const handleNodesChange = (changes: NodeChange[]) => {
    setNodes((prevNodes) => applyNodeChanges(changes, prevNodes));
  };

  const handleEdgesChange = (changes: EdgeChange[]) => {
    // 处理边变化
    console.log("Edges changed:", changes);
  };

  return (
    <div class="space-y-4 p-6">
      <h2 class="text-2xl font-bold mb-4">Flow 流程图示例</h2>

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

      <div class="text-sm text-gray-600 space-y-2">
        <p>💡 提示：</p>
        <ul class="list-disc list-inside space-y-1">
          <li>拖拽节点可以移动位置</li>
          <li>使用鼠标滚轮可以缩放画布</li>
          <li>点击控制按钮可以缩放或适合视图</li>
          <li>右下角的小地图显示整体视图</li>
        </ul>
      </div>
    </div>
  );
};

