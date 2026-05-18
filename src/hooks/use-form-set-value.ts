import { useFormSetValue as useBaseFormSetValue } from "@/components/ui/use-form-set-value";

export function useFormSetValue() {
  const baseFormSetValue = useBaseFormSetValue();
  return baseFormSetValue;
}