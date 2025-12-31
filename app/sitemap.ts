import { MetadataRoute } from 'next';
import { locales, defaultLocale } from '@/i18n/config'; // 👈 确保从你的配置文件导入
import { getAllToolConfigs } from "@/lib/config/tool-utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 生产环境建议明确配置 BASE_URL
  const baseUrl = process.env.BASE_URL || `http://localhost:3000`;
  const sitemapEntries: MetadataRoute.Sitemap = [];

  // 1. 定义所有通用页面（不包含动态的 tool 详情页）
  // path: 原始路径，不要带语言前缀，也不要带 BASE_URL
  const staticRoutes = [
    {
      path: '', // 首页
      changeFrequency: 'weekly',
      priority: 1,
    },
   
    // {
    //   path: '/tools', // 工具列表页
    //   changeFrequency: 'weekly',
    //   priority: 0.8,
    // },
  ] as const;



  // 辅助函数：生成带语言的 URL
  const getUrl = (path: string, locale: string) => {
    // 🔥 核心逻辑：如果是默认语言，前缀为空；否则为 /locale
    const localePrefix = locale === defaultLocale ? '' : `/${locale}`;

    // 拼接逻辑：baseUrl + (语言前缀) + 路径
    // 例如：
    // en + '' -> example.com
    // zh + '' -> example.com/zh
    // en + '/tools' -> example.com/tools
    // zh + '/tools' -> example.com/zh/tools
    return `${baseUrl}${localePrefix}${path}`;
  };

  // 3. 遍历静态路由
  for (const route of staticRoutes) {
    for (const locale of locales) {
      sitemapEntries.push({
        url: getUrl(route.path, locale),
        lastModified: new Date(),
        changeFrequency: route.changeFrequency as any,
        priority: route.priority,
      });
    }
  }

    // 4. 遍历动态 Tool 路由
  // const toolMetaConfigs = await getAllToolConfigs(defaultLocale);
  // for (const tool of toolMetaConfigs) {
  //   for (const locale of locales) {
  //     sitemapEntries.push({
  //       // 注意：这里 path 是 '/tools/xxx'
  //       url: getUrl(`/models/${tool.slug}`, locale),
  //       lastModified: new Date(), // 如果你的 toolConfig 有 updateTime 字段，可以用那个
  //       changeFrequency: 'monthly',
  //       priority: 0.8,
  //     });
  //   }
  // }

  return sitemapEntries;
}