/**
 * useEdges Hook - 获取和管理边
 */

import { type Accessor } from 'solid-js';
import { useFlowContext } from '../components/FlowProvider';
import type { Edge, EdgeChange } from '../types';

/**
 * 返回边的访问器和更新函数
 */
export function useEdges(): [
    Accessor<Edge[]>,
    (changes: EdgeChange[]) => void,
] {
    const context = useFlowContext();
    const edges = context.edges;
    const onEdgesChange = context.onEdgesChange;

    return [edges, onEdgesChange];
}

