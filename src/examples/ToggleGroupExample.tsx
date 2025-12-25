import type { Component } from "solid-js";
import { createSignal } from "solid-js";
import { ToggleGroup } from "@/components/ui/toggle-group";
import { useI18n } from "@/i18n";

export const ToggleGroupExample: Component = () => {
  const { t } = useI18n();
  const [value, setValue] = createSignal<string>("center");
  const [multipleValue, setMultipleValue] = createSignal<string[]>(["bold", "italic"]);

  return (
    <div class="space-y-4 p-6">
      <h2 class="text-2xl font-bold mb-4">{t().toggleGroup.title}</h2>

      <div class="space-y-4">
        <div class="space-y-2">
          <h3 class="text-lg font-semibold">{t().toggleGroup.single}</h3>
          <ToggleGroup type="single" value={value()} onValueChange={(v) => setValue(v as string)}>
            <ToggleGroup.Item value="left" aria-label="左对齐">
              ←
            </ToggleGroup.Item>
            <ToggleGroup.Item value="center" aria-label="居中">
              ↔
            </ToggleGroup.Item>
            <ToggleGroup.Item value="right" aria-label="右对齐">
              →
            </ToggleGroup.Item>
          </ToggleGroup>
          <p class="text-sm text-muted-foreground">
            {t().toggleGroup.selected}: {value() || t().toggleGroup.none}
          </p>
        </div>

        <div class="space-y-2">
          <h3 class="text-lg font-semibold">{t().toggleGroup.multiple}</h3>
          <ToggleGroup type="multiple" value={multipleValue()} onValueChange={(v) => setMultipleValue(v as string[])}>
            <ToggleGroup.Item value="bold" aria-label="粗体">
              <strong>B</strong>
            </ToggleGroup.Item>
            <ToggleGroup.Item value="italic" aria-label="斜体">
              <em>I</em>
            </ToggleGroup.Item>
            <ToggleGroup.Item value="underline" aria-label="下划线">
              <u>U</u>
            </ToggleGroup.Item>
          </ToggleGroup>
          <p class="text-sm text-muted-foreground">
            {t().toggleGroup.selected}: {multipleValue().join(", ") || t().toggleGroup.none}
          </p>
        </div>

        <div class="space-y-2">
          <h3 class="text-lg font-semibold">{t().toggleGroup.disabled}</h3>
          <ToggleGroup type="single" disabled>
            <ToggleGroup.Item value="left">←</ToggleGroup.Item>
            <ToggleGroup.Item value="center">↔</ToggleGroup.Item>
            <ToggleGroup.Item value="right">→</ToggleGroup.Item>
          </ToggleGroup>
        </div>
      </div>
    </div>
  );
};

