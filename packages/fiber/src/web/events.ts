import * as THREE from 'three';
import { type RootState } from './Canvas';

export interface ThreeEvent extends THREE.Intersection {
  eventObject: THREE.Object3D;
  originalEvent: PointerEvent | MouseEvent;
  stopPropagation: () => void;
}

export function createEvents(store: RootState) {
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  
  // Track hovered objects for Over/Out
  let hovered = new Map<string, THREE.Object3D>();

  const handleEvent = (event: PointerEvent | MouseEvent) => {
    const element = event.target as HTMLElement;
    const rect = element.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, store.camera);
    
    // We intersect everything.
    const intersects = raycaster.intersectObjects(store.scene.children, true);
    
    // --- HOVER LOGIC (PointerOver / PointerOut) ---
    // This is a simplified implementation. R3F is more robust.
    if (event.type === 'pointermove' || event.type === 'mousemove') {
       const newHovered = new Map<string, THREE.Object3D>();
       
       // Find all interactive objects in the intersection list (bubbling path from first hit up? Or all hits?)
       // R3F: "Filter: Intersects are sorted by distance. Only the first hit is relevant for hover state change usually, but we traverse up."
       
       if (intersects.length > 0) {
          const hit = intersects[0];
          let obj: THREE.Object3D | null = hit.object;
          while (obj) {
             if (obj.userData?.fiber) {
                newHovered.set(obj.uuid, obj);
             }
             obj = obj.parent;
          }
       }

       // Call onPointerOut for items no longer hovered
       for (const [uuid, obj] of hovered) {
          if (!newHovered.has(uuid)) {
             const instance = obj.userData.fiber;
             if (instance?.props.onPointerOut) {
                instance.props.onPointerOut({ 
                    originalEvent: event, 
                    eventObject: obj, 
                    // We don't have a valid intersection for 'out' if we aren't hitting it, but we mock it or pass previous?
                    // Just passing basic props usually sufficient for Out.
                    distance: 0, point: new THREE.Vector3(), object: obj 
                } as any); 
             }
          }
       }
       
       // Call onPointerOver for newly hovered items
       for (const [uuid, obj] of newHovered) {
          if (!hovered.has(uuid)) {
             const instance = obj.userData.fiber;
             if (instance?.props.onPointerOver) {
                  // Use the first hit intersection data
                  instance.props.onPointerOver({ 
                      originalEvent: event, 
                      eventObject: obj, 
                      ...intersects[0] 
                  });
             }
          }
       }
       
       hovered = newHovered;
    }

    // --- CLICK / MOVE / DOWN / UP LOGIC ---
    if (intersects.length > 0) {
       const hit = intersects[0];
       let obj: THREE.Object3D | null = hit.object;
       let stopped = false;
       
       const stopPropagation = () => { stopped = true; };

       // Bubble up the tree
       while (obj && !stopped) {
          const instance = obj.userData.fiber;
          if (instance) {
             const handlerName = getHandlerName(event.type);
             if (instance.props[handlerName]) {
                instance.props[handlerName]({
                    ...hit,
                    eventObject: obj,
                    originalEvent: event,
                    stopPropagation
                });
             }
          }
          obj = obj.parent;
       }
    }
  };

  return {
    onClick: handleEvent,
    onPointerDown: handleEvent,
    onPointerUp: handleEvent,
    onPointerMove: handleEvent,
    onMouseMove: handleEvent, // fallback
  };
}

function getHandlerName(type: string) {
  switch(type) {
    case 'click': return 'onClick';
    case 'pointerdown': return 'onPointerDown';
    case 'pointerup': return 'onPointerUp';
    case 'pointermove': return 'onPointerMove';
    case 'mousemove': return 'onPointerMove';
  }
  return '';
}
