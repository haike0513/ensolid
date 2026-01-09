/**
 * Flow 组件 - 流程图画布主组件
 */

import {
  type Component,
  createSignal,
  For,
  onCleanup,
  onMount,
  splitProps,
  Show,
  createEffect,
} from "solid-js";
import type {
  EdgeChange,
  FlowProps,
  Node,
  NodeChange,
  Viewport,
  XYPosition,
  Connection,
  Dimensions,
  FitViewOptions,
  Position,
} from "../../types";
import {
  clampZoom,
  screenToFlowPosition,
  getNodeHandlePosition,
  HistoryManager,
} from "../../utils";
import { Background } from "../Background";
import { Controls } from "../Controls";
import { MiniMap } from "../MiniMap";
import { Node as NodeComponent } from "../Node";
import { Edge as EdgeComponent } from "../Edge";
import { DefaultNode } from "../DefaultNode";

export const Flow: Component<FlowProps> = (props) => {
  const [local, others] = splitProps(props, [
    "nodes",
    "edges",
    "onNodesChange",
    "onEdgesChange",
    "onConnect",
    "onConnectStart",
    "onConnectEnd",
    "onNodesDelete",
    "onEdgesDelete",
    "onSelectionChange",
    "onNodeClick",
    "onPaneClick",
    "onInit",
    "nodeTypes",
    "edgeTypes",
    "defaultViewport",
    "minZoom",
    "maxZoom",
    "defaultEdgeOptions",
    "fitView",
    "fitViewOptions",
    "nodesDraggable",
    "nodesConnectable",
    "elementsSelectable",
    "selectNodesOnDrag",
    "panOnDrag",
    "panOnScroll",
    "zoomOnScroll",
    "zoomOnPinch",
    "zoomOnDoubleClick",
    "preventScrolling",
    "style",
    "className",
    "classList",
    "id",
    "children",
    "enableHistory",
    "maxHistorySize",
    "isValidConnection",
  ]);

  // 视口状态
  const [viewport, setViewport] = createSignal<Viewport>(
    local.defaultViewport ?? { x: 0, y: 0, zoom: 1 }
  );
  const [dimensions, setDimensions] = createSignal<Dimensions>({
    width: 0,
    height: 0,
  });

  // 拖拽状态
  const [isDragging, setIsDragging] = createSignal(false);
  const [dragStart, setDragStart] = createSignal<XYPosition | null>(null);
  const [draggedNodeId, setDraggedNodeId] = createSignal<string | null>(null);

  // 选择状态
  const [selectedNodes, setSelectedNodes] = createSignal<Set<string>>(
    new Set()
  );
  const [selectedEdges, setSelectedEdges] = createSignal<Set<string>>(
    new Set()
  );

  // 连接状态
  const [connectingNodeId, setConnectingNodeId] = createSignal<string | null>(
    null
  );
  const [connectingHandleId, setConnectingHandleId] = createSignal<
    string | null
  >(null);
  const [connectingHandleType, setConnectingHandleType] = createSignal<
    "source" | "target" | null
  >(null);
  const [connectingPosition, setConnectingPosition] =
    createSignal<XYPosition | null>(null);
  const [hoveredHandle, setHoveredHandle] = createSignal<{
    nodeId: string;
    handleId: string | null;
    handleType: "source" | "target";
  } | null>(null);

  let containerRef: HTMLDivElement | undefined;

  // 历史管理器
  const historyManager = new HistoryManager(local.maxHistorySize ?? 50);
  const isHistoryEnabled = () => local.enableHistory ?? false;
  const [isRestoringHistory, setIsRestoringHistory] = createSignal(false);

  // 保存历史状态
  const saveHistory = () => {
    if (isHistoryEnabled() && !isRestoringHistory()) {
      historyManager.push({
        nodes: local.nodes,
        edges: local.edges ?? [],
        viewport: viewport(),
      });
    }
  };

  // 撤销操作
  const handleUndo = () => {
    if (!isHistoryEnabled() || !historyManager.canUndo()) return;
    
    setIsRestoringHistory(true);
    const state = historyManager.undo();
    if (state) {
      // 更新节点和边
      if (local.onNodesChange) {
        local.onNodesChange(
          state.nodes.map((node) => ({
            id: node.id,
            type: "reset",
            item: node,
          }))
        );
      }
      if (local.onEdgesChange) {
        local.onEdgesChange(
          state.edges.map((edge) => ({
            id: edge.id,
            type: "reset",
            item: edge,
          }))
        );
      }
      // 更新视口
      updateViewport(state.viewport);
    }
    setIsRestoringHistory(false);
  };

  // 重做操作
  const handleRedo = () => {
    if (!isHistoryEnabled() || !historyManager.canRedo()) return;
    
    setIsRestoringHistory(true);
    const state = historyManager.redo();
    if (state) {
      // 更新节点和边
      if (local.onNodesChange) {
        local.onNodesChange(
          state.nodes.map((node) => ({
            id: node.id,
            type: "reset",
            item: node,
          }))
        );
      }
      if (local.onEdgesChange) {
        local.onEdgesChange(
          state.edges.map((edge) => ({
            id: edge.id,
            type: "reset",
            item: edge,
          }))
        );
      }
      // 更新视口
      updateViewport(state.viewport);
    }
    setIsRestoringHistory(false);
  };


  // 处理视口更新
  const updateViewport = (updates: Partial<Viewport>) => {
    setViewport((prev) => {
      const newViewport = { ...prev, ...updates };
      if (updates.zoom !== undefined) {
        newViewport.zoom = clampZoom(
          updates.zoom,
          local.minZoom,
          local.maxZoom
        );
      }
      return newViewport;
    });
  };

  // 处理节点点击
  const handleNodeClick = (event: MouseEvent, node: Node) => {
    console.log("Flow: handleNodeClick", node.id);
    if (!(local.elementsSelectable ?? true)) return;
    event.stopPropagation();

    setSelectedNodes((prev) => {
      const newSet = new Set(prev);
      if (event.ctrlKey || event.metaKey) {
        // 按住 Ctrl/Cmd 多选
        if (newSet.has(node.id)) {
          newSet.delete(node.id);
        } else {
          newSet.add(node.id);
        }
      } else {
        // 单选
        newSet.clear();
        newSet.add(node.id);
      }
      local.onSelectionChange?.({
        nodes: local.nodes.filter((n) => newSet.has(n.id)),
        edges: (local.edges ?? []).filter((e) => selectedEdges().has(e.id)),
      });
      return newSet;
    });

    local.onNodeClick?.(event, node);

    local.onNodesChange?.([
      {
        id: node.id,
        type: "select",
        selected: !selectedNodes().has(node.id),
      } as NodeChange,
    ]);
  };

  // Has moved flag to distinguish click vs drag
  const [hasMoved, setHasMoved] = createSignal(false);

  // 处理节点拖拽
  const handleNodeMouseDown = (event: MouseEvent, node: Node) => {
    if (!(local.nodesDraggable ?? true)) return;

    // 检查是否点击了 Handle，如果是则不处理节点拖拽
    const target = event.target as HTMLElement;
    if (target.closest("[data-handleid]")) {
      return;
    }

    event.stopPropagation();
    setIsDragging(true);
    setDraggedNodeId(node.id);
    setDragStart({ x: event.clientX, y: event.clientY });
    setHasMoved(false);
  };

  // 处理画布拖拽
  const handlePaneMouseDown = (event: MouseEvent) => {
    // 检查是否点击了节点或边
    const target = event.target as HTMLElement;
    if (
      target.closest(".solidflow-node") ||
      target.closest(".solidflow-edge") ||
      target.closest("[data-handleid]") ||
      target.closest(".solidflow-panel") ||
      target.closest(".nopan")
    ) {
      return;
    }

    // 检查 panOnDrag 设置
    const panOnDrag = local.panOnDrag ?? true;
    const isPanBtn = Array.isArray(panOnDrag)
      ? panOnDrag.includes(event.button)
      : panOnDrag && event.button === 0;

    if (!isPanBtn) return;

    // 防止选中文字等默认行为
    event.preventDefault();

    setIsDragging(true);
    setDraggedNodeId(null);
    setDragStart({ x: event.clientX, y: event.clientY });
    setHasMoved(false);
  };

  // 处理鼠标移动
  const handleMouseMove = (event: MouseEvent) => {
    const currentViewport = viewport();

    // 处理连接状态 - 更新临时连接线的终点位置
    if (connectingNodeId()) {
      if (containerRef) {
        const rect = containerRef.getBoundingClientRect();
        const position = screenToFlowPosition(
          { x: event.clientX - rect.left, y: event.clientY - rect.top },
          currentViewport
        );
        setConnectingPosition(position);

        // 检查鼠标是否悬停在有效的目标 Handle 上
        const targetElement = document.elementFromPoint(
          event.clientX,
          event.clientY
        );
        const targetHandle = targetElement?.closest(
          "[data-handletype]"
        ) as HTMLElement;
        if (targetHandle) {
          const targetNodeElement = targetHandle.closest(
            "[data-id]"
          ) as HTMLElement;
          const targetNodeId = targetNodeElement?.getAttribute("data-id");
          const targetHandleId =
            targetHandle.getAttribute("data-handleid") || null;
          const targetHandleType = targetHandle.getAttribute(
            "data-handletype"
          ) as "source" | "target" | null;
          const handleType = connectingHandleType();

          // 更新悬停的 Handle 信息
          if (
            targetNodeId &&
            targetNodeId !== connectingNodeId() &&
            targetHandleType
          ) {
            const isValid =
              (handleType === "source" && targetHandleType === "target") ||
              (handleType === "target" && targetHandleType === "source");
            setHoveredHandle(
              isValid
                ? {
                    nodeId: targetNodeId,
                    handleId: targetHandleId,
                    handleType: targetHandleType,
                  }
                : null
            );
          } else {
            setHoveredHandle(null);
          }
        } else {
          setHoveredHandle(null);
        }
      }
      return;
    }

    if (isDragging() && draggedNodeId()) {
      const nodeId = draggedNodeId()!;
      const start = dragStart();
      if (start) {
        const deltaX = (event.clientX - start.x) / currentViewport.zoom;
        const deltaY = (event.clientY - start.y) / currentViewport.zoom;

        const node = local.nodes.find((n) => n.id === nodeId);
        if (node) {
          local.onNodesChange?.([
            {
              id: nodeId,
              type: "position",
              position: {
                x: node.position.x + deltaX,
                y: node.position.y + deltaY,
              },
              dragging: true,
            } as NodeChange,
          ]);
        }
        setDragStart({ x: event.clientX, y: event.clientY });
        setHasMoved(true);
      }
    } else if (isDragging() && (local.panOnDrag ?? true)) {
      const start = dragStart();
      if (start) {
        const deltaX = event.clientX - start.x;
        const deltaY = event.clientY - start.y;
        updateViewport({
          x: currentViewport.x + deltaX,
          y: currentViewport.y + deltaY,
        });
        setDragStart({ x: event.clientX, y: event.clientY });
        setHasMoved(true);
      }
    }
  };

  // 处理画布点击（取消选择）
  const handlePaneClick = (event: MouseEvent) => {
    if ((event.target as HTMLElement).closest(".solidflow-node")) return;
    if ((event.target as HTMLElement).closest(".solidflow-edge")) return;

    const newNodesSet = new Set<string>();
    const newEdgesSet = new Set<string>();
    setSelectedNodes(newNodesSet);
    setSelectedEdges(newEdgesSet);
    local.onSelectionChange?.({ nodes: [], edges: [] });
    local.onPaneClick?.(event);
  };

  // 处理鼠标抬起
  const handleMouseUp = (event: MouseEvent) => {
    // 处理连接完成
    if (connectingNodeId()) {
      // 优先使用悬停的 Handle 信息
      const hovered = hoveredHandle();
      if (hovered && hovered.nodeId !== connectingNodeId()) {
        const handleType = connectingHandleType();
        let connection: Connection | null = null;
        
        if (handleType === "source" && hovered.handleType === "target") {
          // 有效的连接：source -> target
          connection = {
            source: connectingNodeId()!,
            target: hovered.nodeId,
            sourceHandle: connectingHandleId(),
            targetHandle: hovered.handleId,
          };
        } else if (handleType === "target" && hovered.handleType === "source") {
          // 有效的连接：target <- source（反向）
          connection = {
            source: hovered.nodeId,
            target: connectingNodeId()!,
            sourceHandle: hovered.handleId,
            targetHandle: connectingHandleId(),
          };
        }

        // 验证连接
        if (connection && (!local.isValidConnection || local.isValidConnection(connection))) {
          local.onConnect?.(connection);
        }
      } else {
        // 如果没有悬停信息，尝试通过 DOM 查找
        const targetElement = document.elementFromPoint(
          event.clientX,
          event.clientY
        ) as HTMLElement;
        const targetHandle = targetElement?.closest(
          "[data-handletype]"
        ) as HTMLElement;

        if (targetHandle) {
          const targetNodeElement = targetHandle.closest(
            "[data-id]"
          ) as HTMLElement;
          const targetNodeId = targetNodeElement?.getAttribute("data-id");
          const targetHandleId =
            targetHandle.getAttribute("data-handleid") || null;
          const targetHandleType = targetHandle.getAttribute(
            "data-handletype"
          ) as "source" | "target" | null;

          if (
            targetNodeId &&
            targetNodeId !== connectingNodeId() &&
            targetHandleType
          ) {
            const handleType = connectingHandleType();
            let connection: Connection | null = null;
            
            if (handleType === "source" && targetHandleType === "target") {
              // 有效的连接：source -> target
              connection = {
                source: connectingNodeId()!,
                target: targetNodeId,
                sourceHandle: connectingHandleId(),
                targetHandle: targetHandleId,
              };
            } else if (
              handleType === "target" &&
              targetHandleType === "source"
            ) {
              // 有效的连接：target <- source（反向）
              connection = {
                source: targetNodeId,
                target: connectingNodeId()!,
                sourceHandle: targetHandleId,
                targetHandle: connectingHandleId(),
              };
            }

            // 验证连接
            if (connection && (!local.isValidConnection || local.isValidConnection(connection))) {
              local.onConnect?.(connection);
            }
          }
        }
      }

      local.onConnectEnd?.(event);
      setConnectingNodeId(null);
      setConnectingHandleId(null);
      setConnectingHandleType(null);
      setConnectingPosition(null);
      setHoveredHandle(null);
      
      // 连接完成，保存历史
      if (hovered && hovered.nodeId !== connectingNodeId()) {
        debouncedSaveHistory();
      }
    }

    if (draggedNodeId()) {
      // Check if it was a click (no movement)
      if (!hasMoved()) {
        const node = local.nodes.find((n) => n.id === draggedNodeId());
        if (node) {
          handleNodeClick(event, node);
        }
      } else {
        // 节点拖拽结束，保存历史
        debouncedSaveHistory();
      }

      local.onNodesChange?.([
        {
          id: draggedNodeId()!,
          type: "position",
          dragging: false,
        } as NodeChange,
      ]);
    }
    setIsDragging(false);
    setDraggedNodeId(null);
    setDragStart(null);
    setHasMoved(false);
  };

  // 处理连接开始（从 Handle 触发，通过事件委托）
  const handleConnectStart = (
    event: MouseEvent,
    nodeId: string,
    handleId: string | null,
    handleType: "source" | "target",
    handlePosArg?: Position
  ) => {
    event.stopPropagation();
    if (!(local.nodesConnectable ?? true)) return;

    setConnectingNodeId(nodeId);
    setConnectingHandleId(handleId);
    setConnectingHandleType(handleType);

    // 获取 Handle 的初始位置
    const node = local.nodes.find((n) => n.id === nodeId);
    if (node && containerRef) {
      const handlePosition =
        handlePosArg ?? (handleType === "source" ? "right" : "left");
      const handlePos = getNodeHandlePosition(node, handleId, handlePosition);
      setConnectingPosition(handlePos);
    } else if (containerRef) {
      const rect = containerRef.getBoundingClientRect();
      const position = screenToFlowPosition(
        { x: event.clientX - rect.left, y: event.clientY - rect.top },
        viewport()
      );
      setConnectingPosition(position);
    }

    local.onConnectStart?.(event, { nodeId, handleId, handleType });
  };

  // 处理 Handle 的鼠标按下事件（事件委托）
  const handleHandleMouseDown = (event: MouseEvent) => {
    // 检查是否点击了 Handle
    const handleElement = (event.target as HTMLElement).closest(
      "[data-handletype]"
    ) as HTMLElement;
    if (!handleElement) return;

    // 检查是否可连接
    const connectable = handleElement.getAttribute("data-connectable");
    if (connectable === "false") return;

    const nodeElement = handleElement.closest("[data-id]") as HTMLElement;
    if (!nodeElement) return;

    const nodeId = nodeElement.getAttribute("data-id");
    if (!nodeId) return;

    const handleId = handleElement.getAttribute("data-handleid") || null;
    const handleType = handleElement.getAttribute("data-handletype") as
      | "source"
      | "target"
      | null;

    const handlePos = handleElement.getAttribute(
      "data-handlepos"
    ) as Position | null;
    const position = handlePos ?? undefined;

    if (handleType && nodeId) {
      // 阻止事件冒泡到节点，避免触发节点的拖拽
      event.stopPropagation();
      handleConnectStart(event, nodeId, handleId, handleType, position);
    }
  };

  // 处理滚轮缩放
  const handleWheel = (event: WheelEvent) => {
    if (!(local.zoomOnScroll ?? true)) return;

    event.preventDefault();
    const currentViewport = viewport();
    const delta = event.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = clampZoom(
      currentViewport.zoom * delta,
      local.minZoom,
      local.maxZoom
    );

    // 计算缩放中心点
    const rect = containerRef?.getBoundingClientRect();
    if (rect) {
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const zoomDelta = newZoom - currentViewport.zoom;

      updateViewport({
        zoom: newZoom,
        x: currentViewport.x - x * zoomDelta,
        y: currentViewport.y - y * zoomDelta,
      });
    }
  };

  // 适合视图
  const performFitView = (options?: FitViewOptions) => {
    if (local.nodes.length === 0) return;

    const bounds = {
      x: Math.min(...local.nodes.map((n) => n.position.x)),
      y: Math.min(...local.nodes.map((n) => n.position.y)),
      width:
        Math.max(...local.nodes.map((n) => n.position.x + (n.width ?? 150))) -
        Math.min(...local.nodes.map((n) => n.position.x)),
      height:
        Math.max(...local.nodes.map((n) => n.position.y + (n.height ?? 40))) -
        Math.min(...local.nodes.map((n) => n.position.y)),
    };

    const containerRect = containerRef?.getBoundingClientRect();
    if (containerRect) {
      const currentOptions = options ?? local.fitViewOptions;
      const padding = currentOptions?.padding ?? 20;
      const scaleX = (containerRect.width - padding * 2) / bounds.width;
      const scaleY = (containerRect.height - padding * 2) / bounds.height;
      const zoom = Math.min(scaleX, scaleY, local.maxZoom ?? 2);

      updateViewport({
        zoom: clampZoom(zoom, local.minZoom, local.maxZoom),
        x:
          (containerRect.width - bounds.width * zoom) / 2 -
          bounds.x * zoom +
          padding,
        y:
          (containerRect.height - bounds.height * zoom) / 2 -
          bounds.y * zoom +
          padding,
      });
    }
  };

  const handleFitView = () => performFitView();

  // 处理缩放按钮
  const handleZoomIn = () => {
    const currentViewport = viewport();
    updateViewport({ zoom: currentViewport.zoom * 1.2 });
  };

  const handleZoomOut = () => {
    const currentViewport = viewport();
    updateViewport({ zoom: currentViewport.zoom * 0.8 });
  };

  const handleZoomReset = () => {
    updateViewport({ zoom: 1, x: 0, y: 0 });
  };

  // 防抖保存历史
  let historySaveTimer: number | null = null;
  const debouncedSaveHistory = () => {
    if (historySaveTimer !== null) {
      clearTimeout(historySaveTimer);
    }
    historySaveTimer = setTimeout(() => {
      if (isHistoryEnabled() && !isRestoringHistory()) {
        saveHistory();
      }
      historySaveTimer = null;
    }, 300) as unknown as number;
  };

  // 初始化
  onMount(() => {
    if (containerRef) {
      containerRef.addEventListener("mousemove", handleMouseMove);
      containerRef.addEventListener("mouseup", handleMouseUp);
      containerRef.addEventListener("wheel", handleWheel, {
        passive: false,
      });
      containerRef.addEventListener("mousedown", handlePaneMouseDown);
      // 在 capture 阶段监听 Handle 的 mousedown 事件，确保能捕获到
      containerRef.addEventListener("mousedown", handleHandleMouseDown, true);

      // ResizeObserver
      const observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          setDimensions({
            width: entry.contentRect.width,
            height: entry.contentRect.height,
          });
        }
      });
      observer.observe(containerRef);

      // Initial size
      const rect = containerRef.getBoundingClientRect();
      setDimensions({ width: rect.width, height: rect.height });

      if (local.fitView) {
        performFitView();
      }

      // 初始化历史记录
      if (isHistoryEnabled()) {
        historyManager.push({
          nodes: local.nodes,
          edges: local.edges ?? [],
          viewport: viewport(),
        });
      }

      // 处理键盘事件
      const handleKeyDown = (event: KeyboardEvent) => {
        // 检查是否在输入框中
        const target = event.target as HTMLElement;
        if (
          target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable
        ) {
          return;
        }

        // 撤销/重做
        if ((event.ctrlKey || event.metaKey) && !event.shiftKey) {
          if (event.key === "z" || event.key === "Z") {
            event.preventDefault();
            handleUndo();
            return;
          }
          if (event.key === "y" || event.key === "Y") {
            event.preventDefault();
            handleRedo();
            return;
          }
        }

        // Shift+Ctrl+Z 重做（Windows/Linux）
        if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === "z") {
          event.preventDefault();
          handleRedo();
          return;
        }

        // Delete/Backspace 删除选中元素
        if (event.key === "Delete" || event.key === "Backspace") {
          event.preventDefault();
          const selectedNodesSet = selectedNodes();
          const selectedEdgesSet = selectedEdges();
          
          if (selectedNodesSet.size > 0 || selectedEdgesSet.size > 0) {
            // 保存历史
            if (isHistoryEnabled()) {
              saveHistory();
            }

            // 删除选中的节点
            if (selectedNodesSet.size > 0 && local.onNodesChange) {
              const changes = Array.from(selectedNodesSet).map((id) => ({
                id,
                type: "remove" as const,
              }));
              local.onNodesChange(changes);
            }

            // 删除选中的边
            if (selectedEdgesSet.size > 0 && local.onEdgesChange) {
              const changes = Array.from(selectedEdgesSet).map((id) => ({
                id,
                type: "remove" as const,
              }));
              local.onEdgesChange(changes);
            }
          }
        }

        // Ctrl+A 全选
        if ((event.ctrlKey || event.metaKey) && event.key === "a") {
          event.preventDefault();
          const allNodeIds = new Set(local.nodes.map((n) => n.id));
          const allEdgeIds = new Set((local.edges ?? []).map((e) => e.id));
          setSelectedNodes(allNodeIds);
          setSelectedEdges(allEdgeIds);
          local.onSelectionChange?.({
            nodes: local.nodes,
            edges: local.edges ?? [],
          });
        }

        // Escape 取消选择
        if (event.key === "Escape") {
          setSelectedNodes(new Set());
          setSelectedEdges(new Set());
          local.onSelectionChange?.({ nodes: [], edges: [] });
        }
      };

      // 添加键盘事件监听
      containerRef.addEventListener("keydown", handleKeyDown);
      // 确保容器可以获得焦点
      containerRef.setAttribute("tabindex", "0");

      // Initialize Flow Instance
      const flowInstance = {
        zoomIn: handleZoomIn,
        zoomOut: handleZoomOut,
        zoomTo: (zoom: number) => updateViewport({ zoom }),
        fitView: performFitView,
        setViewport: (vp: Viewport) => updateViewport(vp),
        getViewport: () => viewport(),
        project: (position: XYPosition) => {
          const rect = containerRef!.getBoundingClientRect();
          return screenToFlowPosition(
            { x: position.x - rect.left, y: position.y - rect.top },
            viewport()
          );
        },
        toObject: () => ({
          nodes: local.nodes,
          edges: local.edges,
          viewport: viewport(),
        }),
        undo: handleUndo,
        redo: handleRedo,
        canUndo: () => isHistoryEnabled() && historyManager.canUndo(),
        canRedo: () => isHistoryEnabled() && historyManager.canRedo(),
      };

      if (local.onInit) {
        local.onInit(flowInstance);
      }

      onCleanup(() => {
        if (containerRef) {
          containerRef.removeEventListener("mousemove", handleMouseMove);
          containerRef.removeEventListener("mouseup", handleMouseUp);
          containerRef.removeEventListener("wheel", handleWheel);
          containerRef.removeEventListener("mousedown", handlePaneMouseDown);
          containerRef.removeEventListener(
            "mousedown",
            handleHandleMouseDown,
            true
          );
          containerRef.removeEventListener("keydown", handleKeyDown);
        }
        observer.disconnect();
      });
    }
  });

  // 获取节点类型组件（带默认值）
  const getNodeComponent = (node: Node) => {
    const nodeType = node.type ?? "default";
    const Component = local.nodeTypes?.[nodeType];
    return Component ?? (nodeType === "default" ? DefaultNode : undefined);
  };

  const currentViewport = () => viewport();

  return (
    <div
      {...others}
      ref={containerRef}
      id={local.id}
      class={local.className}
      classList={{
        solidflow: true,
        "relative w-full h-full overflow-hidden": true,
        ...(local.classList?.reduce(
          (acc, cls) => ({ ...acc, [cls]: true }),
          {} as Record<string, boolean>
        ) ?? {}),
      }}
      style={local.style as any}
      onClick={handlePaneClick}
    >
      {/* 背景 */}
      <Background viewport={currentViewport()} className="-z-10" />

      {/* 边图层 */}
      <div
        class="absolute inset-0 w-full h-full"
        style={{
          transform: `translate(${currentViewport().x}px, ${
            currentViewport().y
          }px) scale(${currentViewport().zoom})`,
          "transform-origin": "0 0",
          "pointer-events": "none",
        }}
      >
          {/* 边 */}
          <For each={local.edges ?? []}>
            {(edge) => (
              <EdgeComponent
                edge={edge}
                sourceNode={local.nodes.find((n) => n.id === edge.source)}
                targetNode={local.nodes.find((n) => n.id === edge.target)}
                selected={selectedEdges().has(edge.id)}
                onClick={(e, ed) => {
                  if (!(local.elementsSelectable ?? true)) {
                    return;
                  }
                  e.stopPropagation();
                  setSelectedEdges((prev) => {
                    const newSet = new Set(prev);
                    if (e.ctrlKey || e.metaKey) {
                      if (newSet.has(ed.id)) {
                        newSet.delete(ed.id);
                      } else {
                        newSet.add(ed.id);
                      }
                    } else {
                      newSet.clear();
                      newSet.add(ed.id);
                    }
                    local.onSelectionChange?.({
                      nodes: local.nodes.filter((n) => selectedNodes().has(n.id)),
                      edges: (local.edges ?? []).filter((e) => newSet.has(e.id)),
                    });
                    return newSet;
                  });
                  local.onEdgesChange?.([
                    {
                      id: ed.id,
                      type: "select",
                      selected: !selectedEdges().has(ed.id),
                    } as EdgeChange,
                  ]);
                }}
                onLabelEdit={(edgeId, label) => {
                  local.onEdgesChange?.([
                    {
                      id: edgeId,
                      type: "reset",
                      item: {
                        ...edge,
                        label,
                      },
                    } as EdgeChange,
                  ]);
                  debouncedSaveHistory();
                }}
              />
            )}
          </For>
      </div>

      {/* 节点 */}
      <div
        class="absolute inset-0"
        style={{
          transform: `translate(${currentViewport().x}px, ${
            currentViewport().y
          }px) scale(${currentViewport().zoom})`,
          "transform-origin": "0 0",
          "pointer-events": "none",
        }}
      >
        <For each={local.nodes}>
          {(node) => {
            const NodeType = getNodeComponent(node);
            return (
                <NodeComponent
                  node={node}
                  selected={selectedNodes().has(node.id)}
                  dragging={draggedNodeId() === node.id}
                  onClick={(e, n) => handleNodeClick(e, n)}
                  onMouseDown={(e, n) => handleNodeMouseDown(e, n)}
                  renderNode={
                    NodeType ? (n) => <NodeType node={n} /> : undefined
                  }
                  onDimensionsChange={(id, dimensions) => {
                    local.onNodesChange?.([
                      {
                        id,
                        type: "dimensions",
                        dimensions,
                      },
                    ]);
                  }}
                />
            );
          }}
        </For>
      </div>

      {/* 临时连接线 */}
      <Show when={connectingNodeId() && connectingPosition()}>
        <svg
          class="absolute inset-0 w-full h-full pointer-events-none z-50"
          style={{
            transform: `translate(${currentViewport().x}px, ${
              currentViewport().y
            }px) scale(${currentViewport().zoom})`,
            "transform-origin": "0 0",
          }}
        >
          {(() => {
            const sourceNode = local.nodes.find(
              (n) => n.id === connectingNodeId()!
            );
            if (!sourceNode || !connectingPosition()) return null;

            const handleType = connectingHandleType();
            const handleId = connectingHandleId();
            const handlePosition = handleType === "source" ? "right" : "left";
            const sourcePosition = getNodeHandlePosition(
              sourceNode,
              handleId,
              handlePosition
            );
            const targetPosition = connectingPosition()!;

            // 根据悬停的 Handle 判断连接是否有效
            const hovered = hoveredHandle();
            let isValidConnection = false;
            let strokeColor = "#b1b1b7"; // 默认灰色

            if (hovered && hovered.nodeId !== connectingNodeId()) {
              isValidConnection = true;
              strokeColor = "#10b981"; // 绿色表示有效
            }

            const path = `M ${sourcePosition.x} ${sourcePosition.y} L ${targetPosition.x} ${targetPosition.y}`;

            return (
              <path
                d={path}
                fill="none"
                stroke={strokeColor}
                stroke-width="2"
                stroke-dasharray="5,5"
                marker-end={isValidConnection ? "url(#arrowhead)" : undefined}
                class="transition-colors duration-150"
              />
            );
          })()}
        </svg>
      </Show>

      {/* 控制按钮 */}
      <Controls
        onFitView={handleFitView}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onZoomReset={handleZoomReset}
      />

      {/* 小地图 */}
      <MiniMap
        nodes={local.nodes}
        edges={local.edges}
        viewport={currentViewport()}
        containerWidth={dimensions().width}
        containerHeight={dimensions().height}
      />
      {local.children}
    </div>
  );
};
