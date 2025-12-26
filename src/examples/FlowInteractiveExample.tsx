/**
 * Flow 交互式示例 - 动态添加和删除节点
 */

import type { Component } from "solid-js";
import { createSignal } from "solid-js";
import { Flow, DefaultNode, applyNodeChanges } from "@ensolid/solidflow";
import type { Node, Edge, NodeChange } from "@ensolid/solidflow";
import { Button } from "@/components/ui/button";

export const FlowInteractiveExample: Component = () => {
  const [nodes, setNodes] = createSignal<Node[]>([
    {
      id: "1",
      type: "default",
      position: { x: 250, y: 100 },
      data: { label: "节点 1" },
    },
    {
      id: "2",
      type: "default",
      position: { x: 250, y: 250 },
      data: { label: "节点 2" },
    },
  ]);

  const [edges, setEdges] = createSignal<Edge[]>([
    {
      id: "e1-2",
      source: "1",
      target: "2",
    },
  ]);

  const [nodeIdCounter, setNodeIdCounter] = createSignal(3);

  const handleNodesChange = (changes: NodeChange[]) => {
    setNodes((prevNodes) => applyNodeChanges(changes, prevNodes));
  };

  const addNode = () => {
    const id = nodeIdCounter().toString();
    setNodeIdCounter(nodeIdCounter() + 1);
    setNodes((prev) => [
      ...prev,
      {
        id,
        type: "default",
        position: {
          x: Math.random() * 400 + 100,
          y: Math.random() * 300 + 100,
        },
        data: { label: `节点 ${id}` },
      },
    ]);
  };

  const removeLastNode = () => {
    setNodes((prev) => {
      if (prev.length > 0) {
        return prev.slice(0, -1);
      }
      return prev;
    });
    // 同时移除相关的边
    setEdges((prev) => {
      const lastNodeId = nodes()[nodes().length - 1]?.id;
      if (lastNodeId) {
        return prev.filter(
          (e) => e.source !== lastNodeId && e.target !== lastNodeId,
        );
      }
      return prev;
    });
  };

  const clearAll = () => {
    setNodes([]);
    setEdges([]);
    setNodeIdCounter(1);
  };

  return (
    <div class="space-y-4 p-6">
      <h2 class="text-2xl font-bold mb-4">Flow 交互式示例</h2>

      <div class="flex gap-2 mb-4">
        <Button onClick={addNode}>添加节点</Button>
        <Button onClick={removeLastNode} variant="outline">
          删除最后一个节点
        </Button>
        <Button onClick={clearAll} variant="destructive">
          清空所有
        </Button>
      </div>

      <div class="border rounded-lg overflow-hidden" style="height: 600px;">
        <Flow
          nodes={nodes()}
          edges={edges()}
          onNodesChange={handleNodesChange}
          nodeTypes={{
            default: DefaultNode,
          }}
        />
      </div>

      <div class="text-sm text-gray-600">
        <p>当前节点数量: {nodes().length}</p>
        <p>当前边数量: {edges().length}</p>
      </div>
    </div>
  );
};

