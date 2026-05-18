import { useFormValues as useBaseFormValues } from "@/components/ui/use-form-values";

export function useFormValues() {
  const baseFormValues = useBaseFormValues();
  return baseFormValues;
}