import type { Component } from "solid-js";
import { Menubar } from "@/components/ui/menubar";
import { useI18n } from "@/i18n";

export const MenubarExample: Component = () => {
  const { t } = useI18n();

  return (
    <div class="space-y-4 p-6">
      <h2 class="text-2xl font-bold mb-4">{t().menubar.title}</h2>

      <div class="space-y-4">
        <div class="space-y-2">
          <p class="text-sm text-muted-foreground">{t().menubar.description}</p>
          <Menubar>
            <Menubar.Menu value="file">
              <Menubar.Trigger>{t().menubar.file}</Menubar.Trigger>
              <Menubar.Content>
                <Menubar.Item>{t().menubar.newTab}</Menubar.Item>
                <Menubar.Item>{t().menubar.newWindow}</Menubar.Item>
                <Menubar.Separator />
                <Menubar.Item>{t().menubar.share}</Menubar.Item>
                <Menubar.Separator />
                <Menubar.Item>{t().menubar.print}</Menubar.Item>
              </Menubar.Content>
            </Menubar.Menu>
            <Menubar.Menu value="edit">
              <Menubar.Trigger>{t().menubar.edit}</Menubar.Trigger>
              <Menubar.Content>
                <Menubar.Item>{t().menubar.undo}</Menubar.Item>
                <Menubar.Item>{t().menubar.redo}</Menubar.Item>
                <Menubar.Separator />
                <Menubar.Item>{t().menubar.find}</Menubar.Item>
                <Menubar.Item>{t().menubar.replace}</Menubar.Item>
              </Menubar.Content>
            </Menubar.Menu>
            <Menubar.Menu value="view">
              <Menubar.Trigger>{t().menubar.view}</Menubar.Trigger>
              <Menubar.Content>
                <Menubar.Item>{t().menubar.zoomIn}</Menubar.Item>
                <Menubar.Item>{t().menubar.zoomOut}</Menubar.Item>
                <Menubar.Separator />
                <Menubar.Item>{t().menubar.fullscreen}</Menubar.Item>
              </Menubar.Content>
            </Menubar.Menu>
          </Menubar>
        </div>
      </div>
    </div>
  );
};

