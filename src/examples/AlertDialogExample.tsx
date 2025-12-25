import type { Component } from "solid-js";
import { createSignal } from "solid-js";
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogAction,
    AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export const AlertDialogExample: Component = () => {
    const [open, setOpen] = createSignal(false);

    return (
        <div class="space-y-4 p-6">
            <h2 class="text-2xl font-bold mb-4">AlertDialog 组件示例</h2>

            <div class="space-y-2">
                <AlertDialog open={open()} onOpenChange={setOpen}>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive">删除账户</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>确定要删除账户吗？</AlertDialogTitle>
                            <AlertDialogDescription>
                                此操作无法撤销。这将永久删除您的账户并删除您数据服务器中的所有数据。
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <div class="flex justify-end gap-2 mt-4">
                            <AlertDialogCancel asChild>
                                <Button variant="outline">取消</Button>
                            </AlertDialogCancel>
                            <AlertDialogAction asChild>
                                <Button variant="destructive">删除</Button>
                            </AlertDialogAction>
                        </div>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    );
};

