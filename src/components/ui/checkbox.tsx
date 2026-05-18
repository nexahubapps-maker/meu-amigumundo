import { Checkbox, CheckboxGroup } from "@/components/ui/checkbox";

export default function CheckboxDemo() {
  return (
    <CheckboxGroup defaultValue={["1"]}>
      <Checkbox value="1">Checkbox 1</Checkbox>
      <Checkbox value="2">Checkbox 2</Checkbox>
      <Checkbox value="3">Checkbox 3</Checkbox>
    </CheckboxGroup>
  );
}