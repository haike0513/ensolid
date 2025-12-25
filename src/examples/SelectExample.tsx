import type { Component } from "solid-js";
import { createSignal } from "solid-js";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/i18n";

export const SelectExample: Component = () => {
    const [value, setValue] = createSignal<string>();
    const { t } = useI18n();

    return (
        <div class="space-y-4 p-6">
            <h2 class="text-2xl font-bold mb-4">{t().select.title}</h2>

            <div class="space-y-4">
                <div class="space-y-2">
                    <Label>{t().select.selectFramework}</Label>
                    <Select value={value()} onValueChange={setValue}>
                        <SelectTrigger class="w-[180px]">
                            <SelectValue placeholder={t().select.selectFrameworkPlaceholder} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="react">React</SelectItem>
                            <SelectItem value="vue">Vue</SelectItem>
                            <SelectItem value="solid">SolidJS</SelectItem>
                            <SelectItem value="svelte">Svelte</SelectItem>
                        </SelectContent>
                    </Select>
                    {value() && (
                        <p class="text-sm text-muted-foreground">
                            {t().select.selected}: {value()}
                        </p>
                    )}
                </div>

                <div class="space-y-2">
                    <Label>{t().common.selectTheme}</Label>
                    <Select>
                        <SelectTrigger class="w-[180px]">
                            <SelectValue placeholder={t().select.selectThemePlaceholder} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="light">{t().common.light}</SelectItem>
                            <SelectItem value="dark">{t().common.dark}</SelectItem>
                            <SelectItem value="system">{t().common.system}</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div class="space-y-2">
                    <Label>{t().common.selectLanguage}</Label>
                    <Select>
                        <SelectTrigger class="w-[180px]">
                            <SelectValue placeholder={t().select.selectLanguagePlaceholder} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="zh">{t().common.chinese}</SelectItem>
                            <SelectItem value="en">{t().common.english}</SelectItem>
                            <SelectItem value="ja">{t().common.japanese}</SelectItem>
                            <SelectItem value="ko">{t().common.korean}</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    );
};

