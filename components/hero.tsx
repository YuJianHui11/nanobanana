import { Button } from "@/components/ui/button"
import { Sparkles, Zap, Globe } from "lucide-react"

export function Hero() {
  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      {/* Banana decorations */}
      <div className="absolute left-10 top-20 text-6xl opacity-20 rotate-12">🍌</div>
      <div className="absolute right-10 top-20 text-6xl opacity-20 -rotate-12">🍌</div>

      <div className="container relative">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            <Sparkles className="h-4 w-4" />
            The AI model that outperforms Flux Kontext
          </div>

          {/* Main heading */}
          <h1 className="mb-6 text-5xl font-bold tracking-tight text-foreground md:text-7xl">Nano Banana</h1>

          {/* Description */}
          <p className="mb-10 text-lg text-muted-foreground md:text-xl leading-relaxed max-w-3xl mx-auto">
            Transform any image with simple text prompts. Nano-banana's advanced model delivers consistent character
            editing and scene preservation that surpasses Flux Kontext. Experience the future of AI image editing.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-base px-8">
              Start Editing
            </Button>
            <Button size="lg" variant="outline" className="text-base px-8 bg-transparent">
              View Examples
            </Button>
          </div>

          {/* Feature badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              <span>One-shot editing</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>Multi-image support</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary" />
              <span>Natural language</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
