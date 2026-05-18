import { useState } from "react";
import { cn } from "@/lib/utils";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function Accordion() {
  return (
    <Accordion>
      <AccordionItem>
        <AccordionTrigger>Accordion Item</AccordionTrigger>
        <AccordionContent>Accordion Content</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}