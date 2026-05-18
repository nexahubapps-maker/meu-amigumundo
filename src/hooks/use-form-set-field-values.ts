import { useFormSetFieldValues as useBaseFormSetFieldValues } from "@/components/ui/use-form-set-field-values";

export function useFormSetFieldValues() {
  const baseFormSetFieldValues = useBaseFormSetFieldValues();
  return baseFormSetFieldValues;
}