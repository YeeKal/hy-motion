import type { ToolConfig } from "@/lib/config/tool-types"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

type FAQProps = ToolConfig["faq"]

interface FAQComponentProps {
  faq: FAQProps
}

export default function ToolFAQ({ faq }: FAQComponentProps) {
  return (
    <section className="py-12 md:py-20 px-4 md:px-6 bg-muted/30">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{faq.title}</h2>
        </div>

        {/* FAQ Items */}
        <Accordion type="single" collapsible className="space-y-3">
          {faq.items.map((item, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border border-border rounded-lg px-4 overflow-hidden"
            >
              <AccordionTrigger className="py-4 hover:no-underline font-semibold">{item.question}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground pt-0">{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
