import type { Component } from "solid-js";
import { NavigationMenu } from "@/components/ui/navigation-menu";
import { useI18n } from "@/i18n";

export const NavigationMenuExample: Component = () => {
  const { t } = useI18n();

  return (
    <div class="space-y-4 p-6">
      <h2 class="text-2xl font-bold mb-4">{t().navigationMenu.title}</h2>

      <div class="space-y-4">
        <div class="space-y-2">
          <p class="text-sm text-muted-foreground">{t().navigationMenu.description}</p>
          <NavigationMenu>
            <NavigationMenu.List>
              <NavigationMenu.Item value="components">
                <NavigationMenu.Trigger>{t().navigationMenu.components}</NavigationMenu.Trigger>
                <NavigationMenu.Content>
                  <ul class="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    <li class="row-span-3">
                      <a
                        class="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                        href="/"
                      >
                        <div class="mb-2 mt-4 text-lg font-medium">
                          {t().navigationMenu.uiComponents}
                        </div>
                        <p class="text-sm leading-tight text-muted-foreground">
                          {t().navigationMenu.uiComponentsDesc}
                        </p>
                      </a>
                    </li>
                    <li>
                      <a
                        class="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        href="/"
                      >
                        <div class="text-sm font-medium leading-none">{t().navigationMenu.alertDialog}</div>
                        <p class="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          {t().navigationMenu.alertDialogDesc}
                        </p>
                      </a>
                    </li>
                    <li>
                      <a
                        class="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        href="/"
                      >
                        <div class="text-sm font-medium leading-none">{t().navigationMenu.hoverCard}</div>
                        <p class="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          {t().navigationMenu.hoverCardDesc}
                        </p>
                      </a>
                    </li>
                  </ul>
                </NavigationMenu.Content>
              </NavigationMenu.Item>
              <NavigationMenu.Item value="examples">
                <NavigationMenu.Trigger>{t().navigationMenu.examples}</NavigationMenu.Trigger>
                <NavigationMenu.Content>
                  <ul class="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    <li>
                      <a
                        class="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        href="/"
                      >
                        <div class="text-sm font-medium leading-none">{t().navigationMenu.basicExample}</div>
                        <p class="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          {t().navigationMenu.basicExampleDesc}
                        </p>
                      </a>
                    </li>
                    <li>
                      <a
                        class="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        href="/"
                      >
                        <div class="text-sm font-medium leading-none">{t().navigationMenu.advancedExample}</div>
                        <p class="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          {t().navigationMenu.advancedExampleDesc}
                        </p>
                      </a>
                    </li>
                  </ul>
                </NavigationMenu.Content>
              </NavigationMenu.Item>
              <NavigationMenu.Item value="docs">
                <NavigationMenu.Link href="/docs">
                  {t().navigationMenu.documentation}
                </NavigationMenu.Link>
              </NavigationMenu.Item>
            </NavigationMenu.List>
            <NavigationMenu.Viewport />
          </NavigationMenu>
        </div>
      </div>
    </div>
  );
};

