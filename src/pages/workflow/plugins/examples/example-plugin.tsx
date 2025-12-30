/**
 * 示例插件 - 演示如何创建和使用工作流插件
 * 
 * 此文件展示了如何创建一个自定义节点插件
 */

import { registerPlugin } from "../index";
import type { Component } from "solid-js";
import { Handle, type NodeComponentProps } from "@ensolid/solidflow";
import type { Node } from "@ensolid/solidflow";
import { Label } from "@/components/ui/label";

// 1. 定义自定义节点组件
const CustomExampleNode: Component<NodeComponentProps> = (props) => {
  return (
    <div
      style={{ width: "200px", height: "auto" }}
      class="relative min-w-[200px] rounded-xl bg-white shadow-lg transition-all hover:shadow-xl border border-blue-500"
    >
      <div class="rounded-t-xl bg-gradient-to-r from-blue-500 to-cyan-600 px-3 py-2">
        <div class="flex items-center gap-2">
          <span class="text-lg">⭐</span>
          <span class="text-xs font-bold uppercase tracking-wider text-white">
            Custom
          </span>
        </div>
      </div>
      <div class="p-4 space-y-2">
        <div class="text-sm font-bold text-gray-800">
          {props.node.data?.label || "Custom Node"}
        </div>
        <p class="text-xs text-gray-500 leading-relaxed">
          {props.node.data?.description || "This is a custom node example"}
        </p>
        {props.node.data?.value && (
          <div class="text-xs text-blue-600 font-medium">
            Value: {props.node.data.value}
          </div>
        )}
      </div>
      <Handle
        nodeId={props.node.id}
        type="target"
        position="left"
        style={{
          width: "12px",
          height: "12px",
          background: "#3b82f6",
          border: "2px solid white",
        }}
      />
      <Handle
        nodeId={props.node.id}
        type="source"
        position="right"
        style={{
          width: "12px",
          height: "12px",
          background: "#3b82f6",
          border: "2px solid white",
        }}
      />
    </div>
  );
};

// 2. 定义自定义属性面板组件（可选）
const CustomExamplePropertyPanel: Component<{
  node: Node;
  onUpdate: (data: Record<string, any>) => void;
}> = (props) => {
  const inputClass =
    "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <div class="space-y-4">
      <div class="space-y-2">
        <Label>Name</Label>
        <input
          type="text"
          class={inputClass}
          value={props.node.data?.label || ""}
          onInput={(e) =>
            props.onUpdate({ label: e.currentTarget.value })
          }
          placeholder="Node Name"
        />
      </div>

      <div class="space-y-2">
        <Label>Description</Label>
        <textarea
          class="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          value={props.node.data?.description || ""}
          onInput={(e) =>
            props.onUpdate({ description: e.currentTarget.value })
          }
          placeholder="Node description..."
          rows={3}
        />
      </div>

      <div class="space-y-2">
        <Label>Value</Label>
        <input
          type="number"
          class={inputClass}
          value={props.node.data?.value || ""}
          onInput={(e) =>
            props.onUpdate({ value: Number(e.currentTarget.value) })
          }
          placeholder="Enter a number"
        />
      </div>
    </div>
  );
};

// 3. 注册插件
export function registerExamplePlugin() {
  registerPlugin({
    id: "example-plugin",
    name: "Example Plugin",
    version: "1.0.0",
    description: "An example plugin demonstrating how to create custom workflow nodes",
    author: "Workflow Team",
    nodes: [
      {
        type: "custom-example",
        label: "Custom Example Node",
        description: "A custom node example for demonstration",
        icon: "⭐",
        component: CustomExampleNode,
        defaultData: {
          label: "Custom Node",
          description: "This is a custom node",
          value: 0,
        },
        createNodeData: (type) => ({
          label: "New Custom Node",
          description: "A new custom node instance",
          value: 0,
        }),
        propertyPanel: CustomExamplePropertyPanel,
        toolbar: {
          title: "Custom Example Node",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          ),
        },
      },
    ],
    onRegister: () => {
      console.log("Example plugin registered!");
    },
    onUnregister: () => {
      console.log("Example plugin unregistered!");
    },
  });
}

