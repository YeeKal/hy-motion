import { Link } from '@/i18n/routing'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ToolMetaConfig } from "@/lib/config/tool-types"


interface ToolsGridProps {
  tools: ToolMetaConfig[]
  className?: string
}

/**
 * 工具网格展示组件
 * 以卡片形式展示OCR工具列表，支持响应式布局和交互动画
 */
export function ToolsGrid({ tools, className }: ToolsGridProps) {
  return (
    <div className={cn('w-full', className)}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>
    </div>
  )
}

interface ToolCardProps {
  tool: ToolMetaConfig
}

/**
 * 单个工具卡片组件
 * 特点：封面图片、工具名称、描述、悬停效果、导航箭头
 */
function ToolCard({ tool }: ToolCardProps) {
  return (
    <Link href={`/models/${tool.slug}`}>
      <div className="group relative h-full overflow-hidden rounded-lg border border-border bg-card transition-all duration-300 hover:shadow-lg hover:border-primary/50 hover:-translate-y-1">
        {/* 封面图片区域 */}
        <div className="relative h-48 w-full overflow-hidden bg-muted">
          <Image
            src={tool.cover.url || "/placeholder.svg"}
            alt={tool.cover.alt}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {/* 徽章 */}
          {/* {tool.badge && (
            <div className="absolute top-3 right-3 bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-semibold">
              {tool.badge}
            </div>
          )}
          {tool.isNew && !tool.badge && (
            <div className="absolute top-3 right-3 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
              新功能
            </div>
          )} */}
        </div>

        {/* 内容区域 */}
        <div className="flex flex-col h-full p-4 bg-card">
          {/* 分类标签（可选） */}
          {/* {tool.category && (
            <span className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
              {tool.category}
            </span>
          )} */}

          {/* 工具名称 */}
          <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">
            {tool.name}
          </h3>

          {/* 描述 */}
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
            {tool.description}
          </p>

          {/* 底部操作区域 */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <span className="text-xs font-medium text-primary uppercase tracking-wider">
              进入工具
            </span>
            <ArrowRight className="w-4 h-4 text-primary transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </div>

        {/* 悬停高亮效果 */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-lg" />
      </div>
    </Link>
  )
}
