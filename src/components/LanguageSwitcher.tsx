import type { Component } from "solid-js";
import { useI18n } from "@/i18n";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const LanguageSwitcher: Component = () => {
  const { locale, setLocale, t } = useI18n();

  const handleValueChange = (value: string) => {
    setLocale(value as "zh" | "en");
  };

  return (
    <Select value={locale()} onValueChange={handleValueChange}>
      <SelectTrigger class="w-[140px]">
        <SelectValue placeholder={t().common.selectLanguage} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="zh">{t().common.chinese}</SelectItem>
        <SelectItem value="en">{t().common.english}</SelectItem>
      </SelectContent>
    </Select>
  );
};

