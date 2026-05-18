import { Tabs, TabsContent, TabsIndicator, TabsItem, TabsTrigger } from "@/components/ui/tabs";

export default function TabsDemo() {
  return (
    <Tabs>
      <TabsTrigger>Tab 1</TabsTrigger>
      <TabsContent>Content 1</TabsContent>
      <TabsTrigger>Tab 2</TabsTrigger>
      <TabsContent>Content 2</TabsContent>
    </Tabs>
  );
}