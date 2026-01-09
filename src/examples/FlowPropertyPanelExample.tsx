
import { type Component, createSignal } from 'solid-js';
import {
  Flow,
  Background,
  Controls,
  MiniMap,
  PropertyPanel,
  useReactFlow,
  type Node,
  type Edge,
  type NodeChange,
  type EdgeChange,
  applyNodeChanges,
  applyEdgeChanges,
} from '@ensolid/solidflow';

// --- Main Example Flow ---

const initialNodes: Node[] = [
  {
    id: '1',
    position: { x: 100, y: 100 },
    data: { label: 'Node 1' },
    style: { background: '#ffffff', border: '1px solid #777', width: '150px', justifyContent: 'center', alignItems: 'center', display: 'flex' },
  },
  {
    id: '2',
    position: { x: 300, y: 200 },
    data: { label: 'Node 2' },
    style: { background: '#eeeeee', border: '1px solid #777', width: '150px', justifyContent: 'center', alignItems: 'center', display: 'flex' },
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e1-2a', source: '1', target: '2' },
];

const FlowPropertyPanelExample: Component = () => {
    const [nodes, setNodes] = createSignal<Node[]>(initialNodes);
    const [edges, setEdges] = createSignal<Edge[]>(initialEdges);
  
    const onNodesChange = (changes: NodeChange[]) => {
      setNodes((nds) => applyNodeChanges(changes, nds));
    };
  
    const onEdgesChange = (changes: EdgeChange[]) => {
      setEdges((eds) => applyEdgeChanges(changes, eds));
    };
  
    return (
      <div style={{ width: '100vw', height: '100vh' }}>
        <Flow
          nodes={nodes()}
          edges={edges()}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView
        >
          <Background />
          <Controls />
          <MiniMap />
          <PropertyPanel showDefault>
            {({ node, updateNode }) => {
                // Need to access setNodes to update style since updateNode helper only updates data currently according to my implementation?
                // Wait, let's check PropertyPanel implementation.
                // updateNodeData does: { ...n, data: { ...n.data, ...data } }
                // So it ONLY updates data.
                // To update style, I definitely need useReactFlow() inside here?
                // But PropertyPanel children function only gives updateNode (which is data-centric).
                
                // Let's use useReactFlow here since we are inside Flow context.
                const { getNodes, setNodes } = useReactFlow();
                
                const handleColorChange = (e: Event) => {
                    const value = (e.target as HTMLInputElement).value;
                    const newNodes = getNodes().map(n => {
                        if (n.id === node.id) {
                            return { ...n, style: { ...n.style, background: value } };
                        }
                        return n;
                    });
                    setNodes(newNodes);
                };

                return (
                    <div class="mt-4 pt-4 border-t border-gray-100">
                        <label class="block text-xs font-semibold text-gray-500 mb-1">Background Color</label>
                         <input
                            type="color"
                            value={(node.style?.background as string) || '#ffffff'}
                            onInput={handleColorChange}
                            class="w-full h-8 p-1 border rounded cursor-pointer"
                        />
                    </div>
                );
            }}
          </PropertyPanel>
        </Flow>
      </div>
    );
};

export default FlowPropertyPanelExample;
