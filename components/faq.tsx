import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    question: "What makes Nano Banana different from other AI image editors?",
    answer:
      "Nano Banana uses an advanced AI model that excels at consistent character editing and scene preservation, outperforming competitors like Flux Kontext. Our natural language interface makes complex edits simple, and our one-shot editing means you get great results on the first try.",
  },
  {
    question: "What file formats are supported?",
    answer:
      "We support all major image formats including JPG, PNG, WebP, and HEIC. Maximum file size is 50MB per image. For batch processing, you can upload multiple images simultaneously.",
  },
  {
    question: "How does the pricing work?",
    answer:
      "We offer flexible pricing plans based on your usage. Start with our free tier to try the service, then upgrade to Pro for unlimited edits and batch processing. Enterprise plans are available for teams with custom requirements.",
  },
  {
    question: "Can I use Nano Banana for commercial projects?",
    answer:
      "Yes! All paid plans include commercial usage rights. You own the output images and can use them for any commercial purpose including marketing, products, and client work.",
  },
  {
    question: "How long does it take to process an image?",
    answer:
      "Most edits complete in 10-30 seconds depending on complexity. Our ultra-fast processing means you can iterate quickly and see results almost instantly. Batch processing runs in parallel for maximum efficiency.",
  },
  {
    question: "Is my data secure and private?",
    answer:
      "Absolutely. We use enterprise-grade encryption for all uploads and processing. Your images are never used for training, and you can delete them at any time. We're fully GDPR compliant.",
  },
  {
    question: "Do I need any technical skills to use Nano Banana?",
    answer:
      "Not at all! Our natural language interface means you can describe edits in plain English. No need to learn complex tools or technical jargon. If you can describe what you want, Nano Banana can create it.",
  },
  {
    question: "What kind of edits can I make?",
    answer:
      "Almost anything! Common use cases include background changes, object removal/addition, style transfers, color grading, lighting adjustments, portrait enhancements, and scene transformations. The AI understands context and maintains consistency.",
  },
]

export function FAQ() {
  return (
    <section id="faq" className="py-20 bg-secondary/30">
      <div className="container">
        <div className="mx-auto max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4 md:text-4xl">Frequently Asked Questions</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Everything you need to know about Nano Banana. Can't find what you're looking for? Contact our support
              team.
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-card-foreground">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
