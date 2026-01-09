
import { Component, createSignal, createEffect, Show, JSX } from 'solid-js';
import { useReactFlow } from '../../hooks/useReactFlow';
import { Panel } from '../Panel';
import type { Node } from '../../types';

export interface PropertyPanelProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  children?: (props: { node: Node; updateNode: (data: any) => void }) => JSX.Element;
  showDefault?: boolean;
}

export const PropertyPanel: Component<PropertyPanelProps> = (props) => {
  const { getNodes, setNodes } = useReactFlow();
  const [selectedNode, setSelectedNode] = createSignal<Node | null>(null);

  createEffect(() => {
    const nodes = getNodes();
    // Prioritize the last selected node or just the first found?
    // ReactFlow usually supports multi-selection. PropertyPanel usually edits the "primary" selected node.
    // Let's take the first one found.
    const selected = nodes.find(n => n.selected);
    
    // Only update if id changes to avoid aggressive re-renders of the form 
    // (though createEffect checks strict equality, the object ref might change if we update data)
    // Actually, we want to update if data changes too.
    setSelectedNode(selected || null);
  });

  const updateNodeData = (data: any) => {
    const node = selectedNode();
    if (!node) return;
    
    const nodes = getNodes();
    const newNodes = nodes.map(n => {
        if (n.id === node.id) {
            return { ...n, data: { ...n.data, ...data } };
        }
        return n;
    });
    setNodes(newNodes);
  };

  return (
    <Panel position={props.position || 'top-right'} class="bg-white p-4 rounded-lg shadow-xl border w-72 pointer-events-auto font-sans solidflow-panel">
        <Show when={selectedNode()} fallback={<div class="text-gray-500 text-sm flex items-center justify-center p-4">Select a node to edit properties</div>}>
            {(node) => (
                <div>
                   <div class="flex items-center justify-between mb-4 pb-2 border-b">
                       <span class="font-bold text-sm text-gray-700">{node().data?.label || node().type || 'Node'}</span>
                       <span class="text-[10px] text-gray-400 font-mono bg-gray-50 px-1 rounded">{node().id}</span>
                   </div>
                   
                   <Show when={props.children}>
                       {props.children!({ node: node(), updateNode: updateNodeData })}
                   </Show>
                   
                   <Show when={!props.children || props.showDefault}>
                       <div class="space-y-4">
                           <div>
                               <label class="block text-xs font-semibold text-gray-500 mb-1">Label</label>
                               <input 
                                   type="text"
                                   value={node().data?.label || ''}
                                   onInput={(e) => updateNodeData({ label: e.currentTarget.value })}
                                   class="w-full text-sm border border-gray-200 rounded px-2 py-1.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-colors"
                                   placeholder="Enter label..."
                               />
                           </div>
                           
                           {/* Position (Read-only for now, or editable?) */}
                           <div class="grid grid-cols-2 gap-2">
                               <div>
                                   <label class="block text-[10px] font-semibold text-gray-400 mb-1">X</label>
                                   <div class="text-xs font-mono bg-gray-50 px-2 py-1 border rounded text-gray-600">
                                       {Math.round(node().position.x)}
                                   </div>
                               </div>
                               <div>
                                   <label class="block text-[10px] font-semibold text-gray-400 mb-1">Y</label>
                                   <div class="text-xs font-mono bg-gray-50 px-2 py-1 border rounded text-gray-600">
                                       {Math.round(node().position.y)}
                                   </div>
                               </div>
                           </div>
                       </div>
                   </Show>
                </div>
            )}
        </Show>
    </Panel>
  );
}
