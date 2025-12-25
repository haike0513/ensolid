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

### Node

节点组件，用于渲染单个节点。

### Edge

边组件，用于渲染连接线。

### Handle

连接点组件，用于节点之间的连接。

### Background

背景组件，提供网格或点状背景。

### Controls

控制按钮组件，提供缩放、适合视图等功能。

### MiniMap

小地图组件，显示整个流程图的缩略图。

### Panel

面板组件，用于在画布上放置自定义内容。

## 特性

- ✅ 节点和边的渲染
- ✅ 节点拖拽
- ✅ 画布平移和缩放
- ✅ 连接点（Handle）
- ✅ 背景网格
- ✅ 控制按钮
- ✅ 小地图
- ✅ 自定义节点和边类型

## 开发状态

⚠️ 本项目仍在开发中，API 可能会有变化。

## 许可证

MIT


