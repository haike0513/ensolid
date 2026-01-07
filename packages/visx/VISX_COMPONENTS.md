# @ensolid/visx 组件移植总结

## 📦 已移植的 visx 组件

### 基础组件 (已有)
- ✅ **Group** - SVG 分组组件
- ✅ **Text** - SVG 文本组件

### 形状组件 (Shapes)
- ✅ **Bar** - 柱状图条形
- ✅ **LinePath** - 线条路径
- ✅ **Area** - 面积图
- ✅ **Arc** - 弧形
- ✅ **Pie** - 饼图
- 🆕 **Circle** - 圆形
- 🆕 **Line** - 直线

### 坐标轴组件 (Axes)
- ✅ **AxisBottom** - 底部坐标轴
- ✅ **AxisLeft** - 左侧坐标轴
- 🆕 **AxisTop** - 顶部坐标轴
- 🆕 **AxisRight** - 右侧坐标轴

### 网格组件 (Grid)
- ✅ **GridRows** - 水平网格线
- ✅ **GridColumns** - 垂直网格线

### 提示组件 (Tooltip)
- 🆕 **Tooltip** - 提示框组件，支持自定义样式和位置

### 渐变组件 (Gradients)
- 🆕 **LinearGradient** - 线性渐变
- 🆕 **RadialGradient** - 径向渐变

### 图案组件 (Pattern)
- 🆕 **Pattern** - SVG 图案定义

### 裁剪路径组件 (ClipPath)
- 🆕 **ClipPath** - 基础裁剪路径
- 🆕 **CircleClipPath** - 圆形裁剪路径
- 🆕 **RectClipPath** - 矩形裁剪路径

## 📝 重要变更

### 移除 D3 重新导出
按照要求，**包内不再重新导出 d3 相关的包**。用户需要直接从 d3 包导入：

```typescript
// ❌ 旧方式 (已移除)
import { scaleLinear } from '@ensolid/visx';

// ✅ 新方式
import { scaleLinear } from 'd3-scale';
import { Bar } from '@ensolid/visx';
```

### Tree-shaking 支持
所有组件都支持独立导入，实现最佳的 tree-shaking：

```typescript
// 完整导入
import { Tooltip, LinearGradient } from '@ensolid/visx';

// 独立导入（推荐，更好的 tree-shaking）
import { Tooltip } from '@ensolid/visx/Tooltip';
import { LinearGradient } from '@ensolid/visx/LinearGradient';
```

## 🎯 使用示例

### Tooltip 示例
```typescript
import { createSignal } from 'solid-js';
import { Tooltip } from '@ensolid/visx/Tooltip';

function Chart() {
  const [tooltipData, setTooltipData] = createSignal({ x: 0, y: 0, value: '' });
  const [showTooltip, setShowTooltip] = createSignal(false);

  return (
    <>
      <svg>{/* 图表内容 */}</svg>
      {showTooltip() && (
        <Tooltip
          top={tooltipData().y}
          left={tooltipData().x}
        >
          {tooltipData().value}
        </Tooltip>
      )}
    </>
  );
}
```

### LinearGradient 示例
```typescript
import { LinearGradient } from '@ensolid/visx/LinearGradient';
import { Bar } from '@ensolid/visx/Bar';

function GradientChart() {
  return (
    <svg width={400} height={300}>
      <LinearGradient
        id="gradient"
        from="#ff6b6b"
        to="#4ecdc4"
        vertical={true}
      />
      <Bar
        x={50}
        y={50}
        width={300}
        height={200}
        fill="url(#gradient)"
      />
    </svg>
  );
}
```

### ClipPath 示例
```typescript
import { CircleClipPath } from '@ensolid/visx/CircleClipPath';

function ClippedChart() {
  return (
    <svg width={400} height={400}>
      <CircleClipPath id="clip-circle" cx={200} cy={200} r={150} />
      <image
        href="/chart.png"
        width={400}
        height={400}
        clip-path="url(#clip-circle)"
      />
    </svg>
  );
}
```

### 完整坐标轴示例
```typescript
import { scaleLinear } from 'd3-scale';
import { AxisBottom, AxisLeft, AxisTop, AxisRight } from '@ensolid/visx';

function FullAxesChart() {
  const xScale = scaleLinear({ domain: [0, 100], range: [0, 400] });
  const yScale = scaleLinear({ domain: [0, 100], range: [400, 0] });

  return (
    <svg width={500} height={500}>
      <g transform="translate(50, 50)">
        {/* 四个方向的坐标轴 */}
        <AxisBottom scale={xScale} top={400} />
        <AxisTop scale={xScale} />
        <AxisLeft scale={yScale} />
        <AxisRight scale={yScale} left={400} />
      </g>
    </svg>
  );
}
```

## 📊 组件统计

- **总计**: 23 个组件
- **新增**: 13 个组件
- **已有**: 10 个组件

## 🚀 后续可移植的组件

根据 visx 包列表，以下组件可以在后续继续移植：

### 高优先级
1. **Legend** (visx-legend) - 图例组件
2. **Annotation** (visx-annotation) - 注释组件
3. **Marker** (visx-marker) - 标记组件
4. **Responsive** (visx-responsive) - 响应式容器

### 中等优先级
5. **Glyph** (visx-glyph) - 符号组件
6. **Brush** (visx-brush) - 刷选组件
7. **Zoom** (visx-zoom) - 缩放组件
8. **Voronoi** (visx-voronoi) - Voronoi 图组件

### 低优先级
9. **Hierarchy** (visx-hierarchy) - 层级图组件
10. **Network** (visx-network) - 网络图组件
11. **Sankey** (visx-sankey) - 桑基图组件
12. **Heatmap** (visx-heatmap) - 热力图组件

## ⚡ 性能优化

所有组件都已经：
- ✅ 配置了 `sideEffects: false`
- ✅ 使用 `preserveModules: true` 构建
- ✅ 提供了细粒度的 `exports` 字段
- ✅ 支持 tree-shaking

## 📝 注意事项

1. **不要从 @ensolid/visx 导入 d3 函数**，请直接从对应的 d3 包导入
2. **推荐使用独立导入**以获得最佳的打包体积
3. **所有组件都是 SolidJS 组件**，使用 SolidJS 的响应式系统而非 React
4. **组件 API 尽量保持与原 visx 一致**，但使用 SolidJS 的命名约定（如 `class` 而非 `className`）

## 🔗 相关链接

- [visx 官方文档](https://airbnb.io/visx/)
- [visx GitHub](https://github.com/airbnb/visx)
- [SolidJS 文档](https://www.solidjs.com/)
