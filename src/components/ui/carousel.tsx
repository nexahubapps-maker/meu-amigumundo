import { Carousel, CarouselContent, CarouselControl, CarouselIndicator, CarouselItem } from "@/components/ui/carousel";

export default function CarouselDemo() {
  return (
    <Carousel className="w-64">
      <CarouselItem>Slide 1</CarouselItem>
      <CarouselItem>Slide 2</CarouselItem>
      <CarouselItem>Slide 3</CarouselItem>
    </Carousel>
  );
}