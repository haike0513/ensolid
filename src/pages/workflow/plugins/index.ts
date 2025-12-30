/**
 * Workflow 插件系统
 * 
 * 使用示例：
 * 
 * ```ts
 * import { registerPlugin } from './workflow/plugins';
 * import { MyCustomNode } from './my-plugin/MyCustomNode';
 * 
 * registerPlugin({
 *   id: 'my-plugin',
 *   name: 'My Plugin',
 *   version: '1.0.0',
 *   nodes: [
 *     {
 *       type: 'my-custom-node',
 *       label: 'My Custom Node',
 *       icon: '🎨',
 *       component: MyCustomNode,
 *       defaultData: { label: 'My Node' },
 *       createNodeData: (type) => ({ label: `New ${type}` }),
 *     },
 *   ],
 * });
 * ```
 */

export * from "./types";
export { pluginRegistry } from "./registry";

// 导出便捷函数
import { pluginRegistry } from "./registry";

/**
 * 注册插件的便捷函数
 */
export function registerPlugin(
  plugin: import("./types").WorkflowPlugin,
  options?: import("./types").PluginRegisterOptions
): void {
  pluginRegistry.register(plugin, options);
}

/**
 * 注销插件的便捷函数
 */
export function unregisterPlugin(pluginId: string): void {
  pluginRegistry.unregister(pluginId);
}

