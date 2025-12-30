/**
 * 内置节点插件
 * 注册系统默认提供的节点类型
 */

import { registerPlugin } from "./index";
import { AgentNode, TaskNode, TriggerNode, ToolNode } from "../nodes";

export function registerBuiltinNodes() {
  registerPlugin(
    {
      id: "builtin-nodes",
      name: "Built-in Nodes",
      version: "1.0.0",
      description: "Default workflow nodes (Agent, Task, Tool, Trigger)",
      nodes: [
        {
          type: "agent",
          label: "Agent",
          description: "AI Agent node",
          icon: "🤖",
          component: AgentNode,
          defaultData: { label: "New Agent", role: "Assistant" },
          createNodeData: () => ({ label: "New Agent", role: "Assistant" }),
          toolbar: {
            title: "Agent Node",
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
                <path d="M12 8V4H8" />
                <rect width="16" height="12" x="4" y="8" rx="2" />
                <path d="M2 14h2" />
                <path d="M20 14h2" />
                <path d="M15 13v2" />
                <path d="M9 13v2" />
              </svg>
            ),
          },
        },
        {
          type: "task",
          label: "Task",
          description: "Task node",
          icon: "📋",
          component: TaskNode,
          defaultData: { label: "New Task", description: "Task description..." },
          createNodeData: () => ({
            label: "New Task",
            description: "Task description...",
          }),
          toolbar: {
            title: "Task Node",
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
                <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                <path d="M12 11h4" />
                <path d="M12 16h4" />
                <path d="M8 11h.01" />
                <path d="M8 16h.01" />
              </svg>
            ),
          },
        },
        {
          type: "tool",
          label: "Tool",
          description: "Tool node",
          icon: "🛠️",
          component: ToolNode,
          defaultData: { label: "New Tool", description: "Tool..." },
          createNodeData: () => ({ label: "New Tool", description: "Tool..." }),
          toolbar: {
            title: "Tool Node",
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
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
              </svg>
            ),
          },
        },
        {
          type: "trigger",
          label: "Trigger",
          description: "Trigger/Start node",
          icon: "🚀",
          component: TriggerNode,
          defaultData: { label: "Start" },
          createNodeData: () => ({ label: "Start" }),
          toolbar: {
            title: "Trigger Node",
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
                <circle cx="12" cy="12" r="10" />
                <path d="m10 8 6 4-6 4V8z" />
              </svg>
            ),
          },
        },
      ],
    },
    { override: true }
  );
}

