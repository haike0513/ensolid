import {
  onMount,
  onCleanup,
  type Component,
  createContext,
  useContext,
} from "solid-js";
import * as THREE from "three";
import { render, type Instance } from "../renderer";
import { createEvents } from "./events";
export type { ThreeEvent } from "./events";

export type RootState = {
  scene: THREE.Scene;
  camera: THREE.Camera;
  renderer: THREE.WebGLRenderer;
  addFrameCallback: (fn: (state: RootState, delta: number) => void) => void;
  removeFrameCallback: (fn: (state: RootState, delta: number) => void) => void;
};

const FiberContext = createContext<RootState>();

export const useThree = () => {
  const context = useContext(FiberContext);
  if (!context) throw new Error("useThree must be used within a Canvas");
  return context;
};

export const useFrame = (
  callback: (state: RootState, delta: number) => void
) => {
  const { addFrameCallback, removeFrameCallback } = useThree();
  onMount(() => addFrameCallback(callback));
  onCleanup(() => removeFrameCallback(callback));
};

export const Canvas: Component<any> = (props) => {
  let container: HTMLDivElement | undefined;

  onMount(() => {
    if (!container) return;

    // Basic setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    container.appendChild(renderer.domElement);

    // Resize handler
    const updateSize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    const observer = new ResizeObserver(updateSize);
    observer.observe(container);
    updateSize();

    // Frame Callbacks
    const frameCallbacks = new Set<(state: RootState, delta: number) => void>();
    const clock = new THREE.Clock();

    const state: RootState = {
      scene,
      camera,
      renderer,
      addFrameCallback: (fn) => frameCallbacks.add(fn),
      removeFrameCallback: (fn) => frameCallbacks.delete(fn),
    };

    // Animation loop
    let frameId: number;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      frameCallbacks.forEach((fn) => fn(state, delta));

      // Default render if no other render loop takes over?
      // R3F separates render logic, but simple loop is fine.
      renderer.render(scene, camera);
    };
    animate();

    // Render children into scene
    const rootInstance: Instance = {
      type: "Scene",
      parent: null,
      children: [],
      object: scene,
      props: {},
      autoAttached: false,
    };

    // Wrap children in Provider
    const dispose = render(
      () => (
        <FiberContext.Provider value={state}>
          {props.children}
        </FiberContext.Provider>
      ),
      rootInstance
    );

    // Event System
    const events = createEvents(state);
    const domEvents: Record<string, any> = {
      click: events.onClick,
      pointerdown: events.onPointerDown,
      pointerup: events.onPointerUp,
      pointermove: events.onPointerMove,
      mousemove: events.onMouseMove,
    };
    
    Object.entries(domEvents).forEach(([name, handler]) => {
      container!.addEventListener(name, handler);
    });

    onCleanup(() => {
      cancelAnimationFrame(frameId);
      observer.disconnect();
      dispose();
      renderer.dispose();
      
      // Cleanup events
      Object.entries(domEvents).forEach(([name, handler]) => {
        if (container) container.removeEventListener(name, handler);
      });

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    });
  });

  return (
    <div
      ref={container}
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
        ...props.style,
      }}
      class={props.class}
    />
  );
};
