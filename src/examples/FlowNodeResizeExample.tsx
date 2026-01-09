import { type Component, createSignal } from 'solid-js';
import {
  Flow,
  Background,
  Controls,
  MiniMap,
  type Node,
  type Edge,
  NodeResizeControl,
  applyNodeChanges,
  applyEdgeChanges,
  type NodeChange,
  type EdgeChange,
} from '@ensolid/solidflow';



// 自定义可调整大小的节点
const ResizableNode: Component<any> = (props) => {
  return (
    <div style={{ padding: '10px', height: '100%', "box-sizing": 'border-box' }}>
      <NodeResizeControl minWidth={100} minHeight={50} />
      <div style={{ "pointer-events": "none" }}>
        <strong>{props.data.label}</strong>
        <div style={{ "margin-top": "5px", "font-size": "12px", color: "#666" }}>
          Resized: {Math.round(props.node.width || 0)}x{Math.round(props.node.height || 0)}
        </div>
      </div>
    </div>
  );
};

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'resizable',
    position: { x: 100, y: 100 },
    data: { label: 'Resizable Node 1' },
    width: 200,
    height: 100,
    style: { background: '#fff', border: '1px solid #777', borderRadius: "8px" },
  },
  {
    id: '2',
    type: 'resizable',
    position: { x: 400, y: 100 },
    data: { label: 'Resizable Node 2' },
    width: 150,
    height: 150,
    style: { background: '#f0f0f0', border: '1px solid #777', borderRadius: "8px" },
  }
];

const initialEdges: Edge[] = [];

const FlowNodeResizeExample: Component = () => {
  const [nodes, setNodes] = createSignal<Node[]>(initialNodes);
  const [edges, setEdges] = createSignal<Edge[]>(initialEdges);

  const onNodesChange = (changes: NodeChange[]) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  };

  const onEdgesChange = (changes: EdgeChange[]) => {
    setEdges((eds) => applyEdgeChanges(changes, eds));
  };

  const nodeTypes = {
    resizable: ResizableNode,
  };

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Flow
        nodes={nodes()}
        edges={edges()}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
      </Flow>
    </div>
  );
};

export default FlowNodeResizeExample;
