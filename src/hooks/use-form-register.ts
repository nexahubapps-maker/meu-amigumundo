import { useFormRegister as useBaseFormRegister } from "@/components/ui/use-form-register";

export function useFormRegister() {
  const baseFormRegister = useBaseFormRegister();
  return baseFormRegister;
}