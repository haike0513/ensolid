import type { Component } from "solid-js";
import { createSignal } from "solid-js";
import { Collapsible } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n";

export const CollapsibleExample: Component = () => {
  const { t } = useI18n();
  const [open, setOpen] = createSignal(false);

  return (
    <div class="space-y-4 p-6">
      <h2 class="text-2xl font-bold mb-4">{t().collapsible.title}</h2>

      <div class="space-y-4">
        <Collapsible open={open()} onOpenChange={setOpen} class="w-[350px] space-y-2">
          <div class="flex items-center justify-between space-x-4 px-4">
            <h4 class="text-sm font-semibold">{t().collapsible.header}</h4>
            <Collapsible.Trigger asChild>
              <Button variant="ghost" size="sm" class="w-9 p-0">
                <span class="sr-only">{t().collapsible.toggle}</span>
                {open() ? "−" : "+"}
              </Button>
            </Collapsible.Trigger>
          </div>
          <div class="px-4 py-2 text-sm text-muted-foreground">
            {t().collapsible.preview}
          </div>
          <Collapsible.Content class="space-y-2 px-4">
            <div class="rounded-md border px-4 py-3 text-sm">
              {t().collapsible.content1}
            </div>
            <div class="rounded-md border px-4 py-3 text-sm">
              {t().collapsible.content2}
            </div>
            <div class="rounded-md border px-4 py-3 text-sm">
              {t().collapsible.content3}
            </div>
          </Collapsible.Content>
        </Collapsible>
      </div>
    </div>
  );
};

