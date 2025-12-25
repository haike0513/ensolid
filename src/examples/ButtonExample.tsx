import type { Component } from "solid-js";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n";

export const ButtonExample: Component = () => {
  const { t } = useI18n();

  return (
    <div class="space-y-4 p-6">
      <h2 class="text-2xl font-bold mb-4">{t().button.title}</h2>

      <div class="space-y-2">
        <h3 class="text-lg font-semibold">{t().button.variants}</h3>
        <div class="flex flex-wrap gap-2">
          <Button variant="default">{t().button.default}</Button>
          <Button variant="destructive">{t().button.destructive}</Button>
          <Button variant="outline">{t().button.outline}</Button>
          <Button variant="secondary">{t().button.secondary}</Button>
          <Button variant="ghost">{t().button.ghost}</Button>
          <Button variant="link">{t().button.link}</Button>
        </div>
      </div>

      <div class="space-y-2">
        <h3 class="text-lg font-semibold">{t().button.sizes}</h3>
        <div class="flex flex-wrap items-center gap-2">
          <Button size="sm">{t().button.small}</Button>
          <Button size="default">{t().button.defaultSize}</Button>
          <Button size="lg">{t().button.large}</Button>
          <Button size="icon">🔍</Button>
        </div>
      </div>

      <div class="space-y-2">
        <h3 class="text-lg font-semibold">{t().button.disabled}</h3>
        <div class="flex flex-wrap gap-2">
          <Button disabled>{t().button.disabledButton}</Button>
          <Button variant="outline" disabled>{t().button.disabledOutline}</Button>
        </div>
      </div>
    </div>
  );
};
