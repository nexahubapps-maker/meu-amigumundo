import { useFormSetFieldValid as useBaseFormSetFieldValid } from "@/components/ui/use-form-set-field-valid";

export function useFormSetFieldValid() {
  const baseFormSetFieldValid = useBaseFormSetFieldValid();
  return baseFormSetFieldValid;
}