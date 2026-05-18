import { useFormErrors as useBaseFormErrors } from "@/components/ui/use-form-errors";

export function useFormErrors() {
  const baseFormErrors = useBaseFormErrors();
  return baseFormErrors;
}