import type { Component } from "solid-js";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export const DropdownMenuExample: Component = () => {
    return (
        <div class="space-y-4 p-6">
            <h2 class="text-2xl font-bold mb-4">DropdownMenu 组件示例</h2>

            <div class="flex flex-wrap gap-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">打开菜单</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>我的账户</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>个人资料</DropdownMenuItem>
                        <DropdownMenuItem>账单</DropdownMenuItem>
                        <DropdownMenuItem>团队</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>登出</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">操作菜单</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem>编辑</DropdownMenuItem>
                        <DropdownMenuItem>复制</DropdownMenuItem>
                        <DropdownMenuItem>分享</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem disabled>删除</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
};

