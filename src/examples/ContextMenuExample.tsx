import type { Component } from "solid-js";
import { ContextMenu } from "@/components/ui/context-menu";
import { useI18n } from "@/i18n";

export const ContextMenuExample: Component = () => {
  const { t } = useI18n();

  return (
    <div class="space-y-4 p-6">
      <h2 class="text-2xl font-bold mb-4">{t().contextMenu.title}</h2>

      <div class="space-y-4">
        <div class="space-y-2">
          <p class="text-sm text-muted-foreground">{t().contextMenu.description}</p>
          <ContextMenu>
            <ContextMenu.Trigger class="flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm">
              {t().contextMenu.rightClick}
            </ContextMenu.Trigger>
            <ContextMenu.Content class="w-64">
              <ContextMenu.Label>{t().contextMenu.myAccount}</ContextMenu.Label>
              <ContextMenu.Separator />
              <ContextMenu.Item>
                {t().contextMenu.profile}
              </ContextMenu.Item>
              <ContextMenu.Item>
                {t().contextMenu.billing}
              </ContextMenu.Item>
              <ContextMenu.Item>
                {t().contextMenu.settings}
              </ContextMenu.Item>
              <ContextMenu.Separator />
              <ContextMenu.Item>
                {t().contextMenu.team}
              </ContextMenu.Item>
              <ContextMenu.Separator />
              <ContextMenu.Item>
                {t().contextMenu.logout}
              </ContextMenu.Item>
            </ContextMenu.Content>
          </ContextMenu>
        </div>
      </div>
    </div>
  );
};

