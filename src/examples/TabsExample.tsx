import type { Component } from "solid-js";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export const TabsExample: Component = () => {
  return (
    <div class="space-y-4 p-6">
      <h2 class="text-2xl font-bold mb-4">Tabs 组件示例</h2>
      
      <Tabs defaultValue="account" class="w-full">
        <TabsList class="grid w-full grid-cols-3">
          <TabsTrigger value="account">账户</TabsTrigger>
          <TabsTrigger value="password">密码</TabsTrigger>
          <TabsTrigger value="settings">设置</TabsTrigger>
        </TabsList>
        <TabsContent value="account" class="mt-4">
          <div class="p-4 border rounded-lg">
            <h3 class="text-lg font-semibold mb-2">账户设置</h3>
            <p>在这里管理您的账户信息。</p>
          </div>
        </TabsContent>
        <TabsContent value="password" class="mt-4">
          <div class="p-4 border rounded-lg">
            <h3 class="text-lg font-semibold mb-2">密码设置</h3>
            <p>在这里更改您的密码。</p>
          </div>
        </TabsContent>
        <TabsContent value="settings" class="mt-4">
          <div class="p-4 border rounded-lg">
            <h3 class="text-lg font-semibold mb-2">应用设置</h3>
            <p>在这里配置应用程序设置。</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

