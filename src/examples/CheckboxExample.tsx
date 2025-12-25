import { Component, createSignal } from "solid-js";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export const CheckboxExample: Component = () => {
  const [checked1, setChecked1] = createSignal(false);
  const [checked2, setChecked2] = createSignal(true);
  const [checked3, setChecked3] = createSignal(false);

  return (
    <div class="space-y-4 p-6">
      <h2 class="text-2xl font-bold mb-4">Checkbox 组件示例</h2>
      
      <div class="space-y-4">
        <div class="flex items-center space-x-2">
          <Checkbox id="terms" checked={checked1()} onCheckedChange={setChecked1} />
          <Label for="terms">我同意服务条款</Label>
        </div>

        <div class="flex items-center space-x-2">
          <Checkbox id="newsletter" checked={checked2()} onCheckedChange={setChecked2} />
          <Label for="newsletter">订阅新闻通讯</Label>
        </div>

        <div class="flex items-center space-x-2">
          <Checkbox id="disabled" disabled />
          <Label for="disabled">禁用状态</Label>
        </div>

        <div class="flex items-center space-x-2">
          <Checkbox id="required" checked={checked3()} onCheckedChange={setChecked3} required />
          <Label for="required">必填项 *</Label>
        </div>

        <div class="pt-4">
          <p class="text-sm text-muted-foreground">
            当前状态: 条款 {checked1() ? "已同意" : "未同意"}, 
            订阅 {checked2() ? "已开启" : "已关闭"}
          </p>
        </div>
      </div>
    </div>
  );
};

