"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import type { GalleryItem } from "@/lib/gallery/types"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/routing" 
import { 
  X, 
  Download, 
  Maximize2, 
  Copy, 
  Zap, 
  Share2, 
  ChevronLeft,
  PenTool,
  GalleryHorizontal,
  Loader2 // 引入 Loading 图标
} from "lucide-react"

interface ImageDetailModalProps {
  item: GalleryItem
  onClose?: () => void
  isModal?: boolean
}

export function ImageDetailModal({ item, onClose, isModal = false }: ImageDetailModalProps) {
  const router = useRouter()
  const [showLightbox, setShowLightbox] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false) // 下载状态

  // 键盘事件监听保持不变
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (showLightbox) setShowLightbox(false)
        else if (isModal && onClose) onClose()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [showLightbox, isModal, onClose])

  // ... 之前的 handleCopyPrompt, handleTryPrompt, handleShare 保持不变
  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(item.prompt)
    toast.success("Copied!", { description: "Prompt copied to clipboard" })
  }

  const handleTryPrompt = () => {
    const queryParams = new URLSearchParams({
      prompt: item.prompt,
      ratio: item.aspectRatio || "1:1",
    })
    router.push(`/?${queryParams.toString()}`)
  }

  const handleShare = () => {
    const url = `${window.location.origin}/gallery/${item.slug}`
    const text = `Check out this AI-generated image: "${item.prompt}"`
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}&hashtags=ZImage,AIArt`
    window.open(twitterUrl, "_blank")
  }

  // ✅ 修复逻辑 2: 真正的文件下载逻辑
  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    
    if (isDownloading) return

    try {
      setIsDownloading(true)
      
      // 1. 请求图片数据
      const response = await fetch(item.url)
      if (!response.ok) throw new Error("Download failed")
      
      // 2. 转换为 Blob 对象
      const blob = await response.blob()
      
      // 3. 创建临时下载链接
      const blobUrl = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = blobUrl
      
      // 4. 设置文件名 (提取 URL 中的文件名或使用默认名)
      const filename = item.slug ? `${item.slug}.png` : `z-image-${Date.now()}.png`
      link.download = filename
      
      // 5. 触发点击并清理
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(blobUrl)

      toast.success("Download started")
    } catch (error) {
      console.error(error)
      toast.error("Failed to download image")
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <>
      {/* 顶部导航栏 (非 Modal 模式) */}
      {!isModal && (
        <div className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-30">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
              {/* ✅ 修改点 1: 返回 Gallery 按钮改为 Link */}
            {/* asChild 会让 Button 将样式传递给子元素 Link，并渲染为 <a> 标签 */}
            <Button variant="ghost" size="sm" asChild className="gap-2 text-muted-foreground hover:text-foreground">
              <Link href="/gallery">
                <ChevronLeft className="w-4 h-4" />
                Back to Gallery
              </Link>
            </Button>
            <h1 className="font-semibold text-sm md:text-base truncate max-w-[200px] md:max-w-md hidden sm:block">
              {item.alt || "Image Details"}
            </h1>
            {/* ✅ 修改点 2: 返回首页创作按钮改为 Link */}
            <Button size="sm" asChild className="gap-2">
              <Link href="/">
                <PenTool className="w-4 h-4" />
                Create New
              </Link>
            </Button>
          </div>
        </div>
      )}

      {/* 模态框背景 */}
      {isModal && onClose && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 transition-opacity" 
          onClick={onClose} 
        />
      )}

      {/* 主布局 */}
      <div className={isModal 
        ? "fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" 
        : "min-h-[calc(100vh-64px)] bg-background py-8 px-2"
      }>
        <div className={isModal 
          ? "bg-background rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col lg:grid lg:grid-cols-3" 
          : "container mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8"
        }>
          
          {/* 关闭按钮 */}
          {isModal && onClose && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-md transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          {/* === 左侧：图片展示区 === */}
          {/* ✅ 修复逻辑 1: 使用 relative + fill + object-contain 确保图片完整显示在框内 */}
          <div className={`
            lg:col-span-2 relative bg-black/5 flex items-center justify-center overflow-hidden group
            ${isModal ? "h-[40vh] lg:h-auto" : "h-[500px] lg:h-[700px] rounded-xl border border-border"}
          `}>
            <div 
              className="relative w-full h-full cursor-zoom-in"
              onClick={() => setShowLightbox(true)}
            >
              {/* 这里改用了 fill 布局，配合 object-contain */}
              <Image
                src={item.url || "/placeholder.svg"}
                alt={item.alt}
                fill // 撑满父容器
                className="object-contain p-4" // 保持比例，不裁切，留一点内边距
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 100vw"
              />
            </div>

            {/* 控制按钮组 */}
            <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button
                onClick={() => setShowLightbox(true)}
                className="p-2.5 bg-background/80 hover:bg-background text-foreground border border-border/50 rounded-full backdrop-blur-md shadow-sm transition-all hover:scale-105"
                title="Full Screen"
              >
                <Maximize2 className="w-5 h-5" />
              </button>
              
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="p-2.5 bg-background/80 hover:bg-background text-foreground border border-border/50 rounded-full backdrop-blur-md shadow-sm transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Download"
              >
                {isDownloading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Download className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* === 右侧：信息展示区 (保持不变) === */}
          <div className={`
            lg:col-span-1 flex flex-col gap-6 
            ${isModal ? "p-6 overflow-y-auto bg-card" : ""}
          `}>
            {/* ... Prompt, Details, Actions 内容保持不变 ... */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">Prompt</h3>
                <Button variant="ghost" size="icon" onClick={handleCopyPrompt} className="h-8 w-8">
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg border border-border">
                <p className="text-sm  leading-relaxed font-mono max-h-[200px] overflow-y-auto whitespace-pre-wrap">
                  {item.prompt}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/30 p-3 rounded-lg border border-border/50">
                  <span className="text-xs text-muted-foreground block mb-1">Category</span>
                  <span className="text-sm font-medium">{item.category}</span>
                </div>
                <div className="bg-muted/30 p-3 rounded-lg border border-border/50">
                  <span className="text-xs text-muted-foreground block mb-1">Aspect Ratio</span>
                  <span className="text-sm font-medium">{item.aspectRatio || "1:1"}</span>
                </div>
              </div>
            </div>

            <div className="mt-auto space-y-3 pt-6">
              <Button 
                onClick={handleTryPrompt} 
                className="w-full h-10 sm:h-12 text-md sm:text-base font-semibold shadow-lg shadow-primary/20"
                size="lg"
              >
                <Zap className="w-4 h-4 mr-2 fill-current" />
                Remix this Prompt
              </Button>
              {/* ✅ 修改点 2: 返回首页创作按钮改为 Link */}
            <Button size="sm" asChild className="gap-2 w-full h-10 sm:h-12 text-md sm:text-base font-semibold">
              <Link href="/gallery">
                <GalleryHorizontal className="w-4 h-4 mr-2 fill-current" />
                Back To Gallery
              </Link>
            </Button>


              <Button 
                variant="outline" 
                onClick={handleShare} 
                className="w-full"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share on Twitter
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. 全屏 Lightbox (保持不变，确保这里也是 object-contain) */}
      {showLightbox && (
        <div 
          className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setShowLightbox(false)}
        >
          <button 
            className="absolute top-6 right-6 p-3 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-all z-50"
            onClick={() => setShowLightbox(false)}
          >
            <X className="w-6 h-6" />
          </button>
          
          <div 
            className="relative w-full h-full max-w-7xl max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={item.url || "/placeholder.svg"}
              alt={item.alt}
              fill
              className="object-contain" // Lightbox 也是完整显示
              quality={100}
              priority
            />
          </div>
        </div>
      )}
    </>
  )
}