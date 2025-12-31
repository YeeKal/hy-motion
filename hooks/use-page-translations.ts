'use client';

import { useTranslations } from 'next-intl';

// 按页面前缀取翻译，如 t('tool.x') → 读 tool.json 中的 x
export function usePageTranslations(pageKey: string) {
    return useTranslations(pageKey);
}
