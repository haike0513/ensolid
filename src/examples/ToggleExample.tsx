import type { Component } from "solid-js";
import { createSignal } from "solid-js";
import { Toggle } from "@/components/ui/toggle";
import { Label } from "@/components/ui/label";

export const ToggleExample: Component = () => {
    const [pressed, setPressed] = createSignal(false);
    const [bold, setBold] = createSignal(false);
    const [italic, setItalic] = createSignal(false);

    return (
        <div class="space-y-4 p-6">
            <h2 class="text-2xl font-bold mb-4">Toggle 组件示例</h2>

            <div class="space-y-4">
                <div class="space-y-2">
                    <Label>单个切换按钮</Label>
                    <div class="flex items-center gap-2">
                        <Toggle pressed={pressed()} onPressedChange={setPressed}>
                            {pressed() ? "已启用" : "已禁用"}
                        </Toggle>
                        <span class="text-sm text-muted-foreground">
                            状态: {pressed() ? "开启" : "关闭"}
                        </span>
                    </div>
                </div>

                <div class="space-y-2">
                    <Label>文本格式</Label>
                    <div class="flex gap-2">
                        <Toggle pressed={bold()} onPressedChange={setBold}>
                            <strong>B</strong>
                        </Toggle>
                        <Toggle pressed={italic()} onPressedChange={setItalic}>
                            <em>I</em>
                        </Toggle>
                    </div>
                    <p class="text-sm text-muted-foreground">
                        粗体: {bold() ? "开启" : "关闭"}, 斜体:{" "}
                        {italic() ? "开启" : "关闭"}
                    </p>
                </div>

                <div class="space-y-2">
                    <Label>图标切换</Label>
                    <div class="flex gap-2">
                        <Toggle>🔔</Toggle>
                        <Toggle>⭐</Toggle>
                        <Toggle>❤️</Toggle>
                    </div>
                </div>

                <div class="space-y-2">
                    <Label>禁用状态</Label>
                    <div class="flex gap-2">
                        <Toggle disabled>禁用</Toggle>
                        <Toggle pressed disabled>
                            禁用（已按下）
                        </Toggle>
                    </div>
                </div>
            </div>
        </div>
    );
};

