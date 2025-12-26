/**
 * Flow 连接功能示例 - 展示 Handle 连接功能
 */

import type { Component } from "solid-js";
import { createSignal } from "solid-js";
import { Flow, DefaultNode, applyNodeChanges, applyEdgeChanges, addEdge } from "@ensolid/solidflow";
import type { Node, Edge, NodeChange, EdgeChange, Connection } from "@ensolid/solidflow";

export const FlowConnectExample: Component = () => {
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
      position: { x: 350, y: 100 },
      data: { label: "中间节点" },
      width: 150,
      height: 40,
    },
    {
      id: "3",
      type: "default",
      position: { x: 600, y: 100 },
      data: { label: "结束节点" },
      width: 150,
      height: 40,
    },
    {
      id: "4",
      type: "default",
      position: { x: 350, y: 250 },
      data: { label: "分支节点" },
      width: 150,
      height: 40,
    },
  ]);

  const [edges, setEdges] = createSignal<Edge[]>([
    {
      id: "e1-2",
      source: "1",
      target: "2",
    },
  ]);

  const handleNodesChange = (changes: NodeChange[]) => {
    setNodes((prevNodes) => applyNodeChanges(changes, prevNodes));
  };

  const handleEdgesChange = (changes: EdgeChange[]) => {
    setEdges((prevEdges) => applyEdgeChanges(changes, prevEdges));
  };

  const handleConnect = (connection: Connection) => {
    console.log("连接创建:", connection);
    setEdges((prevEdges) => addEdge(connection, prevEdges));
  };

  const handleConnectStart = (_event: MouseEvent | TouchEvent, params: { nodeId: string | null; handleId: string | null; handleType: 'source' | 'target' | null }) => {
    console.log("连接开始:", params);
  };

  const handleConnectEnd = (_event: MouseEvent | TouchEvent) => {
    console.log("连接结束");
  };

  return (
    <div class="space-y-4 p-6">
      <h2 class="text-2xl font-bold mb-4">Flow 连接功能示例</h2>

      <div class="border rounded-lg overflow-hidden" style="height: 600px;">
        <Flow
          nodes={nodes()}
          edges={edges()}
          onNodesChange={handleNodesChange}
          onEdgesChange={handleEdgesChange}
          onConnect={handleConnect}
          onConnectStart={handleConnectStart}
          onConnectEnd={handleConnectEnd}
          nodeTypes={{
            default: DefaultNode,
          }}
          nodesConnectable={true}
          fitView
          fitViewOptions={{ padding: 0.2 }}
        />
      </div>

      <div class="text-sm text-gray-600 space-y-2">
        <p>💡 连接功能说明：</p>
        <ul class="list-disc list-inside space-y-1">
          <li>从一个节点的连接点（蓝色圆点）拖拽到另一个节点的连接点来创建连接</li>
          <li>source 类型的连接点（输出）只能连接到 target 类型的连接点（输入）</li>
          <li>拖拽连接时会显示临时的连接线</li>
          <li>松开鼠标在有效的连接点上即可完成连接</li>
          <li>当前已有连接数: {edges().length}</li>
        </ul>
      </div>
    </div>
  );
};

