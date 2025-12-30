import type { WorkflowPlugin, NodeDefinition, PluginRegisterOptions } from "./types";
import type { Component } from "solid-js";
import type { NodeComponentProps } from "@ensolid/solidflow";

/**
 * 插件注册表
 */
class PluginRegistry {
  private plugins: Map<string, WorkflowPlugin> = new Map();
  private nodeTypes: Map<string, NodeDefinition> = new Map();
  private nodeComponents: Map<string, Component<NodeComponentProps>> = new Map();

  /**
   * 注册插件
   */
  register(plugin: WorkflowPlugin, options?: PluginRegisterOptions): void {
    const existingPlugin = this.plugins.get(plugin.id);
    
    if (existingPlugin && !options?.override) {
      console.warn(`Plugin ${plugin.id} is already registered. Use override option to replace it.`);
      return;
    }

    // 卸载旧插件（如果存在）
    if (existingPlugin) {
      existingPlugin.onUnregister?.();
    }

    // 注册插件
    this.plugins.set(plugin.id, plugin);
    
    // 注册节点
    for (const nodeDef of plugin.nodes) {
      const existingNode = this.nodeTypes.get(nodeDef.type);
      
      if (existingNode && !options?.override) {
        console.warn(
          `Node type ${nodeDef.type} from plugin ${plugin.id} conflicts with existing node. Skipping.`
        );
        continue;
      }

      this.nodeTypes.set(nodeDef.type, nodeDef);
      this.nodeComponents.set(nodeDef.type, nodeDef.component);
    }

    // 调用插件初始化函数
    plugin.onRegister?.();

    console.log(`Plugin ${plugin.id} (${plugin.name}) registered successfully.`);
  }

  /**
   * 注销插件
   */
  unregister(pluginId: string): void {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) {
      console.warn(`Plugin ${pluginId} not found.`);
      return;
    }

    // 调用插件卸载函数
    plugin.onUnregister?.();

    // 移除插件注册的节点
    for (const nodeDef of plugin.nodes) {
      this.nodeTypes.delete(nodeDef.type);
      this.nodeComponents.delete(nodeDef.type);
    }

    // 移除插件
    this.plugins.delete(pluginId);

    console.log(`Plugin ${pluginId} unregistered successfully.`);
  }

  /**
   * 获取所有注册的节点类型
   */
  getNodeTypes(): Map<string, NodeDefinition> {
    return new Map(this.nodeTypes);
  }

  /**
   * 获取节点定义
   */
  getNodeDefinition(type: string): NodeDefinition | undefined {
    return this.nodeTypes.get(type);
  }

  /**
   * 获取节点组件
   */
  getNodeComponent(type: string): Component<NodeComponentProps> | undefined {
    return this.nodeComponents.get(type);
  }

  /**
   * 获取所有节点组件（用于 Flow 的 nodeTypes prop）
   */
  getAllNodeComponents(): Record<string, Component<NodeComponentProps>> {
    const components: Record<string, Component<NodeComponentProps>> = {};
    for (const [type, component] of this.nodeComponents.entries()) {
      components[type] = component;
    }
    return components;
  }

  /**
   * 获取所有注册的插件
   */
  getPlugins(): WorkflowPlugin[] {
    return Array.from(this.plugins.values());
  }

  /**
   * 获取插件
   */
  getPlugin(pluginId: string): WorkflowPlugin | undefined {
    return this.plugins.get(pluginId);
  }

  /**
   * 检查节点类型是否存在
   */
  hasNodeType(type: string): boolean {
    return this.nodeTypes.has(type);
  }

  /**
   * 清除所有插件
   */
  clear(): void {
    // 调用所有插件的卸载函数
    for (const plugin of this.plugins.values()) {
      plugin.onUnregister?.();
    }

    this.plugins.clear();
    this.nodeTypes.clear();
    this.nodeComponents.clear();
  }
}

// 导出单例实例
export const pluginRegistry = new PluginRegistry();

