import {
  type Component,
  type JSX,
  createSignal,
  Show,
  mergeProps,
  For,
} from "solid-js";
import { useNodeId } from "../Node/NodeContext";
import { useFlowContext } from "../FlowProvider";
import type { NodeChange } from "../../types";

export type ResizeControlVariant = "border" | "line" | "handle";

export interface NodeResizeControlProps {
  nodeId?: string;
  variant?: ResizeControlVariant;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  color?: string;
  keepAspectRatio?: boolean;
  onResizeStart?: (
    event: MouseEvent | TouchEvent,
    params: { width: number; height: number; x: number; y: number }
  ) => void;
  onResize?: (
    event: MouseEvent | TouchEvent,
    params: { width: number; height: number; x: number; y: number }
  ) => void;
  onResizeEnd?: (
    event: MouseEvent | TouchEvent,
    params: { width: number; height: number; x: number; y: number }
  ) => void;
  style?: JSX.CSSProperties;
  className?: string;
  children?: JSX.Element;
  isVisible?: boolean;
}

type Direction =
  | "top"
  | "right"
  | "bottom"
  | "left"
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

const handleDirections: Direction[] = [
  "top-left",
  "top",
  "top-right",
  "right",
  "bottom-right",
  "bottom",
  "bottom-left",
  "left",
];

const getDirectionStyle = (direction: Direction): JSX.CSSProperties => {
  const style: any = { position: "absolute" };
  const size = 6;
  const offset = -size / 2;

  switch (direction) {
    case "top-left":
      style.top = `${offset}px`;
      style.left = `${offset}px`;
      style.cursor = "nwse-resize";
      break;
    case "top":
      style.top = `${offset}px`;
      style.left = "50%";
      style.transform = "translateX(-50%)";
      style.cursor = "ns-resize";
      break;
    case "top-right":
      style.top = `${offset}px`;
      style.right = `${offset}px`;
      style.cursor = "nesw-resize";
      break;
    case "right":
      style.right = `${offset}px`;
      style.top = "50%";
      style.transform = "translateY(-50%)";
      style.cursor = "ew-resize";
      break;
    case "bottom-right":
      style.bottom = `${offset}px`;
      style.right = `${offset}px`;
      style.cursor = "nwse-resize";
      break;
    case "bottom":
      style.bottom = `${offset}px`;
      style.left = "50%";
      style.transform = "translateX(-50%)";
      style.cursor = "ns-resize";
      break;
    case "bottom-left":
      style.bottom = `${offset}px`;
      style.left = `${offset}px`;
      style.cursor = "nesw-resize";
      break;
    case "left":
      style.left = `${offset}px`;
      style.top = "50%";
      style.transform = "translateY(-50%)";
      style.cursor = "ew-resize";
      break;
  }
  return style;
};

export const NodeResizeControl: Component<NodeResizeControlProps> = (p) => {
  const props = mergeProps(
    {
      variant: "handle",
      minWidth: 10,
      minHeight: 10,
      maxWidth: Number.MAX_VALUE,
      maxHeight: Number.MAX_VALUE,
      isVisible: true,
      color: "#3b82f6",
    },
    p
  );

  const { onNodesChange, nodes, viewport } = useFlowContext();
  let defaultNodeId: string | undefined;

  try {
    defaultNodeId = useNodeId();
  } catch (e) {
    // fallback
  }

  const nodeId = () => props.nodeId || defaultNodeId;
  const node = () => {
    const id = nodeId();
    return id ? nodes().find((n) => n.id === id) : undefined;
  };

  const [resizing, setResizing] = createSignal(false);

  const startResize = (
    event: MouseEvent | TouchEvent,
    direction: Direction
  ) => {
    event.preventDefault();
    event.stopPropagation();

    const currentNode = node();
    if (!currentNode || !nodeId()) return;

    setResizing(true);

    const startX =
      "clientX" in event ? event.clientX : event.touches[0].clientX;
    const startY =
      "clientY" in event ? event.clientY : event.touches[0].clientY;

    const startWidth = currentNode.width ?? 100;
    const startHeight = currentNode.height ?? 50;
    const startNodeX = currentNode.position.x;
    const startNodeY = currentNode.position.y;
    
    // Check for aspect ratio
    // const aspectRatio = startWidth / startHeight;

    const currentBounds = {
      x: startNodeX,
      y: startNodeY,
      width: startWidth,
      height: startHeight,
    };

    props.onResizeStart?.(event, { ...currentBounds });

    const onMove = (moveEvent: MouseEvent | TouchEvent) => {
      moveEvent.preventDefault();
      moveEvent.stopPropagation();

      const currentX =
        "clientX" in moveEvent
          ? moveEvent.clientX
          : moveEvent.touches[0].clientX;
      const currentY =
        "clientY" in moveEvent
          ? moveEvent.clientY
          : moveEvent.touches[0].clientY;

      const vp = viewport();
      const deltaX = (currentX - startX) / vp.zoom;
      const deltaY = (currentY - startY) / vp.zoom;

      let newWidth = startWidth;
      let newHeight = startHeight;
      let newX = startNodeX;
      let newY = startNodeY;

      if (direction.includes("right")) {
        newWidth = startWidth + deltaX;
      } else if (direction.includes("left")) {
        newWidth = startWidth - deltaX;
        newX = startNodeX + deltaX;
      }

      if (direction.includes("bottom")) {
        newHeight = startHeight + deltaY;
      } else if (direction.includes("top")) {
        newHeight = startHeight - deltaY;
        newY = startNodeY + deltaY;
      }

      // Constrain dimensions
      if (newWidth < props.minWidth!) {
         if (direction.includes("left")) {
            newX = startNodeX + (startWidth - props.minWidth!);
         }
         newWidth = props.minWidth!;
      }
      if (newWidth > props.maxWidth!) {
          if (direction.includes("left")) {
            newX = startNodeX + (startWidth - props.maxWidth!);
         }
         newWidth = props.maxWidth!;
      }

      if (newHeight < props.minHeight!) {
         if (direction.includes("top")) {
             newY = startNodeY + (startHeight - props.minHeight!);
         }
         newHeight = props.minHeight!;
      }
      if (newHeight > props.maxHeight!) {
          if (direction.includes("top")) {
             newY = startNodeY + (startHeight - props.maxHeight!);
         }
         newHeight = props.maxHeight!;
      }
      
      // Aspect ratio handling (simplified)
      // If simplified, we might skip complex aspect ratio for checking logic with bounds

      if (
        newWidth !== currentBounds.width ||
        newHeight !== currentBounds.height ||
        newX !== currentBounds.x ||
        newY !== currentBounds.y
      ) {
        currentBounds.width = newWidth;
        currentBounds.height = newHeight;
        currentBounds.x = newX;
        currentBounds.y = newY;
        
        // Update Node
        const changes: NodeChange[] = [
            {
                id: nodeId()!,
                type: 'dimensions',
                dimensions: {
                    x: newX,
                    y: newY,
                    width: newWidth,
                    height: newHeight
                }
            }
        ];
        onNodesChange(changes);
        
        props.onResize?.(moveEvent, { ...currentBounds });
      }
    };

    const onUp = (upEvent: MouseEvent | TouchEvent) => {
      setResizing(false);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);

      props.onResizeEnd?.(upEvent, { ...currentBounds });
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onMove);
    window.addEventListener("touchend", onUp);
  };

  const handleStyle = () => ({
      width: "6px",
      height: "6px",
      background: props.color,
      borderRadius: "1px",
      border: "1px solid white",
  });

  return (
    <Show when={props.isVisible}>
      <div
        class={`solidflow-resize-control ${props.className || ""}`}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          "pointer-events": "none",
          "box-sizing": "border-box",
          ...(props.variant === "border" || resizing()
            ? { border: `1px solid ${props.color}` }
            : {}),
          ...props.style,
        }}
      >
        <Show when={props.children} fallback={
             <For each={handleDirections}>
                {(direction) => (
                    <div 
                        class={`solidflow-resize-handle solidflow-resize-handle-${direction}`}
                        style={{
                            ...getDirectionStyle(direction),
                            "pointer-events": "all",
                            ...handleStyle(),
                        }}
                        onMouseDown={(e) => startResize(e, direction)}
                        onTouchStart={(e) => startResize(e, direction)}
                    />
                )}
             </For>
        }>
            {props.children}
        </Show>
      </div>
    </Show>
  );
};
