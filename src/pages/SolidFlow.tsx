/**
 * SolidFlow 页面 - Flow 流程图示例
 */

import type { Component } from "solid-js";
import { createSignal, For } from "solid-js";
import {
  FlowExample,
  FlowCustomNodeExample,
  FlowInteractiveExample,
  FlowEditorExample,
} from "../examples";

type FlowExampleType = "basic" | "custom-node" | "interactive" | "editor";

const flowExamples = [
  { id: "basic" as FlowExampleType, name: "基础示例", component: FlowExample },
  {
    id: "custom-node" as FlowExampleType,
    name: "自定义节点",
    component: FlowCustomNodeExample,
  },
  {
    id: "interactive" as FlowExampleType,
    name: "交互式示例",
    component: FlowInteractiveExample,
  },
  {
    id: "editor" as FlowExampleType,
    name: "完整编辑器",
    component: FlowEditorExample,
  },
];

export const SolidFlowPage: Component = () => {
  const [currentExample, setCurrentExample] = createSignal<FlowExampleType>("basic");

  return (
    <div class="container mx-auto px-4 py-6">
      <div class="flex gap-6">
        <aside class="w-64 shrink-0">
          <nav class="sticky top-20 space-y-1">
            <h2 class="mb-4 px-2 text-sm font-semibold tracking-tight">Flow 示例</h2>
            <ul class="space-y-1">
              <For each={flowExamples}>
                {(example) => (
                  <li>
                    <button
                      type="button"
                      onClick={() => setCurrentExample(example.id)}
                      class={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                        currentExample() === example.id
                          ? "bg-primary text-primary-foreground font-medium"
                          : "hover:bg-accent hover:text-accent-foreground"
                      }`}
                    >
                      {example.name}
                    </button>
                  </li>
                )}
              </For>
            </ul>
          </nav>
        </aside>

        <main class="flex-1 min-w-0">
          <div class="rounded-lg border bg-card p-6 shadow-sm">
            {(() => {
              const selectedId = currentExample();
              const example = flowExamples.find((e) => e.id === selectedId);
              const Component = example ? example.component : FlowExample;
              return <Component />;
            })()}
          </div>
        </main>
      </div>
    </div>
  );
};

