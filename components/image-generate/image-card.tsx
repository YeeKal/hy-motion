"use client"

import { useState } from "react"
import Image from "next/image"
import { Loader, Download, Maximize2, X, Check } from "lucide-react"
import type { GeneratedImage } from "./image-generator"
import { cn } from "@/lib/utils" // 假设你有这个工具函数，如果没有可以直接用 classNames
import { useTranslations } from "next-intl"

interface ImageCardProps {
  image: GeneratedImage | null
  isLoading: boolean
}

export default function ImageCard({ image, isLoading }: ImageCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [hasDownloaded, setHasDownloaded] = useState(false)
  const t = useTranslations("home.playground.imageCard")

  // 核心功能：处理图片下载
  // 使用 fetch + blob 方式，确保浏览器强制下载而不是在新标签页打开
  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation() // 防止触发查看大图
    if (!image?.url) return

    setIsDownloading(true)
    try {
      const response = await fetch(image.url)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      // 生成带时间戳的文件名
      link.download = `z-image-${Date.now()}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      // 下载成功的反馈动画
      setHasDownloaded(true)
      setTimeout(() => setHasDownloaded(false), 2000)
    } catch (error) {
      console.error("Download failed:", error)
      alert(t("downloadFailed"))
    } finally {
      setIsDownloading(false)
    }
  }

  // Loading 状态
  if (isLoading) {
    return (
      <div className="aspect-square bg-muted/50 rounded-xl border border-border flex items-center justify-center animate-pulse">
        <div className="flex flex-col items-center gap-3">
          <Loader className="animate-spin text-primary" size={28} />
          <p className="text-sm font-medium text-muted-foreground">{t("generating")}</p>
        </div>
      </div>
    )
  }

  // 错误或空状态
  if (!image) {
    return (
      <div className="aspect-square bg-muted/30 rounded-xl border border-border border-dashed flex items-center justify-center">
        <p className="text-muted-foreground text-sm">{t("waiting")}</p>
      </div>
    )
  }

  return (
    <>
      {/* --- 卡片主体 --- */}
      <div 
        className="group relative aspect-square bg-muted rounded-xl border border-border overflow-hidden cursor-zoom-in shadow-sm hover:shadow-md transition-all duration-300"
        onClick={() => setIsModalOpen(true)}
      >
        <Image
          src={image.url}
          alt="Generated image"
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* 遮罩层 (Hover显示) */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />

        {/* 右上角：放大提示图标 */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
            <div className="bg-black/50 backdrop-blur-sm p-1.5 rounded-full text-white">
                <Maximize2 size={16} />
            </div>
        </div>

        {/* 右下角：下载按钮 */}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className={cn(
                "flex items-center justify-center h-10 w-10 rounded-full shadow-lg transition-all active:scale-95",
                hasDownloaded 
                    ? "bg-green-500 text-white" 
                    : "bg-white text-black hover:bg-gray-100"
            )}
            title={t("downloadImage")}
          >
            {isDownloading ? (
              <Loader size={18} className="animate-spin" />
            ) : hasDownloaded ? (
              <Check size={18} />
            ) : (
              <Download size={18} />
            )}
          </button>
        </div>
      </div>

      {/* --- 全屏预览 Modal (Lightbox) --- */}
      {isModalOpen && (
        <div 
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setIsModalOpen(false)}
        >
          {/* 关闭按钮 */}
          <button 
            onClick={() => setIsModalOpen(false)}
            className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-50"
          >
            <X size={24} />
          </button>

          {/* 大图容器 */}
          <div 
            className="relative w-full max-w-5xl h-[80vh] mx-4 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()} // 防止点击图片关闭
          >
            <Image
              src={image.url}
              alt="Generated Full View"
              fill
              className="object-contain"
              quality={100}
            />
          </div>

          {/* 大图底部的下载按钮栏 (可选) */}
          <div 
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4" 
            onClick={(e) => e.stopPropagation()}
          >
             <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full font-medium shadow-xl transition-transform hover:scale-105 active:scale-95"
             >
                {isDownloading ? <Loader size={20} className="animate-spin" /> : <Download size={20} />}
                {t("downloadHighRes")}
             </button>
          </div>
        </div>
      )}
    </>
  )
}