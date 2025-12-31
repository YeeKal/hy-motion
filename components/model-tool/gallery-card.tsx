
"use client";

import { useState } from "react";
import Image from "next/image";
import { Loader, Download, Maximize2, X, Check, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export interface GalleryCardItem {
    src:string;
    alt:string;
}
interface GalleryCardProps{
  item:GalleryCardItem
}

/**
 * 从图片 URL 中提取文件名（含扩展名）
 * @param src 图片的 src 字符串（URL 或路径）
 * @returns 提取的文件名，若无法提取则返回空字符串或原始最后一段
 */
function extractImageFilename(src: string): string {
  try {
    // 使用 URL 构造函数解析（自动处理协议、查询参数、hash）
    const url = new URL(src, 'https://base.example'); // 第二个参数是 base，用于相对路径兜底
    let path = url.pathname;

    // 移除末尾斜杠（避免 '' 作为最后一段）
    if (path.endsWith('/')) {
      path = path.slice(0, -1);
    }

    // 按 '/' 分割，取最后一段
    const segments = path.split('/');
    const filename = segments[segments.length - 1];

    // 若文件名为空（如路径为 '/' 或 '//'），返回空字符串
    return filename || '';
  } catch {
    // 若不是合法 URL（如相对路径 '/images/test.jpg' 或 'test.png'），手动处理
    // 移除查询参数和 hash（兼容非标准 URL）
    const cleanPath = src.split(/[?#]/)[0];
    const segments = cleanPath.split('/');
    const filename = segments[segments.length - 1];
    return filename || '';
  }
}


export function GalleryCard({ item }: GalleryCardProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [hasDownloaded, setHasDownloaded] = useState(false);

    const handleDownload = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!item.src) return;

        setIsDownloading(true);
        try {
            const response = await fetch(item.src);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = extractImageFilename(item.src);

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            setHasDownloaded(true);
            setTimeout(() => setHasDownloaded(false), 2000);
        } catch (error) {
            console.error("Download failed:", error);
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <>
            <div
                className="group relative aspect-square bg-muted rounded-xl border border-border overflow-hidden cursor-zoom-in shadow-sm hover:shadow-md transition-all duration-300"
                onClick={() => setIsModalOpen(true)}
            >
                <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />

                {/* Info Overlay */}
                {/* <div className="absolute top-0 left-0 right-0 p-3 flex justify-between items-start bg-gradient-to-b from-black/60 to-transparent opacity-100 transition-opacity"> */}
                    {/* <span className="text-xs font-semibold text-white bg-black/40 backdrop-blur-md px-2 py-1 rounded">
                        {modelName}
                    </span>
                    {result.generationTime && (
                        <span className="text-[10px] font-medium text-white/90 flex items-center gap-1 bg-black/40 backdrop-blur-md px-1.5 py-0.5 rounded">
                            <Clock size={10} />
                            {(result.generationTime / 1000).toFixed(1)}s
                        </span>
                    )} */}
                {/* </div> */}

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

                {/* Actions */}
                <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <div className="bg-black/50 backdrop-blur-sm p-2 rounded-full text-white hover:bg-black/70 transition-colors">
                        <Maximize2 size={16} />
                    </div>
                    <button
                        onClick={handleDownload}
                        disabled={isDownloading}
                        className={cn(
                            "flex items-center justify-center h-8 w-8 rounded-full shadow-lg transition-all active:scale-95",
                            hasDownloaded
                                ? "bg-green-500 text-white"
                                : "bg-white text-black hover:bg-gray-100"
                        )}
                        title="Download Image"
                    >
                        {isDownloading ? (
                            <Loader size={14} className="animate-spin" />
                        ) : hasDownloaded ? (
                            <Check size={14} />
                        ) : (
                            <Download size={14} />
                        )}
                    </button>
                </div>
            </div>

            {/* Lightbox Modal */}
            {isModalOpen && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm animate-in fade-in duration-200"
                    onClick={() => setIsModalOpen(false)}
                >
                    <button
                        onClick={() => setIsModalOpen(false)}
                        className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-50"
                    >
                        <X size={24} />
                    </button>

                    <div
                        className="relative w-full max-w-5xl h-[80vh] mx-4 animate-in zoom-in-95 duration-200 flex flex-col items-center justify-center"
                        onClick={(e) => e.stopPropagation()}
                    >
      
                        <Image
                            src={item.src}
                            alt={item.alt}
                            fill
                            className="object-contain"
                            quality={100}
                        />
                    </div>

                    <div
                        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={handleDownload}
                            className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full font-medium shadow-xl transition-transform hover:scale-105 active:scale-95"
                        >
                            {isDownloading ? <Loader size={20} className="animate-spin" /> : <Download size={20} />}
                            Download High Res
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

