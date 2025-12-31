import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';
import { getMessages } from './get-messages';

export default getRequestConfig(async ({ requestLocale }) => {
    // This typically corresponds to the `[locale]` segment
    let locale = await requestLocale;

    // Ensure that a valid locale is used
    if (!locale || !routing.locales.includes(locale as any)) {
        locale = routing.defaultLocale;
    }

    // We can load 'common' here as a default, but specific pages will load their own.
    // However, getRequestConfig is called for *every* request.
    // If we want to support the `useTranslations` hook in Client Components that are NOT page-specific
    // (like a global Layout component), we need to provide some messages here.
    // The user's plan says: "只加载 common（全局 UI 文案），页面级文案由各 page.tsx 自行加载"

    // We will load 'common' here.
    // We will load 'common' here.
    // const messages = await getMessages(locale as any, 'home'); // Removed duplicate
    // Actually, getMessages(locale, 'home') returns common + home.
    // If we just want common, we might need a 'common' key or just load common.json.
    // But wait, getRequestConfig returns the messages that are available *globally* via `useTranslations`
    // if we don't pass them explicitly via NextIntlClientProvider.
    // But the user's plan uses NextIntlClientProvider in layout.tsx.

    // Let's stick to the user's pattern:
    // In layout.tsx: <NextIntlClientProvider messages={messages}>
    // So this request.ts might be less critical for *client* components if we pass messages manually,
    // BUT it is crucial for *Server Components* using `getTranslations`.

    // For now, let's return common messages to be safe.
    // Load common and home messages globally to support Server Components on the landing page.
    // This allows components like Features, Roadmap, etc. to be Server Components.
    // const messages = await getMessages(locale as any, 'home');
    const messages = await getMessages(locale as any, 'common' as any);
    // console.log('Loaded messages for locale:', messages);
    


    return {
        locale,
        messages    
    // timeZone, now 等其他可选配置也可以在这里统一返回
    // now: new Date(),
    // timeZone: 'Asia/Shanghai',
    };
});

