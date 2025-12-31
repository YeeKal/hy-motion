// app/[locale]/[...rest]/page.tsx

import { notFound } from "next/navigation";

export default function CatchAllPage() {
  // 只要匹配到这个路由，直接触发 notFound()
  // 这会强制 Next.js 渲染同级目录下的 not-found.tsx (即带样式的那个)
  notFound();
}