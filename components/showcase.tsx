import { Card } from "@/components/ui/card"

const showcaseItems = [
  {
    title: "Portrait Enhancement",
    description: "Professional headshot transformation with natural lighting adjustments",
    image: "/professional-portrait-photo-enhanced-lighting.jpg",
  },
  {
    title: "Scene Transformation",
    description: "Convert daytime scenes to golden hour with perfect atmosphere",
    image: "/landscape-golden-hour-transformation.jpg",
  },
  {
    title: "Style Transfer",
    description: "Apply artistic styles while maintaining subject consistency",
    image: "/artistic-style-transfer-painting-effect.jpg",
  },
  {
    title: "Object Editing",
    description: "Seamlessly add or remove objects with context-aware AI",
    image: "/photo-editing-object-removal-seamless.jpg",
  },
  {
    title: "Color Grading",
    description: "Professional color correction and mood enhancement",
    image: "/color-grading-cinematic-look.jpg",
  },
  {
    title: "Background Change",
    description: "Replace backgrounds while preserving perfect lighting match",
    image: "/background-replacement-studio-quality.jpg",
  },
]

export function Showcase() {
  return (
    <section id="showcase" className="py-20 bg-secondary/30">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4 md:text-4xl">Showcase Gallery</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Explore stunning transformations created with Nano Banana. From subtle enhancements to dramatic changes, see
            what's possible with AI-powered editing.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {showcaseItems.map((item, index) => (
            <Card key={index} className="overflow-hidden border-border/50 hover:shadow-xl transition-shadow group">
              <div className="aspect-video overflow-hidden">
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-card-foreground mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
