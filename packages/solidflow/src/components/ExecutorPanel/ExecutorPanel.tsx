
import { Component, createSignal, createEffect, onCleanup, For, Show } from "solid-js";
import { Panel } from "../Panel";
import { useReactFlow } from "../../hooks/useReactFlow";
import type { Executor } from "../../executor/Executor";
import type { ExecutionEvent, ExecutionStatus } from "../../executor/types";
import type { NodeId } from "../../types";

export interface ExecutorPanelProps {
  executor: Executor | null;
  onRun?: () => void;
  onStop?: () => void;
  autoVisualize?: boolean; // Whether to automatically update node styles based on status
}

interface LogEntry {
  timestamp: number;
  message: string;
  type: 'info' | 'success' | 'error' | 'warning';
}

export const ExecutorPanel: Component<ExecutorPanelProps> = (props) => {
  const { getNodes, setNodes } = useReactFlow();
  const [logs, setLogs] = createSignal<LogEntry[]>([]);
  const [status, setStatus] = createSignal<ExecutionStatus>('idle');
  const [progress, setProgress] = createSignal(0);
  const [totalNodes, setTotalNodes] = createSignal(0);
  const [completedNodes, setCompletedNodes] = createSignal(0);
  
  createEffect(() => {
    const executor = props.executor;
    if (!executor) return;

    // Reset state when executor changes or starts
    setLogs([]);
    setStatus('idle');
    setProgress(0);
    setCompletedNodes(0);
    
    // Subscribe to events
    const unsubscribe = executor.subscribe((event: ExecutionEvent) => {
      handleEvent(event);
    });

    onCleanup(() => {
        unsubscribe();
    });
  });

  const handleEvent = (event: ExecutionEvent) => {
    const timestamp = event.timestamp;
    
    switch (event.type) {
      case 'start':
        setStatus('running');
        addLog({ timestamp, message: 'Execution started', type: 'info' });
        setTotalNodes(getNodes().length); 
        setCompletedNodes(0);
        setProgress(0);
        resetNodeStyles();
        break;
        
      case 'nodeStart':
        addLog({ timestamp, message: `Node ${event.nodeId} started`, type: 'info' });
        updateNodeVisual(event.nodeId, 'running');
        break;
        
      case 'nodeComplete':
        addLog({ timestamp, message: `Node ${event.nodeId} completed`, type: 'success' });
        updateNodeVisual(event.nodeId, 'completed');
        setCompletedNodes(prev => {
            const next = prev + 1;
            setProgress(totalNodes() > 0 ? (next / totalNodes()) * 100 : 0);
            return next;
        });
        break;
        
      case 'nodeError':
        addLog({ timestamp, message: `Node ${event.nodeId} failed: ${event.error.message}`, type: 'error' });
        updateNodeVisual(event.nodeId, 'failed');
        break;
        
      case 'complete':
        setStatus('completed');
        addLog({ timestamp, message: 'Execution completed successfully', type: 'success' });
        setProgress(100);
        break;
        
      case 'error':
        setStatus('failed');
        addLog({ timestamp, message: `Execution failed: ${event.error.message}`, type: 'error' });
        break;
    }
  };

  const addLog = (log: LogEntry) => {
    setLogs(prev => [...prev, log]);
  };
  
  const updateNodeVisual = (nodeId: NodeId, status: ExecutionStatus) => {
    if (!props.autoVisualize) return;
    
    const nodes = getNodes();
    const newNodes = nodes.map(n => {
      if (n.id === nodeId) {
        const classList = (n.classList || []).filter(c => !c.startsWith('executing-'));
        classList.push(`executing-${status}`);
        return {
          ...n,
          classList
        };
      }
      return n;
    });
    setNodes(newNodes);
  };
  
  const resetNodeStyles = () => {
    if (!props.autoVisualize) return;
    
    const nodes = getNodes();
    const newNodes = nodes.map(n => ({
        ...n,
        classList: (n.classList || []).filter(c => !c.startsWith('executing-'))
    }));
    setNodes(newNodes);
  };

  const formatTime = (ts: number) => {
    return new Date(ts).toLocaleTimeString();
  };

  return (
    <Panel position="bottom-center" class="w-[600px] max-w-[90vw] bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden flex flex-col font-sans mb-4">
      {/* Header */}
      <div class="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-100">
        <div class="flex items-center gap-3">
          <div class={`w-3 h-3 rounded-full ${
            status() === 'running' ? 'bg-blue-500 animate-pulse' :
            status() === 'completed' ? 'bg-green-500' :
            status() === 'failed' ? 'bg-red-500' :
            'bg-gray-400'
          }`} />
          <span class="font-medium text-sm text-gray-700">
            {status() === 'idle' ? 'Ready to execute' : 
             status() === 'running' ? `Executing (${completedNodes()}/${totalNodes()})` : 
             status().charAt(0).toUpperCase() + status().slice(1)}
          </span>
        </div>

        
        <div class="flex items-center gap-2">
            <Show when={status() === 'running'}>
                <button 
                  onClick={props.onStop}
                  class="px-3 py-1 text-xs font-medium text-red-600 border border-red-200 rounded hover:bg-red-50 transition-colors"
                >
                    Stop
                </button>
            </Show>
            <Show when={status() !== 'running'}>
                <button 
                  onClick={props.onRun}
                  disabled={!props.executor}
                  class="px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Run Workflow
                </button>
            </Show>
        </div>
      </div>
      
      {/* Progress Bar */}
      <Show when={status() !== 'idle'}>
          <div class="h-1 bg-gray-100 w-full">
            <div 
                class={`h-full transition-all duration-300 ${
                    status() === 'failed' ? 'bg-red-500' : 'bg-blue-500'
                }`}
                style={{ width: `${progress()}%` }}
            />
          </div>
      </Show>
      
      {/* Logs */}
      <div class="h-48 overflow-y-auto p-4 space-y-2 bg-white">
        <For each={logs()}>
            {(log) => (
                <div class="flex items-start gap-2 text-xs font-mono">
                    <span class="text-gray-400 shrink-0">{formatTime(log.timestamp)}</span>
                    <span class={`${
                        log.type === 'error' ? 'text-red-600' :
                        log.type === 'success' ? 'text-green-600' :
                        log.type === 'warning' ? 'text-yellow-600' :
                        'text-gray-600'
                    }`}>
                        {log.message}
                    </span>
                </div>
            )}
        </For>
        <Show when={logs().length === 0}>
            <div class="text-center text-gray-400 text-xs py-10">
                No execution logs. Click Run to start.
            </div>
        </Show>
      </div>
    </Panel>
  );
};
