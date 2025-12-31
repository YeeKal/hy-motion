"use client";

import React, { useState } from "react";
import { Play } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

// 模拟数据结构：假设视频链接是真实存在的
const CATEGORIES = {
  locomotion: {
    label: "Locomotion",
    items: [
      { 
        id: 1, 
        prompt: "A person walks forward confidently.", 
        videoUrl: "https://cdn.hy-motion.ai/home/locomotion-1.webm", 
        color: "bg-blue-100 dark:bg-blue-900/20" 
      },
      { 
        id: 2, 
        prompt: "A person jogs in a circle.", 
        videoUrl: "https://cdn.hy-motion.ai/home/locomotion-2.webm", 
        color: "bg-blue-100 dark:bg-blue-900/20" 
      },
      { 
        id: 3, 
        prompt: "A person jumps over an obstacle.", 
        videoUrl: "https://cdn.hy-motion.ai/home/locomotion-3.webm", 
        color: "bg-blue-100 dark:bg-blue-900/20" 
      },
    ],
  },
  sports: {
    label: "Sports & Athletics",
    items: [
      {
        id: "s1",
        prompt: "A person shoots a basketball.",
        videoUrl: "https://cdn.hy-motion.ai/home/sports-1.webm", // 示例真实链接，如果失效请替换本地路径
        color: "bg-indigo-100 dark:bg-indigo-900/20",
      },
      {
        id: "s2",
        prompt: "A person runs forward, then kicks a soccer ball.",
        videoUrl: "https://cdn.hy-motion.ai/home/sports-2.webm",
        color: "bg-indigo-100 dark:bg-indigo-900/20",
      },
      {
        id: "s3",
        prompt: "A person swings a golf club, hitting the ball forward.",
        videoUrl: "https://cdn.hy-motion.ai/home/sports-3.webm",
        color: "bg-indigo-100 dark:bg-indigo-900/20",
      },
    ],
  },
  fitness: {
    label: "Fitness & Outdoor Activities",
    items: [
      { id: 4, prompt: "A person performs a push-up.", videoUrl: "https://cdn.hy-motion.ai/home/fit-1.webm", color: "bg-sky-100 dark:bg-sky-900/20" },
      { id: 5, prompt: "A person does a yoga pose.", videoUrl: "https://cdn.hy-motion.ai/home/fit-2.webm", color: "bg-sky-100 dark:bg-sky-900/20" },
      { id: 6, prompt: "A person rides a bicycle.", videoUrl: "https://cdn.hy-motion.ai/home/fit-3.webm", color: "bg-sky-100 dark:bg-sky-900/20" },
    ],
  },
  social: {
    label: "Social Interactions & Leisure",
    items: [
      { id: 7, prompt: "A person waves hello.", videoUrl: "https://cdn.hy-motion.ai/home/social-1.webm", color: "bg-purple-100 dark:bg-purple-900/20" },
      { id: 8, prompt: "Two people shake hands.", videoUrl: "https://cdn.hy-motion.ai/home/social-2.webm", color: "bg-purple-100 dark:bg-purple-900/20" },
      { id: 9, prompt: "A person sits on a chair relaxing.", videoUrl: "https://cdn.hy-motion.ai/home/social-3.webm", color: "bg-purple-100 dark:bg-purple-900/20" },
    ],
  },
  daily: {
    label: "Daily Activities",
    items: [
      { id: 10, prompt: "A person drinks from a cup.", videoUrl: "https://cdn.hy-motion.ai/home/daily-1.webm", color: "bg-slate-100 dark:bg-slate-800" },
      { id: 11, prompt: "A person types on a keyboard.", videoUrl: "https://cdn.hy-motion.ai/home/daily-2.webm", color: "bg-slate-100 dark:bg-slate-800" },
      { id: 12, prompt: "A person opens a door.", videoUrl: "https://cdn.hy-motion.ai/home/daily-3.webm", color: "bg-slate-100 dark:bg-slate-800" },
    ],
  },
};

export default function AtomicActionsGallery() {
  const [activeTab, setActiveTab] = useState("sports");

  return (
    <section id={"showcase"} className="scroll-mt-36 w-full py-12 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col items-center space-y-8">
        {/* 标题部分 */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Motion Action Showcase
          </h2>
          <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">
            High-fidelity motion capture animations categorized by activity type.
          </p>
        </div>

        {/* 选项卡组件 */}
        <Tabs
          defaultValue="sports"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full flex flex-col items-center"
        >
          {/* 移动端优化：水平滚动菜单 */}
          <TabsList className="h-auto w-full md:w-auto flex flex-nowrap overflow-x-auto md:overflow-visible md:flex-wrap justify-start md:justify-center gap-2 bg-muted/50 p-1.5 rounded-full scrollbar-hide">
            {Object.entries(CATEGORIES).map(([key, category]) => (
              <TabsTrigger
                key={key}
                value={key}
                className="rounded-full px-5 py-2 whitespace-nowrap text-sm data-[state=active]:text-secondary-foreground  data-[state=active]:bg-secondary/50 data-[state=active]:shadow-sm transition-all"
              >
                {category.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* 内容区域 */}
          <div className="w-full mt-10">
            {Object.entries(CATEGORIES).map(([key, category]) => (
              <TabsContent 
                key={key} 
                value={key} 
                className="mt-0 focus-visible:outline-none"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
                  {category.items.map((item) => (
                    <ActionCard key={item.id} item={item} />
                  ))}
                </div>
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </div>
    </section>
  );
}

// 单个视频卡片
function ActionCard({ item }: { item: any }) {
  return (
    <div className="flex flex-col space-y-3 group">
      {/* 视频容器 */}
      <div
        className={cn(
          "relative aspect-square w-full overflow-hidden rounded-2xl bg-muted", // 基础样式
          item.color // 动态语义化背景色
        )}
      >
        {/* 核心视频标签 - 移除 mix-blend 以防止视频看不清，如果需要透明效果可加回 */}
        <video
          src={item.videoUrl}
          className="absolute inset-0 w-full h-full object-cover"
         controls
              autoPlay
              loop muted
          playsInline // 移动端必须
          // controls={false} // 隐藏默认控件，使用自定义覆盖层
        />
        
        {/* 播放按钮覆盖层 (装饰用，因为视频是自动播放的) */}

      </div>

      {/* 底部 Prompt 文本 */}
      <div className="px-1">
        <p className="text-sm text-muted-foreground leading-snug">
          <span className="font-semibold text-foreground/80 mr-1.5">prompt:</span>
          {item.prompt}
        </p>
      </div>
    </div>
  );
}