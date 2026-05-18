import { useFormSetFieldTouched as useBaseFormSetFieldTouched } from "@/components/ui/use-form-set-field-touched";

export function useFormSetFieldTouched() {
  const baseFormSetFieldTouched = useBaseFormSetFieldTouched();
  return baseFormSetFieldTouched;
}