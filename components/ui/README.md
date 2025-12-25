# shadcn/ui 风格组件

本目录包含基于 `@resolid/radix` 实现的 shadcn/ui 风格组件。

## 可用组件

- **Button** - 按钮组件，支持多种变体和尺寸
- **Card** - 卡片组件，包含 Header、Title、Description、Content、Footer 子组件
- **Dialog** - 对话框组件，基于 Radix Dialog
- **Checkbox** - 复选框组件，基于 Radix Checkbox
- **Switch** - 开关组件，基于 Radix Switch
- **Tabs** - 标签页组件，基于 Radix Tabs
- **Accordion** - 手风琴组件，基于 Radix Accordion
- **Label** - 标签组件，基于 Radix Label
- **Separator** - 分隔线组件，基于 Radix Separator

## 使用方法

### 导入组件

```tsx
import { Button, Card, Dialog } from "@/components/ui";
```

### Button 示例

```tsx
import { Button } from "@/components/ui/button";

function App() {
  return (
    <div>
      <Button variant="default">默认按钮</Button>
      <Button variant="destructive">危险按钮</Button>
      <Button variant="outline">轮廓按钮</Button>
      <Button variant="secondary">次要按钮</Button>
      <Button variant="ghost">幽灵按钮</Button>
      <Button variant="link">链接按钮</Button>
      <Button size="sm">小按钮</Button>
      <Button size="lg">大按钮</Button>
    </div>
  );
}
```

### Card 示例

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function App() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>卡片标题</CardTitle>
        <CardDescription>卡片描述</CardDescription>
      </CardHeader>
      <CardContent>
        <p>卡片内容</p>
      </CardContent>
      <CardFooter>
        <Button>操作</Button>
      </CardFooter>
    </Card>
  );
}
```

### Dialog 示例

```tsx
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

function App() {
  const [open, setOpen] = createSignal(false);

  return (
    <Dialog open={open()} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>打开对话框</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>对话框标题</DialogTitle>
          <DialogDescription>对话框描述</DialogDescription>
        </DialogHeader>
        <p>对话框内容</p>
        <DialogClose>
          <Button>关闭</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
```

### Checkbox 示例

```tsx
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

function App() {
  const [checked, setChecked] = createSignal(false);

  return (
    <div>
      <Label>
        <Checkbox checked={checked()} onCheckedChange={setChecked} />
        同意条款
      </Label>
    </div>
  );
}
```

### Switch 示例

```tsx
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

function App() {
  const [enabled, setEnabled] = createSignal(false);

  return (
    <div>
      <Label>
        <Switch checked={enabled()} onCheckedChange={setEnabled} />
        启用通知
      </Label>
    </div>
  );
}
```

### Tabs 示例

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

function App() {
  return (
    <Tabs defaultValue="tab1">
      <TabsList>
        <TabsTrigger value="tab1">标签 1</TabsTrigger>
        <TabsTrigger value="tab2">标签 2</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">内容 1</TabsContent>
      <TabsContent value="tab2">内容 2</TabsContent>
    </Tabs>
  );
}
```

### Accordion 示例

```tsx
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

function App() {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger>项目 1</AccordionTrigger>
        <AccordionContent>项目 1 的内容</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>项目 2</AccordionTrigger>
        <AccordionContent>项目 2 的内容</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
```

## 样式说明

这些组件使用了类似 Tailwind CSS 的类名，但实际样式需要您自己配置。建议：

1. 安装 Tailwind CSS 并配置
2. 或者使用 CSS 变量定义主题颜色
3. 或者直接修改组件的类名来适配您的样式系统

## 设计原则

这些组件遵循 shadcn/ui 的设计原则：

- **可组合** - 组件可以灵活组合使用
- **可定制** - 通过 props 和 class 属性轻松定制
- **基于 Radix** - 使用 Radix UI Primitives 提供可访问性和功能
- **无样式** - 样式通过类名控制，易于定制

