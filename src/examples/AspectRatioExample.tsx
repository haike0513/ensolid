import type { Component } from "solid-js";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useI18n } from "@/i18n";

export const AspectRatioExample: Component = () => {
  const { t } = useI18n();

  return (
    <div class="space-y-4 p-6">
      <h2 class="text-2xl font-bold mb-4">{t().aspectRatio.title}</h2>

      <div class="space-y-4">
        <div class="space-y-2">
          <h3 class="text-lg font-semibold">{t().aspectRatio.basic}</h3>
          <div class="w-[450px]">
            <AspectRatio ratio={16 / 9} class="bg-muted rounded-md overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&h=450&fit=crop"
                alt="Photo"
                class="h-full w-full object-cover"
              />
            </AspectRatio>
          </div>
        </div>

        <div class="space-y-2">
          <h3 class="text-lg font-semibold">{t().aspectRatio.differentRatios}</h3>
          <div class="grid grid-cols-3 gap-4 w-full max-w-3xl">
            <div class="space-y-2">
              <p class="text-sm text-muted-foreground">16:9</p>
              <AspectRatio ratio={16 / 9} class="bg-muted rounded-md" />
            </div>
            <div class="space-y-2">
              <p class="text-sm text-muted-foreground">4:3</p>
              <AspectRatio ratio={4 / 3} class="bg-muted rounded-md" />
            </div>
            <div class="space-y-2">
              <p class="text-sm text-muted-foreground">1:1</p>
              <AspectRatio ratio={1} class="bg-muted rounded-md" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

