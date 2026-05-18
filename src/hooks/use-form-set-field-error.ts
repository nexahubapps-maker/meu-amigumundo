import { useFormSetFieldError as useBaseFormSetFieldError } from "@/components/ui/use-form-set-field-error";

export function useFormSetFieldError() {
  const baseFormSetFieldError = useBaseFormSetFieldError();
  return baseFormSetFieldError;
}