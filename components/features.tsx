import { Card } from "@/components/ui/card"
import { ImageIcon, Layers, MessageSquare } from "lucide-react"

const features = [
  {
    icon: ImageIcon,
    title: "One-Shot Editing",
    description:
      "Transform your images instantly with a single prompt. No complex workflows or multiple iterations needed.",
  },
  {
    icon: Layers,
    title: "Multi-Image Support",
    description:
      "Process multiple images at once with batch mode. Save time and maintain consistency across your entire project.",
  },
  {
    icon: MessageSquare,
    title: "Natural Language",
    description:
      "Use simple, everyday language to describe your edits. Our AI understands context and intent perfectly.",
  },
]

export function Features() {
  return (
    <section className="py-20 bg-secondary/30">
      <div className="container">
        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 border-border/50 bg-card hover:shadow-lg transition-shadow">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-card-foreground">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
