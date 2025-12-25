import type { Component } from "solid-js";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

export const TooltipExample: Component = () => {
    return (
        <div class="space-y-4 p-6">
            <h2 class="text-2xl font-bold mb-4">Tooltip 组件示例</h2>

            <div class="flex flex-wrap gap-4">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="outline">悬停我</Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>这是一个工具提示</p>
                    </TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="outline">另一个提示</Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>工具提示用于提供额外的信息</p>
                    </TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="ghost">按钮</Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>点击此按钮执行操作</p>
                    </TooltipContent>
                </Tooltip>
            </div>

            <div class="mt-6">
                <h3 class="text-lg font-semibold mb-2">在文本上使用</h3>
                <p class="text-muted-foreground">
                    这是一个包含{" "}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span class="underline decoration-dotted cursor-help">
                                工具提示
                            </span>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>这是内联工具提示的示例</p>
                        </TooltipContent>
                    </Tooltip>
                    {" "}的段落。
                </p>
            </div>
        </div>
    );
};

