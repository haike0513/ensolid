# 图表示例修复指南

## ✅ 已完成的工作

### 1. @ensolid/visx 包优化
- ✅ 移除了所有 d3 相关包的重新导出
- ✅ 新增了 13 个组件（Tooltip, Gradients, Axis, Shapes, Pattern, ClipPath）
- ✅ 配置了完整的 tree-shaking 支持
- ✅ 已成功构建包

### 2. 主项目依赖配置
- ✅ 添加了 d3 运行时依赖：
  - d3-array@^3.2.4
  - d3-hierarchy@^3.1.2
  - d3-scale@^4.0.2
  - d3-shape@^3.2.0
  - d3-time-format@^4.1.0

- ✅ 添加了 TypeScript 类型定义：
  - @types/d3-array
  - @types/d3-hierarchy
  - @types/d3-scale
  - @types/d3-shape
  - @types/d3-time-format

### 3. 已修复的图表文件
- ✅ WaterfallChart.tsx
- ✅ BarChart.tsx
- ✅ LineChart.tsx
- ✅ PieChart.tsx

## 📋 需要修复的图表文件列表

以下文件还需要修复导入（将 d3 函数从 `@ensolid/visx` 分离到各自的 d3 包）：

### 基础图表
1. AreaChart.tsx
2. MultiLineChart.tsx
3. DynamicLineChart.tsx
4. HorizontalBarChart.tsx
5. NegativeBarChart.tsx
6. StackedBarChart.tsx
7. StackedAreaChart.tsx

### 统计图表
8. BoxPlot.tsx
9. Histogram.tsx
10. CandlestickChart.tsx
11. BubbleChart.tsx
12. ScatterPlot.tsx

### 热力图和特殊图表
13. Heatmap.tsx
14. LollipopChart.tsx
15. MixedChart.tsx
16. PunchCardChart.tsx

### 饼图类
17. DonutChart.tsx
18. NightingaleChart.tsx
19. PolarBarChart.tsx
20. RadialBarChart.tsx

### 层级图表
21. TreemapChart.tsx
22. SunburstChart.tsx
23. CircularPackingChart.tsx
24. TreeChart.tsx
25. RadialTreeChart.tsx

### 流图和关系图
26. ThemeRiverChart.tsx
27. GraphChart.tsx
28. ParallelChart.tsx
29. RadarChart.tsx
30. SankeyChart.tsx

### 时间序列和其他
31. GanttChart.tsx
32. CalendarChart.tsx
33. BulletChart.tsx
34. PictorialBarChart.tsx
35. FunnelChart.tsx
36. GaugeChart.tsx
37. LiquidChart.tsx
38. WordCloudChart.tsx
39. StepLineChart.tsx

## 🔧 修复步骤（针对每个文件）

### 模式识别

原始导入（错误）：
```typescript
import { AxisBottom, scaleLinear, max, arc } from "@ensolid/visx";
```

修复后（正确）：
```typescript
import { AxisBottom } from "@ensolid/visx";
import { scaleLinear } from "d3-scale";
import { max } from "d3-array";
import { arc } from "d3-shape";
```

### d3 函数分类表

| 函数名 | 所属包 |
|--------|--------|
| scaleBand, scaleLinear, scaleTime, scaleOrdinal, scaleSqrt, scalePoint | d3-scale |
| max, min, extent, sum | d3-array |
| hierarchy, treemap, treemapSquarify, pack, tree, cluster, partition | d3-hierarchy |
| arc, area, line, stack, pie, curve*, stackOffset*, linkRadial, linkHorizontal | d3-shape |
| timeFormat, timeParse | d3-time-format |

### 快速修复命令（可选）

如果您想批量修复，可以使用以下脚本：

```bash
cd src/pages/charts

# 对于每个文件，手动检查并修复导入
# 或者使用查找替换功能
```

### 示例修复

以AreaChart.tsx为例：

**修复前：**
```typescript
import { AxisBottom, AxisLeft, Group, LinePath, Area, curveMonotoneX, extent, scaleLinear, max, GridRows } from "@ensolid/visx";
```

**修复后：**
```typescript
import { AxisBottom, AxisLeft, Group, LinePath, Area, GridRows } from "@ensolid/visx";
import { scaleLinear } from "d3-scale";
import { extent, max } from "d3-array";
import { curveMonotoneX } from "d3-shape";
```

## 🚀 测试修复

修复后，运行以下命令测试：

```bash
# 构建visx包
pnpm --filter @ensolid/visx build

# 构建主项目
pnpm build

# 或启动开发服务器
pnpm dev
```

## ✨ 新组件使用示例

### 使用新的 Tooltip 组件

```typescript
import { createSignal } from 'solid-js';
import { Tooltip } from '@ensolid/visx';

const [showTooltip, setShowTooltip] = createSignal(false);
const [tooltipData, setTooltipData] = createSignal({ x: 0, y: 0 });

// 在 JSX 中
{showTooltip() && (
  <Tooltip left={tooltipData().x} top={tooltipData().y}>
    提示内容
  </Tooltip>
)}
```

### 使用渐变

```typescript
import { LinearGradient } from '@ensolid/visx';

<svg>
  <LinearGradient
    id="gradient1"
    from="#667eea"
    to="#764ba2"
    vertical={true}
  />
  <rect fill="url(#gradient1)" />
</svg>
```

## 📝 注意事项

1. **所有图表都需要直接从 d3 包导入 d3 函数**
2. **只从 @ensolid/visx 导入 visx 组件**
3. **TypeScript 类型已经配置好**，导入时会有正确的类型提示
4. **不要尝试从 @ensolid/visx 导入任何 d3 函数**，这会导致编译错误

##  🎯 下一步

1. 逐个修复图表文件的导入
2. 测试每个图表是否正常工作
3. 如遇到问题，参考已修复的示例文件（BarChart, LineChart, PieChart, WaterfallChart）

## 💡 提示

- 使用 IDE 的自动导入功能可以更快速
- 确保从正确的包导入（查看上面的分类表）
- 如果不确定某个函数属于哪个包，可以查看 `packages/visx/package.json` 中的 dependencies
