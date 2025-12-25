import type { Component } from "solid-js";
import { createSignal } from "solid-js";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export const SelectExample: Component = () => {
    const [value, setValue] = createSignal<string>();

    return (
        <div class="space-y-4 p-6">
            <h2 class="text-2xl font-bold mb-4">Select 组件示例</h2>

            <div class="space-y-4">
                <div class="space-y-2">
                    <Label>选择框架</Label>
                    <Select value={value()} onValueChange={setValue}>
                        <SelectTrigger class="w-[180px]">
                            <SelectValue placeholder="选择一个框架" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="react">React</SelectItem>
                            <SelectItem value="vue">Vue</SelectItem>
                            <SelectItem value="solid">SolidJS</SelectItem>
                            <SelectItem value="svelte">Svelte</SelectItem>
                        </SelectContent>
                    </Select>
                    {value() && (
                        <p class="text-sm text-muted-foreground">
                            已选择: {value()}
                        </p>
                    )}
                </div>

                <div class="space-y-2">
                    <Label>选择主题</Label>
                    <Select>
                        <SelectTrigger class="w-[180px]">
                            <SelectValue placeholder="选择主题" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="light">浅色</SelectItem>
                            <SelectItem value="dark">深色</SelectItem>
                            <SelectItem value="system">系统</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div class="space-y-2">
                    <Label>选择语言</Label>
                    <Select>
                        <SelectTrigger class="w-[180px]">
                            <SelectValue placeholder="选择语言" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="zh">中文</SelectItem>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="ja">日本語</SelectItem>
                            <SelectItem value="ko">한국어</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    );
};

