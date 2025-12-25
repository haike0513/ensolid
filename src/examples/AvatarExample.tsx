import type { Component } from "solid-js";
import { Avatar } from "@/components/ui/avatar";
import { useI18n } from "@/i18n";

export const AvatarExample: Component = () => {
  const { t } = useI18n();

  return (
    <div class="space-y-4 p-6">
      <h2 class="text-2xl font-bold mb-4">{t().avatar.title}</h2>

      <div class="space-y-4">
        <div class="space-y-2">
          <h3 class="text-lg font-semibold">{t().avatar.basic}</h3>
          <div class="flex items-center gap-4">
            <Avatar>
              <Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
              <Avatar.Fallback>CN</Avatar.Fallback>
            </Avatar>
            <Avatar>
              <Avatar.Image src="https://github.com/vercel.png" alt="@vercel" />
              <Avatar.Fallback>VC</Avatar.Fallback>
            </Avatar>
            <Avatar>
              <Avatar.Fallback>AB</Avatar.Fallback>
            </Avatar>
          </div>
        </div>

        <div class="space-y-2">
          <h3 class="text-lg font-semibold">{t().avatar.sizes}</h3>
          <div class="flex items-center gap-4">
            <Avatar class="h-8 w-8">
              <Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
              <Avatar.Fallback>SM</Avatar.Fallback>
            </Avatar>
            <Avatar class="h-12 w-12">
              <Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
              <Avatar.Fallback>MD</Avatar.Fallback>
            </Avatar>
            <Avatar class="h-16 w-16">
              <Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
              <Avatar.Fallback>LG</Avatar.Fallback>
            </Avatar>
          </div>
        </div>

        <div class="space-y-2">
          <h3 class="text-lg font-semibold">{t().avatar.fallback}</h3>
          <div class="flex items-center gap-4">
            <Avatar>
              <Avatar.Image src="https://invalid-url.png" alt="Invalid" />
              <Avatar.Fallback>错误</Avatar.Fallback>
            </Avatar>
            <Avatar>
              <Avatar.Fallback>无图片</Avatar.Fallback>
            </Avatar>
          </div>
        </div>
      </div>
    </div>
  );
};

