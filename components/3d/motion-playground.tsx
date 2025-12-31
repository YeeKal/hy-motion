"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wand2, AlertCircle, Loader2 } from "lucide-react";
import FbxViewer from "./motion-viewer";
import { cn } from "@/lib/utils";
import { HY_MOTION_MODELS, MAX_PROMPT_LENGTH } from "@/lib/hy-motion/constants";
import { toast } from "sonner";
import { fal } from "@fal-ai/client";
import { useSession } from "next-auth/react";
import { useCredits } from "@/hooks/useCredits";
import { PricingPopup } from "@/components/3d/pricing-popup";
import { useTranslations } from "next-intl";

// Configure FAL client
fal.config({
  proxyUrl: "/api/fal/proxy",
});
const EXAMPLE_PROMPTS = [
  "A person walks forward.",
  "A person doing a hip-hop dance move.",
  "A person looking around in confusion.",
  "A person running and jumping over an obstacle."
];

// const fbxUrl = "/assert/example.fbx";
const fbxUrl = "https://v3b.fal.media/files/b/0a888756/didfMAW2x9WaI1_hJvwA9_hy_motion_000.fbx";

export default function HyMotionPlayground() {
      const t = useTranslations("common.modelPlayground");
  
  // 状态管理
  const [prompt, setPrompt] = useState("");
  const [duration, setDuration] = useState([5]); // Slider value is array
  const [modelId, setModelId] = useState(HY_MOTION_MODELS[0].id);
  const [isLoading, setIsLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(fbxUrl);
  const [statusLog, setStatusLog] = useState("");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [showPricing, setShowPricing] = useState(false);

  const { status } = useSession();
  const { credits, refreshCredits } = useCredits();

  const selectedModel = HY_MOTION_MODELS.find(m => m.id === modelId) || HY_MOTION_MODELS[0];

  // 轮询控制器
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // 清理
  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) clearTimeout(pollIntervalRef.current);
    };
  }, []);

  // 处理输入变化
  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (text.length <= MAX_PROMPT_LENGTH) setPrompt(text);
  };

  // 生成逻辑
  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    if (status === "loading") {
            toast.error(t("toasts.sessionStatusLoading"));
            return;
        }

    if (status === "unauthenticated") {
      setShowPricing(true);
      return;
    }

    if ((credits || 0) < selectedModel.credit) {
      setShowPricing(true);
      return;
    }

    setIsLoading(true);
    setResultUrl(null);
    setStatusLog("Initializing...");
    setProgress(5);

    try {
      // 1. 发起请求
      const res = await fetch("/api/hy-motion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          duration: duration[0],
          modelId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 402) {
          toast.error(`Insufficient credits. Required: ${data.required}, Current: ${data.current}`);
          throw new Error(`Insufficient credits. You need ${data.required} credits.`);
        }
        throw new Error(data.error || "Failed to submit request");
      }
      refreshCredits();

      const { request_id } = data;
      setStatusLog("Processing...");
      setProgress(10);

      // 2. 开始轮询状态
      checkStatus(request_id, modelId); // Pass modelId to helper

    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
      setProgress(0);
      setStatusLog("Something went wrong");

      toast.error(err.message || "Something went wrong");
    }
  };

  // 轮询函数
  const checkStatus = async (requestId: string, currentModelId: string) => {
    const startTime = Date.now();
    const POLL_TIMEOUT = 120000; // 2 minutes timeout
    const POLL_CYCLE_TIME = 1000;

    const poll = async () => {
      if (Date.now() - startTime > POLL_TIMEOUT) {
        setIsLoading(false);
        setProgress(0);
        setStatusLog("Generation timed out");

        toast.error("Generation timed out");
        return;
      }

      try {
        const status = await fal.queue.status(currentModelId, {
          requestId,
          logs: true,
        });

        if (status.status === "COMPLETED") {
          const resultPayload = await fal.queue.result(currentModelId, {
            requestId
          });
          const result = resultPayload.data;

          if (result && result.fbx_file && result.fbx_file.url) {
            setResultUrl(result.fbx_file.url);
            setStatusLog("");
            setProgress(100);
            toast.success("Motion generated successfully!");
          } else {
            throw new Error("No FBX file in response");
          }
          setIsLoading(false);
        } else if (status.status === "IN_PROGRESS" || status.status === "IN_QUEUE") {
          // 继续轮询
          setStatusLog(status.status === "IN_QUEUE" ? "In Queue..." : "Generating motion...");
          if (status.status === "IN_PROGRESS") {
            // Pseudo progress for better UX
            setProgress((prev) => Math.min(prev + 20, 90));
          }
          pollIntervalRef.current = setTimeout(poll, POLL_CYCLE_TIME);
        } else {
          throw new Error(`Generation failed with unknown status`);
        }
      } catch (err: any) {
        console.error("Polling error", err);
        setStatusLog("Failed!");
        setIsLoading(false);
        setProgress(0);
        toast.error(err.message || "Generation failed during polling");
      }
    };

    poll();
  };


  return (
    <div className="w-full max-w-7xl mx-auto overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full p-4 lg:p-8">

        {/* 左侧：控制面板 */}
        <div className="lg:col-span-4 space-y-6">
          <div className="space-y-2 text-center lg:text-left">
            <h1 className="text-3xl font-bold tracking-tight">Hy-Motion Lab</h1>
            <p className="text-muted-foreground text-sm">
              Generate 3D human motion from text using Hunyuan Motion models.
            </p>
          </div>

          <Card className="p-6 space-y-6 shadow-sm border-neutral-200 dark:border-neutral-800">
            {/* 模型选择 */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Select Model</Label>
              <Select value={modelId} onValueChange={setModelId} disabled={isLoading}>
                <SelectTrigger>
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  {HY_MOTION_MODELS.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      <div className="flex items-center justify-between w-full gap-2">
                        <span>{m.name}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                          {m.credit} Credits
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Prompt 输入 */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label htmlFor="prompt">Prompt<span className="text-destructive ml-1">*</span>
                </Label>
                <span className={cn("text-xs", prompt.length >= MAX_PROMPT_LENGTH ? "text-red-500" : "text-muted-foreground")}>
                  {prompt.length}/{MAX_PROMPT_LENGTH}
                </span>
              </div>
              <Textarea
                id="prompt"
                placeholder="A person ..."
                className="w-full px-3 sm:px-6 py-5 bg-card text-foreground placeholder-muted-foreground text-base focus:outline-none resize-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                value={prompt}
                onChange={handlePromptChange}
                maxLength={MAX_PROMPT_LENGTH}
                rows={3}
                disabled={isLoading}
              />
            </div>

            {/* 样例 Prompt */}
            <div className="flex flex-col gap-2">
              {EXAMPLE_PROMPTS.map((ex, i) => (
                <button
                  key={i}
                  onClick={() => setPrompt(ex)}
                  disabled={isLoading}
                  className="text-xs md:text-sm px-3 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors text-left disabled:opacity-50"
                >
                  {ex}
                </button>
              ))}
            </div>

            {/* Duration 滑条 */}
            <div className="space-y-4">
              <div className="flex justify-between">
                <Label>Duration</Label>
                <span className="text-sm font-mono text-muted-foreground">{duration[0]}s</span>
              </div>
              <Slider
                value={duration}
                onValueChange={setDuration}
                min={0.5}
                max={12}
                step={0.5}
                disabled={isLoading}
                className="cursor-pointer"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0.5s</span>
                <span>12s</span>
              </div>
            </div>

            {/* 生成按钮 */}
            <Button
              className="w-full h-12 text-base relative overflow-hidden"
              onClick={handleGenerate}
              disabled={isLoading || !prompt.trim()}
            >
              {isLoading && (
                <div
                  className="absolute left-0 top-0 h-full bg-white/20 transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              )}
              {isLoading ? (
                <div className="flex items-center z-10">
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  <span>{statusLog || "Processing..."}</span>
                </div>
              ) : (
                <div className="flex items-center z-10">
                  <Wand2 className="mr-2 h-5 w-5" />
                  Generate ({selectedModel.credit} Credits)
                </div>
              )}
            </Button>

            {/* 错误提示 */}
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-md flex items-start gap-2">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </Card>
        </div>

        {/* 右侧：渲染区域 */}
        <div className="lg:col-span-8 min-h-[500px] flex flex-col">
          <Card className="flex-1 p-1 overflow-hidden bg-neutral-100 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 relative">
            <FbxViewer
              url={resultUrl}
              isLoading={isLoading}
              statusText={statusLog}
            />
            {!resultUrl && (isLoading && !!statusLog) && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="px-4 py-2 rounded-md bg-muted text-center text-muted-foreground">
                  <Wand2 className="w-12 h-12 mx-auto mb-2" />
                  {statusLog}
                </div>
              </div>
            )}
          </Card>
        </div>

                <PricingPopup open={showPricing} onOpenChange={setShowPricing} />
      </div>
    </div>
  );
}