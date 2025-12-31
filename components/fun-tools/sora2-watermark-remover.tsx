"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Loader2, Copy, Check, Download } from "lucide-react"
import Image from "next/image"

interface WatermarkResponse {
    original_input: string
    post_id: string
    links: {
        mp4: string
        mp4_wm: string
        gif: string
        thumbnail: string
        md: string
    }
}

const exampleResponse: WatermarkResponse = {
    "original_input": "https://sora.chatgpt.com/p/s_68e37ae44a548191a2da126fe20c19d9",
    "post_id": "s_68e37ae44a548191a2da126fe20c19d9",
    "links": {
        "mp4": "https://cdn.kontextflux.io/ai-image/fun-tools/sora2-watermark-remover/s_68e37ae44a548191a2da126fe20c19d9-removed.webm",
        "mp4_wm": "https://cdn.kontextflux.io/ai-image/fun-tools/sora2-watermark-remover/s_68e37ae44a548191a2da126fe20c19d9-raw.webm",
        "gif": "https://oscdn1.dyysy.com/GIF/s_68e37ae44a548191a2da126fe20c19d9.gif",
        "thumbnail": "https://oscdn1.dyysy.com/THUMBNAIL/s_68e37ae44a548191a2da126fe20c19d9.webp",
        "md": "https://oscdn1.dyysy.com/MD/s_68e37ae44a548191a2da126fe20c19d9.mp4"
    }
}

const howToContent = {
  title: "How to Get a Sora 2 Video URL and Remove the Watermark",
  subtitle: "Follow these simple steps to copy the video link from Sora 2",
  steps: [
    {
      id: 1,
      title: "On Desktop (Web Browser)",
      description: "Open the Sora 2 video on web,  tap the three dots button, and copy the video link",
      image: {
        src: "https://cdn.kontextflux.io/ai-image/fun-tools/sora2-watermark-remover/web-get-link.webp",
        alt: "Copy link on desktop web"
      }
    },
    {
      id: 2,
      title: "On Mobile (Sora App)",
      description: "Open the desired video in the Sora app, tap the three dots button, and copy the video link.",
      image: {
        src: "https://cdn.kontextflux.io/ai-image/fun-tools/sora2-watermark-remover/mobile-get-link.webp",
        alt: "Copy link on mobile app"
      }
    },
    {
      id: 3,
      title: "Preview & Download",
      description: "Paste the URL below and preview or download your video in free of watermarks.",
      image: {
        src: "https://cdn.kontextflux.io/ai-image/fun-tools/sora2-watermark-remover/get-the-result.webp",
        alt: "Download the watermark-free result"
      }
    }
  ]
};


export default function WatermarkRemoverPage() {
    const [videoUrl, setVideoUrl] = useState("")
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<WatermarkResponse | null>(exampleResponse)
    const [error, setError] = useState("")
    const [copiedUrl, setCopiedUrl] = useState<string | null>(null)
    const [processingTime, setProcessingTime] = useState<number>(0)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setResult(null)
        setLoading(true)
        const startTime = performance.now()

        const formData = new FormData();
        formData.append("toolId", "sora-2-watermark-remover");
        formData.append("toolParam", JSON.stringify({ "videoUrl": videoUrl }));

        try {
            const response = await fetch("/api/fun-tools", {
                method: "POST",
                body: formData,
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || "Failed to process video. Try again.")
            }

            const data = await response.json()
            setResult(data)
            console.log("Watermark removal result:", data)
            const endTime = performance.now()
            setProcessingTime((endTime - startTime) / 1000)
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred")
        } finally {
            setLoading(false)
        }
    }

    // const copyToClipboard = async (url: string, label: string) => {
    //     try {
    //         await navigator.clipboard.writeText(url)
    //         setCopiedUrl(label)
    //         setTimeout(() => setCopiedUrl(null), 2000)
    //     } catch (err) {
    //         console.error("Failed to copy:", err)
    //     }
    // }

    // const downloadVideo = async (url: string, filename: string) => {
    //     try {
    //         const response = await fetch(url)
    //         const blob = await response.blob()
    //         const blobUrl = window.URL.createObjectURL(blob)
    //         const link = document.createElement("a")
    //         link.href = blobUrl
    //         link.download = filename
    //         document.body.appendChild(link)
    //         link.click()
    //         document.body.removeChild(link)
    //         window.URL.revokeObjectURL(blobUrl)

    //     } catch (err) {
    //         console.error("Failed to download:", err)
    //     }
    // }
    const downloadVideo = (url: string, filename: string) => {
  const link = document.createElement("a");
  link.href = url; // ← Use the original URL directly
  link.download = filename;
  link.target = "_blank"; // Optional: avoids same-origin issues
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

    return (
        <div id="image-generator" className="container max-w-6xl mx-auto px-4 py-8">
            <Card className="border-border p-8">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-foreground mb-2">Video Watermark Remover</h1>
                    <div className="flex items-center gap-4">
                        <div>
                            <p className="text-muted-foreground">Enter the Sora 2 video URL to remove watermarks and generate preview assets</p>
                        </div>
                        <Button
                            // variant="outline"
                            size="sm"
                            onClick={() => {
                                const el = document.getElementById("how-to-get-url");
                                if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                            }}
                            className="font-medium bg-pink-100/50 hover:bg-pink-200/70 text-pink-800 border-1"
                        >
                            → How to get the URL?
                        </Button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="videoUrl" className="text-sm font-medium text-foreground">
                            Video URL
                        </label>
                        <Input
                            id="videoUrl"
                            type="url"
                            placeholder="https://sora.chatgpt.com/p/s_68e37ae44a548191a2da126fe20c19d9"
                            value={videoUrl}
                            onChange={(e) => setVideoUrl(e.target.value)}
                            required
                            disabled={loading}
                            className="bg-background border-input h-14 text-lg px-4"
                        />
                    </div>

                    <Button type="submit" disabled={loading} className="max-w-sm  h-14 text-lg font-semibold">
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            "Remove Watermark (5 credits)"
                        )}
                    </Button>
                </form>

                {error && (
                    <div className="mt-6 p-4 bg-destructive/10 border border-destructive/20 rounded-md">
                        <p className="text-sm text-destructive">{error}</p>
                    </div>
                )}

                {result && (
                    <div className="mt-8 space-y-6">
                        <div className="border-t border-border pt-6">
                            <h2 className="text-xl font-semibold text-foreground mb-4">Processing Complete</h2>
                            <p className="text-sm text-muted-foreground mb-6">
                                Processing time: <span className="font-mono">{processingTime.toFixed(2)}s</span>
                            </p>

                            {/* Videos Grid */}
                            <div className="grid grid-cols-2 gap-6 md:gap-12 mb-6">
                                    <div className="space-y-2">

                                <div className="flex  items-center justify-between">
                                        <h3 className="text-sm font-medium text-foreground">Original Video</h3>
                                        <div className="flex gap-1">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => downloadVideo(result.links.mp4_wm, `video_${result.post_id}.mp4`)}
                                                className="h-8 px-2"
                                            >
                                                <Download className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    <video controls
                                        autoPlay
                                        loop muted
                                        className="w-full rounded-md border border-border bg-muted" src={result.links.mp4_wm}>
                                        Your browser does not support the video tag.
                                    </video>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-medium text-foreground">Watermark Removed</h3>
                                        <div className="flex gap-1">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => downloadVideo(result.links.mp4, `video_${result.post_id}_watermark_removed.mp4`)}
                                                className="h-8 px-2"
                                            >
                                                <Download className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    <video
                                        controls
                                        autoPlay
                                        loop muted
                                        className="w-full rounded-md border border-border bg-muted"
                                        src={result.links.mp4}
                                    >
                                        Your browser does not support the video tag.
                                    </video>
                                </div>
                            </div>

                        </div>
                    </div>
                )}
                {/* How to get URL section target */}

    <div id="how-to-get-url" className="py-20 px-4 bg-muted/30">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {howToContent.title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            {howToContent.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Map over the steps array to dynamically create each card */}
          {howToContent.steps.map((step) => (
            <div key={step.id} className="relative">
              <Card className="border-border p-6 h-full">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-2xl font-bold shadow-lg">
                    {step.id}
                  </div>
                  <h3 className="text-xl font-bold text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                   <div  className="relative aspect-[4/3] w-full h-full">
              <Image
                 src={step.image.src}
                      alt={step.image.alt}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>

                  {/* <div className="mt-4 w-full aspect-[9/16] bg-muted rounded-lg border border-border flex items-center justify-center overflow-hidden">
                    <Image
                    fill
                      src={step.image.src}
                      alt={step.image.alt}
                      className="w-full h-full object-cover"
                    />
                  </div> */}
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
            </Card>
        </div>
    )
}
