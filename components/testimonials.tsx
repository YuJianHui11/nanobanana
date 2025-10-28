import { Card } from "@/components/ui/card"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Content Creator",
    avatar: "/professional-woman-portrait.png",
    content:
      "Nano Banana has completely transformed my workflow. What used to take hours in Photoshop now takes minutes. The AI understands exactly what I want.",
    rating: 5,
  },
  {
    name: "Marcus Rodriguez",
    role: "Marketing Director",
    avatar: "/professional-man-portrait.png",
    content:
      "The consistency across batch edits is incredible. We process hundreds of product images and the quality is always perfect. Best investment we've made.",
    rating: 5,
  },
  {
    name: "Emily Watson",
    role: "Photographer",
    avatar: "/photographer-woman-portrait.jpg",
    content:
      "As a professional photographer, I was skeptical at first. But the scene preservation and natural results are outstanding. It's like having an AI assistant.",
    rating: 5,
  },
  {
    name: "David Kim",
    role: "E-commerce Manager",
    avatar: "/confident-businessman.png",
    content:
      "The multi-image support is a game-changer. We can maintain brand consistency across thousands of products effortlessly. ROI was immediate.",
    rating: 5,
  },
  {
    name: "Lisa Anderson",
    role: "Graphic Designer",
    avatar: "/creative-woman-portrait.png",
    content:
      "The natural language interface is brilliant. I can describe exactly what I want and it delivers. No more fighting with complex tools.",
    rating: 5,
  },
  {
    name: "James Taylor",
    role: "Social Media Manager",
    avatar: "/young-man-portrait.png",
    content:
      "Creating engaging content has never been easier. The speed and quality let me experiment more and post better content consistently.",
    rating: 5,
  },
]

export function Testimonials() {
  return (
    <section id="testimonials" className="py-20">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4 md:text-4xl">Loved by Creators</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Join thousands of satisfied users who have transformed their image editing workflow with Nano Banana.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="p-6 border-border/50 bg-card">
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={testimonial.avatar || "/placeholder.svg"}
                  alt={testimonial.name}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold text-card-foreground">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </div>

              <div className="flex gap-1 mb-3">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed">{testimonial.content}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
