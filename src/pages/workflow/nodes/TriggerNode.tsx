import type { Component } from "solid-js";
import { Handle, type NodeComponentProps } from "@ensolid/solidflow";

export const TriggerNode: Component<NodeComponentProps> = (props) => {
  return (
    <div
      style={{ width: "64px", height: "64px" }}
      class="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-pink-500 shadow-lg ring-4 ring-orange-100 transition-transform hover:scale-110"
    >
      <span class="text-2xl">🚀</span>
      <Handle
        nodeId={props.node.id}
        type="source"
        position="right"
        style={{
          width: "16px",
          height: "16px",
          background: "#f97316",
          border: "4px solid white",
        }}
      />
    </div>
  );
};
