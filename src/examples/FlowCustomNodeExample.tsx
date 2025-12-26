/**
 * Flow 自定义节点示例
 */

import type { Component } from "solid-js";
import { createSignal } from "solid-js";
import { Flow, applyNodeChanges } from "@resolid/solidflow";
import type {
  Node,
  Edge,
  NodeChange,
  NodeComponentProps,
} from "@resolid/solidflow";
import { Handle } from "@resolid/solidflow";

// 自定义输入节点
const InputNode: Component<NodeComponentProps> = (props) => {
  return (
    <div class="bg-blue-100 border-2 border-blue-500 rounded-lg p-4 min-w-[150px] min-h-[60px] shadow-lg">
      <Handle
        type="source"
        position="bottom"
        id="bottom"
        nodeId={props.node.id}
      />
      <div class="font-semibold text-blue-800">输入节点</div>
      <div class="text-sm text-blue-600 mt-1">
        {props.node.data?.label ?? props.node.id}
      </div>
    </div>
  );
};

// 自定义处理节点
const ProcessNode: Component<NodeComponentProps> = (props) => {
  return (
    <div class="bg-green-100 border-2 border-green-500 rounded-lg p-4 min-w-[150px] min-h-[60px] shadow-lg">
      <Handle type="target" position="top" id="top" nodeId={props.node.id} />
      <Handle
        type="source"
        position="bottom"
        id="bottom"
        nodeId={props.node.id}
      />
      <div class="font-semibold text-green-800">处理节点</div>
      <div class="text-sm text-green-600 mt-1">
        {props.node.data?.label ?? props.node.id}
      </div>
    </div>
  );
};

// 自定义输出节点
const OutputNode: Component<NodeComponentProps> = (props) => {
  return (
    <div class="bg-red-100 border-2 border-red-500 rounded-lg p-4 min-w-[150px] min-h-[60px] shadow-lg">
      <Handle type="target" position="top" id="top" nodeId={props.node.id} />
      <div class="font-semibold text-red-800">输出节点</div>
      <div class="text-sm text-red-600 mt-1">
        {props.node.data?.label ?? props.node.id}
      </div>
    </div>
  );
};

// 自定义决策节点
const DecisionNode: Component<NodeComponentProps> = (props) => {
  return (
    <div class="bg-yellow-100 border-2 border-yellow-500 rounded-lg p-4 min-w-[150px] min-h-[80px] shadow-lg transform rotate-45">
      <div class="transform -rotate-45">
        <Handle type="target" position="top" id="top" nodeId={props.node.id} />
        <Handle
          type="source"
          position="right"
          id="right"
          nodeId={props.node.id}
        />
        <Handle
          type="source"
          position="bottom"
          id="bottom"
          nodeId={props.node.id}
        />
        <div class="font-semibold text-yellow-800">决策节点</div>
        <div class="text-sm text-yellow-600 mt-1">
          {props.node.data?.label ?? props.node.id}
        </div>
      </div>
    </div>
  );
};

export const FlowCustomNodeExample: Component = () => {
  const [nodes, setNodes] = createSignal<Node[]>([
    {
      id: "input-1",
      type: "input",
      position: { x: 100, y: 50 },
      data: { label: "数据输入" },
    },
    {
      id: "process-1",
      type: "process",
      position: { x: 300, y: 50 },
      data: { label: "数据处理" },
    },
    {
      id: "decision-1",
      type: "decision",
      position: { x: 500, y: 50 },
      data: { label: "判断条件" },
    },
    {
      id: "process-2",
      type: "process",
      position: { x: 400, y: 200 },
      data: { label: "分支处理" },
    },
    {
      id: "output-1",
      type: "output",
      position: { x: 700, y: 50 },
      data: { label: "结果输出" },
    },
  ]);

  const [edges] = createSignal<Edge[]>([
    {
      id: "e1",
      source: "input-1",
      target: "process-1",
    },
    {
      id: "e2",
      source: "process-1",
      target: "decision-1",
    },
    {
      id: "e3",
      source: "decision-1",
      target: "output-1",
    },
    {
      id: "e4",
      source: "decision-1",
      target: "process-2",
    },
  ]);

  const handleNodesChange = (changes: NodeChange[]) => {
    setNodes((prevNodes) => applyNodeChanges(changes, prevNodes));
  };

  return (
    <div class="space-y-4 p-6">
      <h2 class="text-2xl font-bold mb-4">Flow 自定义节点示例</h2>

      <div class="border rounded-lg overflow-hidden" style="height: 600px;">
        <Flow
          nodes={nodes()}
          edges={edges()}
          onNodesChange={handleNodesChange}
          nodeTypes={{
            input: InputNode,
            process: ProcessNode,
            decision: DecisionNode,
            output: OutputNode,
          }}
          fitView
          fitViewOptions={{ padding: 0.2 }}
        />
      </div>

      <div class="text-sm text-gray-600 space-y-2">
        <p>💡 这个示例展示了如何创建自定义节点类型：</p>
        <ul class="list-disc list-inside space-y-1">
          <li>蓝色节点：输入节点（只有输出连接点）</li>
          <li>绿色节点：处理节点（有输入和输出连接点）</li>
          <li>黄色菱形：决策节点（有多个输出连接点）</li>
          <li>红色节点：输出节点（只有输入连接点）</li>
        </ul>
      </div>
    </div>
  );
};
