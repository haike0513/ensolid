import type { Component } from "solid-js";
import { createSignal, For } from "solid-js";
import {
  AccordionExample,
  AlertDialogExample,
  AvatarExample,
  ButtonExample,
  CardExample,
  CheckboxExample,
  CollapsibleExample,
  ContextMenuExample,
  DialogExample,
  DropdownMenuExample,
  HoverCardExample,
  PopoverExample,
  ProgressExample,
  ScrollAreaExample,
  SelectExample,
  SeparatorExample,
  SliderExample,
  SwitchExample,
  TabsExample,
  ToggleExample,
  ToggleGroupExample,
  TooltipExample,
  AspectRatioExample,
  MenubarExample,
  ToolbarExample,
  NavigationMenuExample,
  FlowExample,
  FlowCustomNodeExample,
  FlowInteractiveExample,
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
  | "toggle"
  | "avatar"
  | "collapsible"
  | "context-menu"
  | "hover-card"
  | "scroll-area"
  | "toggle-group"
  | "aspect-ratio"
  | "menubar"
  | "toolbar"
  | "navigation-menu"
  | "flow"
  | "flow-custom-node"
  | "flow-interactive";

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
  { id: "avatar" as ExampleType, name: t().components.avatar, component: AvatarExample },
  {
    id: "collapsible" as ExampleType,
    name: t().components.collapsible,
    component: CollapsibleExample,
  },
  {
    id: "context-menu" as ExampleType,
    name: t().components.contextMenu,
    component: ContextMenuExample,
  },
  {
    id: "hover-card" as ExampleType,
    name: t().components.hoverCard,
    component: HoverCardExample,
  },
  {
    id: "scroll-area" as ExampleType,
    name: t().components.scrollArea,
    component: ScrollAreaExample,
  },
  {
    id: "toggle-group" as ExampleType,
    name: t().components.toggleGroup,
    component: ToggleGroupExample,
  },
  {
    id: "aspect-ratio" as ExampleType,
    name: t().components.aspectRatio,
    component: AspectRatioExample,
  },
  {
    id: "menubar" as ExampleType,
    name: t().components.menubar,
    component: MenubarExample,
  },
  {
    id: "toolbar" as ExampleType,
    name: t().components.toolbar,
    component: ToolbarExample,
  },
  {
    id: "navigation-menu" as ExampleType,
    name: t().components.navigationMenu,
    component: NavigationMenuExample,
  },
  {
    id: "flow" as ExampleType,
    name: "Flow 流程图",
    component: FlowExample,
  },
  {
    id: "flow-custom-node" as ExampleType,
    name: "Flow 自定义节点",
    component: FlowCustomNodeExample,
  },
  {
    id: "flow-interactive" as ExampleType,
    name: "Flow 交互式",
    component: FlowInteractiveExample,
  },
];

const App: Component = () => {
  const [currentExample, setCurrentExample] = createSignal<ExampleType>(
    "button",
  );
  const { t } = useI18n();
  const examples = () => getExamples(t);

  return (
    <div class="min-h-screen bg-background">
      <header class="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div class="container mx-auto px-4 py-4">
          <div class="flex items-center justify-between">
            <div class="flex-1 flex items-center gap-3">
              <img 
                src="/resolid-logo.svg" 
                alt="Resolid Logo" 
                class="w-10 h-10 shrink-0"
              />
              <div>
                <h1 class="text-2xl font-bold tracking-tight">{t().app.title}</h1>
                <p class="text-sm text-muted-foreground mt-1">
                  {t().app.description}
                </p>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </header>

      <div class="container mx-auto px-4 py-6">
        <div class="flex gap-6">
          <aside class="w-64 shrink-0">
            <nav class="sticky top-20 space-y-1">
              <h2 class="mb-4 px-2 text-sm font-semibold tracking-tight">
                {t().app.componentList}
              </h2>
              <ul class="space-y-1">
                <For each={examples()}>
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
                const example = examples().find((e) => e.id === selectedId);
                const Component = example ? example.component : ButtonExample;
                return <Component />;
              })()}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default App;
