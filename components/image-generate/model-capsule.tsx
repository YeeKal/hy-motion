import * as React from "react";
import { Zap, Crown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/routing";
import { Model, ModelType } from "@/lib/image-generator/type";
import { ImageModels } from "@/lib/image-generator/models";

// 渲染胶囊的函数（逻辑不变，保持之前的样式）
const renderCapsule = (model: Model, isActive: boolean) => {
  const isPro = model.credits >= 2;
  return (
    <Link
      href={`/create?modelId=${model.id}`}
      key={model.id}
      className={cn(
        "shrink-0 relative group flex items-center gap-2 px-2 sm:px-3 py-2 rounded-lg border transition-all duration-200 cursor-pointer select-none",
        isActive
          ? "border-primary bg-primary/5 shadow-md ring-1 ring-primary/20 z-10"
          : "bg-white border-muted-foreground/20 hover:border-primary/50 hover:bg-muted/20 hover:shadow-md shadow-sm",

      )}
    >
      {isPro ? (
        <Crown className={cn("w-3 sm:w-4 h-3 sm:h-4", isActive ? "text-amber-600" : "text-amber-500/70")} />
      ) : (
        <Zap className={cn("w-3 sm:w-4 h-3 sm:h-4", isActive ? "text-blue-600" : "text-muted-foreground")} />
      )}
      <div className="flex flex-col leading-none">
        <span className={cn("whitespace-nowrap text-xs sm:text-sm font-medium transition-colors", isActive ? "text-primary font-semibold" : "text-slate-700")}>
          {model.name}
        </span>
      </div>
      {isActive && (
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-primary border-2 border-background"></span>
        </span>
      )}
    </Link>
  );
};

interface ModelCapsulesProps {
  selectedModelId: string;
}

export function ModelCapsules({ selectedModelId }: ModelCapsulesProps) {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = scrollContainerRef.current;
    if (el) {
      const onWheel = (e: WheelEvent) => {
        if (e.deltaY === 0) return;
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      };
      el.addEventListener("wheel", onWheel, { passive: false });
      return () => el.removeEventListener("wheel", onWheel);
    }
  }, []);

  const visibleModels = ImageModels.slice(0,6);
  return (
<div className=" max-w-4xl mx-auto py-2">
  {/* 容器：面板风格 */}
  <div className="rounded-2xl border border-black/5 dark:border-white/5 bg-muted/30 p-2">
    
    {/* Flex Wrap 布局 */}
    <div className="flex flex-wrap items-center justify-center gap-2.5">
     {visibleModels.map((model) => {
        const isActive = model.id === selectedModelId;
        return (
          // 渲染胶囊 (注意这里加了 shrink-0 防止被挤压)
          <div key={model.id} className="shrink-0">
             {renderCapsule(model, isActive)}
          </div>
        );
      })}
    </div>
  </div>
</div>
  )

  return (
<div className="relative w-full">
  {/* 1. 凹槽容器 (Track) */}
  <div className="relative rounded-md bg-muted/40 border border-black/5 dark:border-white/5 shadow-inner overflow-hidden">
    
    {/* 2. 滚动区域 */}
    <div
      ref={scrollContainerRef}
      className={cn(
        "flex items-center gap-2 overflow-x-auto flex-nowrap",
        "py-2 px-3", // 给凹槽内部一些内边距，让胶囊悬浮在里面
        "scrollbar-hide", 
        "w-full justify-start md:justify-center", // 手机左对齐滑动，电脑居中
      )}
      style={{
        scrollbarWidth: 'none',
        msOverflowStyle: 'none'
      }}
    >
      {visibleModels.map((model) => {
        const isActive = model.id === selectedModelId;
        return (
          // 渲染胶囊 (注意这里加了 shrink-0 防止被挤压)
          <div key={model.id} className="shrink-0">
             {renderCapsule(model, isActive)}
          </div>
        );
      })}
      
      {/* 手机端右侧占位，防止滑动到底部贴边 */}
      <div className="w-2 shrink-0 md:hidden" />
    </div>

    {/* 3. 强化版右侧渐变遮罩 (只在手机端显示) */}
    {/* from-muted/40 对应凹槽的背景色，w-16 加宽遮罩范围 */}
    <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-muted/100 via-muted/50 to-transparent pointer-events-none md:hidden z-10" />
  </div>
</div>
  )
}