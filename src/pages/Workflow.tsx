/**
 * Workflow / Agent Orchestration Page
 * Features a node-based editor for defining AI agents and their tasks.
 */
import type { Component } from "solid-js";
import { createSignal, createMemo, Show } from "solid-js";
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Controls,
  Flow,
  type Connection,
  type Edge,
  type EdgeChange,
  type Node,
  type NodeChange,
  type FlowInstance,
} from "@ensolid/solidflow";
import { NodePropertyPanel } from "../examples/NodePropertyPanel";
import { AgentNode, TaskNode, TriggerNode, ToolNode } from "./workflow/nodes";
import { WorkflowMenu } from "./workflow/components/WorkflowMenu";
import { WorkflowToolbar } from "./workflow/components/WorkflowToolbar";

// --- Main Page ---

export const WorkflowPage: Component = () => {
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

  const [edges, setEdges] = createSignal<Edge[]>([
    {
      id: "e1",
      source: "trigger-1",
      target: "agent-researcher",
      animated: true,
    },
    { id: "e2", source: "agent-researcher", target: "task-analyze" },
  ]);

  const [flowInstance, setFlowInstance] = createSignal<FlowInstance | null>(
    null
  );

  // Selection State
  const [selectedNodeId, setSelectedNodeId] = createSignal<string | null>(null);

  // Canvas State
  const [isLocked, setIsLocked] = createSignal(false);

  // Helper to get current node
  const selectedNode = createMemo(() => nodes().find((n) => n.id === selectedNodeId()));

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

  // Event Handlers
  const onNodeClick = (_: MouseEvent, node: Node) => {
    console.log("Workflow: Node clicked", node);
    setSelectedNodeId(node.id);
  };

  const onSelectionChange = (params: { nodes: Node[]; edges: Edge[] }) => {
    setSelectedNodeId(params.nodes[0]?.id ?? null);
  };

  const onPaneClick = () => {
    setSelectedNodeId(null);
  };

  // Flow Handlers
  const onNodesChange = (changes: NodeChange[]) => {
    let nextSelectedId = selectedNodeId();

    // Sync selection state from Flow change events
    for (const change of changes) {
      if (change.type === "select") {
        if (change.selected) {
          nextSelectedId = change.id;
        } else if (nextSelectedId === change.id) {
          nextSelectedId = null;
        }
      }
    }

    setNodes((nds) => applyNodeChanges(changes, nds));
    setSelectedNodeId(nextSelectedId);
  };
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
  const importGraph = (file: File) => {
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
  };

  const nodeTypes = {
    agent: AgentNode,
    task: TaskNode,
    trigger: TriggerNode,
    tool: ToolNode,
  };

  return (
    <div class="flex h-[calc(100vh-theme(spacing.16))] flex-col bg-white">
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
          onSelectionChange={onSelectionChange}
          onPaneClick={onPaneClick}
          // Locking Props
          nodesDraggable={!isLocked()}
          nodesConnectable={!isLocked()}
          elementsSelectable={!isLocked()}
          panOnDrag={!isLocked()}
          zoomOnScroll={!isLocked()}
          panOnScroll={!isLocked()}
          nodeTypes={nodeTypes}
          fitView
        >
          <Controls position="bottom-left" />

          {/* Hamburger Menu Panel */}
          <WorkflowMenu
            onImport={importGraph}
            onExport={exportGraph}
            onClear={clearGraph}
          />

          {/* Floating Toolbar Panel */}
          <WorkflowToolbar
            isLocked={isLocked}
            setIsLocked={setIsLocked}
            onNodeDragStart={onDragStart}
          />
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
