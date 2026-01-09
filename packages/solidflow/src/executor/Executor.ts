
import type { Node, Edge, NodeId } from '../types';
import type { 
  ExecutorOptions, 
  ExecutionEvent, 
  ExecutionListener, 
  ExecutionResult, 
  WorkflowExecutionState,
  TaskInternal
} from './types';
import { getTopologicalSort, getDependencies } from './utils';

export class Executor {
  private nodes: Node[];
  private edges: Edge[];
  private tasks: Record<string, TaskInternal>;
  private concurrency: number;
  
  private state: WorkflowExecutionState = {
    status: 'idle',
    results: {},
  };
  
  private listeners: Set<ExecutionListener> = new Set();
  private abortController: AbortController | null = null;
  
  // Dependency graph
  private dependencies: Map<NodeId, NodeId[]> = new Map();
  private dependents: Map<NodeId, NodeId[]> = new Map();
  
  // Execution queue/tracking
  private queue: NodeId[] = [];
  private activeCount: number = 0;
  private pendingDependencies: Map<NodeId, number> = new Map(); // NodeId -> count of remaining deps

  constructor(options: ExecutorOptions) {
    this.nodes = options.nodes;
    this.edges = options.edges;
    this.tasks = options.tasks;
    this.concurrency = options.concurrency || 2;
  }

  public subscribe(listener: ExecutionListener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private emit(event: ExecutionEvent) {
    this.listeners.forEach(listener => listener(event));
  }

  public async start(): Promise<WorkflowExecutionState> {
    if (this.state.status === 'running') {
      throw new Error('Execution is already running');
    }

    // Reset state
    this.state = {
      status: 'running',
      results: {},
      startTime: Date.now(),
    };
    this.abortController = new AbortController();
    
    // Initialize dependency graphs
    try {
      // Check for cycles first
      getTopologicalSort(this.nodes, this.edges);
      
      this.dependencies = getDependencies(this.nodes, this.edges);
      this.dependents = new Map();
      this.nodes.forEach(n => this.dependents.set(n.id, []));
      
      this.edges.forEach(edge => {
        if (this.dependents.has(edge.source)) {
          this.dependents.get(edge.source)?.push(edge.target);
        }
      });

      // Initialize execution tracking
      this.pendingDependencies.clear();
      this.queue = [];
      this.activeCount = 0;

      this.nodes.forEach(node => {
        const deps = this.dependencies.get(node.id) || [];
        // Only count dependencies that are actually in the nodes list (handling partial execution in future?)
        // For now assume strictly all upstream deps must be done
        const depCount = deps.length;
        this.pendingDependencies.set(node.id, depCount);
        
        if (depCount === 0) {
          this.queue.push(node.id);
        }
      });

      this.emit({ type: 'start', timestamp: Date.now() });
      
      this.processQueue();
      
      // Return a promise that resolves when done
      return new Promise((resolve, reject) => {
        // Use an internal listener to resolve/reject promise
        const cleanup = this.subscribe((event) => {
          if (event.type === 'complete') {
            cleanup();
            resolve(this.state);
          } else if (event.type === 'error') {
            cleanup();
            reject(event.error);
          }
        });
      });


    } catch (error) {
      this.state.status = 'failed';
      this.state.endTime = Date.now();
      this.emit({ type: 'error', error: error as Error, timestamp: Date.now() });
      throw error;
    }
  }

  public stop() {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
    this.state.status = 'failed'; // Or 'cancelled' if we add that status
    // Emit something?
  }

  private processQueue() {
    if (this.state.status !== 'running') return;
    
    // Check if we are done
    if (this.queue.length === 0 && this.activeCount === 0) {
      // Check if all nodes were executed
      const executedCount = Object.keys(this.state.results).length;
      if (executedCount < this.nodes.length) {
          // This can happen if there are disconnected islands with cycles (though we checked for cycles)
          // or if some dependency logic was wrong.
          // Or simply because we just finished a batch and nothing new was added?
          // No, if queue is empty and active is 0, we can't progress.
          // With topological sort passing, this assumes we reached the end of all reachable nodes.
      }
      
      this.state.status = 'completed';
      this.state.endTime = Date.now();
      this.emit({ type: 'complete', results: this.state.results, timestamp: Date.now() });
      return;
    }

    // Process nodes while we have capacity and items in queue
    while (this.queue.length > 0 && this.activeCount < this.concurrency) {
      const nodeId = this.queue.shift();
      if (nodeId) {
        this.executeNode(nodeId);
      }
    }
  }

  private async executeNode(nodeId: NodeId) {
    const node = this.nodes.find(n => n.id === nodeId);
    if (!node) return;

    this.activeCount++;
    
    // Prepare inputs
    const inputs: Record<string, any> = {};
    const incomingEdges = this.edges.filter(e => e.target === nodeId);
    
    incomingEdges.forEach(edge => {
      const sourceResult = this.state.results[edge.source];
      if (sourceResult && sourceResult.output !== undefined) {
        // If handles are used, use targetHandle as key
        const key = edge.targetHandle || edge.source; // Fallback to source ID
        inputs[key] = sourceResult.output;
      }
    });

    const task = this.tasks[node.type || 'default'] || this.tasks['default'];
    
    if (!task) {
        // Skip or fail? Let's fail for now if no generic task handler
        this.finishNode(nodeId, {
            nodeId,
            status: 'failed',
            error: new Error(`No task implementation for node type: ${node.type}`),
            startTime: Date.now(),
            endTime: Date.now()
        });
        return;
    }

    const startTime = Date.now();
    this.state.results[nodeId] = {
      nodeId,
      status: 'running',
      startTime
    };
    this.emit({ type: 'nodeStart', nodeId, timestamp: startTime });

    try {
      if (!this.abortController) throw new Error("Execution aborted");
      
      const output = await task({
        node,
        inputs,
        signal: this.abortController.signal
      });

      this.finishNode(nodeId, {
        nodeId,
        status: 'completed',
        output,
        startTime,
        endTime: Date.now(),
        duration: Date.now() - startTime
      });
    } catch (err) {
      this.finishNode(nodeId, {
        nodeId,
        status: 'failed',
        error: err as Error,
        startTime,
        endTime: Date.now(),
        duration: Date.now() - startTime
      });
    }
  }

  private finishNode(nodeId: NodeId, result: ExecutionResult) {
    this.activeCount--;
    this.state.results[nodeId] = result;
    
    if (result.status === 'completed') {
      this.emit({ type: 'nodeComplete', nodeId, result: result.output, timestamp: Date.now() });
      
      // Update dependents
      const nextNodes = this.dependents.get(nodeId) || [];
      for (const nextId of nextNodes) {
        const remaining = (this.pendingDependencies.get(nextId) || 0) - 1;
        this.pendingDependencies.set(nextId, remaining);
        
        if (remaining === 0) {
          this.queue.push(nextId);
        }
      }
    } else {
      // If a node failed, do we stop everything?
      // For now, yes.
      this.emit({ type: 'nodeError', nodeId, error: result.error!, timestamp: Date.now() });
      // Depending on policy, we might continue other independent branches, but simplistic approach is fail workflow.
      this.state.status = 'failed';
      this.stop();
      this.emit({ type: 'error', error: result.error!, timestamp: Date.now() });
      return; 
    }

    // Trigger next batch
    this.processQueue();
  }

  public getState(): WorkflowExecutionState {
    return this.state;
  }
}
