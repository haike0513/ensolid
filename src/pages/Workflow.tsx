/**
 * Workflow / Agent Orchestration Page
 * Features a node-based editor for defining AI agents and their tasks.
 */
import type { Component } from "solid-js";
import { createSignal, Show } from "solid-js";
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Controls,
  Flow,
  Handle,
  Panel,
} from "@ensolid/solidflow";
import { NodePropertyPanel } from "../examples/NodePropertyPanel";
import type {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  NodeComponentProps,
  FlowInstance,
} from "@ensolid/solidflow";
import { Button } from "../components/ui/button";

// --- Node Components ---

// Agent Node: Represents an AI entity
const AgentNode: Component<NodeComponentProps> = (props) => {
  return (
    <div
      style={{ width: "180px", height: "auto" }}
      class="relative group min-w-[180px] rounded-xl bg-white shadow-lg transition-all hover:shadow-xl"
    >
      {/* Glassmorphism Header */}
      <div class="rounded-t-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-3 py-2">
        <div class="flex items-center gap-2">
          <span class="text-lg">🤖</span>
          <span class="text-xs font-bold uppercase tracking-wider text-white">
            Agent
          </span>
        </div>
      </div>

      {/* Content */}
      <div class="p-4">
        <div class="text-sm font-bold text-gray-800">
          {props.node.data?.label || "New Agent"}
        </div>
        <div class="mt-1 text-xs text-gray-500">
          {props.node.data?.role || "Assistant"}
        </div>

        <div class="mt-3 flex gap-1 flex-wrap">
          <span class="px-1.5 py-0.5 rounded bg-indigo-50 text-[10px] text-indigo-600 font-medium">
            GPT-4
          </span>
          <span class="px-1.5 py-0.5 rounded bg-indigo-50 text-[10px] text-indigo-600 font-medium">
            Memory
          </span>
        </div>
      </div>

      {/* Handles */}
      <Handle
        nodeId={props.node.id}
        type="target"
        position="left"
        style={{
          width: "12px",
          height: "12px",
          background: "#6366f1",
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
          background: "#6366f1",
          border: "2px solid white",
        }}
      />
    </div>
  );
};

// Task Node: Represents a unit of work
const TaskNode: Component<NodeComponentProps> = (props) => {
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

// Trigger Node: Start of workflow
const TriggerNode: Component<NodeComponentProps> = (props) => {
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

// Tool Node: External tools
const ToolNode: Component<NodeComponentProps> = (props) => {
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

// --- Main Page ---

export const WorkflowPage: Component = () => {
  const [showMenu, setShowMenu] = createSignal(false);
  const [nodes, setNodes] = createSignal<Node[]>([
    {
      id: "trigger-1",
      type: "trigger",
      position: { x: 50, y: 300 },
      data: { label: "Start" },
    },
    {
      id: "agent-researcher",
      type: "agent",
      position: { x: 250, y: 200 },
      data: { label: "Market Researcher", role: "Researcher", model: "GPT-4" },
    },
    {
      id: "task-analyze",
      type: "task",
      position: { x: 550, y: 200 },
      data: {
        label: "Analyze Trends",
        description:
          "Analyze the latest market trends based on the research data.",
      },
    },
    {
      id: "start-2",
      type: "agent",
      position: { x: 250, y: 450 },
      data: { label: "Copywriter", role: "Writer" },
    },
  ]);

  const [flowInstance, setFlowInstance] = createSignal<FlowInstance | null>(
    null
  );

  const onDragStart = (event: DragEvent, type: string) => {
    if (event.dataTransfer) {
      event.dataTransfer.setData("application/solidflow/type", type);
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
    const instance = flowInstance();

    if (!type || !instance) return;

    const position = instance.project({
      x: event.clientX,
      y: event.clientY,
    });

    const id = `${type}-${Date.now()}`;
    let data = { label: `New ${type}` };

    if (type === "agent")
      data = { label: "New Agent", role: "Assistant" } as any;
    if (type === "task")
      data = { label: "New Task", description: "Task description..." } as any;
    if (type === "tool")
      data = { label: "New Tool", description: "Tool..." } as any;
    if (type === "trigger") data = { label: "Start" } as any;

    setNodes((nds) =>
      nds.concat({
        id,
        type,
        position,
        data,
      })
    );
  };

  // Selection State
  const [selectedNodeId, setSelectedNodeId] = createSignal<string | null>(null);

  // Helper to get current node
  const selectedNode = () => nodes().find((n) => n.id === selectedNodeId());

  // Update Node Data
  const updateNodeData = (id: string, data: any) => {
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === id) {
          return { ...n, data: { ...n.data, ...data } };
        }
        return n;
      })
    );
  };

  // Event Handlers
  const onNodeClick = (_: MouseEvent, node: Node) => {
    console.log("Workflow: Node clicked", node);
    setSelectedNodeId(node.id);
  };

  const onPaneClick = () => {
    setSelectedNodeId(null);
  };

  const [edges, setEdges] = createSignal<Edge[]>([
    {
      id: "e1",
      source: "trigger-1",
      target: "agent-researcher",
      animated: true,
    },
    { id: "e2", source: "agent-researcher", target: "task-analyze" },
  ]);

  // Flow Handlers
  const onNodesChange = (changes: NodeChange[]) =>
    setNodes((nds) => applyNodeChanges(changes, nds));
  const onEdgesChange = (changes: EdgeChange[]) =>
    setEdges((eds) => applyEdgeChanges(changes, eds));
  const onConnect = (connection: Connection) =>
    setEdges((eds) => addEdge(connection, eds));

  const clearGraph = () => {
    setNodes([]);
    setEdges([]);
  };

  // Export Graph
  const exportGraph = () => {
    const data = {
      nodes: nodes(),
      edges: edges(),
    };
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "workflow.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Import Graph
  let fileInput: HTMLInputElement | undefined;
  const importGraph = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const data = JSON.parse(content);
          if (data.nodes && data.edges) {
            setNodes(data.nodes);
            setEdges(data.edges);
          } else {
            alert("Invalid workflow file format");
          }
        } catch (error) {
          alert("Error parsing JSON file");
        }
      };
      reader.readAsText(file);
    }
    // Reset input value to allow re-importing same file
    target.value = "";
  };

  // Canvas State
  const [isLocked, setIsLocked] = createSignal(false);

  return (
    <div class="flex h-[calc(100vh-theme(spacing.16))] flex-col bg-white">
      {/* Hidden File Input for Import */}
      <input
        type="file"
        ref={fileInput}
        style={{ display: "none" }}
        accept=".json"
        onChange={importGraph}
      />

      {/* ... Top Bar / Menu (omitted as it's separate) ... */}

      {/* Editor Area */}
      <div class="relative flex-1 overflow-hidden">
        <Flow
          nodes={nodes()}
          edges={edges()}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setFlowInstance}
          onDragOver={onDragOver}
          onDrop={onDrop}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          // Locking Props
          nodesDraggable={!isLocked()}
          nodesConnectable={!isLocked()}
          elementsSelectable={!isLocked()}
          panOnDrag={!isLocked()}
          zoomOnScroll={!isLocked()}
          panOnScroll={!isLocked()}
          nodeTypes={{
            agent: AgentNode,
            task: TaskNode,
            trigger: TriggerNode,
            tool: ToolNode,
          }}
          fitView
        >
          <Controls position="bottom-left" />

          {/* Hamburger Menu Panel */}
          <Panel position="top-left" class="m-4">
            <div class="relative">
              <Button
                variant="outline"
                size="icon"
                class="bg-white border-gray-200 shadow-sm hover:bg-gray-50 h-10 w-10 rounded-lg"
                onClick={() => setShowMenu(!showMenu())}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="text-gray-700"
                >
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              </Button>

              <Show when={showMenu()}>
                <div class="absolute top-12 left-0 w-64 bg-white rounded-lg shadow-xl border border-gray-200 p-2 flex flex-col gap-1 text-sm text-gray-700 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                  <button
                    onClick={() => fileInput?.click()}
                    class="flex items-center justify-between px-3 py-2 rounded hover:bg-indigo-50 hover:text-indigo-700 transition-colors text-left"
                  >
                    <div class="flex items-center gap-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
                      </svg>
                      <span>Open</span>
                    </div>
                    <span class="text-xs text-gray-400">Cmd+O</span>
                  </button>
                  <button
                    onClick={exportGraph}
                    class="flex items-center justify-between px-3 py-2 rounded hover:bg-indigo-50 hover:text-indigo-700 transition-colors text-left"
                  >
                    <div class="flex items-center gap-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" x2="12" y1="15" y2="3" />
                      </svg>
                      <span>Save to...</span>
                    </div>
                  </button>
                  <button class="flex items-center justify-between px-3 py-2 rounded hover:bg-indigo-50 hover:text-indigo-700 transition-colors text-left">
                    <div class="flex items-center gap-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <rect
                          width="18"
                          height="18"
                          x="3"
                          y="3"
                          rx="2"
                          ry="2"
                        />
                        <circle cx="9" cy="9" r="2" />
                        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                      </svg>
                      <span>Export image...</span>
                    </div>
                    <span class="text-xs text-gray-400">Cmd+Shift+E</span>
                  </button>

                  <div class="h-px bg-gray-100 my-1"></div>

                  <button
                    onClick={clearGraph}
                    class="flex items-center justify-between px-3 py-2 rounded hover:bg-red-50 hover:text-red-700 transition-colors text-left"
                  >
                    <div class="flex items-center gap-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path d="M3 6h18" />
                        <path d="M19 6v14c0 1.1-.9 2-2 2H7c-1.1 0-2-.9-2-2V6" />
                        <path d="M8 6V4c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2v2" />
                        <line x1="10" x2="10" y1="11" y2="17" />
                        <line x1="14" x2="14" y1="11" y2="17" />
                      </svg>
                      <span>Reset canvas</span>
                    </div>
                  </button>

                  <div class="h-px bg-gray-100 my-1"></div>

                  <div class="px-3 py-2">
                    <div class="text-xs font-semibold text-gray-400 mb-2">
                      Links
                    </div>
                    <a
                      href="#"
                      class="flex items-center gap-3 text-sm text-gray-600 hover:text-indigo-600 mb-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                      </svg>
                      GitHub
                    </a>
                    <a
                      href="#"
                      class="flex items-center gap-3 text-sm text-gray-600 hover:text-indigo-600"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path d="M16 12l-4-4-4 4" />
                      </svg>
                      Documentation
                    </a>
                  </div>

                  <div class="h-px bg-gray-100 my-1"></div>

                  <div class="px-3 py-2 bg-gray-50 rounded mt-1">
                    <div class="flex items-center justify-between text-xs text-gray-500">
                      <span>Theme</span>
                      <div class="flex gap-1 bg-gray-200 p-1 rounded-md">
                        <button class="p-1 bg-white rounded shadow-sm text-gray-800">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          >
                            <circle cx="12" cy="12" r="5" />
                            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                          </svg>
                        </button>
                        <button class="p-1 hover:bg-white rounded hover:shadow-sm text-gray-500">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          >
                            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Show>
            </div>
          </Panel>

          {/* Floating Toolbar Panel */}
          <Panel position="top-center" class="mt-4">
            <div class="flex items-center gap-1 rounded-xl border border-gray-200 bg-white p-1.5 shadow-lg">
              {/* Lock Button (Functional) */}
              <div
                class={`p-2 rounded-lg cursor-pointer transition-colors ${
                  isLocked()
                    ? "bg-red-100 text-red-600"
                    : "hover:bg-gray-100 text-gray-500"
                }`}
                title={isLocked() ? "Unlock Canvas" : "Lock Canvas"}
                onClick={() => setIsLocked(!isLocked())}
              >
                <Show
                  when={isLocked()}
                  fallback={
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
                      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  }
                >
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
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 9.9-1" />
                  </svg>
                </Show>
              </div>

              {/* Hand / Pan */}
              <div
                class="p-2 rounded-lg hover:bg-gray-100 text-gray-500 cursor-pointer transition-colors"
                title="Pan Mode"
              >
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
                  <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" />
                  <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2" />
                  <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8" />
                  <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
                </svg>
              </div>

              {/* Select (Active) */}
              <div
                class="p-2 rounded-lg bg-indigo-100 text-indigo-700 cursor-pointer transition-colors"
                title="Select Mode"
              >
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
                  <path d="m3 3 7.07 16.97 2.51-7.39 7.39-2.51L3 3z" />
                  <path d="m13 13 6 6" />
                </svg>
              </div>

              <div class="w-px h-6 bg-gray-200 mx-1"></div>

              {/* Draggable Nodes */}

              {/* Agent Node */}
              <div
                class="p-2 rounded-lg hover:bg-gray-100 text-gray-700 cursor-grab active:cursor-grabbing relative group transition-colors"
                title="Agent Node"
                draggable={true}
                onDragStart={(e) => onDragStart(e, "agent")}
              >
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
                <span class="absolute -bottom-1 -right-1 text-[8px] font-bold text-gray-400">
                  1
                </span>
              </div>

              {/* Task Node */}
              <div
                class="p-2 rounded-lg hover:bg-gray-100 text-gray-700 cursor-grab active:cursor-grabbing relative group transition-colors"
                title="Task Node"
                draggable={true}
                onDragStart={(e) => onDragStart(e, "task")}
              >
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
                <span class="absolute -bottom-1 -right-1 text-[8px] font-bold text-gray-400">
                  2
                </span>
              </div>

              {/* Tool Node */}
              <div
                class="p-2 rounded-lg hover:bg-gray-100 text-gray-700 cursor-grab active:cursor-grabbing relative group transition-colors"
                title="Tool Node"
                draggable={true}
                onDragStart={(e) => onDragStart(e, "tool")}
              >
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
                <span class="absolute -bottom-1 -right-1 text-[8px] font-bold text-gray-400">
                  3
                </span>
              </div>

              {/* Trigger Node */}
              <div
                class="p-2 rounded-lg hover:bg-gray-100 text-gray-700 cursor-grab active:cursor-grabbing relative group transition-colors"
                title="Trigger Node"
                draggable={true}
                onDragStart={(e) => onDragStart(e, "trigger")}
              >
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
                <span class="absolute -bottom-1 -right-1 text-[8px] font-bold text-gray-400">
                  4
                </span>
              </div>

              <div class="w-px h-6 bg-gray-200 mx-1"></div>

              {/* Additional static tools for visuals */}
              <div class="p-2 rounded-lg hover:bg-gray-100 text-gray-500 cursor-pointer">
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
                  <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                </svg>
              </div>
              <div class="p-2 rounded-lg hover:bg-gray-100 text-gray-500 cursor-pointer">
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
                  <polyline points="4 7 4 4 20 4 20 7" />
                  <line x1="9" x2="15" y1="20" y2="20" />
                  <line x1="12" x2="12" y1="4" y2="20" />
                </svg>
              </div>
            </div>
          </Panel>
        </Flow>

        {/* Property Panel Sidebar */}
        <Show when={selectedNode()}>
          {(node) => (
            <NodePropertyPanel
              node={node()}
              onClose={onPaneClick}
              onUpdate={updateNodeData}
            />
          )}
        </Show>
      </div>
    </div>
  );
};
