"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { scrollToPlayground } from "@/lib/utils"
import { PLAYGROUND_SECTION_ID } from "@/lib/constants"

interface UrlParamsHandlerProps {
  onPromptChange: (val: string) => void
  onRatioChange: (val: string) => void
}

export function UrlParamsHandler({ onPromptChange, onRatioChange }: UrlParamsHandlerProps) {
  const searchParams = useSearchParams()

  useEffect(() => {
    const promptParam = searchParams.get("prompt")
    const ratioParam = searchParams.get("aspectRatio")

    if (promptParam) {
      onPromptChange(promptParam)
      // 只有在 URL 带参数时才滚动
      scrollToPlayground(PLAYGROUND_SECTION_ID)
    }
    
    if (ratioParam) {
      onRatioChange(ratioParam)
    }
  }, [searchParams, onPromptChange, onRatioChange])

  return null // 这个组件不渲染任何可见内容
}