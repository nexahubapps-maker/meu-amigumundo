import { useFormSetFieldDirty as useBaseFormSetFieldDirty } from "@/components/ui/use-form-set-field-dirty";

export function useFormSetFieldDirty() {
  const baseFormSetFieldDirty = useBaseFormSetFieldDirty();
  return baseFormSetFieldDirty;
}