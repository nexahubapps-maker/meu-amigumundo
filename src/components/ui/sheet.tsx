import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function SheetDemo() {
  return (
    <Sheet>
      <SheetTrigger>Open Sheet</SheetTrigger>
      <SheetContent>Sheet content</SheetContent>
    </Sheet>
  );
}