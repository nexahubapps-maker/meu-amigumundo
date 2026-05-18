import { Tooltip, TooltipContent, TooltipDescription, TooltipTitle, TooltipTrigger } from "@/components/ui/tooltip";

export default function TooltipDemo() {
  return (
    <Tooltip>
      <TooltipTrigger>Hover me</TooltipTrigger>
      <TooltipContent>
        <TooltipTitle>Title</TooltipTitle>
        <TooltipDescription>Description</TooltipDescription>
      </TooltipContent>
    </Tooltip>
  );
}