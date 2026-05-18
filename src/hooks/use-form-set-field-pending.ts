import { useFormSetFieldPending as useBaseFormSetFieldPending } from "@/components/ui/use-form-set-field-pending";

export function useFormSetFieldPending() {
  const baseFormSetFieldPending = useBaseFormSetFieldPending();
  return baseFormSetFieldPending;
}