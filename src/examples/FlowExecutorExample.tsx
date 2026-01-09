
import { Component, createSignal } from 'solid-js';
import {
  Flow,
  Background,
  Controls,
  MiniMap,
  NodeChange,
  EdgeChange,
  applyNodeChanges,
  applyEdgeChanges,
  Executor,
  ExecutorPanel,
} from '@ensolid/solidflow';
import type { Node, Edge } from '@ensolid/solidflow';

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'start',
    position: { x: 100, y: 100 },
    data: { label: 'Start' },
    style: { background: '#fff', border: '1px solid #777', padding: '10px', borderRadius: '5px', width: '150px' },
  },
  {
    id: '2',
    position: { x: 300, y: 100 },
    data: { label: 'Process A' },
    style: { background: '#fff', border: '1px solid #777', padding: '10px', borderRadius: '5px', width: '150px' },
  },
  {
    id: '3',
    position: { x: 300, y: 250 },
    data: { label: 'Process B' },
    style: { background: '#fff', border: '1px solid #777', padding: '10px', borderRadius: '5px', width: '150px' },
  },
  {
    id: '4',
    type: 'end',
    position: { x: 550, y: 175 },
    data: { label: 'End' },
    style: { background: '#fff', border: '1px solid #777', padding: '10px', borderRadius: '5px', width: '150px' },
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e1-3', source: '1', target: '3', animated: true },
  { id: 'e2-4', source: '2', target: '4', animated: true },
  { id: 'e3-4', source: '3', target: '4', animated: true },
];

// Define task handlers
const tasks = {
  'default': async (ctx: any) => {
    const label = ctx.node.data.label;
    console.log(`Executing ${label}... Inputs:`, ctx.inputs);
    
    // Simulate varying execution time
    const duration = 1000 + Math.random() * 2000;
    await new Promise(resolve => setTimeout(resolve, duration));
    
    if (Math.random() < 0.1) {
        throw new Error("Random failure simulation");
    }
    
    return { processed: true, from: label, timestamp: Date.now() };
  },
  'start': async () => {
      await new Promise(r => setTimeout(r, 500));
      return { authorized: true };
  },
  'end': async (ctx: any) => {
      console.log("Finalizing with inputs:", ctx.inputs);
      await new Promise(r => setTimeout(r, 800));
      return "Done";
  }
};

const FlowExecutorExample: Component = () => {
  const [nodes, setNodes] = createSignal<Node[]>(initialNodes);
  const [edges, setEdges] = createSignal<Edge[]>(initialEdges);
  const [executor, setExecutor] = createSignal<Executor | null>(null);

  const onNodesChange = (changes: NodeChange[]) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  };

  const onEdgesChange = (changes: EdgeChange[]) => {
    setEdges((eds) => applyEdgeChanges(changes, eds));
  };

  const handleRun = () => {
    // Create new executor instance with current snapshot
    const exec = new Executor({
        nodes: nodes(),
        edges: edges(),
        tasks: tasks,
        concurrency: 2
    });
    
    setExecutor(exec);
    
    exec.start().then(result => {
        console.log("Workflow finished:", result);
    }).catch(err => {
        console.error("Workflow failed:", err);
    });
  };

  const handleStop = () => {
    executor()?.stop();
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
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
        
      <Flow
        nodes={nodes()}
        edges={edges()}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
        
        <ExecutorPanel 
            executor={executor()} 
            onRun={handleRun}
            onStop={handleStop}
            autoVisualize={true}
        />
      </Flow>
    </div>
  );
};

export default FlowExecutorExample;
