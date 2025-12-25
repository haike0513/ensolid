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
} from "solid-js";
import type {
    FlowProps,
    Node,
    NodeChange,
    Viewport,
    XYPosition,
} from "../../types";
import { clampZoom } from "../../utils";
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
    const [selectedNodes] = createSignal<Set<string>>(new Set());
    const [selectedEdges] = createSignal<Set<string>>(new Set());

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

    // 处理鼠标抬起
    const handleMouseUp = () => {
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
