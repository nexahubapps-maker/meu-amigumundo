import { Sidebar, SidebarContent, SidebarTrigger } from "@/components/ui/sidebar";

export default function SidebarDemo() {
  return (
    <Sidebar>
      <SidebarTrigger>Open Sidebar</SidebarTrigger>
      <SidebarContent>Sidebar content</SidebarContent>
    </Sidebar>
  );
}