import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuProvider } from "@/components/ui/context-menu";

export default function ContextMenuDemo() {
  return (
    <ContextMenuProvider>
      <ContextMenu>
        <ContextMenuContent>
          <ContextMenuItem>Item 1</ContextMenuItem>
          <ContextMenuItem>Item 2</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </ContextMenuProvider>
  );
}