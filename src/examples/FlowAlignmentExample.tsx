/**
 * Flow 节点对齐示例
 */

import type { Component } from "solid-js";
import { createSignal } from "solid-js";
import { Flow, DefaultNode, applyNodeChanges } from "@ensolid/solidflow";
import type { Node, Edge, NodeChange, EdgeChange } from "@ensolid/solidflow";

export const FlowAlignmentExample: Component = () => {
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
      position: { x: 500, y: 200 },
      data: { label: "节点 3" },
      width: 150,
      height: 40,
    },
    {
      id: "4",
      type: "default",
      position: { x: 100, y: 250 },
      data: { label: "节点 4" },
      width: 150,
      height: 40,
    },
  ]);

  const [edges] = createSignal<Edge[]>([]);
  const [snapToGrid, setSnapToGrid] = createSignal(false);

  const handleNodesChange = (changes: NodeChange[]) => {
    setNodes((prevNodes) => applyNodeChanges(changes, prevNodes));
  };

  const handleEdgesChange = (changes: EdgeChange[]) => {
    // 处理边变化
  };

  return (
    <div class="space-y-4 p-6">
      <h2 class="text-2xl font-bold mb-4">节点对齐功能示例</h2>

      <div class="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
        <div class="text-sm text-blue-900 dark:text-blue-100 space-y-2">
          <p class="font-semibold">💡 使用说明：</p>
          <ul class="list-disc list-inside space-y-1 ml-2">
            <li>拖拽节点时，会自动显示对齐辅助线（红色虚线）</li>
            <li>当节点与其他节点的中心、顶部、底部、左侧或右侧对齐时，会显示辅助线</li>
            <li>节点会自动吸附到对齐位置</li>
            <li>可以开启网格对齐功能，节点会自动对齐到网格</li>
          </ul>
        </div>
      </div>

      <div class="flex items-center gap-4 mb-4">
        <label class="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={snapToGrid()}
            onChange={(e) => setSnapToGrid(e.currentTarget.checked)}
            class="w-4 h-4"
          />
          <span class="text-sm">启用网格对齐</span>
        </label>
        {snapToGrid() && (
          <span class="text-sm text-muted-foreground">
            网格大小: 20x20 像素
          </span>
        )}
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
          snapToGrid={snapToGrid()}
          snapGrid={[20, 20]}
          fitView
          fitViewOptions={{ padding: 0.2 }}
        />
      </div>
    </div>
  );
};
