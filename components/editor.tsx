"use client"

import type React from "react"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Upload, Sparkles } from "lucide-react"

export function Editor() {
  const [prompt, setPrompt] = useState("")
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [generatedImages, setGeneratedImages] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setError(null)

      const reader = new FileReader()
      reader.onloadend = () => {
        setSelectedImage(reader.result as string)
        setGeneratedImages([])
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }
      }
      reader.readAsDataURL(file)
    }
  }
  const handleGenerate = async () => {
    if (!selectedImage) {
      setError("请先上传参考图片。")
      return
    }

    if (!prompt.trim()) {
      setError("请在提示词中写入内容。")
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          image: selectedImage,
        }),
      })

      const payload = await response.json()

      if (!response.ok) {
        throw new Error(payload?.error ?? "生成失败，请稍后再试。")
      }

      setGeneratedImages(payload.images ?? [])
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "生成失败，请稍后再试。"
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section id="editor" className="py-20">
      <div className="container">
        <div className="mx-auto max-w-5xl text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4 md:text-4xl">Try The AI Editor</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Experience the power of nano-banana's natural language image editing. Transform any photo with simple text
            commands.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Prompt Engine */}
          <Card className="p-6 border-primary/20 bg-card">
            <div className="mb-4 flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-card-foreground">Prompt Engine</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">Transform your image with AI-powered editing</p>

            {/* Image Upload */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-card-foreground mb-2">Reference Image</label>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-2"
                >
                  {selectedImage ? (
                    <img
                      src={selectedImage}
                      alt="Uploaded preview"
                      className="max-h-40 w-auto max-w-full rounded-lg object-contain"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                      <Upload className="h-10 w-10" />
                      <p className="text-sm font-medium text-card-foreground">Add Image</p>
                      <p className="text-xs">点击上传图片，最大 50MB</p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Main Prompt */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-card-foreground mb-2">Main Prompt</label>
              <Textarea
                placeholder="A futuristic city powered by nano technology, golden hour lighting, ultra detailed..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-32 resize-none"
              />
            </div>

            {error ? (
              <p className="mb-3 text-sm text-destructive">{error}</p>
            ) : null}

            <Button
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              size="lg"
              onClick={handleGenerate}
              disabled={isLoading}
            >
              <Sparkles className="mr-2 h-4 w-4" />
              {isLoading ? "Generating..." : "Generate Now"}
            </Button>
          </Card>

          {/* Output Gallery */}
          <Card className="p-6 border-border/50 bg-secondary/20">
            <div className="mb-4 flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Upload className="h-4 w-4 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-card-foreground">Output Gallery</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">Your ultra-fast AI creations appear here instantly</p>

            {generatedImages.length ? (
              <div className="grid gap-4 md:grid-cols-2">
                {generatedImages.map((imageUrl, index) => (
                  <div
                    key={`${imageUrl}-${index}`}
                    className="overflow-hidden rounded-lg border border-border bg-background shadow-sm"
                  >
                    <img
                      src={imageUrl}
                      alt={`Generated ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center min-h-80 border-2 border-dashed border-border rounded-lg bg-background/50">
                <div className="text-center">
                  <div className="text-6xl mb-4">🖼️</div>
                  <p className="text-sm font-medium text-card-foreground">Ready for instant generation</p>
                  <p className="text-xs text-muted-foreground mt-1">Enter your prompt and unleash the power</p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </section>
  )
}
