import { useFormSubmit as useBaseFormSubmit } from "@/components/ui/use-form-submit";

export function useFormSubmit() {
  const baseFormSubmit = useBaseFormSubmit();
  return baseFormSubmit;
}