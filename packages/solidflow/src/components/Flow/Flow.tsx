/**
 * Flow 组件 - 流程图画布主组件
 */

import {
    Component,
    createSignal,
    For,
    onCleanup,
    onMount,
    splitProps,
    Show,
} from "solid-js";
import type {
    EdgeChange,
    FlowProps,
    Node,
    NodeChange,
    Viewport,
    XYPosition,
    Connection,
} from "../../types";
import { clampZoom, screenToFlowPosition, getNodeHandlePosition } from "../../utils";
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
    ]);

    // 视口状态
    const [viewport, setViewport] = createSignal<Viewport>(
        local.defaultViewport ?? { x: 0, y: 0, zoom: 1 },
    );

    // 拖拽状态
    const [isDragging, setIsDragging] = createSignal(false);
    const [dragStart, setDragStart] = createSignal<XYPosition | null>(null);
    const [draggedNodeId, setDraggedNodeId] = createSignal<string | null>(null);

    // 选择状态
    const [selectedNodes, setSelectedNodes] = createSignal<Set<string>>(
        new Set(),
    );
    const [selectedEdges, setSelectedEdges] = createSignal<Set<string>>(
        new Set(),
    );

    // 连接状态
    const [connectingNodeId, setConnectingNodeId] = createSignal<string | null>(null);
    const [connectingHandleId, setConnectingHandleId] = createSignal<string | null>(null);
    const [connectingHandleType, setConnectingHandleType] = createSignal<'source' | 'target' | null>(null);
    const [connectingPosition, setConnectingPosition] = createSignal<XYPosition | null>(null);

    let containerRef: HTMLDivElement | undefined;
    let svgRef: SVGSVGElement | undefined;

    // 处理视口更新
    const updateViewport = (updates: Partial<Viewport>) => {
        setViewport((prev) => {
            const newViewport = { ...prev, ...updates };
            if (updates.zoom !== undefined) {
                newViewport.zoom = clampZoom(
                    updates.zoom,
                    local.minZoom,
                    local.maxZoom,
                );
            }
            return newViewport;
        });
    };

    // 处理节点点击
    const handleNodeClick = (event: MouseEvent, node: Node) => {
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
                edges: (local.edges ?? []).filter((e) =>
                    selectedEdges().has(e.id)
                ),
            });
            return newSet;
        });

        local.onNodesChange?.([
            {
                id: node.id,
                type: "select",
                selected: !selectedNodes().has(node.id),
            } as NodeChange,
        ]);
    };

    // 处理节点拖拽
    const handleNodeMouseDown = (event: MouseEvent, node: Node) => {
        if (!(local.nodesDraggable ?? true)) return;

        event.stopPropagation();
        setIsDragging(true);
        setDraggedNodeId(node.id);
        setDragStart({ x: event.clientX, y: event.clientY });
    };

    // 处理鼠标移动
    const handleMouseMove = (event: MouseEvent) => {
        const currentViewport = viewport();

        // 处理连接状态
        if (connectingNodeId()) {
            if (containerRef) {
                const rect = containerRef.getBoundingClientRect();
                const position = screenToFlowPosition(
                    { x: event.clientX - rect.left, y: event.clientY - rect.top },
                    currentViewport
                );
                setConnectingPosition(position);
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
            }
        } else if (isDragging() && local.panOnDrag) {
            const start = dragStart();
            if (start) {
                const deltaX = event.clientX - start.x;
                const deltaY = event.clientY - start.y;
                updateViewport({
                    x: currentViewport.x + deltaX,
                    y: currentViewport.y + deltaY,
                });
                setDragStart({ x: event.clientX, y: event.clientY });
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
    };

    // 处理鼠标抬起
    const handleMouseUp = (event: MouseEvent) => {
        // 处理连接完成
        if (connectingNodeId()) {
            const targetElement = event.target as HTMLElement;
            const targetHandle = targetElement.closest('[data-handleid]') as HTMLElement;
            
            if (targetHandle) {
                const targetNodeElement = targetHandle.closest('[data-id]') as HTMLElement;
                const targetNodeId = targetNodeElement?.getAttribute('data-id');
                const targetHandleId = targetHandle.getAttribute('data-handleid') || null;
                const targetHandleType = targetHandle.getAttribute('data-handletype') as 'source' | 'target' | null;
                
                if (targetNodeId && targetNodeId !== connectingNodeId() && targetHandleType) {
                    const handleType = connectingHandleType();
                    if (handleType === 'source' && targetHandleType === 'target') {
                        // 有效的连接：source -> target
                        const connection: Connection = {
                            source: connectingNodeId()!,
                            target: targetNodeId,
                            sourceHandle: connectingHandleId(),
                            targetHandle: targetHandleId,
                        };
                        local.onConnect?.(connection);
                    } else if (handleType === 'target' && targetHandleType === 'source') {
                        // 有效的连接：target <- source（反向）
                        const connection: Connection = {
                            source: targetNodeId,
                            target: connectingNodeId()!,
                            sourceHandle: targetHandleId,
                            targetHandle: connectingHandleId(),
                        };
                        local.onConnect?.(connection);
                    }
                }
            }
            
            local.onConnectEnd?.(event);
            setConnectingNodeId(null);
            setConnectingHandleId(null);
            setConnectingHandleType(null);
            setConnectingPosition(null);
        }

        if (draggedNodeId()) {
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
    };

    // 处理连接开始（从 Handle 触发，通过事件委托）
    const handleConnectStart = (event: MouseEvent, nodeId: string, handleId: string | null, handleType: 'source' | 'target') => {
        event.stopPropagation();
        if (!(local.nodesConnectable ?? true)) return;
        
        setConnectingNodeId(nodeId);
        setConnectingHandleId(handleId);
        setConnectingHandleType(handleType);
        
        if (containerRef) {
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
        const handleElement = (event.target as HTMLElement).closest('[data-handleid]') as HTMLElement;
        if (!handleElement) return;

        const nodeElement = handleElement.closest('[data-id]') as HTMLElement;
        if (!nodeElement) return;

        const nodeId = nodeElement.getAttribute('data-id');
        if (!nodeId) return;

        const handleId = handleElement.getAttribute('data-handleid') || null;
        const handleType = handleElement.getAttribute('data-handletype') as 'source' | 'target' | null;

        if (handleType && nodeId) {
            handleConnectStart(event, nodeId, handleId, handleType);
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
            local.maxZoom,
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
    const handleFitView = () => {
        if (local.nodes.length === 0) return;

        const bounds = {
            x: Math.min(...local.nodes.map((n) => n.position.x)),
            y: Math.min(...local.nodes.map((n) => n.position.y)),
            width: Math.max(
                ...local.nodes.map((n) => n.position.x + (n.width ?? 150)),
            ) -
                Math.min(...local.nodes.map((n) => n.position.x)),
            height: Math.max(
                ...local.nodes.map((n) => n.position.y + (n.height ?? 40)),
            ) -
                Math.min(...local.nodes.map((n) => n.position.y)),
        };

        const containerRect = containerRef?.getBoundingClientRect();
        if (containerRect) {
            const padding = local.fitViewOptions?.padding ?? 20;
            const scaleX = (containerRect.width - padding * 2) / bounds.width;
            const scaleY = (containerRect.height - padding * 2) / bounds.height;
            const zoom = Math.min(scaleX, scaleY, local.maxZoom ?? 2);

            updateViewport({
                zoom: clampZoom(zoom, local.minZoom, local.maxZoom),
                x: (containerRect.width - bounds.width * zoom) / 2 -
                    bounds.x * zoom +
                    padding,
                y: (containerRect.height - bounds.height * zoom) / 2 -
                    bounds.y * zoom +
                    padding,
            });
        }
    };

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

    // 初始化
    onMount(() => {
        if (containerRef) {
            containerRef.addEventListener("mousemove", handleMouseMove);
            containerRef.addEventListener("mouseup", handleMouseUp);
            containerRef.addEventListener("wheel", handleWheel, {
                passive: false,
            });

            if (local.fitView) {
                handleFitView();
            }
        }

        onCleanup(() => {
            if (containerRef) {
                containerRef.removeEventListener("mousemove", handleMouseMove);
                containerRef.removeEventListener("mouseup", handleMouseUp);
                containerRef.removeEventListener("wheel", handleWheel);
            }
        });
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
                    {} as Record<string, boolean>,
                ) ?? {}),
            }}
            style={local.style as any}
            onClick={handlePaneClick}
            onMouseDown={handleHandleMouseDown}
        >
            {/* 背景 */}
            <Background />

            {/* SVG 画布 */}
            <svg
                ref={svgRef}
                class="absolute inset-0 w-full h-full pointer-events-none"
                style={{
                    transform:
                        `translate(${currentViewport().x}px, ${currentViewport().y}px) scale(${currentViewport().zoom})`,
                    "transform-origin": "0 0",
                }}
            >
                {/* 标记定义 */}
                <defs>
                    {/* 箭头标记 */}
                    <marker
                        id="arrowhead"
                        markerWidth="10"
                        markerHeight="10"
                        refX="9"
                        refY="3"
                        orient="auto"
                        markerUnits="strokeWidth"
                    >
                        <path
                            d="M0,0 L0,6 L9,3 z"
                            fill="#b1b1b7"
                        />
                    </marker>
                    <marker
                        id="arrowclosed"
                        markerWidth="12"
                        markerHeight="12"
                        refX="6"
                        refY="6"
                        orient="auto"
                        markerUnits="strokeWidth"
                    >
                        <path
                            d="M 0 0 L 12 6 L 0 12 z"
                            fill="#b1b1b7"
                            stroke="#b1b1b7"
                            stroke-width="1"
                        />
                    </marker>
                    {/* 选中状态的箭头标记 */}
                    <marker
                        id="arrowhead-selected"
                        markerWidth="10"
                        markerHeight="10"
                        refX="9"
                        refY="3"
                        orient="auto"
                        markerUnits="strokeWidth"
                    >
                        <path
                            d="M0,0 L0,6 L9,3 z"
                            fill="#3b82f6"
                        />
                    </marker>
                    <marker
                        id="arrowclosed-selected"
                        markerWidth="12"
                        markerHeight="12"
                        refX="6"
                        refY="6"
                        orient="auto"
                        markerUnits="strokeWidth"
                    >
                        <path
                            d="M 0 0 L 12 6 L 0 12 z"
                            fill="#3b82f6"
                            stroke="#3b82f6"
                            stroke-width="1"
                        />
                    </marker>
                </defs>

                {/* 边 */}
                <For each={local.edges ?? []}>
                    {(edge) => {
                        const sourceNode = local.nodes.find((n) =>
                            n.id === edge.source
                        );
                        const targetNode = local.nodes.find((n) =>
                            n.id === edge.target
                        );
                        return (
                            <EdgeComponent
                                edge={edge}
                                sourceNode={sourceNode}
                                targetNode={targetNode}
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
                                            nodes: local.nodes.filter((n) =>
                                                selectedNodes().has(n.id)
                                            ),
                                            edges: (local.edges ?? []).filter((
                                                e,
                                            ) => newSet.has(e.id)),
                                        });
                                        return newSet;
                                    });
                                    local.onEdgesChange?.([
                                        {
                                            id: ed.id,
                                            type: "select",
                                            selected: !selectedEdges().has(
                                                ed.id,
                                            ),
                                        } as EdgeChange,
                                    ]);
                                }}
                            />
                        );
                    }}
                </For>
            </svg>

            {/* 节点 */}
            <div
                class="absolute inset-0 pointer-events-none"
                style={{
                    transform:
                        `translate(${currentViewport().x}px, ${currentViewport().y}px) scale(${currentViewport().zoom})`,
                    "transform-origin": "0 0",
                }}
            >
                <For each={local.nodes}>
                    {(node) => {
                        const NodeType = getNodeComponent(node);
                        return (
                            <div class="pointer-events-auto">
                                <NodeComponent
                                    node={node}
                                    selected={selectedNodes().has(node.id)}
                                    dragging={draggedNodeId() === node.id}
                                    onClick={(e, n) => handleNodeClick(e, n)}
                                    onMouseDown={(e, n) =>
                                        handleNodeMouseDown(e, n)}
                                    renderNode={NodeType
                                        ? (n) => <NodeType node={n} />
                                        : undefined}
                                />
                            </div>
                        );
                    }}
                </For>
            </div>

            {/* 临时连接线 */}
            <Show when={connectingNodeId() && connectingPosition()}>
                <svg
                    class="absolute inset-0 w-full h-full pointer-events-none z-50"
                    style={{
                        transform:
                            `translate(${currentViewport().x}px, ${currentViewport().y}px) scale(${currentViewport().zoom})`,
                        "transform-origin": "0 0",
                    }}
                >
                    {(() => {
                        const sourceNode = local.nodes.find((n) => n.id === connectingNodeId()!);
                        if (!sourceNode || !connectingPosition()) return null;
                        
                        const handleType = connectingHandleType();
                        const handleId = connectingHandleId();
                        const sourcePosition = handleType === 'source'
                            ? getNodeHandlePosition(sourceNode, handleId, 'right')
                            : getNodeHandlePosition(sourceNode, handleId, 'left');
                        const targetPosition = connectingPosition()!;
                        
                        const path = `M ${sourcePosition.x} ${sourcePosition.y} L ${targetPosition.x} ${targetPosition.y}`;
                        
                        return (
                            <path
                                d={path}
                                fill="none"
                                stroke="#b1b1b7"
                                stroke-width="2"
                                stroke-dasharray="5,5"
                                marker-end="url(#arrowhead)"
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
            />
        </div>
    );
};
