import { useField as useBaseField } from "@/components/ui/use-field";

export function useField() {
  const baseField = useBaseField();
  return baseField;
}