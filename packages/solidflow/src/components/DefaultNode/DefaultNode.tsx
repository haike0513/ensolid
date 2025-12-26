/**
 * DefaultNode 组件 - 默认节点组件
 */

import { type Component } from "solid-js";
import type { NodeComponentProps } from "../../types";
import { Handle } from "../Handle";

export const DefaultNode: Component<NodeComponentProps> = (props) => {
  return (
    <div class="solidflow-default-node bg-white border-2 border-gray-300 rounded-lg p-4 min-w-[150px] min-h-[40px]">
      <Handle type="source" position="top" id="top" nodeId={props.node.id} />
      <div>{props.node.data?.label ?? props.node.id}</div>
      <Handle
        type="target"
        position="bottom"
        id="bottom"
        nodeId={props.node.id}
      />
      <Handle type="target" position="left" id="left" nodeId={props.node.id} />
      <Handle
        type="source"
        position="right"
        id="right"
        nodeId={props.node.id}
      />
    </div>
  );
};
