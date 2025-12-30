import type { Component, JSX } from "solid-js";
import type { Node, NodeComponentProps } from "@ensolid/solidflow";

/**
 * 节点定义接口
 * 定义了一个自定义节点的元数据和组件
 */
export interface NodeDefinition {
  /**
   * 节点类型唯一标识符
   */
  type: string;

  /**
   * 节点显示名称
   */
  label: string;

  /**
   * 节点描述
   */
  description?: string;

  /**
   * 节点图标（emoji 或 SVG）
   */
  icon?: string | JSX.Element;

  /**
   * 节点组件
   */
  component: Component<NodeComponentProps>;

  /**
   * 默认节点数据
   */
  defaultData?: Record<string, any>;

  /**
   * 创建节点时的数据初始化函数
   */
  createNodeData?: (type: string) => Record<string, any>;

  /**
   * 属性面板组件（可选，如果不提供则使用默认面板）
   */
  propertyPanel?: Component<{
    node: Node;
    onUpdate: (data: Record<string, any>) => void;
  }>;

  /**
   * 工具栏按钮配置
   */
  toolbar?: {
    /**
     * 工具栏按钮图标（SVG 或 JSX）
     */
    icon?: JSX.Element;
    /**
     * 工具栏按钮标题
     */
    title?: string;
  };
}

/**
 * 工作流插件接口
 */
export interface WorkflowPlugin {
  /**
   * 插件唯一标识符
   */
  id: string;

  /**
   * 插件名称
   */
  name: string;

  /**
   * 插件版本
   */
  version: string;

  /**
   * 插件描述
   */
  description?: string;

  /**
   * 插件作者
   */
  author?: string;

  /**
   * 注册的节点定义列表
   */
  nodes: NodeDefinition[];

  /**
   * 插件初始化函数（可选）
   */
  onRegister?: () => void;

  /**
   * 插件卸载函数（可选）
   */
  onUnregister?: () => void;
}

/**
 * 插件注册选项
 */
export interface PluginRegisterOptions {
  /**
   * 是否覆盖已存在的节点类型
   */
  override?: boolean;
}

