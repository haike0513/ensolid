# @resolid/solidflow

SolidJS 版本的流程图组件库，移植自 [xyflow/react](https://github.com/xyflow/xyflow)。

## 安装

```bash
pnpm add @resolid/solidflow
```

## 使用

```tsx
import { Flow, DefaultNode } from '@resolid/solidflow';
import { createSignal } from 'solid-js';

function App() {
  const [nodes, setNodes] = createSignal([
    {
      id: '1',
      type: 'default',
      position: { x: 0, y: 0 },
      data: { label: '节点 1' },
    },
    {
      id: '2',
      type: 'default',
      position: { x: 200, y: 200 },
      data: { label: '节点 2' },
    },
  ]);

  const [edges, setEdges] = createSignal([
    {
      id: 'e1-2',
      source: '1',
      target: '2',
    },
  ]);

  return (
    <div style="width: 100vw; height: 100vh">
      <Flow
        nodes={nodes()}
        edges={edges()}
        onNodesChange={(changes) => {
          // 处理节点变化
        }}
        onEdgesChange={(changes) => {
          // 处理边变化
        }}
      />
    </div>
  );
}
```

## 组件

### Flow

主要的流程图组件。

**Props:**
- `nodes`: 节点数组
- `edges`: 边数组
- `onNodesChange`: 节点变化回调
- `onEdgesChange`: 边变化回调
- `onConnect`: 连接回调
- `onConnectStart`: 连接开始回调
- `onConnectEnd`: 连接结束回调
- `nodeTypes`: 自定义节点类型
- `edgeTypes`: 自定义边类型
- `fitView`: 是否自动适配视图
- `nodesDraggable`: 节点是否可拖拽
- `nodesConnectable`: 节点是否可连接
- 更多配置项请参考类型定义

### Node

节点组件，用于渲染单个节点。

### Edge

边组件，用于渲染连接线。支持以下边类型：
- `default` / `simplebezier`: 简单贝塞尔曲线（默认）
- `bezier`: 贝塞尔曲线
- `straight`: 直线
- `smoothstep` / `step`: 平滑步进路径

### Handle

连接点组件，用于节点之间的连接。

**Props:**
- `type`: 'source' | 'target'
- `position`: 'top' | 'bottom' | 'left' | 'right'
- `id`: Handle ID
- `nodeId`: 节点 ID（用于连接）
- `connectable`: 是否可连接

### Background

背景组件，提供网格或点状背景。

### Controls

控制按钮组件，提供缩放、适合视图等功能。

### MiniMap

小地图组件，显示整个流程图的缩略图。

### Panel

面板组件，用于在画布上放置自定义内容。

### FlowProvider

Context Provider，为 Flow 组件提供上下文，支持 Hooks API。

## Hooks

### useNodes

获取节点数组和更新函数。

```tsx
const [nodes, setNodes] = useNodes();
```

### useEdges

获取边数组和更新函数。

```tsx
const [edges, setEdges] = useEdges();
```

### useReactFlow

获取 ReactFlow 实例，提供各种操作 Flow 的方法。

```tsx
const reactFlowInstance = useReactFlow();
```

## 工具函数

### applyNodeChanges

应用节点变化。

```tsx
const newNodes = applyNodeChanges(changes, nodes);
```

### applyEdgeChanges

应用边变化。

```tsx
const newEdges = applyEdgeChanges(changes, edges);
```

### addEdge

添加边。

```tsx
const newEdges = addEdge(connection, edges);
```

### 路径计算函数

- `getStraightPath`: 获取直线路径
- `getBezierPath`: 获取贝塞尔曲线路径
- `getSimpleBezierPath`: 获取简单贝塞尔曲线路径
- `getSmoothStepPath`: 获取平滑步进路径

## 特性

### 核心功能
- ✅ 节点和边的渲染
- ✅ 节点拖拽
- ✅ 画布平移和缩放
- ✅ 连接点（Handle）和连接功能
- ✅ 背景网格
- ✅ 控制按钮
- ✅ 小地图
- ✅ 自定义节点和边类型

### 高级功能
- ✅ 多种边路径类型（直线、贝塞尔曲线、平滑步进）
- ✅ 边标记（箭头）支持
- ✅ 状态管理工具函数（applyNodeChanges, applyEdgeChanges, addEdge）
- ✅ FlowProvider Context 和 Hooks API
- ✅ 连接事件处理（onConnectStart, onConnectEnd, onConnect）
- ✅ 选择和多选功能
- ✅ 视图适配（fitView）

## 开发状态

⚠️ 本项目仍在开发中，API 可能会有变化。

## 许可证

MIT


