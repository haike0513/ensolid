import type { Component } from "solid-js";
import { Button } from "@/components/ui/button";

export const ButtonExample: Component = () => {
  return (
    <div class="space-y-4 p-6">
      <h2 class="text-2xl font-bold mb-4">Button 组件示例</h2>

      <div class="space-y-2">
        <h3 class="text-lg font-semibold">变体 (Variants)</h3>
        <div class="flex flex-wrap gap-2">
          <Button variant="default">默认按钮</Button>
          <Button variant="destructive">危险按钮</Button>
          <Button variant="outline">轮廓按钮</Button>
          <Button variant="secondary">次要按钮</Button>
          <Button variant="ghost">幽灵按钮</Button>
          <Button variant="link">链接按钮</Button>
        </div>
      </div>

      <div class="space-y-2">
        <h3 class="text-lg font-semibold">尺寸 (Sizes)</h3>
        <div class="flex flex-wrap items-center gap-2">
          <Button size="sm">小按钮</Button>
          <Button size="default">默认按钮</Button>
          <Button size="lg">大按钮</Button>
          <Button size="icon">🔍</Button>
        </div>
      </div>

      <div class="space-y-2">
        <h3 class="text-lg font-semibold">禁用状态</h3>
        <div class="flex flex-wrap gap-2">
          <Button disabled>禁用按钮</Button>
          <Button variant="outline" disabled>禁用轮廓按钮</Button>
        </div>
      </div>
    </div>
  );
};
