import { useFormSetValues as useBaseFormSetValues } from "@/components/ui/use-form-set-values";

export function useFormSetValues() {
  const baseFormSetValues = useBaseFormSetValues();
  return baseFormSetValues;
}