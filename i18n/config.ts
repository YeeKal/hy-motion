export const locales = ['en'] as const;
export const defaultLocale = 'en';
export type Locale = (typeof locales)[number];

export const languageMap: Record<string, string> = {
    en: 'English',              // 英语
    // zh: '简体中文',              // 简体中文 (中国大陆/新加坡)
    // 'zh-TW': '繁體中文',         // 繁体中文 (港澳台)
    // ja: '日本語',                // 日语 (日本)
    // ko: '한국어',                // 韩语 (韩国)
    // es: 'Español',              // 西班牙语 (拉美/西班牙)
    // hi: 'हिन्दी',               // 印地语 (印度)
    // ru: 'Русский',              // 俄语 (俄罗斯/东欧)
    // fr: 'Français',             // 法语 (法国/非洲)
    // de: 'Deutsch',              // 德语 (欧洲)
    // id: 'Bahasa Indonesia',     // 印尼语 (东南亚)
    // ar: 'العربية',              // 阿拉伯语 (中东/北非) - RTL
    // pt: 'Português',            // 葡萄牙语 (巴西/葡萄牙)
    // bn: 'বাংলা',                // 孟加拉语 (孟加拉/印度)
};

