import { Toggle, ToggleGroup } from "@/components/ui/toggle-group";

export default function ToggleGroupDemo() {
  return (
    <ToggleGroup defaultValue="1">
      <Toggle value="1">Option 1</Toggle>
      <Toggle value="2">Option 2</Toggle>
    </ToggleGroup>
  );
}