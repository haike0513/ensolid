import { createRenderer } from 'solid-js/universal';
import * as THREE from 'three';

export type Instance = {
  type: string;
  parent: Instance | null;
  children: Instance[];
  object: any; // THREE object
  props: Record<string, any>;
  autoAttached: boolean;
};

// Helper to check if a key works in Three.js
function isThreeClass(name: string) {
  return name in THREE;
}

export const {
  render,
  effect,
  memo,
  createComponent,
  createElement,
  createTextNode,
  insertNode,
  removeNode,
  setProperty,
  destroyNode,
  getRootNode,
} = createRenderer<Instance>({
  createElement(str: string) {
    // We defer creation until we have args if possible, but Solid creates element then sets props.
    // So we create a wrapper instance.
    return {
      type: str,
      parent: null,
      children: [],
      object: null, // Created later or lazily?
      // Actually, to keep it simple, we try to create immediately if no args needed, 
      // or we accept that strict arg-based objects need a specific handling.
      // For now, let's try to instantiate immediately if possible, or use a "sentinel"
      props: {},
      autoAttached: false,
    };
  },
  createTextNode(value: string) {
    // Text nodes purely in structure? usually ignored or treated as speical
    return {
      type: 'Text',
      parent: null,
      children: [],
      object: null, 
      props: {},
      autoAttached: false,
    };
  },
  replaceText(node, value) {
    // No-op for now
  },
  isTextNode(node) {
    return node.type === 'Text';
  },
  setProperty(node, name, value) {
    node.props[name] = value;
    if (name === 'args') {
      updateInstance(node);
    } else {
      // If object exists, apply immediately. 
      // If not, it will be applied in updateInstance when object is created.
      if (node.object) {
        applyProp(node.object, name, value);
      }
    }
  },
  insertNode(parent, node, anchor) {
    if (!node.object) {
        // Instantiate if not already done (e.g. no args prop passed)
        updateInstance(node);
    }

    node.parent = parent;
    parent.children.push(node);
    
    if (parent.object && node.object) {
       let attach = node.props.attach;
       
       // Automatic attach logic
       if (!attach) {
           if (node.type.endsWith('Geometry')) attach = 'geometry';
           else if (node.type.endsWith('Material')) attach = 'material';
       }

       if (attach) {
         if (typeof attach === 'string') {
            // attach='material' -> parent.material = object
            if (parent.object[attach] instanceof THREE.Material) {
                // handle material disposal if replacing?
                 parent.object[attach].dispose?.();
            }
            parent.object[attach] = node.object;
            node.autoAttached = true;
         }
       } else if (node.object.isObject3D && parent.object.isObject3D) {
         parent.object.add(node.object);
       }
    }
  },
  removeNode(parent, node) {
    node.parent = null;
    const idx = parent.children.indexOf(node);
    if (idx >= 0) parent.children.splice(idx, 1);

    if (parent.object && node.object) {
       const attach = node.props.attach;
       if (attach && typeof attach === 'string') {
          parent.object[attach] = null;
       } else if (node.object.isObject3D && parent.object.isObject3D) {
          parent.object.remove(node.object);
       }
    }
    
    // Dispose resources if needed
    if (node.object && typeof node.object.dispose === 'function') {
      node.object.dispose();
    }
  },
  getParentNode(node) {
    return node.parent || undefined;
  },
  getFirstChild(node) {
    return node.children[0] || undefined;
  },
  getNextSibling(node) {
    // This is expensive if we don't store links, but createRenderer might not use it often if we handle insert/remove correctly
    if (!node.parent) return undefined;
    const idx = node.parent.children.indexOf(node);
    if (idx >= 0 && idx < node.parent.children.length - 1) return node.parent.children[idx + 1];
    return undefined;
  }
}) as any;

function applyProp(object: any, name: string, value: any) {
  if (name === 'args' || name === 'attach' || name === 'children') return;
  
  // Basic props
  const target = object[name];
  if (target?.set && (value instanceof THREE.Vector3 || typeof value === 'number' || Array.isArray(value))) {
      // Handle .set methods (Vector3, Color, etc)
      if (Array.isArray(value)) target.set(...value);
      else target.set(value);
  } else {
      object[name] = value;
  }
}

function updateInstance(node: Instance) {
  // Logic to instantiate THREE object based on node.type and node.props.args
  if (!node.type) return;
  
  // @ts-ignore
  const Class = THREE[node.type.charAt(0).toUpperCase() + node.type.slice(1)]; 
  if (!Class) {
     // console.warn(`Could not find THREE class for ${node.type}`);
     return;
  }

  const args = node.props.args || [];
  
  // If object exists and args match, maybe skip?
  // For now, always recreate if this function is called (usually when args change or init)
  
  if (node.object) {
      // Dispose old
      if (typeof node.object.dispose === 'function') node.object.dispose();
      // Remove from parent?
      // Re-add logic required
  }

  try {
     node.object = new Class(...args);
  } catch (e) {
     console.error(e);
  }

  // Apply other props
  for (const key in node.props) {
    applyProp(node.object, key, node.props[key]);
  }
  
  // If already attached to parent, re-attach?
  // This simplistic implementation assumes updateInstance called during creation mainly
}

// Hook into creation flow:
// Solid creates element -> setProperty(args) -> insertNode.
// We need to ensure we instantiate in setProperty('args') or insertNode if args not provided?
// We'll modify setProperty to check args. 
// AND insertNode should check if object is created. If not (no args), create with empty args.

const origCreateElement = createElement;
// We can't easily patch the exported object functions inside the definition.
// But we used logic inside `createElement`.
// Refined:
// `createElement` returns structure.
// `setProperty` sets props.
// `insertNode` (or when all props done) -> we assume props are set synchronously?
// Solid effects run synchronously for creation usually.

// Improvement: add a "commit" phase or just lazy init.
