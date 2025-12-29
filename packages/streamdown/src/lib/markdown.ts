// @ts-ignore - hast types are available via hast-util-to-jsx-runtime
import type { Element, Nodes } from "hast";
import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import type { Component, JSX } from "solid-js";
import remarkParse from "remark-parse";
import type { Options as RemarkRehypeOptions } from "remark-rehype";
import remarkRehype from "remark-rehype";
import type { PluggableList } from "unified";
import { unified } from "unified";

// Fragment component for SolidJS - returns children as-is
// In SolidJS, Fragment is not a namespace API like React.Fragment,
// but we need a component function for hast-util-to-jsx-runtime
// SolidJS only supports <>...</> syntax in JSX, not Fragment as a component
// However, for hast-util-to-jsx-runtime compatibility, we create a Fragment component
const Fragment: Component<{ children?: JSX.Element }> = (props) => {
  return props.children as JSX.Element;
};

export type ExtraProps = {
  node?: Element | undefined;
};

export type Components = {
  [Key in keyof JSX.IntrinsicElements]?:
    | Component<JSX.IntrinsicElements[Key] & ExtraProps>
    | keyof JSX.IntrinsicElements;
};

export type Options = {
  children?: string;
  components?: Components;
  rehypePlugins?: PluggableList;
  remarkPlugins?: PluggableList;
  remarkRehypeOptions?: Readonly<RemarkRehypeOptions>;
};

// Stable references for common cases
const EMPTY_PLUGINS: PluggableList = [];
const DEFAULT_REMARK_REHYPE_OPTIONS = { allowDangerousHtml: true };

// Plugin name cache for faster serialization
// biome-ignore lint/complexity/noBannedTypes: "Need Function type for plugin caching"
const pluginNameCache = new WeakMap<Function, string>();

// LRU Cache for unified processors
class ProcessorCache {
  // biome-ignore lint/suspicious/noExplicitAny: Processor type is complex and varies with plugins
  private readonly cache = new Map<string, any>();
  private readonly keyCache = new WeakMap<Readonly<Options>, string>();
  private readonly maxSize = 100;

  generateCacheKey(options: Readonly<Options>): string {
    // Check WeakMap cache first for faster lookups (before any processing)
    const cachedKey = this.keyCache.get(options);
    if (cachedKey) {
      return cachedKey;
    }

    const rehypePlugins = options.rehypePlugins;
    const remarkPlugins = options.remarkPlugins;
    const remarkRehypeOptions = options.remarkRehypeOptions;

    // Fast path for no plugins (most common case)
    if (!(rehypePlugins || remarkPlugins || remarkRehypeOptions)) {
      const key = "default";
      this.keyCache.set(options, key);
      return key;
    }

    // Optimize serialization for plugins
    // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: "Plugin serialization requires checking multiple plugin formats"
    const serializePlugins = (plugins: PluggableList | undefined): string => {
      if (!plugins || plugins.length === 0) {
        return "";
      }

      let result = "";
      for (let i = 0; i < plugins.length; i += 1) {
        const plugin = plugins[i];
        if (i > 0) {
          result += ",";
        }

        if (Array.isArray(plugin)) {
          // Plugin with options: [plugin, options]
          const [pluginFn, pluginOptions] = plugin;
          if (typeof pluginFn === "function") {
            let name = pluginNameCache.get(pluginFn);
            if (!name) {
              name = pluginFn.name;
              pluginNameCache.set(pluginFn, name);
            }
            result += name;
          } else {
            result += String(pluginFn);
          }
          result += ":";
          result += JSON.stringify(pluginOptions);
        } else if (typeof plugin === "function") {
          // Plugin without options
          let name = pluginNameCache.get(plugin);
          if (!name) {
            name = plugin.name;
            pluginNameCache.set(plugin, name);
          }
          result += name;
        } else {
          result += String(plugin);
        }
      }
      return result;
    };

    const rehypeKey = serializePlugins(rehypePlugins);
    const remarkKey = serializePlugins(remarkPlugins);
    const optionsKey = remarkRehypeOptions
      ? JSON.stringify(remarkRehypeOptions)
      : "";

    const key = `${remarkKey}::${rehypeKey}::${optionsKey}`;

    // Cache the key in WeakMap for this options object
    this.keyCache.set(options, key);

    return key;
  }

  get(options: Readonly<Options>) {
    const key = this.generateCacheKey(options);
    const processor = this.cache.get(key);

    if (processor) {
      // Move to end (most recently used)
      this.cache.delete(key);
      this.cache.set(key, processor);
    }

    return processor;
  }

  // biome-ignore lint/suspicious/noExplicitAny: Processor type is complex and varies with plugins
  set(options: Readonly<Options>, processor: any): void {
    const key = this.generateCacheKey(options);

    // Remove oldest entry if cache is full
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }

    this.cache.set(key, processor);
  }

  clear(): void {
    this.cache.clear();
    // Note: WeakMap doesn't need manual clearing
  }
}

// Global processor cache instance
const processorCache = new ProcessorCache();

export const Markdown = (options: Readonly<Options>) => {
  const processor = getCachedProcessor(options);
  const content = options.children || "";
  return post(
    // biome-ignore lint/suspicious/noExplicitAny: runSync return type varies with processor configuration
    processor.runSync(processor.parse(content), content) as any,
    options,
  );
};

const getCachedProcessor = (options: Readonly<Options>) => {
  // Try to get from cache first
  const cached = processorCache.get(options);
  if (cached) {
    return cached;
  }

  // Create new processor and cache it
  const processor = createProcessor(options);
  processorCache.set(options, processor);
  return processor;
};

const createProcessor = (options: Readonly<Options>) => {
  const rehypePlugins = options.rehypePlugins || EMPTY_PLUGINS;
  const remarkPlugins = options.remarkPlugins || EMPTY_PLUGINS;
  const remarkRehypeOptions = options.remarkRehypeOptions
    ? { ...DEFAULT_REMARK_REHYPE_OPTIONS, ...options.remarkRehypeOptions }
    : DEFAULT_REMARK_REHYPE_OPTIONS;

  return unified()
    .use(remarkParse)
    .use(remarkPlugins)
    .use(remarkRehype, remarkRehypeOptions)
    .use(rehypePlugins);
};

// Convert className to class for SolidJS
const convertProps = (props: Record<string, any>): Record<string, any> => {
  const converted: Record<string, any> = {};
  for (const key in props) {
    if (key === "className") {
      converted.class = props[key];
    } else {
      converted[key] = props[key];
    }
  }
  return converted;
};

// Adapter functions to convert React-style jsx/jsxs to SolidJS JSX elements
// In SolidJS, JSX elements are functions that return DOM nodes or components
// We create a function that SolidJS's renderer can execute
const createJsxAdapter = () => {
  return (type: any, props: any, ...children: any[]) => {
    // Handle Fragment specially - in SolidJS, Fragment should return children directly
    if (type === Fragment) {
      const flatChildren = children.flat(Infinity).filter((c) => c != null);
      // For Fragment, return children directly (SolidJS Fragment behavior)
      return flatChildren.length === 1 ? flatChildren[0] : flatChildren;
    }

    const convertedProps = convertProps(props || {});
    // Flatten children array
    const flatChildren = children.flat(Infinity).filter((c) => c != null);

    // In SolidJS, JSX elements are functions that create DOM nodes
    // For string types (HTML elements), we need to return a JSX element
    // that SolidJS can render
    if (typeof type === "string") {
      // For SolidJS, we need to return a function that creates the element
      // SolidJS JSX runtime expects elements to be functions
      // We'll use a template function that SolidJS can process
      return (() => {
        // Create the element using SolidJS's JSX pattern
        // This will be processed by SolidJS's JSX runtime during rendering
        const elementProps = { ...convertedProps };
        if (flatChildren.length > 0) {
          elementProps.children = flatChildren.length === 1
            ? flatChildren[0]
            : flatChildren;
        }
        // Return a function that SolidJS can call to create the element
        // This matches SolidJS's JSX element structure
        return {
          __solidjs_element: true,
          type,
          props: elementProps,
        };
      }) as unknown as JSX.Element;
    }

    // For components, call them with props and children
    // SolidJS components receive props as first argument
    if (flatChildren.length > 0) {
      convertedProps.children = flatChildren.length === 1
        ? flatChildren[0]
        : flatChildren;
    }
    return type(convertedProps) as JSX.Element;
  };
};

// Adapter function to convert hast-util-to-jsx-runtime output to SolidJS
const post = (tree: Nodes, options: Readonly<Options>): JSX.Element => {
  // Use toJsxRuntime with SolidJS JSX adapter (no h function needed)
  const jsxAdapter = createJsxAdapter();
  const result = toJsxRuntime(tree, {
    Fragment: Fragment as any,
    components: options.components as any,
    ignoreInvalidStyle: true,
    jsx: jsxAdapter,
    jsxs: jsxAdapter, // Use same adapter for jsxs
    passKeys: true,
    passNode: true,
  });
  return result as JSX.Element;
};
