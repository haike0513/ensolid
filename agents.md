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

- 包名：`@ensolid/[original-name]` 或 `@ensolid/[solid-name]`
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
  "name": "@ensolid/[package-name]",
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

**特殊情况：**
- 在 JSX 属性中，如果 prop 是响应式的，也需要使用函数调用：`class={props.class?.() ?? ''}`
- 在条件判断中，使用 `Show` 组件而不是直接访问：`<Show when={condition()}>`

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

**使用 splitProps 分离 props：**
```tsx
// ✅ 推荐方式 - 使用 splitProps 分离需要特殊处理的 props
const Component: Component<Props> = (props) => {
  const [local, others] = splitProps(props, ['class', 'style', 'children']);
  return <div class={local.class} {...others}>{local.children}</div>;
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

### 类型导入规范

⚠️ **重要**: 使用 `import type` 导入类型，避免运行时导入：

```tsx
// ✅ 正确 - 类型导入
import type { Component } from 'solid-js';
import { createSignal } from 'solid-js';

// ❌ 错误 - 可能导致运行时错误
import { Component, createSignal } from 'solid-js';
```

### 子组件导出规范

当组件有子组件时，使用类型断言或 Object.assign：

```tsx
// 方式 1: 类型断言（推荐）
(Component as any).SubComponent = SubComponent;

// 方式 2: Object.assign
Object.assign(Component, {
  SubComponent,
});

// 使用
<Component>
  <Component.SubComponent />
</Component>
```

### 事件处理器类型规范

使用 `JSX.EventHandler` 类型定义事件处理器：

```tsx
// ✅ 正确
const handleClick: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (e) => {
  e.preventDefault();
  // 处理逻辑
};

// 在 props 中定义
interface ButtonProps {
  onClick?: JSX.EventHandler<HTMLButtonElement, MouseEvent>;
}
```

### 样式处理规范

⚠️ **避免使用对象形式的 style**，使用字符串形式：

```tsx
// ❌ 可能导致类型错误
<div style={{ color: 'red', fontSize: '14px' }} />

// ✅ 推荐使用字符串
<div style="color: red; font-size: 14px;" />

// ✅ 或者使用动态字符串
<div style={`color: ${color()}; font-size: ${size()}px;`} />
```

### splitProps 使用规范

使用 `as const` 断言确保类型安全：

```tsx
// ✅ 正确
const [local, others] = splitProps(props, ['class', 'children'] as const);

// ❌ 可能导致类型错误
const [local, others] = splitProps(props, ['class', 'children']);
```

### 受控/非受控组件模式

实现受控和非受控两种模式：

```tsx
interface ComponentProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

const Component: Component<ComponentProps> = (props) => {
  const [local, others] = splitProps(props, ['value', 'defaultValue', 'onValueChange']);
  
  const [internalValue, setInternalValue] = createSignal(
    local.value ?? local.defaultValue ?? ''
  );
  
  const isControlled = () => local.value !== undefined;
  const value = () => (isControlled() ? local.value! : internalValue());
  
  const handleChange = (newValue: string) => {
    if (!isControlled()) {
      setInternalValue(newValue);
    }
    local.onValueChange?.(newValue);
  };
  
  return (
    <input
      value={value()}
      onInput={(e) => handleChange(e.currentTarget.value)}
      {...others}
    />
  );
};
```

### Context 使用规范

创建和使用 Context 的标准模式：

```tsx
// 1. 定义 Context 接口
interface ComponentContextValue {
  value: () => string;
  setValue: (value: string) => void;
}

// 2. 创建 Context
const ComponentContext = createContext<ComponentContextValue>();

// 3. 创建 Hook（可选，但推荐）
export const useComponentContext = () => {
  const context = useContext(ComponentContext);
  if (!context) {
    throw new Error('Component must be used within Component');
  }
  return context;
};

// 4. 在父组件中提供 Context
export const Component: Component<ComponentProps> = (props) => {
  const [value, setValue] = createSignal('');
  
  const contextValue: ComponentContextValue = {
    value,
    setValue,
  };
  
  return (
    <ComponentContext.Provider value={contextValue}>
      {props.children}
    </ComponentContext.Provider>
  );
};

// 5. 在子组件中使用 Context
export const ComponentItem: Component<ComponentItemProps> = (props) => {
  const context = useComponentContext();
  // 使用 context.value(), context.setValue()
};
```

### Portal 使用规范

Portal 必须检查 `isServer`：

```tsx
import { Portal } from 'solid-js/web';
import { isServer } from 'solid-js/web';
import { Show } from 'solid-js';

const Modal: Component<ModalProps> = (props) => {
  return (
    <Show when={props.open}>
      <Portal mount={!isServer ? document.body : undefined}>
        <div class="modal">{props.children}</div>
      </Portal>
    </Show>
  );
};
```

### 事件监听器清理规范

所有事件监听器必须在 `onMount` 中注册，在 `onCleanup` 中清理：

```tsx
import { onMount, onCleanup } from 'solid-js';
import { isServer } from 'solid-js/web';

const Component: Component<Props> = (props) => {
  onMount(() => {
    if (!isServer) {
      const handleResize = () => {
        // 处理逻辑
      };
      
      window.addEventListener('resize', handleResize);
      
      onCleanup(() => {
        window.removeEventListener('resize', handleResize);
      });
    }
  });
  
  return <div>{props.children}</div>;
};
```

### 动态导入规范

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
    <Show when={!isServer} fallback={<div>Loading...</div>}>
      <ClientOnlyComponent {...props} />
    </Show>
  );
};
```

### asChild 属性实现规范

⚠️ **重要**: `asChild` 是 Radix UI 的特殊属性，用于将组件的功能传递给子元素。只有需要这种"功能传递"模式的组件才应该实现 `asChild`。

**何时需要实现 asChild**:
- Radix 基础组件的 Trigger 子组件（如 `Dialog.Trigger`、`Popover.Trigger` 等）
- 需要将点击事件、ARIA 属性等功能传递给子元素的组件

**何时不需要实现 asChild**:
- 普通的 UI 组件（如 `Button`、`Card`、`Input` 等）
- 不需要功能传递的组件

**实现 asChild 的标准模式**:

```tsx
import type { Component, JSX } from 'solid-js';
import { splitProps, children } from 'solid-js';

interface TriggerProps {
  asChild?: boolean;
  children?: JSX.Element;
  onClick?: JSX.EventHandler<HTMLElement, MouseEvent>;
  // ... 其他 props
}

export const Trigger: Component<TriggerProps> = (props) => {
  const [local, others] = splitProps(props, ['asChild', 'children', 'onClick']);
  
  const handleClick: JSX.EventHandler<HTMLElement, MouseEvent> = (e) => {
    // 触发组件的功能逻辑
    // 例如：打开对话框、显示弹出层等
    
    // 调用用户提供的 onClick
    if (typeof local.onClick === 'function') {
      local.onClick(e);
    }
  };
  
  // 如果 asChild 为 true，将功能传递给子元素
  if (local.asChild) {
    const child = children(() => local.children);
    const childElement = child() as JSX.Element & {
      props: Record<string, any>;
    };
    
    // 合并 props 到子元素
    return {
      ...childElement,
      props: {
        ...childElement.props,
        onClick: handleClick,
        // 添加其他需要的 props（如 ARIA 属性）
        'aria-expanded': open(),
        'data-state': open() ? 'open' : 'closed',
        ...others,
      },
    } as JSX.Element;
  }
  
  // 否则正常渲染组件
  return (
    <button onClick={handleClick} {...others}>
      {local.children}
    </button>
  );
};
```

**注意事项**:
1. 使用 `splitProps` 分离 `asChild` 和其他 props
2. 使用 `children()` 获取子元素
3. 当 `asChild` 为 true 时，需要将功能 props（如 `onClick`、ARIA 属性）合并到子元素
4. 确保类型安全，使用类型断言处理子元素
5. 如果原 React 组件支持 `asChild`，移植时必须实现此功能，否则会导致类型错误

**常见错误**:
- ❌ 在普通 UI 组件上使用 `asChild` 属性
- ❌ 忘记在 `asChild` 模式下合并功能 props 到子元素
- ❌ 类型定义中缺少 `asChild?: boolean`

详细错误说明请参考"常见错误和解决方案"中的"错误 9: asChild 属性使用错误"章节。

---

## 检查清单

移植组件时，请确保：

### 基础转换
- [ ] 所有 `useState` 转换为 `createSignal`
- [ ] 所有 `useEffect` 转换为 `createEffect` 或 `onMount`
- [ ] 所有 `useMemo` 转换为 `createMemo`
- [ ] 所有 `useRef` 转换为变量引用
- [ ] 所有 `className` 转换为 `class`
- [ ] 所有响应式值通过函数调用访问（如 `value()`）
- [ ] Props 不解构，通过 `props.xxx` 或 `splitProps` 访问
- [ ] 组件类型使用 `Component<Props>` 定义

### 渲染优化
- [ ] 条件渲染使用 `<Show>` 组件
- [ ] 列表渲染使用 `<For>` 组件
- [ ] 避免在渲染函数中直接调用副作用

### 配置和导出
- [ ] TypeScript 配置正确（`jsxImportSource: "solid-js"`）
- [ ] Package.json 配置正确（导出、依赖等）
- [ ] 所有组件在 `components/index.ts` 中导出
- [ ] 包入口在 `src/index.ts` 中导出所有组件
- [ ] shadcn/ui 包装在 `components/ui/index.ts` 中导出

### SSR 兼容性
- [ ] 组件适配 SSR 或提供 SSR 配置选项
- [ ] 所有浏览器 API 调用在 `onMount` 中或使用 `isServer` 检查
- [ ] 事件监听器在 `onMount` 中注册并在 `onCleanup` 中清理
- [ ] Portal 组件正确处理 SSR 场景（`mount={!isServer ? document.body : undefined}`）
- [ ] localStorage/sessionStorage 等存储 API 仅在客户端使用

### 样式和类型
- [ ] 样式对象使用字符串形式避免 TypeScript 类型问题
- [ ] 使用 `cn()` 函数合并 Tailwind CSS 类名
- [ ] 事件处理函数使用 `JSX.EventHandler` 类型
- [ ] 使用 `import type` 导入类型定义
- [ ] 子组件使用类型断言或 Object.assign 导出

### 示例和文档
- [ ] 创建示例组件展示基本用法
- [ ] 在 `examples/index.ts` 中导出示例
- [ ] 在 `App.tsx` 中添加示例到导航
- [ ] 在 `i18n/locales` 中添加翻译文本

---

## 实际移植案例：Radix UI Primitives

### 移植概述

本项目成功将 Radix UI Primitives 从 React 移植到 SolidJS，创建了 `@ensolid/radix` 包，并在此基础上实现了 shadcn/ui 风格的组件库。

### 当前项目状态（2024年更新）

#### 移植进度
- ✅ **已完成**: 25 个 Radix UI Primitives 组件
- ✅ **shadcn/ui 包装**: 所有组件都有对应的 shadcn/ui 风格包装
- ✅ **示例代码**: 所有组件都有完整的示例展示
- ✅ **国际化支持**: 中英文双语支持
- ✅ **构建系统**: 完整的 TypeScript 类型定义和构建配置

#### 组件分类统计
- **基础组件**: 4 个（Separator, Label, AspectRatio, VisuallyHidden）
- **表单组件**: 7 个（Checkbox, Switch, RadioGroup, Select, Slider, Toggle, ToggleGroup）
- **布局组件**: 4 个（Tabs, Accordion, Collapsible, ScrollArea）
- **弹出层组件**: 8 个（Dialog, AlertDialog, Popover, DropdownMenu, Tooltip, HoverCard, ContextMenu, Menubar）
- **其他组件**: 2 个（Progress, Avatar）

#### 待移植组件
- ⏳ **Navigation Menu** - 导航菜单组件（复杂组件，需要更多时间实现）
- ⏳ **Toast** - 提示消息组件（需要 Provider 支持）
- ⏳ **Form** - 表单组件（需要表单验证集成）

### 已移植的组件列表（25个）

#### 基础组件
1. **Separator** - 分隔线组件
2. **Label** - 标签组件
3. **AspectRatio** - 宽高比组件（用于保持元素宽高比）
4. **VisuallyHidden** - 视觉隐藏组件（辅助功能，屏幕阅读器可见）

#### 表单组件
5. **Checkbox** - 复选框组件
6. **Switch** - 开关组件
7. **RadioGroup** - 单选组组件（包含 RadioGroup.Item）
8. **Select** - 选择器组件（包含 Select.Trigger, Select.Value, Select.Content, Select.Item）
9. **Slider** - 滑块组件
10. **Toggle** - 切换按钮组件
11. **ToggleGroup** - 切换组组件（包含 ToggleGroup.Item，支持单选和多选模式）

#### 布局组件
12. **Tabs** - 标签页组件（包含 Tabs.List, Tabs.Trigger, Tabs.Content）
13. **Accordion** - 手风琴组件（包含 Accordion.Item, Accordion.Trigger, Accordion.Content）
14. **Collapsible** - 可折叠组件（包含 Collapsible.Trigger, Collapsible.Content）
15. **ScrollArea** - 滚动区域组件（包含 ScrollArea.Viewport, ScrollArea.Scrollbar, ScrollArea.Thumb, ScrollArea.Corner）

#### 弹出层组件
16. **Dialog** - 对话框组件（包含 Dialog.Trigger, Dialog.Content, Dialog.Title, Dialog.Description, Dialog.Close）
17. **AlertDialog** - 警告对话框组件（包含 AlertDialog.Trigger, AlertDialog.Content, AlertDialog.Title, AlertDialog.Description, AlertDialog.Action, AlertDialog.Cancel）
18. **Popover** - 弹出框组件（包含 Popover.Trigger, Popover.Content）
19. **DropdownMenu** - 下拉菜单组件（包含 DropdownMenu.Trigger, DropdownMenu.Content, DropdownMenu.Item, DropdownMenu.Label, DropdownMenu.Separator）
20. **Tooltip** - 工具提示组件（包含 Tooltip.Trigger, Tooltip.Content）
21. **HoverCard** - 悬停卡片组件（包含 HoverCard.Trigger, HoverCard.Content）
22. **ContextMenu** - 上下文菜单组件（包含 ContextMenu.Trigger, ContextMenu.Content, ContextMenu.Item, ContextMenu.Label, ContextMenu.Separator）
23. **Menubar** - 菜单栏组件（包含 Menubar.Menu, Menubar.Trigger, Menubar.Content, Menubar.Item, Menubar.Separator）

#### 其他组件
24. **Progress** - 进度条组件
25. **Avatar** - 头像组件（包含 Avatar.Image, Avatar.Fallback）

### 移植步骤总结

#### 第一步：创建基础组件（packages/radix）

1. **创建组件目录结构**
   ```
   packages/radix/src/components/
   └── ComponentName/
       ├── ComponentName.tsx
       └── index.ts
   ```

2. **实现组件逻辑**
   - 将 React 的 `useState` 转换为 `createSignal`
   - 将 React 的 `useEffect` 转换为 `createEffect` 或 `onMount`
   - 将 React 的 `useContext` 转换为 SolidJS 的 `useContext`
   - 使用 `createContext` 和 `useContext` 实现组件间通信
   - 使用 `Portal` 实现弹出层组件
   - 使用 `isServer` 检查实现 SSR 适配

3. **处理受控/非受控模式**
   ```tsx
   const isControlled = () => local.value !== undefined;
   const value = () => (isControlled() ? local.value! : internalValue());
   ```

4. **实现事件处理**
   ```tsx
   const handleClick: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (e) => {
     if (typeof local.onClick === 'function') {
       local.onClick(e);
     }
     // 其他逻辑
   };
   ```

5. **导出组件**
   - 在 `ComponentName/index.ts` 中导出
   - 在 `components/index.ts` 中统一导出
   - 在 `src/index.ts` 中导出所有组件

#### 第二步：创建 shadcn/ui 风格包装（components/ui）

1. **创建包装组件**
   ```tsx
   import * as ComponentPrimitive from "@ensolid/radix";
   import { cn } from "./utils";
   
   export const Component: Component<ComponentProps> = (props) => {
     const [local, others] = splitProps(props, ["class", "children"]);
     return (
       <ComponentPrimitive.Component
         class={cn("shadcn-ui-style-classes", local.class)}
         {...others}
       />
     );
   };
   ```

2. **添加样式类名**
   - 使用 Tailwind CSS 类名
   - 使用 `cn()` 函数合并类名
   - 遵循 shadcn/ui 的设计规范

3. **处理子组件**
   ```tsx
   (Component as any).SubComponent = SubComponent;
   ```

#### 第三步：创建示例代码（src/examples）

1. **创建示例组件**
   - 展示组件的基本用法
   - 展示不同变体和配置
   - 展示状态管理
   - 展示交互功能

2. **更新导航**
   - 在 `App.tsx` 中添加示例到导航列表
   - 在 `examples/index.ts` 中导出所有示例

### 关键移植模式

#### 模式 1：带 Context 的复合组件

```tsx
// 1. 定义 Context
interface ComponentContextValue {
  value: () => string | undefined;
  setValue: (value: string) => void;
}

const ComponentContext = createContext<ComponentContextValue>();

// 2. 创建 Hook
export const useComponentContext = () => {
  const context = useContext(ComponentContext);
  if (!context) {
    throw new Error('Component must be used within Component');
  }
  return context;
};

// 3. 在父组件中提供 Context
export const Component: Component<ComponentProps> = (props) => {
  const contextValue: ComponentContextValue = {
    value,
    setValue: handleValueChange,
  };
  return (
    <ComponentContext.Provider value={contextValue}>
      {local.children}
    </ComponentContext.Provider>
  );
};

// 4. 在子组件中使用 Context
export const ComponentItem: Component<ComponentItemProps> = (props) => {
  const context = useComponentContext();
  // 使用 context.value(), context.setValue()
};
```

#### 模式 2：Portal 弹出层组件

```tsx
import { Portal } from 'solid-js/web';
import { isServer } from 'solid-js/web';

export const PopupComponent: Component<PopupProps> = (props) => {
  return (
    <Show when={open()}>
      <Portal mount={!isServer ? document.body : undefined}>
        <div class={local.class}>
          {local.children}
        </div>
      </Portal>
    </Show>
  );
};
```

#### 模式 3：受控/非受控组件

```tsx
export const ControlledComponent: Component<Props> = (props) => {
  const [local, others] = splitProps(props, ['value', 'defaultValue', 'onValueChange']);
  
  const [internalValue, setInternalValue] = createSignal(
    local.value ?? local.defaultValue ?? defaultValue
  );
  
  const isControlled = () => local.value !== undefined;
  const value = () => (isControlled() ? local.value! : internalValue());
  
  const handleChange = (newValue: T) => {
    if (!isControlled()) {
      setInternalValue(newValue);
    }
    local.onValueChange?.(newValue);
  };
  
  return (
    <input
      value={value()}
      onInput={(e) => handleChange(e.currentTarget.value)}
      {...others}
    />
  );
};
```

#### 模式 4：事件处理和清理

```tsx
export const ComponentWithEvents: Component<Props> = (props) => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      // 处理逻辑
    }
  };
  
  onMount(() => {
    if (!isServer) {
      document.addEventListener('keydown', handleKeyDown);
    }
  });
  
  createEffect(() => {
    if (!isServer && open()) {
      document.addEventListener('keydown', handleKeyDown);
    } else {
      document.removeEventListener('keydown', handleKeyDown);
    }
  });
  
  onCleanup(() => {
    if (!isServer) {
      document.removeEventListener('keydown', handleKeyDown);
    }
  });
};
```

### 常见问题和解决方案

#### 问题 1：类型导入错误
**错误**: `The requested module does not provide an export named 'Component'`
**解决**: 使用 `import type { Component } from "solid-js"` 而不是 `import { Component } from "solid-js"`

#### 问题 2：子组件类型错误
**错误**: `Property 'Item' does not exist on type 'Component<Props>'`
**解决**: 使用类型断言 `(Component as any).Item = ComponentItem`

#### 问题 3：事件处理器类型错误
**错误**: `This expression is not callable`
**解决**: 使用 `JSX.EventHandler<HTMLElement, Event>` 类型，并检查函数类型：
```tsx
const handleClick: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (e) => {
  if (typeof local.onClick === 'function') {
    local.onClick(e);
  }
};
```

#### 问题 4：splitProps 类型错误
**错误**: `Type '"class"' is not assignable to type 'keyof Props'`
**解决**: 使用 `as const` 断言：
```tsx
const [local, others] = splitProps(props, ["class", "children"] as const);
```

### 移植检查清单（基于实际经验）

移植组件时，按以下顺序检查：

1. **基础结构**
   - [ ] 创建组件目录和文件
   - [ ] 使用 `Component<Props>` 类型定义
   - [ ] 使用 `splitProps` 分离 props
   - [ ] 正确导入类型（使用 `import type`）

2. **状态管理**
   - [ ] `useState` → `createSignal`
   - [ ] 实现受控/非受控模式
   - [ ] 使用 `createMemo` 处理计算值

3. **Context 和复合组件**
   - [ ] 定义 Context 接口
   - [ ] 创建 `useContext` Hook
   - [ ] 在父组件中提供 Context
   - [ ] 在子组件中使用 Context
   - [ ] 使用类型断言添加子组件

4. **事件处理**
   - [ ] 使用 `JSX.EventHandler` 类型
   - [ ] 检查函数类型后再调用
   - [ ] 正确处理事件对象

5. **生命周期和副作用**
   - [ ] 使用 `onMount` 处理挂载逻辑
   - [ ] 使用 `onCleanup` 清理资源
   - [ ] 使用 `createEffect` 处理响应式副作用
   - [ ] 检查 `isServer` 避免 SSR 错误

6. **Portal 和弹出层**
   - [ ] 使用 `Portal` 渲染到指定容器
   - [ ] 使用 `isServer` 检查
   - [ ] 使用 `Show` 控制显示/隐藏

7. **类型和导出**
   - [ ] 所有接口正确扩展 JSX 类型
   - [ ] 在组件目录的 `index.ts` 中导出
   - [ ] 在 `components/index.ts` 中导出
   - [ ] 在包的 `src/index.ts` 中导出

8. **构建和测试**
   - [ ] 运行 `pnpm build:radix` 检查编译
   - [ ] 修复所有 TypeScript 错误
   - [ ] 创建示例代码验证功能

9. **shadcn/ui 包装**
   - [ ] 创建包装组件
   - [ ] 添加样式类名
   - [ ] 使用 `cn()` 合并类名
   - [ ] 导出到 `components/ui/index.ts`

10. **文档和示例**
    - [ ] 创建示例组件
    - [ ] 添加到导航列表
    - [ ] 更新 README（如需要）

### 项目结构参考

```
ensolid/
├── packages/
│   └── radix/                    # Radix UI Primitives 移植
│       ├── src/
│       │   ├── components/
│       │   │   ├── ComponentName/
│       │   │   │   ├── ComponentName.tsx
│       │   │   │   └── index.ts
│       │   │   └── index.ts
│       │   └── index.ts
│       ├── package.json
│       └── tsconfig.json
├── components/
│   └── ui/                       # shadcn/ui 风格组件
│       ├── component-name.tsx
│       ├── utils.ts
│       └── index.ts
└── src/
    └── examples/                  # 组件示例
        ├── ComponentExample.tsx
        └── index.ts
```

### 移植规则总结

#### 核心转换规则
1. **状态管理**: `useState` → `createSignal`
2. **副作用**: `useEffect` → `createEffect` / `onMount` / `onCleanup`
3. **计算值**: `useMemo` → `createMemo`
4. **引用**: `useRef` → 变量引用
5. **Context**: `createContext` / `useContext` 保持不变
6. **条件渲染**: `{condition && <Component />}` → `<Show when={condition()}>`
7. **列表渲染**: `items.map()` → `<For each={items()}>`
8. **Props 访问**: 不解构，使用 `props.xxx` 或 `splitProps`
9. **样式属性**: `className` → `class`
10. **样式对象**: 使用字符串形式避免 TypeScript 类型问题

#### 组件结构规范
1. **目录结构**: `packages/radix/src/components/ComponentName/`
2. **文件命名**: `ComponentName.tsx` 和 `index.ts`
3. **导出规范**: 组件目录 → `components/index.ts` → `src/index.ts`
4. **类型定义**: 使用 `Component<Props>` 类型
5. **子组件**: 使用 `Object.assign` 或类型断言添加

#### shadcn/ui 包装规范
1. **文件位置**: `src/components/ui/component-name.tsx`
2. **导入方式**: `import * as ComponentPrimitive from "@ensolid/radix"`
3. **样式合并**: 使用 `cn()` 函数合并 Tailwind CSS 类名
4. **Props 传递**: 使用 `splitProps` 分离样式和功能 Props
5. **子组件导出**: 在 `components/ui/index.ts` 统一导出

#### 示例代码规范
1. **文件位置**: `src/examples/ComponentExample.tsx`
2. **导出方式**: 在 `examples/index.ts` 中导出
3. **导航集成**: 在 `App.tsx` 中添加示例到导航列表
4. **国际化**: 使用 `useI18n()` Hook 获取翻译文本

### 最佳实践

1. **从简单到复杂**：先移植基础组件（如 Separator、Label），再移植复杂组件（如 Dialog、DropdownMenu）

2. **保持 API 一致性**：尽量保持与原库 API 一致，减少学习成本

3. **类型安全**：充分利用 TypeScript 类型系统，提供完整的类型定义

4. **SSR 优先**：所有组件都应考虑 SSR 兼容性，使用 `isServer` 检查浏览器 API

5. **测试驱动**：每移植一个组件，立即创建示例验证功能

6. **渐进式增强**：先实现核心功能，再添加高级特性

7. **样式处理**：使用字符串形式的 style 属性避免 TypeScript 类型问题

8. **事件处理**：使用 `JSX.EventHandler` 类型定义事件处理函数

9. **Portal 使用**：弹出层组件使用 `Portal` 并检查 `isServer`

10. **清理资源**：所有事件监听器和定时器在 `onCleanup` 中清理

11. **类型导入分离**：使用 `import type` 导入类型，避免运行时导入

12. **Props 分离**：使用 `splitProps` 分离需要特殊处理的 props

13. **受控/非受控模式**：实现两种模式以提供更好的灵活性

14. **Context 模式**：对于复合组件，使用 Context 实现组件间通信

15. **错误处理**：在 Context Hook 中添加错误检查，提供清晰的错误信息

16. **性能优化**：使用 `createMemo` 缓存计算结果，避免不必要的重新计算

17. **代码复用**：提取公共逻辑到工具函数或自定义 Hook

18. **文档完善**：为每个组件添加 JSDoc 注释，说明用法和参数

19. **示例代码**：创建完整的示例代码，展示各种使用场景

20. **构建验证**：每次修改后运行构建命令，确保没有类型错误和编译错误

---

## 常见错误和解决方案

### 错误 1: 响应式值未使用函数调用

**错误信息**: `Type 'Accessor<T>' is not assignable to type 'T'`

**原因**: 在需要值的地方使用了 Accessor（函数）

**解决方案**: 使用函数调用获取值

```tsx
// ❌ 错误
const value = count; // count 是 Accessor<number>

// ✅ 正确
const value = count(); // 调用函数获取值
```

### 错误 2: Props 解构导致响应式丢失

**错误信息**: 组件不响应 props 变化

**原因**: 解构 props 会破坏响应式

**解决方案**: 使用 `props.xxx` 或 `splitProps`

```tsx
// ❌ 错误
const Component = ({ title }: Props) => {
  return <div>{title}</div>; // title 不会响应变化
};

// ✅ 正确
const Component: Component<Props> = (props) => {
  return <div>{props.title}</div>; // 响应式访问
};
```

### 错误 3: 类型导入错误

**错误信息**: `The requested module does not provide an export named 'Component'`

**原因**: 类型应该使用 `import type` 导入

**解决方案**: 分离类型导入和值导入

```tsx
// ❌ 错误
import { Component, createSignal } from 'solid-js';

// ✅ 正确
import type { Component } from 'solid-js';
import { createSignal } from 'solid-js';
```

### 错误 4: 子组件类型错误

**错误信息**: `Property 'Item' does not exist on type 'Component<Props>'`

**原因**: TypeScript 无法识别动态添加的子组件

**解决方案**: 使用类型断言

```tsx
// ✅ 正确
(Component as any).Item = ComponentItem;
```

### 错误 5: SSR 中访问浏览器 API

**错误信息**: `window is not defined` 或 `document is not defined`

**原因**: 在服务端渲染时访问了浏览器 API

**解决方案**: 使用 `isServer` 检查或 `onMount`

```tsx
// ❌ 错误
const width = window.innerWidth;

// ✅ 正确
onMount(() => {
  if (!isServer) {
    const width = window.innerWidth;
  }
});
```

### 错误 6: 事件处理器类型错误

**错误信息**: `This expression is not callable`

**原因**: 事件处理器类型定义不正确

**解决方案**: 使用 `JSX.EventHandler` 类型

```tsx
// ❌ 错误
const handleClick = (e: MouseEvent) => { ... };

// ✅ 正确
const handleClick: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (e) => {
  // 处理逻辑
};
```

### 错误 7: splitProps 类型错误

**错误信息**: `Type '"class"' is not assignable to type 'keyof Props'`

**原因**: TypeScript 无法推断 props 键

**解决方案**: 使用 `as const` 断言

```tsx
// ❌ 错误
const [local, others] = splitProps(props, ['class', 'children']);

// ✅ 正确
const [local, others] = splitProps(props, ['class', 'children'] as const);
```

### 错误 8: Portal 在 SSR 中报错

**错误信息**: `Cannot read property 'body' of undefined`

**原因**: 在服务端访问 `document.body`

**解决方案**: 使用 `isServer` 检查

```tsx
// ❌ 错误
<Portal mount={document.body}>{children}</Portal>

// ✅ 正确
<Portal mount={!isServer ? document.body : undefined}>
  {children}
</Portal>
```

### 错误 9: asChild 属性使用错误

**错误信息**: `Property 'asChild' does not exist on type 'IntrinsicAttributes & ButtonProps'`

**原因**: 
1. `asChild` 是 Radix UI 的一个特殊属性，用于将组件的功能传递给子元素，而不是渲染组件本身
2. 只有 Radix 基础组件（如 `Dialog.Trigger`、`Popover.Trigger` 等）支持 `asChild` 属性
3. 普通的 UI 组件（如 `Button`）不支持 `asChild` 属性

**解决方案**: 

**方案 1**: 对于 Radix 基础组件的 Trigger，正确使用 `asChild`

```tsx
// ✅ 正确 - Radix 组件的 Trigger 支持 asChild
<Dialog>
  <Dialog.Trigger asChild>
    <Button>打开对话框</Button>
  </Dialog.Trigger>
  <Dialog.Content>...</Dialog.Content>
</Dialog>
```

**方案 2**: 对于普通 UI 组件，不要使用 `asChild`，改用包装方式

```tsx
// ❌ 错误 - Button 组件不支持 asChild
<Button asChild size="lg">
  <A href="/components">查看组件</A>
</Button>

// ✅ 正确 - 使用 A 标签包装 Button
<A href="/components">
  <Button size="lg">查看组件</Button>
</A>
```

**方案 3**: 如果需要实现类似 `asChild` 的功能，需要修改组件实现

如果确实需要让某个组件支持 `asChild`，需要在组件实现中处理：

```tsx
interface ComponentProps {
  asChild?: boolean;
  children?: JSX.Element;
  // ... 其他 props
}

export const Component: Component<ComponentProps> = (props) => {
  const [local, others] = splitProps(props, ["asChild", "children"]);
  
  // 如果 asChild 为 true，直接返回 children（需要是单个元素）
  if (local.asChild) {
    return local.children as JSX.Element;
  }
  
  // 否则正常渲染组件
  return (
    <div {...others}>
      {local.children}
    </div>
  );
};
```

**重要提示**:
- `asChild` 主要用于 Radix UI 的复合组件模式，允许将组件的功能（如点击事件、ARIA 属性等）传递给子元素
- 不是所有组件都需要支持 `asChild`，只有需要这种"功能传递"模式的组件才需要实现
- 在移植 React 组件时，如果原组件支持 `asChild`，需要明确实现这个功能，否则会导致类型错误

## 调试技巧

### 1. 检查响应式值

使用 `console.log` 检查响应式值：

```tsx
createEffect(() => {
  console.log('Value changed:', value());
});
```

### 2. 检查组件渲染

使用 `onMount` 和 `onCleanup` 检查组件生命周期：

```tsx
onMount(() => {
  console.log('Component mounted');
});

onCleanup(() => {
  console.log('Component cleaned up');
});
```

### 3. 类型检查

使用 TypeScript 的严格模式检查类型错误：

```json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

### 4. 构建验证

每次修改后运行构建命令：

```bash
pnpm build:radix  # 构建特定包
pnpm build        # 构建所有包
```

## 参考资料

- [SolidJS 官方文档](https://www.solidjs.com/)
- [SolidJS React 迁移指南](https://www.solidjs.com/docs/latest/api#react-comparison)
- [SolidJS JSX 指南](https://www.solidjs.com/docs/latest/guides/jsx)
- [SolidJS SSR 指南](https://www.solidjs.com/docs/latest/guides/server)
- [SolidStart 文档](https://start.solidjs.com/) (SSR 框架)
- [Radix UI Primitives](https://www.radix-ui.com/primitives) (原始 React 实现)
- [shadcn/ui](https://ui.shadcn.com/) (设计参考)
- [BaseUI](https://baseui.org/) (BaseUI 原始实现)
- [React Flow](https://reactflow.dev/) (React Flow 原始实现)

