/**
 * useReactFlow Hook - 获取 Flow 实例方法
 * 类似于 React Flow 的 useReactFlow hook
 */

import { type Accessor } from 'solid-js';
import { useFlowContext } from '../components/FlowProvider';
import type { Viewport, Node, Edge } from '../types';

export interface ReactFlowInstance {
    viewport: Accessor<Viewport>;
    setViewport: (viewport: Viewport) => void;
    getViewport: () => Viewport;
    fitView: (options?: { padding?: number; includeHiddenNodes?: boolean }) => void;
    project: (screenPosition: { x: number; y: number }) => { x: number; y: number };
    screenToFlowPosition: (screenPosition: { x: number; y: number }) => { x: number; y: number };
    flowToScreenPosition: (flowPosition: { x: number; y: number }) => { x: number; y: number };
    addEdges: (edges: Edge[]) => void;
    getNode: (id: string) => Node | undefined;
    getNodes: () => Node[];
    getEdge: (id: string) => Edge | undefined;
    getEdges: () => Edge[];
    setNodes: (nodes: Node[]) => void;
    setEdges: (edges: Edge[]) => void;
}

/**
 * 获取 ReactFlow 实例
 * 这个 hook 提供了访问和操作 Flow 的方法
 */
export function useReactFlow(): ReactFlowInstance {
    const context = useFlowContext();
    const viewport = context.viewport;
    const nodes = context.nodes;
    const edges = context.edges;
    const onEdgesChange = context.onEdgesChange;

    return {
        viewport,
        setViewport: (newViewport: Viewport) => {
            context.updateViewport(newViewport);
        },
        getViewport: () => viewport(),
        fitView: () => {
            // 需要在 Flow 组件中实现
        },
        project: (screenPosition: { x: number; y: number }) => {
            const vp = viewport();
            return {
                x: (screenPosition.x - vp.x) / vp.zoom,
                y: (screenPosition.y - vp.y) / vp.zoom,
            };
        },
        screenToFlowPosition: (screenPosition: { x: number; y: number }) => {
            const vp = viewport();
            return {
                x: (screenPosition.x - vp.x) / vp.zoom,
                y: (screenPosition.y - vp.y) / vp.zoom,
            };
        },
        flowToScreenPosition: (flowPosition: { x: number; y: number }) => {
            const vp = viewport();
            return {
                x: flowPosition.x * vp.zoom + vp.x,
                y: flowPosition.y * vp.zoom + vp.y,
            };
        },
        addEdges: (newEdges: Edge[]) => {
            onEdgesChange(
                newEdges.map((edge) => ({
                    type: 'add',
                    item: edge,
                    id: edge.id,
                })),
            );
        },
        getNode: (id: string) => {
            return nodes().find((n) => n.id === id);
        },
        getNodes: () => nodes(),
        getEdge: (id: string) => {
            return edges().find((e) => e.id === id);
        },
        getEdges: () => edges(),
        setNodes: (newNodes: Node[]) => {
            context.setNodes(newNodes);
        },
        setEdges: (newEdges: Edge[]) => {
            context.setEdges(newEdges);
        },
    };
}

