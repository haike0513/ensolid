/**
 * FlowProvider - 为 Flow 组件提供上下文
 */

import { Component, createContext, useContext, JSX } from 'solid-js';
import type {
    Node,
    Edge,
    NodeChange,
    EdgeChange,
    Connection,
    Viewport,
    OnNodesChange,
    OnEdgesChange,
    OnConnect,
} from '../../types';
import { applyNodeChanges, applyEdgeChanges, addEdge } from '../../utils';

export interface FlowProviderContextValue {
    nodes: () => Node[];
    edges: () => Edge[];
    viewport: () => Viewport;
    onNodesChange: (changes: NodeChange[]) => void;
    onEdgesChange: (changes: EdgeChange[]) => void;
    onConnect: (connection: Connection) => void;
    updateViewport: (viewport: Viewport) => void;
    setNodes: (nodes: Node[]) => void;
    setEdges: (edges: Edge[]) => void;
}

const FlowProviderContext = createContext<FlowProviderContextValue>();

export const useFlowContext = () => {
    const context = useContext(FlowProviderContext);
    if (!context) {
        throw new Error('useFlowContext must be used within FlowProvider');
    }
    return context;
};

export interface FlowProviderProps {
    nodes: Node[];
    edges: Edge[];
    viewport?: Viewport;
    onNodesChange?: OnNodesChange;
    onEdgesChange?: OnEdgesChange;
    onConnect?: OnConnect;
    children: JSX.Element;
}

export const FlowProvider: Component<FlowProviderProps> = (props) => {
    const viewport = () => props.viewport ?? { x: 0, y: 0, zoom: 1 };

    const handleNodesChange = (changes: NodeChange[]) => {
        if (props.onNodesChange) {
            props.onNodesChange(changes);
        }
    };

    const handleEdgesChange = (changes: EdgeChange[]) => {
        if (props.onEdgesChange) {
            props.onEdgesChange(changes);
        }
    };

    const handleConnect = (connection: Connection) => {
        if (props.onConnect) {
            props.onConnect(connection);
        }
    };

    const contextValue: FlowProviderContextValue = {
        nodes: () => props.nodes,
        edges: () => props.edges,
        viewport,
        onNodesChange: handleNodesChange,
        onEdgesChange: handleEdgesChange,
        onConnect: handleConnect,
        updateViewport: () => {
            // 这个需要在 Flow 组件内部实现
        },
        setNodes: () => {
            // 这个需要在 Flow 组件内部实现
        },
        setEdges: () => {
            // 这个需要在 Flow 组件内部实现
        },
    };

    return (
        <FlowProviderContext.Provider value={contextValue}>
            {props.children}
        </FlowProviderContext.Provider>
    );
};

