import { useFormFocus as useBaseFormFocus } from "@/components/ui/use-form-focus";

export function useFormFocus() {
  const baseFormFocus = useBaseFormFocus();
  return baseFormFocus;
}