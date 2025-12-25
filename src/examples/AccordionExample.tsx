import { Component } from "solid-js";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

export const AccordionExample: Component = () => {
  return (
    <div class="space-y-4 p-6">
      <h2 class="text-2xl font-bold mb-4">Accordion 组件示例</h2>
      
      <Accordion type="single" collapsible class="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>这是第一个项目</AccordionTrigger>
          <AccordionContent>
            这是第一个项目的内容。您可以在这里放置任何信息。
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>这是第二个项目</AccordionTrigger>
          <AccordionContent>
            这是第二个项目的内容。Accordion 组件非常适合展示可折叠的内容。
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>这是第三个项目</AccordionTrigger>
          <AccordionContent>
            这是第三个项目的内容。每个项目都可以独立展开和折叠。
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div class="mt-6">
        <h3 class="text-lg font-semibold mb-2">多个展开模式</h3>
        <Accordion type="multiple" class="w-full">
          <AccordionItem value="multi-1">
            <AccordionTrigger>多选项目 1</AccordionTrigger>
            <AccordionContent>
              在多个展开模式下，可以同时展开多个项目。
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="multi-2">
            <AccordionTrigger>多选项目 2</AccordionTrigger>
            <AccordionContent>
              这个项目也可以与上面的项目同时展开。
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

