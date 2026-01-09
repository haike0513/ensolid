/**
 * Flow 边标签编辑示例
 */

import type { Component } from "solid-js";
import { createSignal } from "solid-js";
import {
  Flow,
  DefaultNode,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  type Node,
  type Edge,
  type NodeChange,
  type EdgeChange,
  type Connection,
} from "@ensolid/solidflow";

export const FlowEdgeLabelExample: Component = () => {
  const [nodes, setNodes] = createSignal<Node[]>([
    {
      id: "1",
      type: "default",
      position: { x: 100, y: 100 },
      data: { label: "开始" },
    },
    {
      id: "2",
      type: "default",
      position: { x: 300, y: 100 },
      data: { label: "处理" },
    },
    {
      id: "3",
      type: "default",
      position: { x: 500, y: 100 },
      data: { label: "结束" },
    },
    {
      id: "4",
      type: "default",
      position: { x: 300, y: 250 },
      data: { label: "分支" },
    },
  ]);

  const [edges, setEdges] = createSignal<Edge[]>([
    {
      id: "e1-2",
      source: "1",
      target: "2",
      label: "流程 1",
      labelShowBg: true,
      labelBgStyle: {
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        borderColor: "#3b82f6",
        borderWidth: "1",
      },
      labelBgPadding: [6, 4],
      labelBgBorderRadius: 4,
    },
    {
      id: "e2-3",
      source: "2",
      target: "3",
      label: "成功路径",
      labelStyle: {
        color: "#10b981",
        fontWeight: "bold",
      },
      labelShowBg: true,
      labelBgStyle: {
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        borderColor: "#10b981",
        borderWidth: "1",
      },
    },
    {
      id: "e2-4",
      source: "2",
      target: "4",
      label: "分支路径",
      labelStyle: {
        color: "#f59e0b",
        fontWeight: "bold",
      },
      labelShowBg: true,
      labelBgStyle: {
        backgroundColor: "rgba(245, 158, 11, 0.1)",
        borderColor: "#f59e0b",
        borderWidth: "1",
      },
    },
  ]);

  const handleNodesChange = (changes: NodeChange[]) => {
    setNodes((prevNodes) => applyNodeChanges(changes, prevNodes));
  };

  const handleEdgesChange = (changes: EdgeChange[]) => {
    setEdges((prevEdges) => applyEdgeChanges(changes, prevEdges));
  };

  const handleConnect = (connection: Connection) => {
    setEdges((prev) =>
      addEdge(connection, prev, {
        label: "新连接",
        labelShowBg: true,
        labelBgStyle: {
          backgroundColor: "rgba(255, 255, 255, 0.9)",
        },
      })
    );
  };

  return (
    <div class="space-y-4 p-6">
      <h2 class="text-2xl font-bold mb-4">边标签编辑示例</h2>

      <div class="border rounded-lg overflow-hidden" style="height: 600px;">
        <Flow
          nodes={nodes()}
          edges={edges()}
          onNodesChange={handleNodesChange}
          onEdgesChange={handleEdgesChange}
          onConnect={handleConnect}
          nodeTypes={{
            default: DefaultNode,
          }}
          fitView
          fitViewOptions={{ padding: 0.2 }}
        />
      </div>

      <div class="text-sm text-gray-600 space-y-2">
        <p>💡 边标签编辑功能：</p>
        <ul class="list-disc list-inside space-y-1">
          <li>
            <strong>编辑标签:</strong> 双击边上的标签即可编辑
          </li>
          <li>
            <strong>保存:</strong> 按 Enter 键或点击外部区域保存
          </li>
          <li>
            <strong>取消:</strong> 按 Escape 键取消编辑
          </li>
          <li>
            <strong>标签样式:</strong> 支持自定义标签颜色、背景、边框等样式
          </li>
          <li>
            <strong>标签背景:</strong> 可以通过 labelShowBg 属性显示标签背景
          </li>
        </ul>
        <p class="mt-2">
          边的 <code class="bg-gray-100 px-1 rounded">label</code> 属性用于设置标签文本，
          <code class="bg-gray-100 px-1 rounded">labelStyle</code> 用于设置标签样式，
          <code class="bg-gray-100 px-1 rounded">labelBgStyle</code> 用于设置标签背景样式。
        </p>
      </div>
    </div>
  );
};
