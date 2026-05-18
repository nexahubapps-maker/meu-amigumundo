import { useForm as useBaseForm } from "@/components/ui/use-form";

export function useForm() {
  const baseForm = useBaseForm();
  return baseForm;
}