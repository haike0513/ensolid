import { Component } from "solid-js";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const CardExample: Component = () => {
  return (
    <div class="space-y-4 p-6">
      <h2 class="text-2xl font-bold mb-4">Card 组件示例</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>卡片标题</CardTitle>
            <CardDescription>这是一个卡片描述，用于说明卡片的内容。</CardDescription>
          </CardHeader>
          <CardContent>
            <p>这是卡片的主要内容区域。您可以在这里放置任何内容。</p>
          </CardContent>
          <CardFooter>
            <Button>操作按钮</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>另一个卡片</CardTitle>
            <CardDescription>展示不同的卡片内容。</CardDescription>
          </CardHeader>
          <CardContent>
            <p>卡片组件非常适合展示相关信息或功能模块。</p>
          </CardContent>
          <CardFooter class="flex justify-between">
            <Button variant="outline">取消</Button>
            <Button>确认</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

