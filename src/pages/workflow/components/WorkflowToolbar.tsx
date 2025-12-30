import type { Component, Setter, Accessor } from "solid-js";
import { createSignal, Show, For } from "solid-js";
import { Panel, type PanelPosition } from "@ensolid/solidflow";
import { pluginRegistry } from "../plugins";

interface WorkflowToolbarProps {
  isLocked: Accessor<boolean>;
  setIsLocked: Setter<boolean>;
  onNodeDragStart: (event: DragEvent, type: string) => void;
}

export const WorkflowToolbar: Component<WorkflowToolbarProps> = (props) => {
  const [toolbarPos, setToolbarPos] = createSignal<PanelPosition>("top-center");
  const [isDraggingToolbar, setIsDraggingToolbar] = createSignal(false);
  
  // 获取所有注册的节点定义（在渲染时获取，确保插件已注册）
  const nodeDefinitions = () => Array.from(pluginRegistry.getNodeTypes().values());

  const handleToolbarDragStart = (e: MouseEvent) => {
    // Prevent interfering with node dragging
    if ((e.target as HTMLElement).closest('[draggable="true"]')) return;

    e.preventDefault();
    setIsDraggingToolbar(true);

    const handleMouseMove = (ev: MouseEvent) => {
      // Determine closest edge based on mouse position
      const { clientX, clientY, view } = ev;
      if (!view) return;
      const { innerWidth, innerHeight } = view;

      const distTop = clientY;
      const distBottom = innerHeight - clientY;
      const distLeft = clientX;
      const distRight = innerWidth - clientX;

      const minDist = Math.min(distTop, distBottom, distLeft, distRight);

      if (minDist === distTop) setToolbarPos("top-center");
      else if (minDist === distBottom) setToolbarPos("bottom-center");
      else if (minDist === distLeft) setToolbarPos("center-left");
      else if (minDist === distRight) setToolbarPos("center-right");
    };

    const handleMouseUp = () => {
      setIsDraggingToolbar(false);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const isHorizontalToolbar = () =>
    toolbarPos().includes("top") || toolbarPos().includes("bottom");

  return (
    <Panel
      position={toolbarPos()}
      class={toolbarPos().includes("bottom") ? "mb-4" : "mt-4"}
    >
      <div
        class={`flex items-center gap-1 rounded-xl border border-gray-200 bg-white p-1.5 shadow-lg cursor-move transition-all duration-200 ${
          isHorizontalToolbar() ? "flex-row" : "flex-col"
        } ${
          isDraggingToolbar()
            ? "scale-105 shadow-xl ring-2 ring-indigo-500/20"
            : ""
        }`}
        onMouseDown={handleToolbarDragStart}
      >
        {/* Drag Handle Indicator */}
        <div
          class={`flex justify-center items-center ${
            isHorizontalToolbar() ? "w-2 h-full" : "h-2 w-full"
          } text-gray-300`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class={isHorizontalToolbar() ? "rotate-90" : ""}
          >
            <circle cx="9" cy="12" r="1" />
            <circle cx="9" cy="5" r="1" />
            <circle cx="9" cy="19" r="1" />
            <circle cx="15" cy="12" r="1" />
            <circle cx="15" cy="5" r="1" />
            <circle cx="15" cy="19" r="1" />
          </svg>
        </div>

        <div
          class={`w-px bg-gray-200 mx-1 ${
            isHorizontalToolbar() ? "h-6 w-px" : "w-6 h-px"
          }`}
        ></div>
        {/* Lock Button (Functional) */}
        <div
          class={`p-2 rounded-lg cursor-pointer transition-colors ${
            props.isLocked()
              ? "bg-red-100 text-red-600"
              : "hover:bg-gray-100 text-gray-500"
          }`}
          title={props.isLocked() ? "Unlock Canvas" : "Lock Canvas"}
          onClick={() => props.setIsLocked(!props.isLocked())}
        >
          <Show
            when={props.isLocked()}
            fallback={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 9.9-1" />
            </svg>
          </Show>
        </div>

        {/* Hand / Pan */}
        <div
          class="p-2 rounded-lg hover:bg-gray-100 text-gray-500 cursor-pointer transition-colors"
          title="Pan Mode"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" />
            <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2" />
            <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8" />
            <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
          </svg>
        </div>

        {/* Select (Active) */}
        <div
          class="p-2 rounded-lg bg-indigo-100 text-indigo-700 cursor-pointer transition-colors"
          title="Select Mode"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="m3 3 7.07 16.97 2.51-7.39 7.39-2.51L3 3z" />
            <path d="m13 13 6 6" />
          </svg>
        </div>

        <div
          class={`bg-gray-200 mx-1 ${
            isHorizontalToolbar() ? "h-6 w-px" : "w-6 h-px"
          }`}
        ></div>

        {/* Draggable Nodes - 动态生成 */}
        <For each={nodeDefinitions()}>
          {(nodeDef, index) => (
            <div
              class="p-2 rounded-lg hover:bg-gray-100 text-gray-700 cursor-grab active:cursor-grabbing relative group transition-colors"
              title={nodeDef.toolbar?.title || nodeDef.label}
              draggable={true}
              onDragStart={(e) => props.onNodeDragStart(e, nodeDef.type)}
            >
              {nodeDef.toolbar?.icon || (
                <div class="w-[18px] h-[18px] flex items-center justify-center text-lg">
                  {typeof nodeDef.icon === "string" ? nodeDef.icon : nodeDef.icon}
                </div>
              )}
              <span class="absolute -bottom-1 -right-1 text-[8px] font-bold text-gray-400">
                {index() + 1}
              </span>
            </div>
          )}
        </For>

        <div
          class={`bg-gray-200 mx-1 ${
            isHorizontalToolbar() ? "h-6 w-px" : "w-6 h-px"
          }`}
        ></div>

        {/* Additional static tools for visuals */}
        <div class="p-2 rounded-lg hover:bg-gray-100 text-gray-500 cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
          </svg>
        </div>
        <div class="p-2 rounded-lg hover:bg-gray-100 text-gray-500 cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="4 7 4 4 20 4 20 7" />
            <line x1="9" x2="15" y1="20" y2="20" />
            <line x1="12" x2="12" y1="4" y2="20" />
          </svg>
        </div>
      </div>
    </Panel>
  );
};
