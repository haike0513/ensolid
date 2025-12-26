/**
 * useNodes Hook - 获取和管理节点
 */

import { type Accessor } from 'solid-js';
import { useFlowContext } from '../components/FlowProvider';
import type { Node, NodeChange } from '../types';

/**
 * 返回节点的访问器和更新函数
 */
export function useNodes(): [
    Accessor<Node[]>,
    (changes: NodeChange[]) => void,
] {
    const context = useFlowContext();
    const nodes = context.nodes;
    const onNodesChange = context.onNodesChange;

    return [nodes, onNodesChange];
}

