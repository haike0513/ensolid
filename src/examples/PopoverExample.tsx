import type { Component } from "solid-js";
import { createSignal } from "solid-js";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

export const PopoverExample: Component = () => {
    const [open, setOpen] = createSignal(false);

    return (
        <div class="space-y-4 p-6">
            <h2 class="text-2xl font-bold mb-4">Popover 组件示例</h2>

            <div class="flex flex-wrap gap-4">
                <Popover open={open()} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button variant="outline">打开弹出框</Button>
                    </PopoverTrigger>
                    <PopoverContent>
                        <div class="space-y-2">
                            <h4 class="font-medium leading-none">尺寸</h4>
                            <p class="text-sm text-muted-foreground">
                                设置弹出框的尺寸和位置。
                            </p>
                        </div>
                    </PopoverContent>
                </Popover>

                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline">另一个弹出框</Button>
                    </PopoverTrigger>
                    <PopoverContent>
                        <div class="space-y-2">
                            <h4 class="font-medium leading-none">通知</h4>
                            <p class="text-sm text-muted-foreground">
                                您有 3 条未读消息。
                            </p>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    );
};

