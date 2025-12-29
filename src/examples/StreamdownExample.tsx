/**
 * Streamdown Markdown 渲染测试示例
 */

import type { Component } from "solid-js";
import { Streamdown } from "@ensolid/streamdown";

const testMarkdown = `# 标题 1

这是一个段落，包含**粗体**和*斜体*文本。

## 标题 2

### 列表

- 项目 1
- 项目 2
- 项目 3

### 代码块

\`\`\`javascript
function hello() {
  console.log("Hello, World!");
}
\`\`\`

### 链接和图片

这是一个[链接](https://example.com)。

### 表格

| 列1 | 列2 | 列3 |
|-----|-----|-----|
| 数据1 | 数据2 | 数据3 |
| 数据4 | 数据5 | 数据6 |

### 数学公式

行内公式：$E = mc^2$

块级公式：

$$
\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}
$$

### 引用

> 这是一个引用块
> 可以包含多行内容
`;

export const StreamdownExample: Component = () => {
  return (
    <div class="space-y-6">
      <div>
        <h2 class="text-2xl font-bold mb-4">Streamdown Markdown 渲染测试</h2>
        <div class="rounded-lg border p-6 bg-card">
          <Streamdown mode="static">{testMarkdown}</Streamdown>
        </div>
      </div>

      <div>
        <h3 class="text-xl font-semibold mb-2">流式模式测试</h3>
        <div class="rounded-lg border p-6 bg-card">
          <Streamdown mode="streaming">{testMarkdown}</Streamdown>
        </div>
      </div>
    </div>
  );
};
