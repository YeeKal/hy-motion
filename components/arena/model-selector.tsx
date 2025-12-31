"use client";

import * as React from "react";
import { ARENA_MODELS } from "@/lib/arena/models";
import { X, Check, ChevronsUpDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface ModelSelectorProps {
  selectedModels: string[];
  onSelect: (models: string[]) => void;
  disabled?: boolean;
}

export function ModelSelector({
  selectedModels,
  onSelect,
  disabled,
}: ModelSelectorProps) {
  const [open, setOpen] = React.useState(false);
  const MAX_SELECTION = 4;
    const t = useTranslations('arena.modelSelector');

  // 处理移除模型
  const handleRemove = (modelId: string) => {
    onSelect(selectedModels.filter((id) => id !== modelId));
  };

  // 处理切换选择模型
  const handleToggle = (modelId: string) => {
    if (selectedModels.includes(modelId)) {
      handleRemove(modelId);
    } else {
      if (selectedModels.length >= MAX_SELECTION) return;
      onSelect([...selectedModels, modelId]);
    }
  };

  return (
    <div className="flex lg:items-center flex-col  lg:flex-row gap-4">
      <label className="text-sm font-medium text-foreground">
        {t('label')} <span className="text-muted-foreground ml-1">({selectedModels.length}/{MAX_SELECTION})</span>
      </label>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div
            role="combobox"
            aria-expanded={open}
            className={cn(
              // --- 样式修改开始 ---
              " flex-1 flex min-h-[48px] w-full flex-wrap items-center justify-between rounded-xl px-2 py-2 text-sm transition-all cursor-pointer",
              // 1. 沉降式背景：浅灰底色 + 内阴影
              "bg-slate-100 dark:bg-slate-900/50 shadow-inner border border-transparent", 
              // 2. Hover 效果：稍微加深背景
              "hover:bg-slate-200/50 dark:hover:bg-slate-800/50",
              // 3. Focus 状态：外发光圈
              "focus-within:ring-2 focus-within:ring-primary/20",
              // --- 样式修改结束 ---
              disabled && "cursor-not-allowed opacity-50"
            )}
            onClick={() => !disabled && setOpen(!open)}
          >
            <div className="flex flex-wrap gap-2">
              {selectedModels.length === 0 && (
                <span className="text-muted-foreground">{t('placeholder')}</span>
              )}

              {selectedModels.map((modelId) => {
                const model = ARENA_MODELS.find((m) => m.id === modelId);
                if (!model) return null;
                return (
                  <Badge
                    key={model.id}
                    variant="secondary"
                     className={cn(
                        // --- Badge 样式修改 ---
                        // 让 Badge 看起来像浮在凹槽上面的卡片
                        "flex items-center gap-1 pr-1 pl-2 py-1.5 text-xs sm:text-sm font-medium",
                        "bg-white dark:bg-slate-800", // 白色背景
                        "text-indigo-600 dark:text-indigo-400", // 文字颜色
                        "shadow-sm border border-slate-200 dark:border-slate-700", // 轻微投影和边框
                        "hover:bg-white/80"
                    )}
                    onClick={(e) => e.stopPropagation()} // 防止点击 Badge 时触发展开/收起
                  >
                    {model.name}
                    <button
                      className="ml-1 rounded-full p-0.5 outline-none hover:bg-background/80 hover:text-destructive focus:bg-background/80 focus:text-destructive"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleRemove(modelId);
                        }
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onClick={() => handleRemove(modelId)}
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">{t('remove',{modelName:model.name})} </span>
                    </button>
                  </Badge>
                );
              })}
            </div>
            <ChevronsUpDown className="hidden sm:inline ml-2 h-4 w-4 shrink-0 opacity-50" />
          </div>
        </PopoverTrigger>
        
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
          <Command>
            <CommandInput placeholder={t('searchPlaceholder')} />
            <CommandList>
              <CommandEmpty>{t('noResult')}</CommandEmpty>
              <CommandGroup>
                {ARENA_MODELS.map((model) => {
                  const isSelected = selectedModels.includes(model.id);
                  const isMaxReached = selectedModels.length >= MAX_SELECTION;
                  const isDisabled = !isSelected && isMaxReached;

                  return (
                    <CommandItem
                      key={model.id}
                      value={model.name} // 用于搜索匹配
                      onSelect={() => handleToggle(model.id)}
                      disabled={isDisabled || disabled}
                      className={cn(
                        "flex items-center justify-between cursor-pointer",
                        isDisabled && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      <div className="flex items-center">
                        <div
                          className={cn(
                            "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                            isSelected
                              ? "bg-primary text-primary-foreground"
                              : "opacity-50 [&_svg]:invisible"
                          )}
                        >
                          <Check className={cn("h-4 w-4")} />
                        </div>
                        <span>{model.name}</span>
                      </div>
                      <span className="text-xs text-muted-foreground font-mono">
                        {t('credit',{credit:model.credit})}
                      </span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}