# React 到 SolidJS 组件库移植规则

本文档定义了将 React 组件库移植到 SolidJS 的标准规则和最佳实践。

## 📋 目录

1. [基础语法转换](#基础语法转换)
2. [组件结构转换](#组件结构转换)
3. [状态管理转换](#状态管理转换)
4. [生命周期转换](#生命周期转换)
5. [事件处理转换](#事件处理转换)
6. [类型定义转换](#类型定义转换)
7. [项目结构规范](#项目结构规范)
8. [构建配置规范](#构建配置规范)
9. [依赖管理规范](#依赖管理规范)
10. [常见模式转换](#常见模式转换)
11. [SSR 适配规范](#ssr-适配规范)

---

## 基础语法转换

### JSX 属性转换

| React | SolidJS | 说明 |
|-------|---------|------|
| `className` | `class` | 使用 HTML 标准属性 |
| `htmlFor` | `for` | 使用 HTML 标准属性 |
| `onClick` | `onClick` | 事件处理保持不变 |
| `style={{...}}` | `style={{...}}` | 样式对象保持不变 |

### 条件渲染

**React:**
```tsx
{condition && <Component />}
{condition ? <A /> : <B />}
```

**SolidJS:**
```tsx
{condition() && <Component />}
<Show when={condition()} fallback={<B />}>
  <A />
</Show>
```

### 列表渲染

**React:**
```tsx
{items.map(item => <Item key={item.id} {...item} />)}
```

**SolidJS:**
```tsx
<For each={items()}>
  {(item) => <Item {...item} />}
</For>
```

---

## 组件结构转换

### 函数组件转换

**React:**
```tsx
import React from 'react';

interface Props {
  title: string;
  onClick?: () => void;
}

export function Button({ title, onClick }: Props) {
  return <button onClick={onClick}>{title}</button>;
}
```

**SolidJS:**
```tsx
import { Component } from 'solid-js';

interface ButtonProps {
  title: string;
  onClick?: () => void;
}

export const Button: Component<ButtonProps> = (props) => {
  return <button onClick={props.onClick}>{props.title}</button>;
};
```

### 组件 Props 访问

**React:**
```tsx
function Component({ prop1, prop2 }) {
  // 直接使用 prop1, prop2
}
```

**SolidJS:**
```tsx
const Component: Component<Props> = (props) => {
  // 使用 props.prop1, props.prop2
  // 如果 prop 是响应式的，使用 props.prop1()
};
```

---

## 状态管理转换

### useState 转换

**React:**
```tsx
const [count, setCount] = useState(0);
const [name, setName] = useState('');

// 使用
<div>{count}</div>
<button onClick={() => setCount(count + 1)}>+</button>
```

**SolidJS:**
```tsx
import { createSignal } from 'solid-js';

const [count, setCount] = createSignal(0);
const [name, setName] = createSignal('');

// 使用
<div>{count()}</div>
<button onClick={() => setCount(count() + 1)}>+</button>
```

### useRef 转换

**React:**
```tsx
const inputRef = useRef<HTMLInputElement>(null);
<input ref={inputRef} />
```

**SolidJS:**
```tsx
import { createSignal } from 'solid-js';

let inputRef: HTMLInputElement | undefined;
<input ref={inputRef} />
```

### useMemo 转换

**React:**
```tsx
const memoized = useMemo(() => expensive(a, b), [a, b]);
```

**SolidJS:**
```tsx
import { createMemo } from 'solid-js';

const memoized = createMemo(() => expensive(a(), b()));
```

### useCallback 转换

**React:**
```tsx
const callback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);
```

**SolidJS:**
```tsx
// SolidJS 不需要 useCallback，函数本身就是稳定的
const callback = () => {
  doSomething(a(), b());
};
```

---

## 生命周期转换

### useEffect 转换

**React:**
```tsx
useEffect(() => {
  // 副作用
  return () => {
    // 清理
  };
}, [deps]);
```

**SolidJS:**
```tsx
import { onMount, onCleanup, createEffect } from 'solid-js';

// 组件挂载
onMount(() => {
  // 初始化逻辑
  onCleanup(() => {
    // 清理逻辑
  });
});

// 响应式副作用
createEffect(() => {
  // 当 deps() 变化时执行
  const value = deps();
  // 副作用逻辑
});
```

### 组件挂载/卸载

**React:**
```tsx
useEffect(() => {
  // 挂载时执行
  return () => {
    // 卸载时执行
  };
}, []);
```

**SolidJS:**
```tsx
import { onMount, onCleanup } from 'solid-js';

onMount(() => {
  // 挂载时执行
  onCleanup(() => {
    // 卸载时执行
  });
});
```

---

## 事件处理转换

### 事件处理器

**React:**
```tsx
const handleClick = (e: React.MouseEvent) => {
  e.preventDefault();
  // ...
};
```

**SolidJS:**
```tsx
const handleClick = (e: MouseEvent) => {
  e.preventDefault();
  // ...
};
```

### 事件委托

SolidJS 的事件处理与 React 类似，但需要注意：
- 使用原生 DOM 事件类型
- 事件对象是原生 DOM 事件，不是 SyntheticEvent

---

## 类型定义转换

### Props 类型定义

**React:**
```tsx
import { FC } from 'react';

interface Props {
  title: string;
  count?: number;
}

export const Component: FC<Props> = ({ title, count = 0 }) => {
  // ...
};
```

**SolidJS:**
```tsx
import { Component } from 'solid-js';

interface ComponentProps {
  title: string;
  count?: number;
}

export const Component: Component<ComponentProps> = (props) => {
  const count = () => props.count ?? 0;
  // ...
};
```

### 子元素类型

**React:**
```tsx
interface Props {
  children: React.ReactNode;
}
```

**SolidJS:**
```tsx
import { JSX } from 'solid-js';

interface Props {
  children?: JSX.Element;
}
```

---

## 项目结构规范

### Monorepo 包结构

每个移植的组件库应遵循以下结构：

```
packages/
└── [package-name]/
    ├── src/
    │   ├── components/
    │   │   ├── ComponentName/
    │   │   │   ├── index.ts
    │   │   │   └── ComponentName.tsx
    │   │   └── index.ts
    │   └── index.ts
    ├── package.json
    ├── tsconfig.json
    └── dist/ (构建输出)
```

### 导出规范

**组件导出 (`src/components/index.ts`):**
```ts
export * from './ComponentName';
```

**包入口 (`src/index.ts`):**
```ts
export * from './components';
```

### 命名规范

- 包名：`@resolid/[original-name]` 或 `@resolid/[solid-name]`
- 组件名：使用 PascalCase
- 文件名：与组件名保持一致

---

## 构建配置规范

### TypeScript 配置

每个包的 `tsconfig.json` 应包含：

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "preserve",
    "jsxImportSource": "solid-js",
    "moduleResolution": "bundler",
    "strict": true,
    "declaration": true,
    "declarationMap": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

### Package.json 配置

```json
{
  "name": "@resolid/[package-name]",
  "version": "0.0.0",
  "type": "module",
  "main": "./dist/index.js",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  },
  "files": ["dist"],
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch"
  },
  "dependencies": {
    "solid-js": "^1.9.9"
  },
  "peerDependencies": {
    "solid-js": "^1.9.9"
  }
}
```

---

## 依赖管理规范

### 依赖分类

1. **dependencies**: 运行时必需的依赖（如 `solid-js`）
2. **peerDependencies**: 需要宿主环境提供的依赖（如 `solid-js`）
3. **devDependencies**: 开发时依赖（如 `typescript`）

### 依赖版本

- `solid-js`: `^1.9.9` (与根项目保持一致)
- `typescript`: `~5.8.3` (与根项目保持一致)

---

## 常见模式转换

### Context API 转换

**React:**
```tsx
const Context = createContext(defaultValue);
const value = useContext(Context);
```

**SolidJS:**
```tsx
import { createContext, useContext } from 'solid-js';

const Context = createContext(defaultValue);
const value = useContext(Context);
```

### 自定义 Hooks 转换

**React:**
```tsx
function useCustomHook() {
  const [state, setState] = useState();
  useEffect(() => { /* ... */ }, []);
  return { state, setState };
}
```

**SolidJS:**
```tsx
function createCustomHook() {
  const [state, setState] = createSignal();
  onMount(() => { /* ... */ });
  return { state, setState };
}
```

### 受控组件转换

**React:**
```tsx
<input value={value} onChange={(e) => setValue(e.target.value)} />
```

**SolidJS:**
```tsx
<input value={value()} onInput={(e) => setValue(e.currentTarget.value)} />
```

### 不受控组件转换

**React:**
```tsx
const ref = useRef<HTMLInputElement>(null);
<input ref={ref} defaultValue="initial" />
```

**SolidJS:**
```tsx
let ref: HTMLInputElement | undefined;
<input ref={ref} value="initial" />
```

### Portal 转换

**React:**
```tsx
import { createPortal } from 'react-dom';
createPortal(children, container);
```

**SolidJS:**
```tsx
import { Portal } from 'solid-js/web';
<Portal mount={container}>{children}</Portal>
```

### 错误边界转换

**React:**
```tsx
<ErrorBoundary>
  <Component />
</ErrorBoundary>
```

**SolidJS:**
```tsx
import { ErrorBoundary } from 'solid-js';
<ErrorBoundary fallback={(err) => <div>Error: {err.toString()}</div>}>
  <Component />
</ErrorBoundary>
```

---

## SSR 适配规范

### 基本原则

⚠️ **重要**: 所有移植的组件应尽可能适配 SSR（服务端渲染），或至少提供 SSR 兼容的配置选项。

### 环境检测

使用 `isServer` 检测运行环境：

```tsx
import { isServer } from 'solid-js/web';

const Component: Component<Props> = (props) => {
  // 仅在客户端执行的代码
  if (!isServer) {
    // 浏览器 API 调用
    window.addEventListener('resize', handleResize);
  }
  
  return <div>{props.children}</div>;
};
```

### 避免浏览器 API 直接调用

**❌ 错误示例:**
```tsx
const Component: Component<Props> = (props) => {
  // 在 SSR 中会报错
  const width = window.innerWidth;
  document.addEventListener('click', handler);
  
  return <div>Width: {width}</div>;
};
```

**✅ 正确示例:**
```tsx
import { isServer, onMount, onCleanup } from 'solid-js';

const Component: Component<Props> = (props) => {
  const [width, setWidth] = createSignal(0);
  
  onMount(() => {
    if (!isServer) {
      setWidth(window.innerWidth);
      const handleResize = () => setWidth(window.innerWidth);
      window.addEventListener('resize', handleResize);
      onCleanup(() => window.removeEventListener('resize', handleResize));
    }
  });
  
  return <div>Width: {width()}</div>;
};
```

### 动态导入客户端专用代码

对于仅在客户端需要的功能，使用动态导入：

```tsx
import { lazy, Show } from 'solid-js';
import { isServer } from 'solid-js/web';

// 仅在客户端加载
const ClientOnlyComponent = lazy(() => 
  import('./ClientOnlyComponent').then(m => ({ default: m.ClientOnlyComponent }))
);

const Component: Component<Props> = (props) => {
  return (
    <Show when={!isServer}>
      <ClientOnlyComponent />
    </Show>
  );
};
```

### Portal 的 SSR 处理

Portal 在 SSR 中需要特殊处理：

```tsx
import { Portal } from 'solid-js/web';
import { isServer } from 'solid-js/web';

const Modal: Component<ModalProps> = (props) => {
  // 在 SSR 中，Portal 会渲染到默认位置
  // 在客户端，会移动到指定容器
  return (
    <Show when={props.open}>
      <Portal mount={!isServer ? document.body : undefined}>
        <div class="modal">{props.children}</div>
      </Portal>
    </Show>
  );
};
```

### 事件监听器的 SSR 安全处理

所有事件监听器应在 `onMount` 中注册：

```tsx
import { onMount, onCleanup } from 'solid-js';

const Component: Component<Props> = (props) => {
  onMount(() => {
    if (!isServer) {
      const handler = () => { /* ... */ };
      document.addEventListener('click', handler);
      onCleanup(() => document.removeEventListener('click', handler));
    }
  });
  
  return <div>{props.children}</div>;
};
```

### localStorage/sessionStorage 的使用

存储 API 仅在客户端可用：

```tsx
import { createSignal, onMount } from 'solid-js';
import { isServer } from 'solid-js/web';

const Component: Component<Props> = (props) => {
  const [value, setValue] = createSignal<string | null>(null);
  
  onMount(() => {
    if (!isServer) {
      const stored = localStorage.getItem('key');
      setValue(stored);
    }
  });
  
  const saveValue = (newValue: string) => {
    if (!isServer) {
      localStorage.setItem('key', newValue);
      setValue(newValue);
    }
  };
  
  return <div>{value()}</div>;
};
```

### 第三方库的 SSR 兼容性

如果组件依赖第三方库，确保：

1. **检查库的 SSR 兼容性**
2. **使用动态导入包装不兼容的库**
3. **提供 SSR 降级方案**

```tsx
import { lazy, Show } from 'solid-js';
import { isServer } from 'solid-js/web';

// 不兼容 SSR 的库
const ThirdPartyComponent = lazy(() => 
  import('third-party-library').then(m => ({ default: m.Component }))
);

const Component: Component<Props> = (props) => {
  return (
    <>
      {/* SSR 降级内容 */}
      <Show when={isServer} fallback={<ThirdPartyComponent {...props} />}>
        <div>Loading...</div>
      </Show>
    </>
  );
};
```

### 样式注入的 SSR 处理

如果组件需要动态注入样式，确保 SSR 安全：

```tsx
import { onMount } from 'solid-js';
import { isServer } from 'solid-js/web';

const Component: Component<Props> = (props) => {
  onMount(() => {
    if (!isServer) {
      // 动态注入样式
      const style = document.createElement('style');
      style.textContent = '/* styles */';
      document.head.appendChild(style);
    }
  });
  
  return <div>{props.children}</div>;
};
```

### SSR 配置选项

为需要特殊 SSR 处理的组件提供配置选项：

```tsx
interface ComponentProps {
  children?: JSX.Element;
  /** 是否禁用 SSR，强制客户端渲染 */
  ssr?: boolean;
  /** SSR 降级内容 */
  ssrFallback?: JSX.Element;
}

const Component: Component<ComponentProps> = (props) => {
  const shouldRender = () => {
    if (props.ssr === false) {
      return !isServer;
    }
    return true;
  };
  
  return (
    <Show when={shouldRender()} fallback={props.ssrFallback}>
      {props.children}
    </Show>
  );
};
```

### SSR 测试建议

1. **使用 SolidStart 或类似框架测试 SSR**
2. **验证组件在服务端和客户端都能正常渲染**
3. **检查水合（hydration）过程无错误**
4. **确保没有浏览器 API 在服务端被调用**

---

## 注意事项

### 响应式访问

⚠️ **重要**: 在 SolidJS 中，所有响应式值（signals、props、memos）都需要通过函数调用访问：

```tsx
// ❌ 错误
<div>{count}</div>

// ✅ 正确
<div>{count()}</div>
```

### Props 解构

⚠️ **避免解构 props**，因为这会破坏响应式：

```tsx
// ❌ 错误 - 失去响应式
const Component = ({ title }: Props) => {
  return <div>{title}</div>;
};

// ✅ 正确
const Component: Component<Props> = (props) => {
  return <div>{props.title}</div>;
};
```

### 条件渲染性能

使用 `<Show>` 组件进行条件渲染，而不是三元运算符，以获得更好的性能：

```tsx
// ✅ 推荐
<Show when={condition()} fallback={<Fallback />}>
  <Content />
</Show>

// ⚠️ 可用但不推荐
{condition() ? <Content /> : <Fallback />}
```

### 列表渲染性能

使用 `<For>` 组件进行列表渲染，而不是 `map()`：

```tsx
// ✅ 推荐
<For each={items()}>
  {(item) => <Item {...item} />}
</For>

// ⚠️ 可用但不推荐
{items().map(item => <Item {...item} />)}
```

---

## 检查清单

移植组件时，请确保：

- [ ] 所有 `useState` 转换为 `createSignal`
- [ ] 所有 `useEffect` 转换为 `createEffect` 或 `onMount`
- [ ] 所有 `useMemo` 转换为 `createMemo`
- [ ] 所有 `useRef` 转换为变量引用
- [ ] 所有 `className` 转换为 `class`
- [ ] 所有响应式值通过函数调用访问
- [ ] Props 不解构，通过 `props.xxx` 访问
- [ ] 组件类型使用 `Component<Props>` 定义
- [ ] 条件渲染使用 `<Show>` 组件
- [ ] 列表渲染使用 `<For>` 组件
- [ ] TypeScript 配置正确（`jsxImportSource: "solid-js"`）
- [ ] Package.json 配置正确（导出、依赖等）
- [ ] 所有组件在 `components/index.ts` 中导出
- [ ] 包入口在 `src/index.ts` 中导出所有组件
- [ ] 组件适配 SSR 或提供 SSR 配置选项
- [ ] 所有浏览器 API 调用在 `onMount` 中或使用 `isServer` 检查
- [ ] 事件监听器在 `onMount` 中注册并在 `onCleanup` 中清理
- [ ] Portal 组件正确处理 SSR 场景
- [ ] localStorage/sessionStorage 等存储 API 仅在客户端使用

---

## 参考资料

- [SolidJS 官方文档](https://www.solidjs.com/)
- [SolidJS React 迁移指南](https://www.solidjs.com/docs/latest/api#react-comparison)
- [SolidJS JSX 指南](https://www.solidjs.com/docs/latest/guides/jsx)
- [SolidJS SSR 指南](https://www.solidjs.com/docs/latest/guides/server)
- [SolidStart 文档](https://start.solidjs.com/) (SSR 框架)

