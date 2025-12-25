import type { Component } from "solid-js";
import { createSignal } from "solid-js";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

export const SliderExample: Component = () => {
    const [value, setValue] = createSignal<number[]>([50]);
    const [volume, setVolume] = createSignal<number[]>([30]);
    const [brightness, setBrightness] = createSignal<number[]>([80]);

    return (
        <div class="space-y-4 p-6">
            <h2 class="text-2xl font-bold mb-4">Slider 组件示例</h2>

            <div class="space-y-6">
                <div class="space-y-2">
                    <Label>音量: {value()[0]}%</Label>
                    <Slider
                        value={value()}
                        onValueChange={setValue}
                        min={0}
                        max={100}
                        step={1}
                    />
                </div>

                <div class="space-y-2">
                    <Label>音量控制: {volume()[0]}%</Label>
                    <Slider
                        value={volume()}
                        onValueChange={setVolume}
                        min={0}
                        max={100}
                        step={5}
                    />
                </div>

                <div class="space-y-2">
                    <Label>亮度: {brightness()[0]}%</Label>
                    <Slider
                        value={brightness()}
                        onValueChange={setBrightness}
                        min={0}
                        max={100}
                        step={1}
                    />
                </div>

                <div class="space-y-2">
                    <Label>禁用状态</Label>
                    <Slider
                        defaultValue={[50]}
                        disabled
                    />
                </div>

                <div class="space-y-2">
                    <Label>范围: 0-1000</Label>
                    <Slider
                        defaultValue={[500]}
                        min={0}
                        max={1000}
                        step={10}
                    />
                </div>
            </div>
        </div>
    );
};

