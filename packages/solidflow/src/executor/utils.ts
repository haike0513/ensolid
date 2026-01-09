
import type { Node, Edge, NodeId } from '../types';

/**
 * Perform a topological sort on the workflow graph.
 * Returns an array of NodeIds in order of execution.
 * Throws an error if a cycle is detected.
 */
export function getTopologicalSort(nodes: Node[], edges: Edge[]): NodeId[] {
  const result: NodeId[] = [];
  const visited = new Set<NodeId>();
  const visiting = new Set<NodeId>();
  
  // Build adjacency list
  const graph = new Map<NodeId, NodeId[]>();
  nodes.forEach(node => {
    graph.set(node.id, []);
  });
  
  edges.forEach(edge => {
    if (graph.has(edge.source) && graph.has(edge.target)) {
      graph.get(edge.source)?.push(edge.target);
    }
  });
  
  function visit(nodeId: NodeId) {
    if (visiting.has(nodeId)) {
      throw new Error(`Cycle detected involving node ${nodeId}`);
    }
    if (visited.has(nodeId)) {
      return;
    }
    
    visiting.add(nodeId);
    
    const neighbors = graph.get(nodeId) || [];
    for (const neighbor of neighbors) {
      visit(neighbor);
    }
    
    visiting.delete(nodeId);
    visited.add(nodeId);
    result.push(nodeId);
  }
  
  // Visit all nodes
  // Note: The above standard DFS topological sort gives reverse topological order (dependencies last).
  // We want dependencies first.
  // Wait, standard DFS post-order traversal gives reverse topological order.
  // So we reverse the result at the end.
  
  for (const node of nodes) {
    if (!visited.has(node.id)) {
      visit(node.id);
    }
  }
  
  return result.reverse();
}

/**
 * Calculate the dependency graph for execution.
 * Returns a map where key is node ID and value is list of input node IDs (dependencies).
 */
export function getDependencies(nodes: Node[], edges: Edge[]): Map<NodeId, NodeId[]> {
  const deps = new Map<NodeId, NodeId[]>();
  
  // Initialize
  nodes.forEach(node => {
    deps.set(node.id, []);
  });
  
  // Fill dependencies (target depends on source)
  edges.forEach(edge => {
    if (deps.has(edge.target)) {
      deps.get(edge.target)?.push(edge.source);
    }
  });
  
  return deps;
}
