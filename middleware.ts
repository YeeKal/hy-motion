// src/middleware.ts
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing'; // 确保引入了你定义了 as-needed 的那个配置

export default createMiddleware(routing);

export const config = {
  // 匹配所有路径，除了 _next, api, 以及常见静态文件后缀
  matcher: [
    '/((?!_next|api|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:css|js|jpg|jpeg|png|gif|svg|mp4|webm|webp|ico|csv|docx|xlsx|zip|webmanifest|pdf)).*)',
  ]
};