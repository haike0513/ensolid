import { type Component, createSignal, createEffect, For, Show } from 'solid-js';
import {
  Flow,
  Background,
  Controls,
  MiniMap,
  Panel,
  useReactFlow,
  type Node,
  type Edge,
  type NodeChange,
  type EdgeChange,
  applyNodeChanges,
  applyEdgeChanges,
} from '@ensolid/solidflow';



// --- Property Panel Component ---

const PropertyPanel: Component = () => {
  const { getNodes, setNodes } = useReactFlow();
  const [selectedNode, setSelectedNode] = createSignal<Node | null>(null);

  // Poll for selection changes or use an effect if we had a selection signal exposed directly.
  // Since we rely on nodes() updates, we create an effect on getNodes.
  createEffect(() => {
    const nodes = getNodes();
    const selected = nodes.find((n) => n.selected);
    // Only update if ID changed or reference changed to avoid loop if we are careful
    // But here we just set it.
    setSelectedNode(selected || null);
  });

  const handleLabelChange = (e: Event) => {
    const node = selectedNode();
    if (!node) return;
    const value = (e.target as HTMLInputElement).value;
    
    // Update label in data
    const newNodes = getNodes().map((n) => {
      if (n.id === node.id) {
        return {
          ...n,
          data: { ...n.data, label: value },
        };
      }
      return n;
    });
    setNodes(newNodes);
  };

  const handleColorChange = (e: Event) => {
    const node = selectedNode();
    if (!node) return;
    const value = (e.target as HTMLInputElement).value;

    const newNodes = getNodes().map((n) => {
      if (n.id === node.id) {
        return {
          ...n,
          style: { ...n.style, background: value },
        };
      }
      return n;
    });
    setNodes(newNodes);
  };

  const panelStyle = {
    background: 'white',
    padding: '16px',
    'border-radius': '8px',
    'box-shadow': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    width: '240px',
    'font-family': 'sans-serif',
    border: '1px solid #e5e7eb',
  };

  const labelStyle = {
    display: 'block',
    'font-size': '12px',
    'font-weight': '600',
    color: '#374151',
    'margin-bottom': '4px',
  };

  const inputStyle = {
    width: '100%',
    padding: '8px',
    border: '1px solid #d1d5db',
    'border-radius': '4px',
    'margin-bottom': '12px',
    'font-size': '14px',
    outline: 'none',
  };

  return (
    <Panel position="top-right" style={panelStyle}>
        <Show when={selectedNode()} fallback={<div style={{ color: '#6b7280', "font-size": "14px" }}>Select a node to edit properties</div>}>
            {(node) => (
                <div>
                    <h3 style={{ "margin-top": "0", "margin-bottom": "12px", "font-size": "16px", "font-weight": "bold", "border-bottom": "1px solid #eee", "padding-bottom": "8px" }}>
                        Properties
                    </h3>
                    
                    <label style={labelStyle}>Label</label>
                    <input
                        type="text"
                        value={node().data.label}
                        onInput={handleLabelChange}
                        style={inputStyle}
                    />

                    <label style={labelStyle}>Background Color</label>
                    <input
                        type="color"
                        value={(node().style?.background as string) || '#ffffff'}
                        onInput={handleColorChange}
                        style={{ ...inputStyle, height: '40px', padding: '2px' }}
                    />
                    
                    <div style={{ "font-size": "12px", color: "#6b7280", "margin-top": "8px" }}>
                        ID: {node().id}<br/>
                        Pos: {Math.round(node().position.x)}, {Math.round(node().position.y)}
                    </div>
                </div>
            )}
        </Show>
    </Panel>
  );
};


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
          <PropertyPanel />
        </Flow>
      </div>
    );
};

export default FlowPropertyPanelExample;
