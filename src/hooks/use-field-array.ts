import { useFieldArray as useBaseFieldArray } from "@/components/ui/use-field-array";

export function useFieldArray() {
  const baseFieldArray = useBaseFieldArray();
  return baseFieldArray;
}