import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardImage, CardTitle } from "@/components/ui/card";

export default function CardDemo() {
  return (
    <Card className="w-64">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description</CardDescription>
      </CardHeader>
      <CardImage src="https://picsum.photos/seed/card/300/200" alt="Card image" />
      <CardContent>Card content</CardContent>
      <CardFooter>Card footer</CardFooter>
    </Card>
  );
}