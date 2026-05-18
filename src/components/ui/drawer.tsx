import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";

export default function DrawerDemo() {
  const [open, setOpen] = useState(false);
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger>Open Drawer</DrawerTrigger>
      <DrawerContent>Drawer content</DrawerContent>
    </Drawer>
  );
}