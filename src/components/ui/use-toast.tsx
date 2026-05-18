import { useToast } from "@/components/ui/use-toast";

export default function UseToastDemo() {
  const toast = useToast();
  return (
    <Button onClick={() => toast({ title: "Title", description: "Description" })}>
      Show Toast
    </Button>
  );
}