# Resolid

一个用于完善 SolidJS 生态相关 UI 与工具库的项目。

## 📖 项目简介

Resolid 致力于将 React 生态系统中优秀的库和 UI 组件移植到 SolidJS 生态中，以丰富 SolidJS 的生态系统，为开发者提供更多可用的工具和组件。

## 🎯 项目目的

本项目的主要目的是：
- 将 React 生态中成熟的库和 UI 组件移植到 SolidJS
- 为 SolidJS 开发者提供更多可用的工具和组件选择
- 通过 AI 辅助加速移植过程

## ⚠️ 重要提示

**本项目使用 AI 完成移植工作，存在以下情况：**
- 代码可能不够完善，存在潜在问题
- 功能可能未完全测试
- API 可能与原库存在差异
- 性能优化可能不足

**请谨慎使用，建议在生产环境使用前进行充分测试。**

## 🛠️ 技术栈

- [SolidJS](https://www.solidjs.com/) - 响应式 UI 框架
- [TypeScript](https://www.typescriptlang.org/) - 类型安全
- [Vite](https://vite.dev/) - 构建工具
- [pnpm](https://pnpm.io/) - 包管理器

## 📦 安装

本项目使用 [pnpm](https://pnpm.io/) 作为包管理器。

首先确保已安装 pnpm：

```bash
npm install -g pnpm
```

然后安装项目依赖：

```bash
pnpm install
```

## 🚀 开发

### 开发模式

启动开发服务器：

```bash
pnpm dev
```

开发服务器将在 [http://localhost:5173](http://localhost:5173) 启动。

### 构建

构建生产版本：

```bash
pnpm build
```

构建产物将输出到 `dist` 目录，已进行生产优化和代码压缩。

### 预览

预览生产构建：

```bash
pnpm preview
```

## 📁 项目结构

```
resolid/
├── src/              # 源代码目录
│   ├── App.tsx       # 主应用组件
│   └── ...
├── public/           # 静态资源
├── package.json      # 项目配置
└── vite.config.ts    # Vite 配置
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

由于项目使用 AI 辅助移植，如果您发现任何问题或有改进建议，请随时反馈。

## 📚 相关资源

- [SolidJS 官网](https://www.solidjs.com/)
- [SolidJS Discord](https://discord.com/invite/solidjs)
- [Vite 文档](https://vite.dev/)

## 📄 许可证

待定
