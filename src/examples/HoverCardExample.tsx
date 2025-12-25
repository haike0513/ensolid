import type { Component } from "solid-js";
import { HoverCard } from "@/components/ui/hover-card";
import { Avatar } from "@/components/ui/avatar";
import { useI18n } from "@/i18n";

export const HoverCardExample: Component = () => {
  const { t } = useI18n();

  return (
    <div class="space-y-4 p-6">
      <h2 class="text-2xl font-bold mb-4">{t().hoverCard.title}</h2>

      <div class="space-y-4">
        <div class="space-y-2">
          <p class="text-sm text-muted-foreground">{t().hoverCard.description}</p>
          <HoverCard>
            <HoverCard.Trigger asChild>
              <a
                href="https://twitter.com/shadcn"
                target="_blank"
                rel="noopener noreferrer"
                class="text-sm font-medium underline underline-offset-4 hover:text-primary"
              >
                @shadcn
              </a>
            </HoverCard.Trigger>
            <HoverCard.Content class="w-80">
              <div class="flex justify-between space-x-4">
                <Avatar>
                  <Avatar.Image src="https://github.com/shadcn.png" />
                  <Avatar.Fallback>SC</Avatar.Fallback>
                </Avatar>
                <div class="space-y-1">
                  <h4 class="text-sm font-semibold">@shadcn</h4>
                  <p class="text-sm text-muted-foreground">
                    {t().hoverCard.bio}
                  </p>
                  <div class="flex items-center pt-2">
                    <span class="text-xs text-muted-foreground">
                      {t().hoverCard.following} 20 · {t().hoverCard.followers} 1.2K
                    </span>
                  </div>
                </div>
              </div>
            </HoverCard.Content>
          </HoverCard>
        </div>
      </div>
    </div>
  );
};

