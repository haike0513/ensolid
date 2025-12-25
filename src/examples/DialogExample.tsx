import { Component, createSignal } from "solid-js";
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
              <DialogClose asChild>
                <Button variant="outline">取消</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button>确认</Button>
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

