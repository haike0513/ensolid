import type { Component } from "solid-js";
import { createSignal } from "solid-js";
import {
  ButtonExample,
  CardExample,
  DialogExample,
  CheckboxExample,
  SwitchExample,
  TabsExample,
  AccordionExample,
  SeparatorExample,
} from "./examples";
import "./App.css";

type ExampleType =
  | "button"
  | "card"
  | "dialog"
  | "checkbox"
  | "switch"
  | "tabs"
  | "accordion"
  | "separator";

const App: Component = () => {
  const [currentExample, setCurrentExample] = createSignal<ExampleType>("button");

  const examples = [
    { id: "button" as ExampleType, name: "Button", component: ButtonExample },
    { id: "card" as ExampleType, name: "Card", component: CardExample },
    { id: "dialog" as ExampleType, name: "Dialog", component: DialogExample },
    { id: "checkbox" as ExampleType, name: "Checkbox", component: CheckboxExample },
    { id: "switch" as ExampleType, name: "Switch", component: SwitchExample },
    { id: "tabs" as ExampleType, name: "Tabs", component: TabsExample },
    { id: "accordion" as ExampleType, name: "Accordion", component: AccordionExample },
    { id: "separator" as ExampleType, name: "Separator", component: SeparatorExample },
  ];

  const CurrentComponent = () => {
    const example = examples.find((e) => e.id === currentExample());
    const Component = example ? example.component : ButtonExample;
    return <Component />;
  };

  return (
    <div class="min-h-screen bg-background">
      <header class="border-b">
        <div class="container mx-auto px-4 py-4">
          <h1 class="text-3xl font-bold">Resolid UI 组件示例</h1>
          <p class="text-muted-foreground mt-2">
            基于 @resolid/radix 的 shadcn/ui 风格组件展示
          </p>
        </div>
      </header>

      <div class="container mx-auto px-4 py-6">
        <div class="flex gap-4 mb-6">
          <nav class="w-64 border-r pr-4">
            <h2 class="text-lg font-semibold mb-4">组件列表</h2>
            <ul class="space-y-2">
              {examples.map((example) => (
                <li>
                  <button
                    onClick={() => setCurrentExample(example.id)}
                    class={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                      currentExample() === example.id
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-accent"
                    }`}
                  >
                    {example.name}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <main class="flex-1">
            <CurrentComponent />
          </main>
        </div>
      </div>
    </div>
  );
};

export default App;
