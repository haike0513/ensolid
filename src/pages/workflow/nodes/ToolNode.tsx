import type { Component } from "solid-js";
import { Handle, type NodeComponentProps } from "@ensolid/solidflow";

export const ToolNode: Component<NodeComponentProps> = (props) => {
  return (
    <div
      style={{ width: "140px", height: "auto" }}
      class="min-w-[140px] rounded-lg bg-gray-50 shadow-sm p-2 flex items-center gap-2"
    >
      <div class="w-8 h-8 rounded bg-white border flex items-center justify-center text-lg">
        🛠️
      </div>
      <div>
        <div class="text-xs font-bold text-gray-700">
          {props.node.data?.label || "Tool"}
        </div>
        <div class="text-[10px] text-gray-500">External Capability</div>
      </div>
      <Handle
        nodeId={props.node.id}
        type="target"
        position="left"
        style={{ background: "#9ca3af" }}
      />
    </div>
  );
};
