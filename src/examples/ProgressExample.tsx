import type { Component } from "solid-js";
import { createSignal, onMount } from "solid-js";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";

export const ProgressExample: Component = () => {
    const [progress, setProgress] = createSignal(0);

    onMount(() => {
        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(timer);
                    return 100;
                }
                return prev + 10;
            });
        }, 500);

        return () => clearInterval(timer);
    });

    return (
        <div class="space-y-4 p-6">
            <h2 class="text-2xl font-bold mb-4">Progress 组件示例</h2>

            <div class="space-y-4">
                <div class="space-y-2">
                    <Label>加载进度: {progress()}%</Label>
                    <Progress value={progress()} />
                </div>

                <div class="space-y-2">
                    <Label>进度 25%</Label>
                    <Progress value={25} />
                </div>

                <div class="space-y-2">
                    <Label>进度 50%</Label>
                    <Progress value={50} />
                </div>

                <div class="space-y-2">
                    <Label>进度 75%</Label>
                    <Progress value={75} />
                </div>

                <div class="space-y-2">
                    <Label>进度 100%</Label>
                    <Progress value={100} />
                </div>

                <div class="space-y-2">
                    <Label>显示百分比</Label>
                    <Progress value={65} showValue />
                </div>
            </div>
        </div>
    );
};

