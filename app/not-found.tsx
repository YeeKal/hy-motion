import { Button } from '@/components/ui/button'
import { ArrowLeft } from "lucide-react"
import Image from 'next/image'
import Link from 'next/link'

export default async function NotFound() {
  return (
    // 1. 外层容器增加 min-h-[80vh] 实现垂直居中，让页面不显得空荡
    <div className="flex flex-col items-center justify-center min-h-[80vh] w-full bg-background">
      
      {/* 2. 主要内容容器：px-6 确保移动端两侧有足够的呼吸感 */}
      <div className="container px-6 py-12 md:py-20 mx-auto max-w-6xl">
        
        <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24">
          
          {/* 
             3. 图片区域优化：
             - w-full: 确保宽度撑满父容器（也就是 container 的宽度减去 padding）
             - max-w-md / lg:max-w-2xl: 限制最大宽度，防止图片无限拉伸
             - order-last lg:order-first: (可选) 如果你想移动端先看文字再看图，可以用这个
          */}
          <div className="relative w-full max-w-md lg:max-w-xl aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-border/50">
            <Image
              src="https://cdn.z-image.app/visual-logo/robot-404.webp"
              alt="404 Robot"
              fill
              className="object-cover"
              priority // 404图片通常是首屏内容，加上 priority 提升加载体验
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            
            {/* 增加一个极其微弱的遮罩，让图片更好地融入背景（可选） */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
          </div>

          {/* 文本区域 */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left max-w-lg">
            <h1 className="text-7xl lg:text-8xl font-extrabold tracking-tight text-primary mb-4 select-none">
              Oops!
            </h1>
            
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Page not found
            </h2>

            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              We couldn&apos;t find the page you were looking for. It might have been moved, deleted, or never existed.
            </p>

            <Link href="/" prefetch={false}>
              <Button
                size="lg"
                className="h-12 px-8 rounded-full text-base font-semibold shadow-lg hover:shadow-primary/20 transition-all duration-300 hover:-translate-y-1"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Go Home
              </Button>
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}