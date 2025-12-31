// components/ModelComparison.tsx
import React from 'react';
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Icon } from "../wrapper/lucide-icon";

// ==========================================
// 1. Data Definitions (数据层)
// ==========================================
interface ComparisonItem {
  id: string;
  icon: string;
  targetModel: string;
  category: string;
  title: string;
  description: string;
  metric: string;
  colors: {
    text: string;
    bg: string;
    fill: string;
    stroke: string;
    border: string;
  };
  svgType: string;
}

interface ModelComparisonProps {
  data: {
    title: string;
    badge: string;
    description: string;
    items: ComparisonItem[];
    footer: {
      text1: string;
      text2: string;
    };
  };
}

// ==========================================
// 2. SVG Graphics Component (可视化层)
// ==========================================
interface GraphicProps {
  type: string;
  colors: {
    fill: string;
    stroke: string;
    text: string;
  };
}

const ComparisonGraphic = ({ type, colors }: GraphicProps) => {
  // 通用 SVG 文本样式
  const textBase = "font-mono text-[10px] fill-muted-foreground";

  switch (type) {
    case 'speed':
      return (
        <svg viewBox="0 0 200 100" className="w-full h-full">
          {/* Flux Track (背景) */}
          <rect x="20" y="30" width="160" height="8" rx="4" className="fill-muted opacity-30" />
          <rect x="20" y="30" width="40" height="8" rx="4" className="fill-muted-foreground/50" />
          <text x="20" y="20" className={textBase}>Flux (25s)</text>

          {/* Z-Image Track (高亮) */}
          <rect x="20" y="65" width="160" height="8" rx="4" className="fill-muted opacity-30" />
          <rect x="20" y="65" width="140" height="8" rx="4" className={colors.fill} />
          {/* 箭头 */}
          <path d="M155 60 L165 69 L155 78" className={colors.fill} />
          <text x="20" y="55" className={cn(textBase, colors.text, "font-bold")}>Z-Image (&lt;1s)</text>
        </svg>
      );
    case 'vram':
      return (
        <svg viewBox="0 0 200 100" className="w-full h-full">
          {/* 芯片边框 */}
          <rect x="75" y="10" width="50" height="80" rx="4" className="stroke-border fill-none" strokeWidth="1.5" />

          {/* 竞品占用 (高) */}
          <rect x="80" y="15" width="18" height="70" rx="2" className="fill-muted-foreground opacity-30" />

          {/* Z-Image 占用 (低) */}
          <rect x="102" y="45" width="18" height="40" rx="2" className={colors.fill} />

          <text x="65" y="90" className={textBase} textAnchor="end">Others</text>
          <text x="155" y="90" className={cn(textBase, colors.text, "font-bold")}>Z-Image</text>

          {/* 闪电图标 */}
          <path d="M105 5 L115 5 L108 25 L118 25 L100 55 L105 30 L95 30 Z" className={colors.fill} transform="translate(30, -10)" />
        </svg>
      );
    case 'cost':
      return (
        <svg viewBox="0 0 200 100" className="w-full h-full">
          {/* 左侧：付费订阅锁 */}
          <g transform="translate(40, 30)">
            <rect x="10" y="15" width="30" height="25" rx="3" className="fill-muted" />
            <path d="M15 15 V8 A10 10 0 0 1 35 8 V15" className="stroke-muted-foreground fill-none" strokeWidth="2" />
            <text x="25" y="60" textAnchor="middle" className={textBase}>$$/mo</text>
          </g>

          <path d="M90 50 L110 50" className="stroke-border" strokeWidth="1" strokeDasharray="3 3" />

          {/* 右侧：开源免费 */}
          <g transform="translate(110, 30)">
            <circle cx="25" cy="20" r="12" className={cn("fill-none", colors.stroke)} strokeWidth="2" />
            <rect x="23" y="28" width="4" height="12" className={colors.fill} />
            <rect x="23" y="32" width="8" height="3" className={colors.fill} />
            <text x="25" y="60" textAnchor="middle" className={cn(textBase, colors.text, "font-bold")}>Free</text>
          </g>
        </svg>
      );
    case 'language':
      return (
        <svg viewBox="0 0 200 100" className="w-full h-full">
          {/* 英文气泡 (背景) */}
          <path d="M50 30 H90 V60 H70 L50 70 V30 Z" className="fill-muted opacity-50" />
          <text x="60" y="50" className="fill-muted-foreground text-[14px] font-serif">Ag</text>

          {/* 中文气泡 (前景高亮) */}
          <path d="M150 20 H100 V60 H120 L150 70 V20 Z" className={cn(colors.fill, "opacity-90")} />
          <text x="110" y="48" className="fill-primary-foreground text-[20px] font-serif font-bold">文</text>

          {/* 连接箭头 */}
          <path d="M92 45 L98 45" className={colors.stroke} strokeWidth="2" markerEnd="url(#arrow)" />
        </svg>
      );
    default:
      return null;
  }
};

// ==========================================
// 3. Main Component (主组件)
// ==========================================
export default function ModelComparison({ data }: ModelComparisonProps) {
  if (!data) return null;

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="outline" className="mb-4 border-primary/20 text-primary bg-primary/5">
            {data.badge}
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-foreground tracking-tight">
            {data.title}
          </h2>
          <p className="text-lg text-muted-foreground" dangerouslySetInnerHTML={{ __html: data.description }} />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {data.items.map((item) => (
            <Card
              key={item.id}
              className="flex flex-col overflow-hidden border-border bg-card hover:border-primary/30 transition-all duration-300 hover:shadow-lg group"
            >
              {/* Colored Top Border (使用 tailwind 类) */}
              <div
                className={cn("h-1 w-full", item.colors.bg)}
              />

              <CardHeader className="pb-2">
                <div className="flex justify-between items-center mb-2">
                  <div
                    className="p-2 rounded-lg bg-muted/50 text-muted-foreground group-hover:text-foreground transition-colors"
                  >
                    <Icon name={item.icon} className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] uppercase tracking-widest font-mono text-muted-foreground/70">
                    VS {item.targetModel}
                  </span>
                </div>
                <CardTitle className="text-xl font-bold text-card-foreground">
                  {item.title}
                </CardTitle>
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mt-1">
                  <span>{item.category}</span>
                </div>
              </CardHeader>

              {/* Graphic Area */}
              <div className="h-32 w-full bg-accent/30 flex items-center justify-center p-4 my-2 relative overflow-hidden">
                {/* Decorative background circle */}
                <div
                  className={cn("absolute w-32 h-32 rounded-full opacity-5 blur-2xl", item.colors.bg)}
                />
                <ComparisonGraphic type={item.svgType} colors={item.colors} />
              </div>

              <CardContent className="flex-grow pt-4">
                <CardDescription className="text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </CardDescription>
              </CardContent>

              <div className="p-6 pt-0 mt-auto">
                <div
                  className={cn(
                    "inline-flex items-center px-3 py-1 rounded-md text-sm font-semibold border bg-secondary/50 border-opacity-20",
                    item.colors.text,
                    item.colors.border
                  )}
                  style={{
                    // 这里仅保留透明度处理，如果 tailwind 配置了 border-opacity 可以移除
                    borderColor: 'currentColor',
                  }}
                >
                  {item.metric}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Footer info */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 text-muted-foreground text-sm">
            <span>{data.footer.text1}</span>
            <span className="w-1 h-1 rounded-full bg-border"></span>
            <span>{data.footer.text2}</span>
          </div>
        </div>

      </div>
    </section>
  );
}