import { createContext, useContext } from 'solid-js';
import type { NodeId } from '../../types';

export interface NodeContextValue {
  id: NodeId;
}

const NodeContext = createContext<NodeContextValue>();

export const useNodeId = () => {
  const context = useContext(NodeContext);
  if (!context) {
    throw new Error('useNodeId must be used within a NodeWrapper');
  }
  return context.id;
};

export const NodeProvider = NodeContext.Provider;
