import type { Component } from "solid-js";
import { createSignal, For } from "solid-js";
import {
  AccordionExample,
  AlertDialogExample,
  ButtonExample,
  CardExample,
  CheckboxExample,
  DialogExample,
  DropdownMenuExample,
  PopoverExample,
  ProgressExample,
  SelectExample,
  SeparatorExample,
  SliderExample,
  SwitchExample,
  TabsExample,
  ToggleExample,
  TooltipExample,
} from "./examples";
import { useI18n } from "./i18n";
import { LanguageSwitcher } from "./components/LanguageSwitcher";
import "./App.css";

type ExampleType =
  | "button"
  | "card"
  | "dialog"
  | "checkbox"
  | "switch"
  | "tabs"
  | "accordion"
  | "separator"
  | "alert-dialog"
  | "popover"
  | "dropdown-menu"
  | "tooltip"
  | "select"
  | "slider"
  | "progress"
  | "toggle";

const getExamples = (t: () => typeof import("./i18n/locales/zh").zh) => [
  { id: "button" as ExampleType, name: t().components.button, component: ButtonExample },
  { id: "card" as ExampleType, name: t().components.card, component: CardExample },
  { id: "dialog" as ExampleType, name: t().components.dialog, component: DialogExample },
  {
    id: "checkbox" as ExampleType,
    name: t().components.checkbox,
    component: CheckboxExample,
  },
  { id: "switch" as ExampleType, name: t().components.switch, component: SwitchExample },
  { id: "tabs" as ExampleType, name: t().components.tabs, component: TabsExample },
  {
    id: "accordion" as ExampleType,
    name: t().components.accordion,
    component: AccordionExample,
  },
  {
    id: "separator" as ExampleType,
    name: t().components.separator,
    component: SeparatorExample,
  },
  {
    id: "alert-dialog" as ExampleType,
    name: t().components.alertDialog,
    component: AlertDialogExample,
  },
  { id: "popover" as ExampleType, name: t().components.popover, component: PopoverExample },
  {
    id: "dropdown-menu" as ExampleType,
    name: t().components.dropdownMenu,
    component: DropdownMenuExample,
  },
  { id: "tooltip" as ExampleType, name: t().components.tooltip, component: TooltipExample },
  { id: "select" as ExampleType, name: t().components.select, component: SelectExample },
  { id: "slider" as ExampleType, name: t().components.slider, component: SliderExample },
  {
    id: "progress" as ExampleType,
    name: t().components.progress,
    component: ProgressExample,
  },
  { id: "toggle" as ExampleType, name: t().components.toggle, component: ToggleExample },
];

const App: Component = () => {
  const [currentExample, setCurrentExample] = createSignal<ExampleType>(
    "button",
  );
  const { t } = useI18n();
  const examples = () => getExamples(t);

  return (
    <div class="min-h-screen bg-background">
      <header class="border-b">
        <div class="container mx-auto px-4 py-4">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-3xl font-bold">{t().app.title}</h1>
              <p class="text-muted-foreground mt-2">
                {t().app.description}
              </p>
            </div>
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      <div class="container mx-auto px-4 py-6">
        <div class="flex gap-4 mb-6">
          <nav class="w-64 border-r pr-4">
            <h2 class="text-lg font-semibold mb-4">{t().app.componentList}</h2>
            <ul class="space-y-2">
              <For each={examples()}>
                {(example) => (
                  <li>
                    <button
                      type="button"
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
                )}
              </For>
            </ul>
          </nav>

          <main class="flex-1">
            {(() => {
              const selectedId = currentExample();
              const example = examples().find((e) => e.id === selectedId);
              const Component = example ? example.component : ButtonExample;
              return <Component />;
            })()}
          </main>
        </div>
      </div>
    </div>
  );
};

export default App;
