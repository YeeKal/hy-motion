"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wand2, AlertCircle } from "lucide-react";
import FbxViewer from "./motion-viewer";
import { cn } from "@/lib/utils";

// 配置常量
const MODELS = [
  { id: "fal-ai/hunyuan-motion/fast", name: "HY-Motion-1.0-Lite (0.46B)", tag: "Fast" },
  { id: "fal-ai/hunyuan-motion", name: "HY-Motion-1.0 (1B)", tag: "Quality" },
];

const EXAMPLE_PROMPTS = [
  "A person walking confidently forward.",
  "A hip-hop dance move.",
  "A person looking around in confusion.",
  "Running and jumping over an obstacle."
];

const fbxUrl = "/assert/example.fbx";

export default function HyMotionPlayground() {
  // 状态管理
  const [prompt, setPrompt] = useState("");
  const [duration, setDuration] = useState([5]); // Slider value is array
  const [modelId, setModelId] = useState(MODELS[0].id);
  const [isLoading, setIsLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(fbxUrl);
  const [statusLog, setStatusLog] = useState("");
  const [error, setError] = useState<string | null>(null);

  // 轮询控制器
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // 处理输入变化
  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (text.length <= 500) setPrompt(text);
  };

  // 生成逻辑
  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError(null);
    setResultUrl(null);
    setStatusLog("Initializing request...");

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

      if (!res.ok) throw new Error(data.error || "Failed to submit request");
      
      const { request_id } = data;
      setStatusLog("Request submitted. Processing...");

      // 2. 开始轮询状态
      checkStatus(request_id);

    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  // 轮询函数
  const checkStatus = async (requestId: string) => {
    const poll = async () => {
      try {
        const res = await fetch(`/api/hy-motion?requestId=${requestId}`);
        const data = await res.json();

        if (data.status === "COMPLETED") {
          // 完成
          if (data.result && data.result.fbx_file && data.result.fbx_file.url) {
             setResultUrl(data.result.fbx_file.url);
             setStatusLog("Completed!");
          } else {
             throw new Error("No FBX file in response");
          }
          setIsLoading(false);
        } else if (data.status === "IN_PROGRESS" || data.status === "IN_QUEUE") {
          // 继续轮询
          setStatusLog(data.status === "IN_QUEUE" ? "In Queue..." : "Generating motion...");
          pollIntervalRef.current = setTimeout(poll, 1000); // 1秒后再次检查
        } else {
          // 失败或其他状态
          throw new Error(`Generation failed with status: ${data.status}`);
        }
      } catch (err: any) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    poll();
  };

  return (
    <div className="w-full max-w-7xl mx-auto overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full p-4 lg:p-8">
        
        {/* 左侧：控制面板 */}
        <div className="lg:col-span-4 space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tight">Hy-Motion Lab</h1>
            <p className="text-muted-foreground text-sm">
              Generate 3D human motion from text using Hunyuan Motion models.
            </p>
          </div>

          <Card className="p-6 space-y-6 shadow-sm border-neutral-200 dark:border-neutral-800">
            {/* 模型选择 */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Select Model</Label>
              <Select value={modelId} onValueChange={setModelId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  {MODELS.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      <div className="flex items-center justify-between w-full">
                        <span>{m.name}</span>
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
                <span className={cn("text-xs", prompt.length >= 500 ? "text-red-500" : "text-muted-foreground")}>
                  {prompt.length}/500
                </span>
              </div>
              <Textarea
                id="prompt"
                placeholder="A person ..."
                className="w-full px-3 sm:px-6 py-5 bg-card text-foreground placeholder-muted-foreground text-base focus:outline-none resize-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"

                value={prompt}
                onChange={handlePromptChange}
                maxLength={500}
                rows={3}
              />
            </div>

            {/* 样例 Prompt */}
            <div className="flex flex-col gap-2">
              {EXAMPLE_PROMPTS.map((ex, i) => (
                <button
                  key={i}
                  onClick={() => setPrompt(ex)}
                  className="text-xs md:text-md  px-2.5 py-2 bg-secondary text-secondary-foreground rounded-full hover:bg-secondary/80 transition-colors text-left"
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
                className="cursor-pointer"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0.5s</span>
                <span>12s</span>
              </div>
            </div>

            {/* 生成按钮 */}
            <Button 
              className="w-full h-12 text-base" 
              onClick={handleGenerate}
              disabled={isLoading || !prompt.trim()}
            >
              {isLoading ? (
                <>
                  <span className="animate-pulse">{statusLog || "Processing"}</span>
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-5 w-5" />
                  Generate Motion
                </>
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
        <div className="lg:col-span-8 h-[500px] lg:h-auto min-h-[500px]">
          <FbxViewer 
            url={resultUrl} 
            isLoading={isLoading} 
            statusText={statusLog}
          />
        </div>

      </div>
    </div>
  );
}