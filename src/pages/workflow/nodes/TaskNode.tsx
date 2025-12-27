import type { Component } from "solid-js";
import { Handle, type NodeComponentProps } from "@ensolid/solidflow";

export const TaskNode: Component<NodeComponentProps> = (props) => {
  return (
    <div
      style={{ width: "220px", height: "auto" }}
      class="relative min-w-[220px] rounded-xl bg-white shadow-lg transition-all hover:shadow-xl"
    >
      <div class="rounded-t-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-3 py-2">
        <div class="flex items-center gap-2">
          <span class="text-lg">📋</span>
          <span class="text-xs font-bold uppercase tracking-wider text-white">
            Task
          </span>
        </div>
      </div>
      <div class="p-4 space-y-2">
        <div class="text-sm font-bold text-gray-800">
          {props.node.data?.label || "New Task"}
        </div>
        <p class="text-xs text-gray-500 leading-relaxed line-clamp-2">
          {props.node.data?.description ||
            "Define the task objectives and expected output..."}
        </p>
      </div>
      <Handle
        nodeId={props.node.id}
        type="target"
        position="top"
        style={{
          width: "12px",
          height: "12px",
          background: "#10b981",
          border: "2px solid white",
        }}
      />
      <Handle
        nodeId={props.node.id}
        type="source"
        position="bottom"
        style={{
          width: "12px",
          height: "12px",
          background: "#10b981",
          border: "2px solid white",
        }}
      />
    </div>
  );
};
