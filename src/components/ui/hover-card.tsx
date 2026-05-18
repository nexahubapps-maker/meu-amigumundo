import { HoverCard, HoverCardContent, HoverCardFooter, HoverCardHeader } from "@/components/ui/hover-card";

export default function HoverCardDemo() {
  return (
    <HoverCard>
      <HoverCardHeader>Header</HoverCardHeader>
      <HoverCardContent>Content</HoverCardContent>
      <HoverCardFooter>Footer</HoverCardFooter>
    </HoverCard>
  );
}