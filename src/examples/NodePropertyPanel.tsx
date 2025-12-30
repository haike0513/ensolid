import type { Component } from "solid-js";
import { For, Show, Match, Switch } from "solid-js";
import type { Node } from "@ensolid/solidflow";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { pluginRegistry } from "@/pages/workflow/plugins";

export interface NodePropertyPanelProps {
  node: Node;
  onClose: () => void;
  onUpdate: (id: string, data: any) => void;
}

export const NodePropertyPanel: Component<NodePropertyPanelProps> = (props) => {
  // Styles
  const inputClass =
    "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50";
  const textareaClass =
    "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50";

  const updateData = (key: string, value: any) => {
    props.onUpdate(props.node.id, {
      ...props.node.data,
      [key]: value,
    });
  };

  const getNodeTypeLabel = (type?: string) => {
    if (!type) return "Node Properties";
    
    const nodeDef = pluginRegistry.getNodeDefinition(type);
    if (nodeDef) {
      return nodeDef.label;
    }
    
    // 回退到默认标签
    switch (type) {
      case "agent":
        return "Agent Node";
      case "task":
        return "Task Node";
      case "tool":
        return "Tool Node";
      case "trigger":
        return "Trigger Node";
      default:
        return "Node Properties";
    }
  };

  // 获取节点定义
  const nodeDef = () => {
    if (!props.node.type) return undefined;
    return pluginRegistry.getNodeDefinition(props.node.type);
  };

  // 获取节点图标
  const getNodeIcon = () => {
    const def = nodeDef();
    if (def?.icon) {
      if (typeof def.icon === "string") {
        return def.icon;
      }
      // JSX.Element 会在渲染时处理
      return null;
    }
    // 回退到默认图标
    return null;
  };

  return (
    <div class="absolute top-4 right-4 w-80 bg-white border rounded-lg shadow-xl p-4 z-[60] pointer-events-auto solidflow-panel animate-in fade-in slide-in-from-right-4 h-[calc(100vh-2rem)] overflow-y-auto">
      <div class="flex items-center justify-between mb-6 border-b pb-4">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
            <Show when={typeof getNodeIcon() === "string"}>
              {getNodeIcon() as string}
            </Show>
            <Show when={getNodeIcon() === null}>
              <Show when={props.node.type === "agent"}>🤖</Show>
              <Show when={props.node.type === "task"}>📋</Show>
              <Show when={props.node.type === "tool"}>🛠️</Show>
              <Show when={props.node.type === "trigger"}>🚀</Show>
              <Show
                when={
                  !["agent", "task", "tool", "trigger"].includes(
                    props.node.type || ""
                  )
                }
              >
                📦
              </Show>
            </Show>
          </div>
          <div>
            <h3 class="font-bold text-lg">
              {props.node.data?.label || "Unnamed Node"}
            </h3>
            <p class="text-xs text-gray-500">
              {getNodeTypeLabel(props.node.type)}
            </p>
            <p class="text-xs text-gray-400 font-mono">{props.node.id}</p>
          </div>
        </div>
        <button
          class="text-gray-400 hover:text-gray-600"
          onClick={props.onClose}
        >
          ✕
        </button>
      </div>

      <div class="space-y-6">
        <Switch>
          <Match when={nodeDef()?.propertyPanel}>
            {/* 使用插件的自定义属性面板 */}
            {(() => {
              const CustomPanel = nodeDef()!.propertyPanel!;
              return (
                <CustomPanel
                  node={props.node}
                  onUpdate={(data) => {
                    props.onUpdate(props.node.id, {
                      ...props.node.data,
                      ...data,
                    });
                  }}
                />
              );
            })()}
          </Match>
          <Match when={!nodeDef()?.propertyPanel}>
            {/* 默认属性面板 */}
            <div>
              <h4 class="font-semibold mb-4 text-sm uppercase text-gray-500">
                Configuration
              </h4>

              <div class="space-y-4">
                {/* Common: Label/Name */}
                <div class="space-y-2">
                  <Label>Name</Label>
                  <input
                    type="text"
                    class={inputClass}
                    value={props.node.data?.label || ""}
                    onInput={(e) => updateData("label", e.currentTarget.value)}
                    placeholder="Node Name"
                  />
                </div>

                {/* Agent Specific */}
            <Show
              when={
                props.node.type === "agent" || props.node.type === "default"
              }
            >
              {/* Treating 'default' as Agent for the Example flow compatibility */}
              <div class="space-y-2">
                <Label>Role</Label>
                <input
                  type="text"
                  class={inputClass}
                  value={props.node.data?.role || ""}
                  onInput={(e) => updateData("role", e.currentTarget.value)}
                  placeholder="e.g. Researcher, Writer"
                />
              </div>

              <div class="space-y-2">
                <Label>Model</Label>
                <Select
                  value={props.node.data?.model || "gpt-5-mini"}
                  onValueChange={(value) => updateData("model", value)}
                >
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="Select a model" />
                  </SelectTrigger>
                  <SelectContent>
                    <For
                      each={[
                        "gpt-5-mini",
                        "gpt-4",
                        "claude-3-opus",
                        "gemini-pro",
                      ]}
                    >
                      {(item) => <SelectItem value={item}>{item}</SelectItem>}
                    </For>
                  </SelectContent>
                </Select>
              </div>

              <div class="space-y-2">
                <Label>Tools</Label>
                <div class="border rounded-md p-3 space-y-3">
                  <div class="flex items-start space-x-3">
                    <Checkbox
                      id="wiki"
                      checked={props.node.data?.tools?.includes("wiki")}
                      onCheckedChange={(checked) => {
                        const tools = props.node.data?.tools || [];
                        updateData(
                          "tools",
                          checked
                            ? [...tools, "wiki"]
                            : tools.filter((t: string) => t !== "wiki")
                        );
                      }}
                    />
                    <div class="space-y-1 leading-none">
                      <label
                        for="wiki"
                        class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Wikipedia Query
                      </label>
                      <p class="text-xs text-muted-foreground">
                        Search Wikipedia articles or get summaries...
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="space-y-2">
                <Label>System Prompt</Label>
                <textarea
                  class={`${textareaClass} h-64 font-mono text-sm leading-relaxed resize-none`}
                  style={{ "white-space": "pre-wrap" }}
                  value={props.node.data?.systemPrompt || ""}
                  onInput={(e) =>
                    updateData("systemPrompt", e.currentTarget.value)
                  }
                  placeholder="Enter system prompt..."
                />
              </div>
            </Show>

            {/* Task Specific */}
            <Show when={props.node.type === "task"}>
              <div class="space-y-2">
                <Label>Description</Label>
                <textarea
                  class={textareaClass}
                  value={props.node.data?.description || ""}
                  onInput={(e) =>
                    updateData("description", e.currentTarget.value)
                  }
                  placeholder="Task detailed description..."
                  rows={4}
                />
              </div>
            </Show>

            {/* Tool Specific */}
            <Show when={props.node.type === "tool"}>
              <div class="space-y-2">
                <Label>Tool Definition</Label>
                <div class="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                  External tool configuration...
                </div>
              </div>
            </Show>
              </div>
            </div>
          </Match>
        </Switch>

        {/* Metadata section */}
        <div class="pt-4 border-t border-gray-100">
          <h3 class="text-xs font-bold text-gray-900 mb-2">Metadata</h3>
          <div class="grid grid-cols-2 gap-2">
            <div class="bg-gray-50 p-2 rounded border border-gray-100">
              <div class="text-[10px] text-gray-400">Position X</div>
              <div class="text-xs font-mono text-gray-700">
                {Math.round(props.node.position.x)}
              </div>
            </div>
            <div class="bg-gray-50 p-2 rounded border border-gray-100">
              <div class="text-[10px] text-gray-400">Position Y</div>
              <div class="text-xs font-mono text-gray-700">
                {Math.round(props.node.position.y)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
