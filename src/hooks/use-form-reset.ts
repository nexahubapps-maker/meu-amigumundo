import { useFormReset as useBaseFormReset } from "@/components/ui/use-form-reset";

export function useFormReset() {
  const baseFormReset = useBaseFormReset();
  return baseFormReset;
}