"use client"

import { useState } from "react"
import Image from "next/image"
import { Link } from "@/i18n/routing"
import type { GalleryItem } from "@/lib/gallery/types"
import { toast } from "sonner"
import { useTranslations } from "next-intl"

interface GalleryCardProps {
  item: GalleryItem
}

/**
 * 辅助函数：将 "16:9" 字符串转换为 CSS aspectRatio 值 (number)
 * 如果格式不对，默认返回 1 (即 1:1)
 */
function parseAspectRatio(ratioStr: string): number {
  try {
    if (!ratioStr) return 1
    const [w, h] = ratioStr.split(":").map(Number)
    if (!w || !h) return 1
    return w / h
  } catch (e) {
    return 1
  }
}


export function GalleryCard({ item }: GalleryCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const t = useTranslations("gallery.card")

  // 计算宽高比数值
  const ratioValue = parseAspectRatio(item.aspectRatio)

  const handleCopyPrompt = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    navigator.clipboard.writeText(item.prompt)
    toast.success(t("copied"), {
      description: t("copiedDesc"),
    })
  }

  const handleRemix = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const queryParams = new URLSearchParams({
      prompt: item.prompt,
      ratio: item.aspectRatio || "1:1",
    })
    window.location.href = `/?${queryParams.toString()}`
  }

  return (
    <div
      role="article"
      aria-label={item.alt}
      className="group relative rounded-xl bg-card border border-border hover:border-accent transition-colors duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/gallery/${item.slug}`} prefetch={false} className="block w-full cursor-zoom-in">
        {/* 
           关键修改：
           1. relative: 为内部的 absolute 图片提供定位基准
           2. w-full: 宽度跟随 Masonry 列宽
           3. style={{ aspectRatio }}: 核心！让浏览器根据宽度自动计算高度，形成瀑布流占位
           4. overflow-hidden: 裁剪圆角
        */}
        <div
          className="relative w-full overflow-hidden rounded-xl bg-muted/20"
          style={{ aspectRatio: ratioValue }}
        >
          <Image
            src={item.url || "/placeholder.svg"}
            alt={item.alt}
            // 使用 fill 模式，图片会自动填满父容器（父容器已经由 aspectRatio 撑开）
            fill
            className={`object-cover transition-transform duration-500 ${isHovered ? "scale-110" : "scale-100"
              }`}
            // 优化加载策略
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </Link>

      {/* Overlay - 保持之前的逻辑 */}
      <div
        className={`absolute inset-0 rounded-xl bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 flex flex-col justify-end p-4 pointer-events-none ${isHovered ? "opacity-100" : "opacity-0"
          }`}
      >
        <div className="flex gap-2 animate-in fade-in duration-200">
          <button
            onClick={handleCopyPrompt}
            className="pointer-events-auto flex-1 flex items-center justify-center gap-2 bg-muted/90 hover:bg-accent text-foreground rounded-md py-2 transition-colors text-xs font-medium backdrop-blur-sm"
          >
            <span>📋</span>
            {t("copy")}
          </button>
          <button
            onClick={handleRemix}
            className="pointer-events-auto flex-1 flex items-center justify-center gap-2 bg-accent hover:bg-primary text-accent-foreground rounded-md py-2 transition-colors text-xs font-medium"
          >
            <span>⚡</span>
            {t("remix")}
          </button>
        </div>
      </div>
    </div>
  )
}