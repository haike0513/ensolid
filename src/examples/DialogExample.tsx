import type { Component } from "solid-js";
import { createSignal } from "solid-js";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export const DialogExample: Component = () => {
  const [open, setOpen] = createSignal(false);

  return (
    <div class="space-y-4 p-6">
      <h2 class="text-2xl font-bold mb-4">Dialog 组件示例</h2>
      
      <div class="flex flex-wrap gap-2">
        <Dialog open={open()} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>打开对话框</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>对话框标题</DialogTitle>
              <DialogDescription>
                这是一个对话框示例。您可以在这里放置任何内容。
              </DialogDescription>
            </DialogHeader>
            <div class="py-4">
              <p>这是对话框的主要内容区域。</p>
            </div>
            <div class="flex justify-end gap-2">
              <DialogClose class="px-4 py-2 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground">
                取消
              </DialogClose>
              <DialogClose class="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90">
                确认
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

