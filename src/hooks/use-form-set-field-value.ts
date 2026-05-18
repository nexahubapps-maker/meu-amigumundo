import { useFormSetFieldValue as useBaseFormSetFieldValue } from "@/components/ui/use-form-set-field-value";

export function useFormSetFieldValue() {
  const baseFormSetFieldValue = useBaseFormSetFieldValue();
  return baseFormSetFieldValue;
}