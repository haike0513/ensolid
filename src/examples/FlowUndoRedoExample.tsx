/**
 * Flow 撤销/重做示例
 */

import type { Component } from "solid-js";
import { createSignal, Show } from "solid-js";
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
  type FlowInstance,
} from "@ensolid/solidflow";
import { Button } from "@/components/ui/button";

export const FlowUndoRedoExample: Component = () => {
  const [nodes, setNodes] = createSignal<Node[]>([
    {
      id: "1",
      type: "default",
      position: { x: 100, y: 100 },
      data: { label: "节点 1" },
    },
    {
      id: "2",
      type: "default",
      position: { x: 300, y: 100 },
      data: { label: "节点 2" },
    },
    {
      id: "3",
      type: "default",
      position: { x: 500, y: 100 },
      data: { label: "节点 3" },
    },
  ]);

  const [edges, setEdges] = createSignal<Edge[]>([
    {
      id: "e1-2",
      source: "1",
      target: "2",
    },
  ]);

  const [flowInstance, setFlowInstance] = createSignal<FlowInstance | null>(
    null
  );

  const handleNodesChange = (changes: NodeChange[]) => {
    setNodes((prevNodes) => applyNodeChanges(changes, prevNodes));
  };

  const handleEdgesChange = (changes: EdgeChange[]) => {
    setEdges((prevEdges) => applyEdgeChanges(changes, prevEdges));
  };

  const handleConnect = (connection: Connection) => {
    setEdges((prev) => addEdge(connection, prev));
  };

  const handleInit = (instance: FlowInstance) => {
    setFlowInstance(instance);
  };

  const addNode = () => {
    const id = `node-${Date.now()}`;
    setNodes((prev) => [
      ...prev,
      {
        id,
        type: "default",
        position: {
          x: Math.random() * 400 + 200,
          y: Math.random() * 300 + 100,
        },
        data: { label: `新节点 ${id.slice(-4)}` },
      },
    ]);
  };

  const deleteSelected = () => {
    const instance = flowInstance();
    if (!instance) return;

    // 获取当前状态
    const state = instance.toObject();
    const selectedNodes = state.nodes.filter((n) => n.selected);
    const selectedEdges = state.edges.filter((e) => e.selected);

    if (selectedNodes.length > 0) {
      handleNodesChange(
        selectedNodes.map((n) => ({ id: n.id, type: "remove" as const }))
      );
    }

    if (selectedEdges.length > 0) {
      handleEdgesChange(
        selectedEdges.map((e) => ({ id: e.id, type: "remove" as const }))
      );
    }
  };

  return (
    <div class="space-y-4 p-6">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h2 class="text-2xl font-bold">撤销/重做示例</h2>
          <p class="text-sm text-muted-foreground mt-1">
            支持历史记录管理，可以使用 Ctrl+Z 撤销，Ctrl+Y 或 Ctrl+Shift+Z 重做
          </p>
        </div>
      </div>

      {/* 工具栏 */}
      <div class="border rounded-lg p-4 bg-gray-50 flex items-center gap-2">
        <Button onClick={addNode} size="sm" variant="outline">
          + 添加节点
        </Button>
        <Button onClick={deleteSelected} size="sm" variant="outline">
          删除选中
        </Button>
        <div class="ml-4 border-l pl-4 flex items-center gap-2">
          <Show when={flowInstance()}>
            <Button
              onClick={() => flowInstance()?.undo()}
              size="sm"
              variant="outline"
              disabled={!flowInstance()?.canUndo()}
            >
              ↶ 撤销 (Ctrl+Z)
            </Button>
            <Button
              onClick={() => flowInstance()?.redo()}
              size="sm"
              variant="outline"
              disabled={!flowInstance()?.canRedo()}
            >
              ↷ 重做 (Ctrl+Y)
            </Button>
          </Show>
        </div>
      </div>

      {/* Flow 画布 */}
      <div class="border rounded-lg overflow-hidden bg-white" style="height: 600px;">
        <Flow
          nodes={nodes()}
          edges={edges()}
          onNodesChange={handleNodesChange}
          onEdgesChange={handleEdgesChange}
          onConnect={handleConnect}
          onInit={handleInit}
          nodeTypes={{
            default: DefaultNode,
          }}
          enableHistory={true}
          maxHistorySize={50}
          fitView
          fitViewOptions={{ padding: 0.2 }}
        />
      </div>

      {/* 使用说明 */}
      <div class="border rounded-lg p-4 bg-blue-50">
        <h3 class="font-semibold mb-2 text-blue-900">💡 使用说明</h3>
        <div class="text-sm text-blue-800 space-y-1">
          <ul class="list-disc list-inside space-y-1">
            <li>
              <strong>撤销:</strong> 按 <kbd class="px-1.5 py-0.5 bg-white rounded border">Ctrl+Z</kbd> 或点击撤销按钮
            </li>
            <li>
              <strong>重做:</strong> 按 <kbd class="px-1.5 py-0.5 bg-white rounded border">Ctrl+Y</kbd> 或 <kbd class="px-1.5 py-0.5 bg-white rounded border">Ctrl+Shift+Z</kbd> 或点击重做按钮
            </li>
            <li>
              <strong>删除:</strong> 选中节点或边后，按 <kbd class="px-1.5 py-0.5 bg-white rounded border">Delete</kbd> 或 <kbd class="px-1.5 py-0.5 bg-white rounded border">Backspace</kbd>
            </li>
            <li>
              <strong>全选:</strong> 按 <kbd class="px-1.5 py-0.5 bg-white rounded border">Ctrl+A</kbd>
            </li>
            <li>
              <strong>取消选择:</strong> 按 <kbd class="px-1.5 py-0.5 bg-white rounded border">Escape</kbd>
            </li>
            <li>
              历史记录会在以下操作时自动保存：
              <ul class="list-disc list-inside ml-4 mt-1">
                <li>拖拽节点后</li>
                <li>添加/删除节点或边</li>
                <li>连接节点后</li>
              </ul>
            </li>
          </ul>
        </div>
      </div>

      {/* 状态信息 */}
      <div class="grid grid-cols-2 gap-4">
        <div class="border rounded-lg p-4">
          <h3 class="font-semibold mb-2">节点信息</h3>
          <div class="text-sm space-y-1">
            <p>总节点数: {nodes().length}</p>
            <p>总边数: {edges().length}</p>
          </div>
        </div>
        <div class="border rounded-lg p-4">
          <h3 class="font-semibold mb-2">历史记录</h3>
          <div class="text-sm space-y-1">
            <Show when={flowInstance()}>
              <p>
                可撤销: {flowInstance()?.canUndo() ? "是" : "否"}
              </p>
              <p>
                可重做: {flowInstance()?.canRedo() ? "是" : "否"}
              </p>
            </Show>
          </div>
        </div>
      </div>
    </div>
  );
};
