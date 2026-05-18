import { useFormSetFieldVisited as useBaseFormSetFieldVisited } from "@/components/ui/use-form-set-field-visited";

export function useFormSetFieldVisited() {
  const baseFormSetFieldVisited = useBaseFormSetFieldVisited();
  return baseFormSetFieldVisited;
}