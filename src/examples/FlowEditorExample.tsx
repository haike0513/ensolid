/**
 * Flow 编辑器完整示例 - 展示所有功能
 */

import type { Component } from "solid-js";
import { createSignal, For } from "solid-js";
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  DefaultNode,
  Flow,
  Handle,
} from "@resolid/solidflow";
import type {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  NodeComponentProps,
  FlowInstance,
} from "@resolid/solidflow";
import { Button } from "@/components/ui/button";

// 自定义输入节点
const InputNode: Component<NodeComponentProps> = (props) => {
  return (
    <div class="bg-blue-50 border-2 border-blue-400 rounded-lg p-3 min-w-[120px] shadow-md">
      <Handle
        type="source"
        position="right"
        id="output"
        nodeId={props.node.id}
      />
      <div class="text-xs text-blue-600 font-semibold mb-1">输入</div>
      <div class="text-sm text-blue-800">
        {props.node.data?.label ?? props.node.id}
      </div>
    </div>
  );
};

// 自定义处理节点
const ProcessNode: Component<NodeComponentProps> = (props) => {
  return (
    <div class="bg-green-50 border-2 border-green-400 rounded-lg p-3 min-w-[120px] shadow-md">
      <Handle type="target" position="left" id="input" nodeId={props.node.id} />
      <Handle
        type="source"
        position="right"
        id="output"
        nodeId={props.node.id}
      />
      <div class="text-xs text-green-600 font-semibold mb-1">处理</div>
      <div class="text-sm text-green-800">
        {props.node.data?.label ?? props.node.id}
      </div>
    </div>
  );
};

// 自定义输出节点
const OutputNode: Component<NodeComponentProps> = (props) => {
  return (
    <div class="bg-purple-50 border-2 border-purple-400 rounded-lg p-3 min-w-[120px] shadow-md">
      <Handle type="target" position="left" id="input" nodeId={props.node.id} />
      <div class="text-xs text-purple-600 font-semibold mb-1">输出</div>
      <div class="text-sm text-purple-800">
        {props.node.data?.label ?? props.node.id}
      </div>
    </div>
  );
};

// 自定义决策节点（菱形）
const DecisionNode: Component<NodeComponentProps> = (props) => {
  return (
    <div class="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-3 min-w-[100px] min-h-[100px] shadow-md flex items-center justify-center transform rotate-45">
      <div class="transform -rotate-45">
        <Handle
          type="target"
          position="top"
          id="input"
          nodeId={props.node.id}
        />
        <Handle
          type="source"
          position="right"
          id="yes"
          nodeId={props.node.id}
        />
        <Handle
          type="source"
          position="bottom"
          id="no"
          nodeId={props.node.id}
        />
        <div class="text-xs text-yellow-600 font-semibold text-center">
          判断
        </div>
      </div>
    </div>
  );
};

export const FlowEditorExample: Component = () => {
  const [nodes, setNodes] = createSignal<Node[]>([
    {
      id: "1",
      type: "input",
      position: { x: 100, y: 100 },
      data: { label: "开始" },
    },
    {
      id: "2",
      type: "process",
      position: { x: 300, y: 100 },
      data: { label: "处理数据" },
    },
    {
      id: "3",
      type: "decision",
      position: { x: 500, y: 100 },
      data: { label: "检查条件" },
    },
    {
      id: "4",
      type: "process",
      position: { x: 400, y: 250 },
      data: { label: "分支处理" },
    },
    {
      id: "5",
      type: "output",
      position: { x: 700, y: 100 },
      data: { label: "结束" },
    },
    {
      id: "6",
      type: "default",
      position: { x: 100, y: 300 },
      data: { label: "默认节点" },
    },
  ]);

  const [edges, setEdges] = createSignal<Edge[]>([
    {
      id: "e1-2",
      source: "1",
      target: "2",
      sourceHandle: "output",
      targetHandle: "input",
      animated: false,
    },
    {
      id: "e2-3",
      source: "2",
      target: "3",
      sourceHandle: "output",
      targetHandle: "input",
      animated: false,
    },
    {
      id: "e3-5",
      source: "3",
      target: "5",
      sourceHandle: "yes",
      targetHandle: "input",
      animated: true,
    },
    {
      id: "e3-4",
      source: "3",
      target: "4",
      sourceHandle: "no",
      targetHandle: "input",
      animated: false,
    },
  ]);

  const [selectedNodeIds, setSelectedNodeIds] = createSignal<Set<string>>(
    new Set()
  );
  const [selectedEdgeIds, setSelectedEdgeIds] = createSignal<Set<string>>(
    new Set()
  );
  const [nodeIdCounter, setNodeIdCounter] = createSignal(7);
  const [flowInstance, setFlowInstance] = createSignal<FlowInstance | null>(
    null
  );

  const onInit = (instance: FlowInstance) => {
    setFlowInstance(instance);
  };

  const onDragStart = (event: DragEvent, nodeType: string) => {
    if (event.dataTransfer) {
      event.dataTransfer.setData("application/solidflow/type", nodeType);
      event.dataTransfer.effectAllowed = "move";
    }
  };

  const onDragOver = (event: DragEvent) => {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = "move";
    }
  };

  const onDrop = (event: DragEvent) => {
    event.preventDefault();

    const type = event.dataTransfer?.getData("application/solidflow/type");
    if (!type || !flowInstance()) return;

    const position = flowInstance()!.project({
      x: event.clientX,
      y: event.clientY,
    });

    const newNode: Node = {
      id: nodeIdCounter().toString(),
      type,
      position,
      data: { label: `${type} node` },
    };

    setNodeIdCounter(nodeIdCounter() + 1);
    setNodes((nds) => nds.concat(newNode));
  };

  // 处理节点变化
  const handleNodesChange = (changes: NodeChange[]) => {
    // 处理选择状态
    for (const change of changes) {
      if (change.type === "select") {
        setSelectedNodeIds((prev) => {
          const newSet = new Set(prev);
          if (change.selected) {
            newSet.add(change.id);
          } else {
            newSet.delete(change.id);
          }
          return newSet;
        });
      } else if (change.type === "remove") {
        setSelectedNodeIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(change.id);
          return newSet;
        });
        // 同时删除相关的边
        setEdges((prevEdges) =>
          prevEdges.filter(
            (e) => e.source !== change.id && e.target !== change.id
          )
        );
      }
    }
    setNodes((prevNodes) => applyNodeChanges(changes, prevNodes));
  };

  // 处理边变化
  const handleEdgesChange = (changes: EdgeChange[]) => {
    // 处理选择状态
    for (const change of changes) {
      if (change.type === "select") {
        setSelectedEdgeIds((prev) => {
          const newSet = new Set(prev);
          if (change.selected) {
            newSet.add(change.id);
          } else {
            newSet.delete(change.id);
          }
          return newSet;
        });
      } else if (change.type === "remove") {
        setSelectedEdgeIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(change.id);
          return newSet;
        });
      }
    }
    setEdges((prevEdges) => applyEdgeChanges(changes, prevEdges));
  };

  // 处理连接
  const handleConnect = (connection: Connection) => {
    if (connection.source && connection.target) {
      setEdges((prev) =>
        addEdge(connection, prev, {
          animated: false,
        })
      );
    }
  };

  // 添加节点
  const addNode = (type: string) => {
    const id = nodeIdCounter().toString();
    setNodeIdCounter(nodeIdCounter() + 1);
    const position = {
      x: Math.random() * 400 + 200,
      y: Math.random() * 300 + 100,
    };
    setNodes((prev) => [
      ...prev,
      {
        id,
        type,
        position,
        data: { label: `${type} 节点 ${id}` },
      },
    ]);
  };

  // 删除选中节点
  const deleteSelectedNodes = () => {
    const selected = selectedNodeIds();
    if (selected.size > 0) {
      setNodes((prev) => prev.filter((n) => !selected.has(n.id)));
      setEdges((prev) =>
        prev.filter((e) => !selected.has(e.source) && !selected.has(e.target))
      );
      setSelectedNodeIds(new Set<string>());
    }
  };

  // 删除选中边
  const deleteSelectedEdges = () => {
    const selected = selectedEdgeIds();
    if (selected.size > 0) {
      setEdges((prev) => prev.filter((e) => !selected.has(e.id)));
      setSelectedEdgeIds(new Set<string>());
    }
  };

  // 切换边动画
  const toggleEdgeAnimation = (edgeId: string) => {
    setEdges((prev) =>
      prev.map((e) => (e.id === edgeId ? { ...e, animated: !e.animated } : e))
    );
  };

  // 清除所有
  const clearAll = () => {
    setNodes([]);
    setEdges([]);
    setSelectedNodeIds(new Set<string>());
    setSelectedEdgeIds(new Set<string>());
    setNodeIdCounter(1);
  };

  // 获取选中节点
  const selectedNodes = () =>
    nodes().filter((n) => selectedNodeIds().has(n.id));
  const selectedEdges = () =>
    edges().filter((e) => selectedEdgeIds().has(e.id));

  return (
    <div class="space-y-4 p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-2xl font-bold">Flow 编辑器完整示例</h2>
        <div class="flex gap-2">
          <Button onClick={clearAll} variant="destructive" size="sm">
            清空所有
          </Button>
        </div>
      </div>

      {/* 工具栏 */}
      <div class="border rounded-lg p-4 bg-gray-50 flex flex-col gap-4">
        <div class="flex flex-wrap gap-2 items-center">
          <span class="text-sm font-semibold mr-2">Click to Add:</span>
          <Button onClick={() => addNode("input")} size="sm" variant="outline">
            + 输入节点
          </Button>
          <Button
            onClick={() => addNode("process")}
            size="sm"
            variant="outline"
          >
            + 处理节点
          </Button>
          <Button
            onClick={() => addNode("decision")}
            size="sm"
            variant="outline"
          >
            + 决策节点
          </Button>
          <Button onClick={() => addNode("output")} size="sm" variant="outline">
            + 输出节点
          </Button>
          <Button
            onClick={() => addNode("default")}
            size="sm"
            variant="outline"
          >
            + 默认节点
          </Button>
          <div class="ml-4 border-l pl-4">
            <Button
              onClick={deleteSelectedNodes}
              size="sm"
              variant="destructive"
              disabled={selectedNodeIds().size === 0}
            >
              删除选中节点 ({selectedNodeIds().size})
            </Button>
            <Button
              onClick={deleteSelectedEdges}
              size="sm"
              variant="destructive"
              class="ml-2"
              disabled={selectedEdgeIds().size === 0}
            >
              删除选中边 ({selectedEdgeIds().size})
            </Button>
          </div>
        </div>

        <div class="flex gap-4 items-center border-t pt-4">
          <span class="text-sm font-semibold mr-2">Drag to Add:</span>
          <div class="flex gap-2">
            <div
              class="p-2 bg-blue-100 rounded cursor-grab"
              draggable={true}
              onDragStart={(e) => onDragStart(e, "input")}
            >
              Input
            </div>
            <div
              class="p-2 bg-green-100 rounded cursor-grab"
              draggable={true}
              onDragStart={(e) => onDragStart(e, "process")}
            >
              Process
            </div>
            <div
              class="p-2 bg-yellow-100 rounded cursor-grab"
              draggable={true}
              onDragStart={(e) => onDragStart(e, "decision")}
            >
              Decision
            </div>
            <div
              class="p-2 bg-purple-100 rounded cursor-grab"
              draggable={true}
              onDragStart={(e) => onDragStart(e, "output")}
            >
              Output
            </div>
          </div>
        </div>
      </div>

      {/* Flow 画布 */}
      <div
        class="border rounded-lg overflow-hidden bg-white"
        style="height: 700px;"
      >
        <Flow
          nodes={nodes()}
          edges={edges()}
          onNodesChange={handleNodesChange}
          onEdgesChange={handleEdgesChange}
          onConnect={handleConnect}
          nodeTypes={{
            default: DefaultNode,
            input: InputNode,
            process: ProcessNode,
            decision: DecisionNode,
            output: OutputNode,
          }}
          nodesConnectable={true}
          elementsSelectable={true}
          panOnDrag={[1, 2]} // 中键或右键拖拽平移
          zoomOnScroll={true}
          fitView={false}
          defaultViewport={{ x: 0, y: 0, zoom: 1 }}
          onInit={onInit}
          onDragOver={onDragOver}
          onDrop={onDrop}
        />
      </div>

      {/* 信息面板 */}
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="border rounded-lg p-4">
          <h3 class="font-semibold mb-2">节点信息</h3>
          <div class="text-sm space-y-1">
            <p>总节点数: {nodes().length}</p>
            <p>选中节点数: {selectedNodeIds().size}</p>
            {selectedNodes().length > 0 && (
              <div class="mt-2">
                <p class="font-semibold">选中的节点:</p>
                <ul class="list-disc list-inside mt-1">
                  <For each={selectedNodes()}>
                    {(node) => (
                      <li>
                        {node.id} ({node.type}) - {node.data?.label}
                      </li>
                    )}
                  </For>
                </ul>
              </div>
            )}
          </div>
        </div>

        <div class="border rounded-lg p-4">
          <h3 class="font-semibold mb-2">边信息</h3>
          <div class="text-sm space-y-1">
            <p>总边数: {edges().length}</p>
            <p>选中边数: {selectedEdgeIds().size}</p>
            {selectedEdges().length > 0 && (
              <div class="mt-2">
                <p class="font-semibold">选中的边:</p>
                <ul class="list-disc list-inside mt-1 space-y-1">
                  <For each={selectedEdges()}>
                    {(edge) => (
                      <li class="flex items-center justify-between">
                        <span>
                          {edge.source} → {edge.target}
                          {edge.animated && " (动画)"}
                        </span>
                        <Button
                          onClick={() => toggleEdgeAnimation(edge.id)}
                          size="sm"
                          variant="outline"
                          class="ml-2 h-6 text-xs"
                        >
                          {edge.animated ? "停止动画" : "开始动画"}
                        </Button>
                      </li>
                    )}
                  </For>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 使用说明 */}
      <div class="border rounded-lg p-4 bg-blue-50">
        <h3 class="font-semibold mb-2 text-blue-900">💡 使用说明</h3>
        <div class="text-sm text-blue-800 space-y-1">
          <ul class="list-disc list-inside space-y-1">
            <li>
              <strong>添加节点:</strong> 点击工具栏中的按钮添加不同类型的节点
            </li>
            <li>
              <strong>连接节点:</strong>{" "}
              从一个节点的连接点（Handle）拖拽到另一个节点的连接点
            </li>
            <li>
              <strong>移动节点:</strong> 左键拖拽节点可以移动位置
            </li>
            <li>
              <strong>平移画布:</strong> 使用鼠标中键或右键拖拽，或使用控制按钮
            </li>
            <li>
              <strong>缩放:</strong> 使用鼠标滚轮缩放，或使用控制按钮
            </li>
            <li>
              <strong>选择:</strong>{" "}
              点击节点或边进行选择，选中的边可以切换动画效果
            </li>
            <li>
              <strong>删除:</strong> 选中节点或边后，点击删除按钮删除
            </li>
            <li>
              <strong>小地图:</strong> 右下角显示整个流程图的小地图
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
