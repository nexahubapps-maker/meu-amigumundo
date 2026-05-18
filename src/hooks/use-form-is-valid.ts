import { useFormIsValid as useBaseFormIsValid } from "@/components/ui/use-form-is-valid";

export function useFormIsValid() {
  const baseFormIsValid = useBaseFormIsValid();
  return baseFormIsValid;
}