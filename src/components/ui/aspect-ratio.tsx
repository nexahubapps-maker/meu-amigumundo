import { AspectRatio } from "@/components/ui/aspect-ratio";

export default function AspectRatioDemo() {
  return (
    <AspectRatio className="w-48 h-32 bg-gray-200 rounded-lg" ratio="16:9">
      <img src="https://picsum.photos/seed/aspect/320/180" alt="" />
    </AspectRatio>
  );
}