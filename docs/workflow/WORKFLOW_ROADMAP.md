# Ensolid Workflow 路线图

本文档规划了 Ensolid Workflow 工具链的建设路线图，旨在打造一个强大的、可视化的、可扩展的 AI Agent 工作流编排平台。

## 🌟 愿景
构建一个类似 ComfyUI 或 LangFlow 的可视化工作流编排引擎，专注于 AI Agent 的构建、调试和部署。基于 SolidFlow 提供高性能的可视化交互。

## 🗺️ 阶段规划

### 第一阶段：核心引擎与基础可视化（当前阶段）
**目标**：构建稳定的工作流执行引擎和基础编辑器。

- [x] **SolidFlow 基础**：完成节点拖拽、连线、缩放等画布基础功能。
- [x] **Executor 引擎**：
    - [x] DAG 拓扑排序与环检测。
    - [x] 异步任务调度。
    - [x] 数据流转机制 (Inputs/Outputs)。
- [x] **基础 UI 组件**：
    - [x] ExecutorPanel (执行状态与日志)。
    - [x] PropertyPanel (属性编辑)。
    - [x] 侧边栏与工具栏。


### 第二阶段：节点生态与插件系统（高优先级）
**目标**：丰富内置节点，建立插件机制，支持第三方扩展。

- [x] **插件系统架构**：
    - [x] 定义标准的 Node Manifest (JSON/YAML) - `NodeDefinition` with inputs/outputs/execute.
    - [ ] 支持动态加载自定义节点组件。

- [ ] **核心节点库**：
    - [ ] **LLM 节点**：支持 OpenAI, Anthropic, Gemini, Ollama 等模型调用。
    - [ ] **Tool 节点**：Web Search, Calculator, Shell Command, API Request。
    - [ ] **RAG 节点**：Vector Store Query, Document Loader, Text Splitter。
    - [ ] **Logic 节点**：If/Else, Loop, Switch, Merge, Delay。
    - [ ] **Input/Output**：Chat Input, Text Output, File Upload, Image Display。
- [ ] **模板市场**：
    - [ ] 支持导入/导出 Workflow JSON。
    - [ ] 内置常用 Agent 模板（如 Researcher, Writer, Coder）。

### 第三阶段：高级调试与可视化（中优先级）
**目标**：提供类似 IDE 的调试体验。

- [ ] **可视化调试**：
    - [ ] 断点调试 (Breakpoints)。
    - [ ] 逐步执行 (Step-by-step Execution)。
    - [ ] 数据流探针 (Data Probe)：鼠标悬停连线查看流动的数据。
    - [ ] 状态快照与回溯 (Time Travel)。
- [ ] **高级面板**：
    - [ ] Trace Panel：完整的执行链路追踪。
    - [ ] Cost Panel：Token 消耗与成本估算。
    - [ ] Variable Panel：全局变量管理。

### 第四阶段：部署与服务化（长期目标）
**目标**：将 Workflow 转化为可服务的 API。

- [ ] **Workflow as API**：
    - [ ] 一键生成 REST API Endpoint。
    - [ ] 支持 WebSocket 流式输出。
- [ ] **Serverless 部署**：
    - [ ] 支持将 Workflow 编译为 Edge Function。
- [ ] **监控与运维**：
    - [ ] 执行历史记录。
    - [ ] 性能监控与报警。

## 🧩 详细功能清单

### 1. 执行引擎增强
- **并行执行**：优化并发调度策略，支持 worker 线程池。
- **流式传输 (Streaming)**：支持 LLM 的 token 流式逐字输出，并在节点上实时打字机显示。
- **状态持久化**：支持暂停/恢复执行，将执行状态序列化存储。

### 2. 编辑器增强 (SolidFlow)
- **节点自动布局**：主要用于导入复杂 JSON 后的自动整理。
- **智能连线**：自动避障的连线算法。
- **子流程 (Sub-flow)**：支持将一部分图封装为一个 Group Node，支持嵌套编辑。

### 3. 数据处理
- **结构化数据**：支持 JSON Schema 定义输入输出，编辑器自动生成对应的 Form 表单。
- **多媒体支持**：原生支持 Image, Audio, Video 数据流转与预览。
- **代码节点**：内置 JS/Python 解释器（WebAssembly），允许用户编写简单的胶水代码。

## 📅 实施计划建议

1.  **完善类型系统**：为 Node 和 Edge 的 data 定义严格的 TypeScript 类型，确保数据流转的类型安全。
2.  **实现 LLM 节点**：优先接入一个主流模型，打通 Prompt -> LLM -> Output 的完整链路。
3.  **实现代码节点**：利用 QuickJS 或 Pyodide 实现浏览器端的沙箱代码执行。
4.  **优化 UX**：增加更多快捷键，优化连线吸附体验，美化节点样式。
