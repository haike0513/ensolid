import type { Component } from "solid-js";
import { createSignal } from "solid-js";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export const SwitchExample: Component = () => {
  const [enabled1, setEnabled1] = createSignal(false);
  const [enabled2, setEnabled2] = createSignal(true);
  const [enabled3, setEnabled3] = createSignal(false);

  return (
    <div class="space-y-4 p-6">
      <h2 class="text-2xl font-bold mb-4">Switch 组件示例</h2>
      
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <Label for="notifications">启用通知</Label>
          <Switch id="notifications" checked={enabled1()} onCheckedChange={setEnabled1} />
        </div>

        <div class="flex items-center justify-between">
          <Label for="marketing">营销邮件</Label>
          <Switch id="marketing" checked={enabled2()} onCheckedChange={setEnabled2} />
        </div>

        <div class="flex items-center justify-between">
          <Label for="dark-mode">深色模式</Label>
          <Switch id="dark-mode" checked={enabled3()} onCheckedChange={setEnabled3} />
        </div>

        <div class="flex items-center justify-between">
          <Label for="disabled-switch">禁用开关</Label>
          <Switch id="disabled-switch" disabled />
        </div>

        <div class="pt-4 border-t">
          <p class="text-sm text-muted-foreground">
            通知: {enabled1() ? "开启" : "关闭"}, 
            营销: {enabled2() ? "开启" : "关闭"}, 
            深色模式: {enabled3() ? "开启" : "关闭"}
          </p>
        </div>
      </div>
    </div>
  );
};

