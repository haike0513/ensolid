/**
 * Flow 边类型示例 - 展示不同的边路径类型
 */

import type { Component } from "solid-js";
import { createSignal } from "solid-js";
import { Flow, DefaultNode, applyNodeChanges, applyEdgeChanges } from "@resolid/solidflow";
import type { Node, Edge, NodeChange, EdgeChange } from "@resolid/solidflow";

export const FlowEdgeTypesExample: Component = () => {
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
      position: { x: 350, y: 100 },
      data: { label: "直线边" },
      width: 150,
      height: 40,
    },
    {
      id: "3",
      type: "default",
      position: { x: 100, y: 250 },
      data: { label: "开始" },
      width: 150,
      height: 40,
    },
    {
      id: "4",
      type: "default",
      position: { x: 350, y: 250 },
      data: { label: "贝塞尔曲线" },
      width: 150,
      height: 40,
    },
    {
      id: "5",
      type: "default",
      position: { x: 100, y: 400 },
      data: { label: "开始" },
      width: 150,
      height: 40,
    },
    {
      id: "6",
      type: "default",
      position: { x: 350, y: 400 },
      data: { label: "平滑步进" },
      width: 150,
      height: 40,
    },
    {
      id: "7",
      type: "default",
      position: { x: 600, y: 250 },
      data: { label: "简单贝塞尔" },
      width: 150,
      height: 40,
    },
  ]);

  const [edges, setEdges] = createSignal<Edge[]>([
    {
      id: "e1-2",
      source: "1",
      target: "2",
      type: "straight",
      label: "straight",
    },
    {
      id: "e3-4",
      source: "3",
      target: "4",
      type: "bezier",
      label: "bezier",
    },
    {
      id: "e5-6",
      source: "5",
      target: "6",
      type: "smoothstep",
      label: "smoothstep",
    },
    {
      id: "e3-7",
      source: "3",
      target: "7",
      type: "simplebezier",
      label: "simplebezier",
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
      <h2 class="text-2xl font-bold mb-4">Flow 边类型示例</h2>

      <div class="border rounded-lg overflow-hidden" style="height: 700px;">
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
        <p>💡 边类型说明：</p>
        <ul class="list-disc list-inside space-y-1">
          <li><strong>straight:</strong> 直线路径，最简单直接的连接方式</li>
          <li><strong>bezier:</strong> 贝塞尔曲线，平滑的曲线路径</li>
          <li><strong>simplebezier:</strong> 简单贝塞尔曲线，默认的边类型</li>
          <li><strong>smoothstep:</strong> 平滑步进路径，带圆角的阶梯状路径</li>
        </ul>
        <p class="mt-2">可以通过设置边的 <code class="bg-gray-100 px-1 rounded">type</code> 属性来指定边类型。</p>
      </div>
    </div>
  );
};

