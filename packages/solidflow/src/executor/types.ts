
import type { Node, Edge, NodeId } from '../types';

export type ExecutionStatus = 'idle' | 'pending' | 'running' | 'completed' | 'failed' | 'skipped';

export interface ExecutionResult {
  nodeId: NodeId;
  status: ExecutionStatus;
  output?: any;
  error?: Error;
  startTime?: number;
  endTime?: number;
  duration?: number;
}

export interface TaskContext {
  node: Node;
  inputs: Record<string, any>;
  signal: AbortSignal;
}

export type TaskInternal = (context: TaskContext) => Promise<any>;

export interface ExecutorOptions {
  nodes: Node[];
  edges: Edge[];
  tasks: Record<string, TaskInternal>; // Map node type to task function
  concurrency?: number;
}

export interface WorkflowExecutionState {
  status: ExecutionStatus;
  results: Record<NodeId, ExecutionResult>;
  startTime?: number;
  endTime?: number;
}

export type ExecutionEvent = 
  | { type: 'start'; timestamp: number }
  | { type: 'nodeStart'; nodeId: NodeId; timestamp: number }
  | { type: 'nodeComplete'; nodeId: NodeId; result: any; timestamp: number }
  | { type: 'nodeError'; nodeId: NodeId; error: Error; timestamp: number }
  | { type: 'complete'; results: Record<NodeId, ExecutionResult>; timestamp: number }
  | { type: 'error'; error: Error; timestamp: number };

export type ExecutionListener = (event: ExecutionEvent) => void;
