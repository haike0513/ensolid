/**
 * Workflow / Agent Orchestration Page
 * Features a node-based editor for defining AI agents and their tasks.
 */
import type { Component } from "solid-js";
import { createSignal, createMemo, Show, createEffect } from "solid-js";
import { createStore } from "solid-js/store";
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Controls,
  Flow,
  Executor,
  type Connection,
  type Edge,
  type EdgeChange,
  type Node,
  type NodeChange,
  type FlowInstance,
  ExecutorPanel,
  PropertyPanel,
} from "@ensolid/solidflow";
import { WorkflowMenu } from "./workflow/components/WorkflowMenu";
import { WorkflowToolbar } from "./workflow/components/WorkflowToolbar";
import { pluginRegistry } from "./workflow/plugins";
import { registerBuiltinNodes } from "./workflow/plugins/builtin";

// Define Tasks for Executor
const tasks = {
  // Start/Trigger
  trigger: async () => {
    return { timestamp: Date.now(), source: "trigger" };
  },
  // Agent
  agent: async (ctx: any) => {
    const { node, inputs } = ctx;
    const role = node.data.role || "Assistant";
    const model = node.data.model || "GPT-4";
    console.log(`[Agent ${role}] Processing with ${model}...`, inputs);
    
    // Simulate thinking time
    await new Promise(r => setTimeout(r, 1500));
    
    return { 
        response: `Analysis by ${role} complete.`,
        model,
        timestamp: Date.now()
    };
  },
  // Task
  task: async (ctx: any) => {
    const { node, inputs } = ctx;
    console.log(`[Task ${node.data.label}] Executing...`, inputs);
    await new Promise(r => setTimeout(r, 1000));
    return { status: "Done", output: "Task Result" };
  },
  // Default fallback
  default: async () => {
    await new Promise(r => setTimeout(r, 500));
    return "completed";
  }
};


// 初始化内置节点插件（在模块加载时注册）
registerBuiltinNodes();

// --- Main Page ---

export const WorkflowPage: Component = () => {

  const [nodes, setNodes] = createStore<Node[]>([
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
  
  // Executor State
  const [executor, setExecutor] = createSignal<Executor | null>(null);

  const handleRun = () => {
    const exec = new Executor({
      nodes: nodes,
      edges: edges(),
      tasks: tasks,
      concurrency: 2,
    });
    setExecutor(exec);
    exec.start().catch((err) => console.error("Workflow failed", err));
  };

  const handleStop = () => {
    executor()?.stop();
  };

  // Selection State

  const [selectedNodeId, setSelectedNodeId] = createSignal<string | null>(null);

  // Canvas State
  const [isLocked, setIsLocked] = createSignal(false);

  // Helper to get current node
  const selectedNode = createMemo(() => nodes.find((n) => n.id === selectedNodeId()));

  // Update Node Data
  const updateNodeData = (id: string, data: any) => {
    setNodes(
      (n) => n.id === id,
      "data",
      (prev) => ({ ...prev, ...data })
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
    
    // 从插件系统获取节点定义
    const nodeDef = pluginRegistry.getNodeDefinition(type);
    const data = nodeDef?.createNodeData
      ? nodeDef.createNodeData(type)
      : nodeDef?.defaultData || { label: `New ${type}` };

    setNodes((nds) => [
      ...nds,
      {
        id,
        type,
        position,
        data,
      },
    ]);
  };

  // Event Handlers
  const onNodeClick = (_: MouseEvent, node: Node) => {
    console.log("Workflow: Node clicked", node);
    // 不在这里设置 selectedNodeId，让 onSelectionChange 统一处理
  };

  const onSelectionChange = (params: { nodes: Node[]; edges: Edge[] }) => {
    // 统一由 onSelectionChange 管理选择状态
    setSelectedNodeId(params.nodes[0]?.id ?? null);
  };

  const onPaneClick = () => {
    setSelectedNodeId(null);
  };

  // Flow Handlers
  const onNodesChange = (changes: NodeChange[]) => {
    // 只处理节点数据变化，不处理选择状态
    // 选择状态由 onSelectionChange 统一管理
    setNodes(applyNodeChanges(changes, nodes));
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
      nodes: nodes,
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

  // 从插件系统获取所有节点组件
  const nodeTypes = pluginRegistry.getAllNodeComponents();

  createEffect(() => {
    console.log("selectedNode", selectedNode());
  });

  return (
    <div class="flex h-[calc(100vh-theme(spacing.16))] flex-col bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 dark:from-slate-950 dark:via-blue-950/30 dark:to-slate-950 relative">
      <style>
        {`
        .executing-running {
            border-color: #3b82f6 !important;
            box-shadow: 0 0 0 2px #bfdbfe, 0 0 10px rgba(59, 130, 246, 0.5);
            transition: all 0.3s;
        }
        .executing-completed {
            border-color: #22c55e !important;
            background-color: #f0fdf4 !important;
            transition: all 0.3s;
        }
        .executing-failed {
            border-color: #ef4444 !important;
            background-color: #fef2f2 !important;
            box-shadow: 0 0 0 2px #fecaca;
            transition: all 0.3s;
        }
        `}
      </style>
      {/* 顶部标题栏 */}

      <div class="border-b bg-background/80 backdrop-blur-sm px-6 py-3 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20">
            <span class="text-xl">🔄</span>
          </div>
          <div>
            <h1 class="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              工作流编辑器
            </h1>
            <p class="text-xs text-muted-foreground">拖拽节点构建 AI 工作流</p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <div class="px-3 py-1.5 rounded-lg bg-muted/50 text-xs">
            <span class="text-muted-foreground">节点: </span>
            <span class="font-semibold text-foreground">{nodes.length}</span>
          </div>
          <div class="px-3 py-1.5 rounded-lg bg-muted/50 text-xs">
            <span class="text-muted-foreground">连接: </span>
            <span class="font-semibold text-foreground">{edges().length}</span>
          </div>
        </div>
      </div>

      {/* Editor Area */}
      <div class="relative flex-1 overflow-hidden">
        {/* 背景装饰 */}
        <div class="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none"></div>
        <Flow
          nodes={nodes}
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
          
          <ExecutorPanel 
            executor={executor()} 
            onRun={handleRun}
            onStop={handleStop}
            autoVisualize={true}
          />
          
          <PropertyPanel>
            {({ node }) => (
                <div class="space-y-4">
                     {/* Common: Label */}
                     <div class="space-y-1">
                       <label class="block text-xs font-medium text-gray-500">Node Name</label>
                       <input 
                         type="text"
                         value={node.data?.label || ""}
                         onInput={(e) => updateNodeData(node.id, { label: e.currentTarget.value })}
                         class="w-full text-sm border rounded px-2 py-1.5 focus:border-blue-500 outline-none"
                         placeholder="Name"
                       />
                     </div>
                     
                     {/* Agent Fields */}
                     <Show when={node.type === "agent"}>
                       <div class="space-y-3 pt-2 border-t border-gray-100">
                         <div class="space-y-1">
                           <label class="block text-xs font-medium text-gray-500">Role</label>
                           <input 
                             type="text"
                             value={node.data?.role || ""}
                             onInput={(e) => updateNodeData(node.id, { role: e.currentTarget.value })}
                             class="w-full text-sm border rounded px-2 py-1.5 focus:border-blue-500 outline-none"
                             placeholder="e.g. Researcher"
                           />
                         </div>
                         <div class="space-y-1">
                           <label class="block text-xs font-medium text-gray-500">Model</label>
                           <select 
                             value={node.data?.model || "gpt-5-mini"}
                             onChange={(e) => updateNodeData(node.id, { model: e.currentTarget.value })}
                             class="w-full text-sm border rounded px-2 py-1.5 focus:border-blue-500 outline-none bg-white"
                           >
                             <option value="gpt-5-mini">GPT-5 Mini</option>
                             <option value="gpt-4">GPT-4</option>
                             <option value="claude-3-opus">Claude 3 Opus</option>
                           </select>
                         </div>
                       </div>
                     </Show>

                     {/* Task Fields */}
                     <Show when={node.type === "task"}>
                       <div class="space-y-1 pt-2 border-t border-gray-100">
                         <label class="block text-xs font-medium text-gray-500">Description</label>
                         <textarea 
                           value={node.data?.description || ""}
                           onInput={(e) => updateNodeData(node.id, { description: e.currentTarget.value })}
                           class="w-full text-sm border rounded px-2 py-1.5 focus:border-blue-500 outline-none min-h-[80px]"
                           placeholder="Describe the task..."
                         />
                       </div>
                     </Show>
                </div>
            )}
          </PropertyPanel>

        </Flow>
      </div>
    </div>
  );
};

