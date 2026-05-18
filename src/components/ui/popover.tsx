import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export default function PopoverDemo() {
  return (
    <Popover>
      <PopoverTrigger>Open Popover</PopoverTrigger>
      <PopoverContent>Popover content</PopoverContent>
    </Popover>
  );
}