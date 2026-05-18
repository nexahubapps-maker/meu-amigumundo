import { Command, CommandButton, CommandInput, CommandItem } from "@/components/ui/command";

export default function CommandDemo() {
  return (
    <Command>
      <CommandInput />
      <CommandItem>Command Item 1</CommandItem>
      <CommandItem>Command Item 2</CommandItem>
    </Command>
  );
}