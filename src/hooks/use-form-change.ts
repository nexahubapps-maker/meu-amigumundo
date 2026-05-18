import { useFormChange as useBaseFormChange } from "@/components/ui/use-form-change";

export function useFormChange() {
  const baseFormChange = useBaseFormChange();
  return baseFormChange;
}