import type { Component } from "solid-js";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useI18n } from "@/i18n";

export const ScrollAreaExample: Component = () => {
  const { t } = useI18n();

  const tags = Array.from({ length: 50 }).map((_, i) => `标签 ${i + 1}`);

  return (
    <div class="space-y-4 p-6">
      <h2 class="text-2xl font-bold mb-4">{t().scrollArea.title}</h2>

      <div class="space-y-4">
        <div class="space-y-2">
          <h3 class="text-lg font-semibold">{t().scrollArea.basic}</h3>
          <ScrollArea class="h-72 w-48 rounded-md border">
            <ScrollArea.Viewport>
              <div class="p-4 space-y-1">
                {tags.map((tag) => (
                  <div class="text-sm">{tag}</div>
                ))}
              </div>
            </ScrollArea.Viewport>
            <ScrollArea.Scrollbar orientation="vertical">
              <ScrollArea.Thumb />
            </ScrollArea.Scrollbar>
            <ScrollArea.Corner />
          </ScrollArea>
        </div>

        <div class="space-y-2">
          <h3 class="text-lg font-semibold">{t().scrollArea.withViewport}</h3>
          <ScrollArea class="h-[300px] w-full rounded-md border">
            <ScrollArea.Viewport>
              <div class="p-4 space-y-4">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div class="p-4 border rounded-md">
                    <h4 class="font-semibold mb-2">{t().scrollArea.item} {i + 1}</h4>
                    <p class="text-sm text-muted-foreground">
                      {t().scrollArea.content}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollArea.Viewport>
            <ScrollArea.Scrollbar orientation="vertical">
              <ScrollArea.Thumb />
            </ScrollArea.Scrollbar>
            <ScrollArea.Corner />
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

