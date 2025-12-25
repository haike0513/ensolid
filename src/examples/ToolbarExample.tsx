import type { Component } from "solid-js";
import { Toolbar } from "@/components/ui/toolbar";
import { useI18n } from "@/i18n";

export const ToolbarExample: Component = () => {
  const { t } = useI18n();

  return (
    <div class="space-y-4 p-6">
      <h2 class="text-2xl font-bold mb-4">{t().toolbar.title}</h2>

      <div class="space-y-4">
        <div class="space-y-2">
          <h3 class="text-lg font-semibold">{t().toolbar.basic}</h3>
          <Toolbar>
            <Toolbar.Button>
              {t().toolbar.bold}
            </Toolbar.Button>
            <Toolbar.Button>
              {t().toolbar.italic}
            </Toolbar.Button>
            <Toolbar.Button>
              {t().toolbar.underline}
            </Toolbar.Button>
            <Toolbar.Separator />
            <Toolbar.Button>
              {t().toolbar.alignLeft}
            </Toolbar.Button>
            <Toolbar.Button>
              {t().toolbar.alignCenter}
            </Toolbar.Button>
            <Toolbar.Button>
              {t().toolbar.alignRight}
            </Toolbar.Button>
          </Toolbar>
        </div>

        <div class="space-y-2">
          <h3 class="text-lg font-semibold">{t().toolbar.withToggleGroup}</h3>
          <Toolbar>
            <Toolbar.ToggleGroup type="multiple">
              <Toolbar.ToggleItem value="bold">
                <strong>B</strong>
              </Toolbar.ToggleItem>
              <Toolbar.ToggleItem value="italic">
                <em>I</em>
              </Toolbar.ToggleItem>
              <Toolbar.ToggleItem value="underline">
                <u>U</u>
              </Toolbar.ToggleItem>
            </Toolbar.ToggleGroup>
            <Toolbar.Separator />
            <Toolbar.Link href="#" target="_blank">
              {t().toolbar.link}
            </Toolbar.Link>
          </Toolbar>
        </div>
      </div>
    </div>
  );
};

