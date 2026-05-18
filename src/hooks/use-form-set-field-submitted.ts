import { useFormSetFieldSubmitted as useBaseFormSetFieldSubmitted } from "@/components/ui/use-form-set-field-submitted";

export function useFormSetFieldSubmitted() {
  const baseFormSetFieldSubmitted = useBaseFormSetFieldSubmitted();
  return baseFormSetFieldSubmitted;
}