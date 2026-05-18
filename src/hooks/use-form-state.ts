import { useFormState as useBaseFormState } from "@/components/ui/use-form-state";

export function useFormState() {
  const baseFormState = useBaseFormState();
  return baseFormState;
}