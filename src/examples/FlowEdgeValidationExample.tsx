/**
 * Flow 边验证示例 - 展示自定义连接规则
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

export const FlowEdgeValidationExample: Component = () => {
  const [nodes, setNodes] = createSignal<Node[]>([
    {
      id: "input-1",
      type: "default",
      position: { x: 100, y: 100 },
      data: { label: "输入节点 1", type: "input" },
    },
    {
      id: "input-2",
      type: "default",
      position: { x: 100, y: 250 },
      data: { label: "输入节点 2", type: "input" },
    },
    {
      id: "process-1",
      type: "default",
      position: { x: 350, y: 100 },
      data: { label: "处理节点 1", type: "process" },
    },
    {
      id: "process-2",
      type: "default",
      position: { x: 350, y: 250 },
      data: { label: "处理节点 2", type: "process" },
    },
    {
      id: "output-1",
      type: "default",
      position: { x: 600, y: 100 },
      data: { label: "输出节点 1", type: "output" },
    },
    {
      id: "output-2",
      type: "default",
      position: { x: 600, y: 250 },
      data: { label: "输出节点 2", type: "output" },
    },
  ]);

  const [edges, setEdges] = createSignal<Edge[]>([
    {
      id: "e1",
      source: "input-1",
      target: "process-1",
    },
    {
      id: "e2",
      source: "process-1",
      target: "output-1",
    },
  ]);

  const handleNodesChange = (changes: NodeChange[]) => {
    setNodes((prevNodes) => applyNodeChanges(changes, prevNodes));
  };

  const handleEdgesChange = (changes: EdgeChange[]) => {
    setEdges((prevEdges) => applyEdgeChanges(changes, prevEdges));
  };

  // 自定义连接验证规则
  const isValidConnection = (connection: Connection): boolean => {
    if (!connection.source || !connection.target) {
      return false;
    }

    // 不允许自连接
    if (connection.source === connection.target) {
      return false;
    }

    // 获取源节点和目标节点
    const sourceNode = nodes().find((n) => n.id === connection.source);
    const targetNode = nodes().find((n) => n.id === connection.target);

    if (!sourceNode || !targetNode) {
      return false;
    }

    const sourceType = sourceNode.data?.type;
    const targetType = targetNode.data?.type;

    // 验证规则：
    // 1. 输入节点只能连接到处理节点
    // 2. 处理节点可以连接到输出节点或其他处理节点
    // 3. 输出节点不能作为源节点
    // 4. 输入节点不能作为目标节点

    if (sourceType === "output") {
      return false; // 输出节点不能作为源
    }

    if (targetType === "input") {
      return false; // 输入节点不能作为目标
    }

    if (sourceType === "input" && targetType !== "process") {
      return false; // 输入节点只能连接到处理节点
    }

    // 检查是否已存在相同的连接
    const existingEdge = edges().find(
      (e) =>
        e.source === connection.source &&
        e.target === connection.target &&
        e.sourceHandle === connection.sourceHandle &&
        e.targetHandle === connection.targetHandle
    );

    if (existingEdge) {
      return false; // 不允许重复连接
    }

    return true;
  };

  const handleConnect = (connection: Connection) => {
    if (isValidConnection(connection)) {
      setEdges((prev) => addEdge(connection, prev));
    } else {
      console.warn("无效的连接:", connection);
    }
  };

  return (
    <div class="space-y-4 p-6">
      <h2 class="text-2xl font-bold mb-4">边验证示例</h2>

      <div class="border rounded-lg overflow-hidden" style="height: 600px;">
        <Flow
          nodes={nodes()}
          edges={edges()}
          onNodesChange={handleNodesChange}
          onEdgesChange={handleEdgesChange}
          onConnect={handleConnect}
          isValidConnection={isValidConnection}
          nodeTypes={{
            default: DefaultNode,
          }}
          fitView
          fitViewOptions={{ padding: 0.2 }}
        />
      </div>

      <div class="text-sm text-gray-600 space-y-2">
        <p>💡 连接验证规则：</p>
        <ul class="list-disc list-inside space-y-1">
          <li>
            <strong>输入节点 → 处理节点:</strong> ✅ 允许
          </li>
          <li>
            <strong>处理节点 → 输出节点:</strong> ✅ 允许
          </li>
          <li>
            <strong>处理节点 → 处理节点:</strong> ✅ 允许
          </li>
          <li>
            <strong>输入节点 → 输出节点:</strong> ❌ 不允许（必须经过处理节点）
          </li>
          <li>
            <strong>输出节点 → 任何节点:</strong> ❌ 不允许（输出节点不能作为源）
          </li>
          <li>
            <strong>任何节点 → 输入节点:</strong> ❌ 不允许（输入节点不能作为目标）
          </li>
          <li>
            <strong>自连接:</strong> ❌ 不允许
          </li>
          <li>
            <strong>重复连接:</strong> ❌ 不允许
          </li>
        </ul>
        <p class="mt-2">
          连接时，如果连接无效，临时连接线会显示为红色；如果有效，会显示为绿色。
        </p>
        <p>
          可以通过 <code class="bg-gray-100 px-1 rounded">isValidConnection</code> 属性传入自定义的验证函数。
        </p>
      </div>
    </div>
  );
};
