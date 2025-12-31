"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Search, Zap, Crown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Model, ModelType } from "@/lib/image-generator/type";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";

interface ModelSelectorProps {
  models: Model[];
  selectedModelId: string;
  onSelect: (id: string) => void;
  disabled?: boolean;
}

function getModelTypeName(modelType: ModelType): string {
  switch (modelType) {
    case ModelType.TextToImage: return "text-to-image";
    case ModelType.TIToImage:
      return "text/image-to-image";
    case ModelType.TIIToImage:
      return "image-to-image";
    default:
      return "image-generation";
  }
}

function getCreditBadgeStyles(credits: number, isSelected: boolean) {
  if (isSelected) return "bg-background/80 text-foreground border-transparent shadow-sm";
  if (credits <= 1) return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (credits <= 10) return "bg-blue-50 text-blue-700 border-blue-200";
  return "bg-amber-50 text-amber-700 border-amber-200";
}

export function ModelSelector({
  models,
  selectedModelId,
  onSelect,
  disabled,
}: ModelSelectorProps) {
  const [open, setOpen] = React.useState(false);
  const t=useTranslations("common.modelPlayground.modelSelector")

  // 快捷展示的数量
  const MAX_VISIBLE = 6;
  const visibleModels = models.slice(0, MAX_VISIBLE);

  const selectedModel = models.find((m) => m.id === selectedModelId);

  // 渲染胶囊的函数（逻辑不变，保持之前的样式）
  const renderCapsule = (model: Model, isActive: boolean, onClick: () => void) => {
    const isPro = model.credits >= 10;
    return (
      <div
        key={model.id}
        onClick={() => !disabled && onClick()}
        className={cn(
          "relative group flex items-center gap-2 px-2 sm:px-3 py-2 rounded-lg border transition-all duration-200 cursor-pointer select-none",
          isActive
            ? "border-primary bg-primary/5 shadow-md ring-1 ring-primary/20 z-10"
            : "bg-white border-muted-foreground/20 hover:border-primary/50 hover:bg-muted/20 hover:shadow-md shadow-sm",
          disabled && "opacity-50 cursor-not-allowed grayscale"
        )}
      >
        {isPro ? (
          <Crown className={cn("w-3 sm:w-4 h-3 sm:h-4", isActive ? "text-amber-600" : "text-amber-500/70")} />
        ) : (
          <Zap className={cn("w-3 sm:w-4 h-3 sm:h-4", isActive ? "text-blue-600" : "text-muted-foreground")} />
        )}
        <div className="flex flex-col leading-none">
          <span className={cn("text-xs sm:text-sm font-medium transition-colors", isActive ? "text-primary font-semibold" : "text-slate-700")}>
            {model.name}
          </span>
        </div>
        {isActive && (
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary border-2 border-background"></span>
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-3">
      {/* 1. 上方：搜索框 / 主选择器 (作为 Popover Trigger) */}
      <div className="flex flex-col gap-1.5">
        {/* <label className="text-sm font-medium text-foreground/90">Model</label> */}

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              disabled={disabled}
              className={cn(
                // 2. 限制宽度 (max-w-md) 并居中 (mx-auto)
                // justify-start: 让内容靠左对齐，配合左侧图标
                "w-full max-w-md mx-auto justify-start h-11 px-3 shadow-sm",
                "bg-background border-input font-normal",
                "hover:bg-accent/20 hover:border-primary/30 transition-all",
                // 展开时的聚焦样式
                open && "border-primary ring-1 ring-primary/20"
              )}
            >
              {/* 1. Search Icon 移到最左边 (opacity-50 防止太抢眼) */}
              <Search className="w-4 h-4 mr-2 text-muted-foreground/70 shrink-0" />

              {selectedModel ? (
                <div className="flex items-center gap-2 flex-1 overflow-hidden">
                  {/* 3. Model Name 以悬浮胶囊显示 (Badge), 前面没有图标 */}
                  <Badge
                    variant="secondary"
                    className="rounded-md px-2 py-0.5 h-6 text-sm font-medium bg-secondary text-secondary-foreground shrink-0 whitespace-nowrap border border-input shadow-sm"
                  >
                    {selectedModel.name}

                  </Badge>

                  {/* 4. 提示文字与胶囊并排 (Side by side) */}
                  <span className="text-xs text-muted-foreground/50 truncate">
                   {t('searchPlaceholder')}
                  </span>
                </div>
              ) : (
                // 未选中状态
                <span className="text-sm text-muted-foreground">{t('searchPlaceholder2')}</span>
              )}
            </Button>
          </PopoverTrigger>

          {/* 2. Popover 内容 (全量列表) */}
          <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
            <Command>
              <CommandInput placeholder="Search models..." />
              <CommandList>
                <CommandEmpty>{t('noModelFound')}</CommandEmpty>
                <CommandGroup heading="Available Models">
                  {models.map((model) => (
                    <CommandItem
                      key={model.id}
                      value={model.name}
                      onSelect={() => {
                        onSelect(model.id);
                        setOpen(false);
                      }}
                      className="cursor-pointer"
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedModelId === model.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <div className="flex flex-col">
                        <span className="font-medium">{model.name}</span>
                        <span className="text-xs text-muted-foreground line-clamp-1">{model.description}</span>
                      </div>
                      <div className="ml-auto flex items-center gap-2 ">
                        <Badge variant="outline" className="text-[10px] h-5">
                          {getModelTypeName(model.type)}
                        </Badge>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {model.credits} credits
                        </span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {/* 3. 下方：快捷胶囊 (点击直接切换，不需要开 Popover) */}
      {/* 如果你想在这里加个标题，可以解开注释 */}
      {/* <span className="text-xs text-muted-foreground font-medium px-1">Quick Access</span> */}

      <div className="mx-auto flex flex-wrap justify-center gap-2.5">
        {visibleModels.map((model) =>
          renderCapsule(model, model.id === selectedModelId, () => onSelect(model.id))
        )}

        {/* 如果选中的模型不在前几个快捷位里，我们还是不显示它在胶囊列表里，
            因为它已经显示在上面的主搜索框里了，没必要重复占位。
            这保持了下方区域纯粹作为 "Shortcuts" 的定义。 */}
      </div>
    </div>
  );
}