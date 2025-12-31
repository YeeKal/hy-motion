import { Locale } from './config';

type PageKey = string; //'home' | 'tools-overview' | 'tools' | 'privacy' | 'terms' | 'about' | 'waitlist';

// 📦 按页面动态导入翻译
async function importMessages(locale: Locale, pageKey: PageKey) {
    try {
        // Note: Adjust path if your messages are in a different location
        return (await import(`../messages/${locale}/${pageKey}.json`)).default;
    } catch (error) {
        console.warn(`⚠️ Missing ${pageKey}.json for locale "${locale}"`);
        return {};
    }
}

// 🌍 加载 common + 指定页面的翻译
export async function getMessages(locale: Locale, pageKey: PageKey) {
    const [common, page] = await Promise.all([
        import(`../messages/${locale}/common.json`).then(m => m.default),
        importMessages(locale, pageKey),
    ]);

    return { common, [pageKey]: page };

}

// 📄 加载 common + 多个页面（如 layout 需要）
export async function getMessagesForLayout(locale: Locale, pageKeys: PageKey[] = []) {
    const common = (await import(`../messages/${locale}/common.json`)).default;
    const pages = await Promise.all(pageKeys.map(async key => ({ [key]: await importMessages(locale, key) })));

    return Object.assign({}, common, ...pages);
}
