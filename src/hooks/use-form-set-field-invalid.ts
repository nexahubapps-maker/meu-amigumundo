import { useFormSetFieldInvalid as useBaseFormSetFieldInvalid } from "@/components/ui/use-form-set-field-invalid";

export function useFormSetFieldInvalid() {
  const baseFormSetFieldInvalid = useBaseFormSetFieldInvalid();
  return baseFormSetFieldInvalid;
}