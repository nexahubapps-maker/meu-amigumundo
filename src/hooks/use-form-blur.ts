import { useFormBlur as useBaseFormBlur } from "@/components/ui/use-form-blur";

export function useFormBlur() {
  const baseFormBlur = useBaseFormBlur();
  return baseFormBlur;
}