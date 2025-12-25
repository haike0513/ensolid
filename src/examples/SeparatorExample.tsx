import { Component } from "solid-js";
import { Separator } from "@/components/ui/separator";

export const SeparatorExample: Component = () => {
  return (
    <div class="space-y-4 p-6">
      <h2 class="text-2xl font-bold mb-4">Separator 组件示例</h2>
      
      <div class="space-y-4">
        <div>
          <h3 class="text-lg font-semibold mb-2">水平分隔线</h3>
          <div class="space-y-2">
            <p>这是分隔线上方的内容</p>
            <Separator />
            <p>这是分隔线下方的内容</p>
          </div>
        </div>

        <div class="mt-6">
          <h3 class="text-lg font-semibold mb-2">垂直分隔线</h3>
          <div class="flex items-center gap-4 h-20">
            <span>左侧内容</span>
            <Separator orientation="vertical" />
            <span>中间内容</span>
            <Separator orientation="vertical" />
            <span>右侧内容</span>
          </div>
        </div>

        <div class="mt-6">
          <h3 class="text-lg font-semibold mb-2">在列表中使用</h3>
          <div class="space-y-1">
            <div class="p-2">项目 1</div>
            <Separator />
            <div class="p-2">项目 2</div>
            <Separator />
            <div class="p-2">项目 3</div>
          </div>
        </div>
      </div>
    </div>
  );
};

